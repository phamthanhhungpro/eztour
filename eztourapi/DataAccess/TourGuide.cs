﻿namespace eztourapi.DataAccess
{
    public class TourGuide : BaseEntity
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public double Rate { get; set; }
        public string Image { get; set; }
    }
}
