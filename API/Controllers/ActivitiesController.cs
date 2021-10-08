using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
{

    public class ActivitiesController : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken cancellationToken)
        {
            return HandleResult(await MyMediator.Send(new ListActivities.Query()));
        }
        [HttpGet("{id}")] // activities/{id}
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            //var activity = await MyMediator.Send(new Details.Query { Id = id });
            //return activity == null ? NotFound() : Ok(activity);
            return HandleResult(await MyMediator.Send(new Details.Query { Id = id }));
        }
        [HttpPost]
        public async Task<IActionResult> CreateActivity([FromBody] Activity activity)
        {
            return HandleResult(await MyMediator.Send(new Create.Command { Activity = activity }));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await MyMediator.Send(new Edit.Command { Activity = activity }));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await MyMediator.Send(new Delete.Command { Id = id }));
        }
    }
}
