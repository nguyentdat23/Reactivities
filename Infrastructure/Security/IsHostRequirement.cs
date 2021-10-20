using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }
    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContext;

        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContext)
        {
            _dbContext = dbContext;
            _httpContext = httpContext;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Task.CompletedTask;
            Guid activityId = Guid.Parse(_httpContext.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());
            var attendee = _dbContext.ActivityAttendees.AsNoTracking().SingleOrDefaultAsync(a => a.AppUserId == userId && a.ActivityId == activityId).Result;
            if (attendee == null) return Task.CompletedTask;
            if (attendee.IsHost) context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
