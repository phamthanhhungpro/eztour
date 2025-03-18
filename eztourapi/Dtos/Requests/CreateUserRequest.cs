using System.ComponentModel.DataAnnotations;

namespace eztourapi.Dtos.Requests
{
    public class CreateUserRequest
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
    }
}
