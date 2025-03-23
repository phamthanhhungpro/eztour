using eztourapi.DataAccess;
using eztourapi.Dtos.Requests;
using eztourapi.Dtos.Responses;
using Microsoft.EntityFrameworkCore;

namespace eztourapi.Services
{
    public interface IClientService
    {
        Task<BaseResponse> CreateClient(CreateOrUpdateClientRequest request);
        Task<BaseResponse> Update(Guid id, CreateOrUpdateClientRequest request);
        Task<BaseResponse> Delete(Guid id);
        Task<List<Client>> GetAll();
    }

    public class ClientService : IClientService
    {
        private readonly DatabaseContext _dbContext;
        public ClientService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<BaseResponse> CreateClient(CreateOrUpdateClientRequest request)
        {
            var client = new Client
            {
                Name = request.Name,
                Phone = request.Phone,
                Address = request.Address,
                Banner = request.Banner,
                ViewUserName = request.ViewUserName,
                ViewPassword = request.ViewPassword,
                Email = request.Email
            };

            _dbContext.Clients.Add(client);
            await _dbContext.SaveChangesAsync();

            return new BaseResponse { IsSucceeded = true, Message = "Client created successfully." };
        }

        public async Task<BaseResponse> Delete(Guid id)
        {
            var client = await _dbContext.Clients.FindAsync(id);
            if (client == null)
            {
                return new BaseResponse { IsSucceeded = false, Message = "Client not found." };
            }

            _dbContext.Clients.Remove(client);
            await _dbContext.SaveChangesAsync();

            return new BaseResponse { IsSucceeded = true, Message = "Client deleted successfully." };
        }

        public async Task<List<Client>> GetAll()
        {
            return await _dbContext.Clients.ToListAsync();
        }

        public async Task<BaseResponse> Update(Guid id, CreateOrUpdateClientRequest request)
        {
            var client = await _dbContext.Clients.FindAsync(id);
            if (client == null)
            {
                return new BaseResponse { IsSucceeded = false, Message = "Client not found." };
            }

            client.Name = request.Name;
            client.Phone = request.Phone;
            client.Address = request.Address;
            client.Banner = request.Banner;
            client.ViewUserName = request.ViewUserName;
            client.ViewPassword = request.ViewPassword;
            client.Email = request.Email;

            _dbContext.Clients.Update(client);
            await _dbContext.SaveChangesAsync();

            return new BaseResponse { IsSucceeded = true, Message = "Client updated successfully." };
        }
    }
}
