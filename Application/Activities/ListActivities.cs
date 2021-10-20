using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
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

            public Handler(DataContext context, IMapper autoMapper)
            {
            _context = context;
                _autoMapper = autoMapper;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_autoMapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}
