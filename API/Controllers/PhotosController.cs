using Application.Photos;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command)
        {
            return HandleResult(await MyMediator.Send(command));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await MyMediator.Send(new Delete.Command { Id = id }));
        }
        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetMain(string id)
        {
            return HandleResult(await MyMediator.Send(new SetMain.Command { Id = id }));
        }
    }
}
