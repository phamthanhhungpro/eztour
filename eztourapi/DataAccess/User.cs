﻿namespace eztourapi.DataAccess
{
    public class User : BaseEntity
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
    }
}
