using eztourapi.DataAccess;

namespace eztourapi.Dtos.Responses
{
    public class LoginResponse : BaseResponse
    {
        public string Token { get; set; }
        public User User { get; set; }
    }
}
