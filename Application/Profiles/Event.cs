using Application.Activities;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class Event
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _autoMapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IMapper autoMapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _autoMapper = autoMapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(_autoMapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() })
                    .Where(a => a.HostUserName == request.Username || a.Attendees.Any(a => a.Username == request.Username))
                    .ProjectTo<UserActivityDto>(_autoMapper.ConfigurationProvider,
                        new { currentUsername = _userAccessor.GetUserName() })
                    .AsQueryable();
                var result = new List<UserActivityDto>();

                if (request.Predicate == "hosting")
                {
                    result = await query.Where(a => a.HostUsername == request.Username).ToListAsync();
                }

                if (request.Predicate == "past")
                {
                    result = await query.Where(d => DateTime.Compare(d.Date, DateTime.Now) < 0).ToListAsync();
                }

                if (request.Predicate == "future")
                {
                    result = await query.Where(d => DateTime.Compare(d.Date, DateTime.UtcNow) > 0).ToListAsync();
                }

                if (result.Count() == 0)
                {
                    result = await query.ToListAsync();

                }
                return Result<List<UserActivityDto>>.Success(result);
            }
        }
    }
}
