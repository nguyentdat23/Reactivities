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
    public class Detail
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.ProjectTo<Profile>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() })
                    .SingleOrDefaultAsync(u => u.Username == request.Username);
                return Result<Profile>.Success(user);

            }
        }
    }
}
