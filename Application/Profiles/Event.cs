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
                    .ProjectTo<UserActivityDto>(_autoMapper.ConfigurationProvider)
                    .AsQueryable();

                if (request.Predicate == "hosting")
                {
                    query.Where(a => a.HostUsername == _userAccessor.GetUserName());
                }

                if (request.Predicate == "past")
                {
                    query.Where(d => DateTime.Compare(d.Date, DateTime.UtcNow) < 0);
                }

                if (request.Predicate == "future")
                {
                    query.Where(d => DateTime.Compare(d.Date, DateTime.UtcNow) >= 0);
                }

                return Result<List<UserActivityDto>>.Success(await query.ToListAsync());
            }
        }
    }
}
