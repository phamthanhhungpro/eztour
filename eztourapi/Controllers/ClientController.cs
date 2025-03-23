using eztourapi.Dtos.Requests;
using eztourapi.Services;
using Microsoft.AspNetCore.Mvc;

namespace eztourapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;
        public ClientController(IClientService clientService)
        { 
            _clientService = clientService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateClient(CreateOrUpdateClientRequest request)
        {
            var response = await _clientService.CreateClient(request);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(Guid id, CreateOrUpdateClientRequest request)
        {
            var response = await _clientService.Update(id, request);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(Guid id)
        {
            var response = await _clientService.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllClients()
        {
            var response = await _clientService.GetAll();
            return Ok(response);
        }
    }
}
