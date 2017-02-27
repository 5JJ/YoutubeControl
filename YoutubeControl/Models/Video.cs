using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YoutubeControl.Models
{
    public class Video
    {
        public int Id { get; set; }
        public string vLink { get; set; }
        public string vThumb { get; set; }
        public string vTitle { get; set; }
        public string vId { get; set; }
        public int vNum { get; set; }
        public int listNum { get; set; }
        public int ListBoxId { get; set; }
        public ListBox ListBox { get; set; }
    }
}