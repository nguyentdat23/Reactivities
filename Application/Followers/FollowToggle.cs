using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }

        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetUserName());

                var targetUser = await _context.Users.FirstOrDefaultAsync(x =>
                x.UserName == request.TargetUsername);

                if (observer == null || targetUser == null) return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id, targetUser.Id);
                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = targetUser,
                    };
                    _context.UserFollowings.Add(following);
                }
                else
                {
                    _context.UserFollowings.Remove(following);
                }
                var result = await _context.SaveChangesAsync() > 0;
                if (result)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Error update following");
            }
        }
    }
}
