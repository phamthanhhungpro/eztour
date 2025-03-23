using eztourapi.DataAccess;
using eztourapi.Dtos.Requests;
using eztourapi.Dtos.Responses;
using Microsoft.EntityFrameworkCore;

namespace eztourapi.Services
{
    public interface ITourGuideService
    {
        Task<BaseResponse> CreateTourGuide(CreateUpdateTourGuideRequest request);
        Task<BaseResponse> Update(Guid id, CreateUpdateTourGuideRequest request);
        Task<BaseResponse> Delete(Guid id);
        Task<List<TourGuide>> GetAll();
    }

    public class TourGuideService : ITourGuideService
    {
        private readonly DatabaseContext _dbContext;
        public TourGuideService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<BaseResponse> CreateTourGuide(CreateUpdateTourGuideRequest request)
        {
            var tourGuide = new TourGuide
            {
                Name = request.Name,
                Phone = request.Phone,
                Address = request.Address,
                Image = request.Image,
                Rate = 5
            };

            _dbContext.TourGuides.Add(tourGuide);
            await _dbContext.SaveChangesAsync();

            return new BaseResponse { IsSucceeded = true, Message = "Tour guide created successfully." };
        }

        public async Task<BaseResponse> Update(Guid id, CreateUpdateTourGuideRequest request)
        {
            var tourGuide = await _dbContext.TourGuides.FindAsync(id);
            if (tourGuide == null)
            {
                return new BaseResponse { IsSucceeded = false, Message = "Tour guide not found." };
            }

            tourGuide.Name = request.Name;
            tourGuide.Phone = request.Phone;
            tourGuide.Address = request.Address;
            tourGuide.Image = request.Image;

            _dbContext.TourGuides.Update(tourGuide);
            await _dbContext.SaveChangesAsync();

            return new BaseResponse { IsSucceeded = true, Message = "Tour guide updated successfully." };
        }

        public async Task<BaseResponse> Delete(Guid id)
        {
            var tourGuide = await _dbContext.TourGuides.FindAsync(id);
            if (tourGuide == null)
            {
                return new BaseResponse { IsSucceeded = false, Message = "Tour guide not found." };
            }

            _dbContext.TourGuides.Remove(tourGuide);
            await _dbContext.SaveChangesAsync();

            return new BaseResponse { IsSucceeded = true, Message = "Tour guide deleted successfully." };
        }

        public async Task<List<TourGuide>> GetAll()
        {
            return await _dbContext.TourGuides.ToListAsync();
        }
    }
}