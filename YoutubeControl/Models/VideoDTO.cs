using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YoutubeControl.Models
{
    public class VideoDTO
    {
        public int Id { get; set; }
        public string vLink { get; set; }
        public string vthumb { get; set; }
        public string vTitle { get; set; }
        public string vId { get; set; }
        public int vNum { get; set; }
        public int listNum { get; set; }
        public int listid { get; set; }
    }
}