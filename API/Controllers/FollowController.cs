using Application.Followers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {

        //GET: /api/follow/nguyentdat27?predicate
        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollow(string username, string predicate)
        {
            return HandleResult(await MyMediator.Send(new Followers.Query { predicate = predicate, username = username }));
        }
        //POST: /api/follow/nguyentdat27
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await MyMediator.Send(new FollowToggle.Command { TargetUsername = username }));
        }
    }
}
