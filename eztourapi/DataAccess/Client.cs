namespace eztourapi.DataAccess
{
    public class Client : BaseEntity
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Banner { get; set; }
        public string ViewUserName { get; set; }
        public string ViewPassword { get; set; }
        public string Email { get; set; }
    }
}
