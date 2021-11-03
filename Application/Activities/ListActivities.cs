using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<ActivityDto>>>
        {
            public CancellationToken CancellationToken { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _autoMapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper autoMapper, IUserAccessor userAccessor)
            {
                _context = context;
                _autoMapper = autoMapper;
                _userAccessor = userAccessor;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_autoMapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() })
                    .ToListAsync();

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}
