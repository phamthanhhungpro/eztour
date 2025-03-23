using eztourapi.DataAccess;
using eztourapi.Dtos.Requests;
using eztourapi.Dtos.Responses;
using eztourapi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eztourapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TourGuideController : ControllerBase
    {
        private readonly ITourGuideService _tourGuideService;

        public TourGuideController(ITourGuideService tourGuideService)
        {
            _tourGuideService = tourGuideService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTourGuide([FromBody] CreateUpdateTourGuideRequest request)
        {
            var response = await _tourGuideService.CreateTourGuide(request);

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTourGuide([FromRoute] Guid id, [FromBody] CreateUpdateTourGuideRequest request)
        {
            var response = await _tourGuideService.Update(id, request);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourGuide([FromRoute] Guid id)
        {
            var response = await _tourGuideService.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult<List<TourGuide>>> GetAllTourGuides()
        {
            var tourGuides = await _tourGuideService.GetAll();
            return Ok(tourGuides);
        }
    }
}