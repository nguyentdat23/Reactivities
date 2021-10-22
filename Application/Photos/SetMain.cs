using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;
                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                var oldMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain == true);
                if (photo == null) return null;
                if (oldMainPhoto != null) oldMainPhoto.IsMain = false;
                photo.IsMain = true;
                var result = await _dataContext.SaveChangesAsync() > 0;
                if (result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem set main photo");
            }
        }
    }
}
