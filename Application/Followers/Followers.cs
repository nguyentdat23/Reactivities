using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class Followers
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string username { get; set; }
            public string predicate { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.username);
                if (user == null) return null;
                var followingList = new List<Profiles.Profile>();
                if (request.predicate == "following")
                {
                    followingList = await _context.UserFollowings.Where(x => x.ObserverId == user.Id).Select(user => user.Target).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() }).ToListAsync();

                }
                if (request.predicate == "follower")
                {
                    followingList = await _context.UserFollowings.Where(x => x.TargetId == user.Id).Select(user => user.Observer).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() }).ToListAsync();

                }
                return Result<List<Profiles.Profile>>.Success(followingList);
            }
        }


    }
}
