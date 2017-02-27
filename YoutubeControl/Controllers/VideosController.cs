using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using YoutubeControl.Models;

namespace YoutubeControl.Controllers
{
    public class VideosController : ApiController
    {
        private YoutubeControlContext db = new YoutubeControlContext();

        // GET: api/Videos
        public IQueryable<Video> GetVideos()
        {
            return db.Videos;
        }

        // GET: api/Videos/5
        //[ResponseType(typeof(Video))]
        //public async Task<IHttpActionResult> GetVideo(int id)
        //{
        //    Video v = parsingURL(video.uri);
        //    v.ListBoxId = 0;

        //    db.Videos.Add(v);
        //    await db.SaveChangesAsync();

        //   // Video v = await db.Videos.FindAsync(id);
        //    var videos = new VideoDTO()
        //                 {
        //                     Id = v.Id,
        //                     vTitle = v.vTitle,
        //                     vthumb = v.vThumb,
        //                     vLink = v.vLink,
        //                     vNum = v.vNum,
        //                     listNum = v.listNum,
        //                     listid = v.ListBoxId,
        //                     vId = v.vId
        //                 };
        //    if (videos == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(videos);
        //}

        // PUT: api/Videos/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutVideo(int id, Video video)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != video.Id)
            {
                return BadRequest();
            }

            db.Entry(video).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VideoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Videos
        //[ResponseType(typeof(Video))]
        public async Task<IHttpActionResult> PostVideo(videoUri video)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Video v = parsingURL(video.uri);
            v.ListBoxId = video.listId;

            db.Videos.Add(v);
            await db.SaveChangesAsync();

            var dto = new VideoDTO()
            {
                Id = v.Id,
                vTitle = v.vTitle,
                vthumb = v.vThumb,
                vLink = v.vLink,
                vNum = v.vNum,
                vId = v.vId,
                listNum = v.listNum
            };


            return CreatedAtRoute("DefaultApi", new { Id = v.Id }, dto);
        }

        // DELETE: api/Videos/5
        [ResponseType(typeof(Video))]
        public async Task<IHttpActionResult> DeleteVideo(int id)
        {
            Video video = await db.Videos.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            db.Videos.Remove(video);
            await db.SaveChangesAsync();

            return Ok(video);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VideoExists(int id)
        {
            return db.Videos.Count(e => e.Id == id) > 0;
        }
        private Video parsingURL(string uri)
        {
            WebRequest request = WebRequest.Create(uri);
            WebResponse response = request.GetResponse();
            StreamReader stream = new StreamReader(response.GetResponseStream());
            string vTitle = null, vLink = null, vThumb = null, vId= null;
            string tmp;

            //need to verify if it's the youtube website or not

            Video vi = new Video();
            int startindex, endindex;
            while ((vLink == null) || (vTitle == null) || (vThumb == null))
            {
                tmp = stream.ReadLine().Trim();
                if (tmp.Length > 7)
                {
                    if (vTitle == null)
                    {
                        if ((tmp[0] == '<') && (tmp[1] == 't'))
                        {
                            startindex = 7;
                            endindex = tmp.IndexOf("</title>");
                            vTitle = tmp.Substring(startindex, endindex - startindex - 9);
                        }
                    }
                    else if (vLink == null)
                    {
                        if ((tmp[0] == '<') && (tmp[1] == 'm') && (tmp.IndexOf("og:video:url") > 0))
                        {
                            startindex = tmp.IndexOf("content=") + 9;
                            endindex = tmp.IndexOf(">");
                            vLink = tmp.Substring(startindex, endindex - startindex - 1);
                           
                            int findId = vLink.LastIndexOf("/");
                            int tmpindex = vLink.IndexOf("?");
                            if (tmpindex > 0)
                            {
                                vId = vLink.Substring(findId + 1, tmpindex - findId - 1);
                            }else
                            {
                                vId = vLink.Substring(findId + 1, endindex - startindex - findId - 2);

                            }

                            

                           
                        }

                    }
                    else if (vThumb == null)
                    {
                        if ((tmp[0] == '<') && (tmp[1] == 'm') && (tmp.IndexOf("twitter:image") > 0))
                        {
                            startindex = tmp.IndexOf("content=") + 9;
                            endindex = tmp.IndexOf(">");
                            vThumb = tmp.Substring(startindex, endindex - startindex - 1);
                        }
                    }
                }
            };

           

            vi.vTitle = vTitle;
            vi.vLink = vLink;
            vi.vThumb = vThumb;
            vi.vNum = 1;
            vi.listNum = 1;
            vi.vId = vId;
            Debug.WriteLine(uri);
            return vi;
        }
    }
}