using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class ListActivities
    {
        public class Query : IRequest<List<Activity>>
        {
            public CancellationToken CancellationToken { get; set; }
        }
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;

            public Handler(DataContext context, ILogger<ListActivities> logger)
            {
                _context = context;
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    await Task.Delay(5000, cancellationToken);
                    _logger.LogInformation($"Task Handler list is completed");

                }
                catch (Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation("Task was cancelled");
                }
                return await _context.Activities.ToListAsync(cancellationToken);
            }
        }
    }
}
