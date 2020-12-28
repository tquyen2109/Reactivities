using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> GetTask(string username)
        {
            return await Mediator.Send(new Details.Query{Username = username});
        }
        [HttpPut]
        public async Task<ActionResult<Unit>> Update (Update.Command command)
        {
            return await Mediator.Send(command);
           
        }
    }
}