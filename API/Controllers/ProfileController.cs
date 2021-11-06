using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfileController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> Profile(string username)
        {
            return HandleResult(await MyMediator.Send(new Detail.Query { Username = username }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> UserActivities(string username, [FromQuery] string predicate)
        {
            return HandleResult(await MyMediator.Send(new Event.Query { Username = username, Predicate = predicate }));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile(Profile profile)
        {
            return HandleResult(await MyMediator.Send(new Update.Command { Bio = profile.Bio, DisplayName = profile.DisplayName }));
        }

    }
}
