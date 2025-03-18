namespace eztourapi.Dtos.Responses
{
    public class BaseResponse
    {
        public Guid Id { get; set; }
        public bool IsSucceeded { get; set; } = true;
        public string Message { get; set; }
    }
}
