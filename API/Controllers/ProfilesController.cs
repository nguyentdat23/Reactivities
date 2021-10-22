using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> Profile(string username)
        {
            return HandleResult(await MyMediator.Send(new Detail.Query { Username = username }));
        }
    }
}
