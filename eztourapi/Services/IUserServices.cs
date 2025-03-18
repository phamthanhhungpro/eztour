using eztourapi.DataAccess;
using eztourapi.Dtos.Requests;
using eztourapi.Dtos.Responses;
using eztourapi.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace eztourapi.Services
{
    public interface IUserServices
    {
        Task<BaseResponse> CreateUser(CreateUserRequest request);

        Task<LoginResponse> Login(LoginRequest request);

        Task<List<User>> GetAll();

        Task<BaseResponse> UpdateUser(Guid id, UpdateUserRequest request);
        Task<BaseResponse> DeleteUser(Guid id);
    }

    public class UserService : IUserServices
    {
        private readonly DatabaseContext _context;
        private readonly string _jwtKey;

        public UserService(DatabaseContext context, IConfiguration config)
        { 
            _context = context;
            _jwtKey = config["Jwt:Key"];
        }

        public async Task<BaseResponse> CreateUser(CreateUserRequest request)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.UserName == request.UserName);
            if (existingUser != null)
            {
                return new BaseResponse { Message = "User already exists", IsSucceeded = false };
            }

            var hashedPassword = request.Password.ToHashPassword();
            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                UserName = request.UserName,
                FullName = request.FullName
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return new BaseResponse { Id = newUser.Id, Message = "User created successfully", IsSucceeded = true };
        }

        public async Task<BaseResponse> DeleteUser(Guid id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return new BaseResponse { Message = "User not found", IsSucceeded = false };
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new BaseResponse { Message = "User deleted successfully", IsSucceeded = true };
        }

        public async Task<List<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<LoginResponse> Login(LoginRequest request)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == request.UserName);
            if (user == null)
            {
                return new LoginResponse { Message = "User not found", IsSucceeded = false };
            }

            if (!user.PasswordHash.VerifyPassword(request.Password))
            {
                return new LoginResponse { Message = "Invalid username or password", IsSucceeded = false };
            }

            var token = GenerateJwtToken(user);
            // add token to token table

            return new LoginResponse
            {
                Message = "Login successful",
                IsSucceeded = true,
                Token = token,
                User = new User
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName,
                    FullName = user.FullName
                }
            };
        }

        public async Task<BaseResponse> UpdateUser(Guid id, UpdateUserRequest request)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return new BaseResponse { Message = "User not found", IsSucceeded = false };
            }

            user.Email = request.Email;
            user.FullName = request.FullName;
            user.UserName = request.UserName;

            await _context.SaveChangesAsync();

            return new BaseResponse { Message = "User updated successfully", IsSucceeded = true };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.UserName),
                ]),
                Expires = DateTime.UtcNow.AddHours(4),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
