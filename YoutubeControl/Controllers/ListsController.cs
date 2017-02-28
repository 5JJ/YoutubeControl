using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using YoutubeControl.Models;

namespace YoutubeControl.Controllers
{
    public class ListsController : ApiController
    {
        private YoutubeControlContext db = new YoutubeControlContext();

        // GET: api/ListBoxes
        public IQueryable<ListBox> GetListBoxes()
        {
            return db.ListBoxes;
        }

        // GET: api/ListBoxes/5
        //get video lists in the selected listbox
        [ResponseType(typeof(ListBox))]
        public async Task<IHttpActionResult> GetListBox(int id)
        {

            var videos = from b in db.Videos
                         where (b.ListBoxId == id)
                        select new VideoDTO()
                        {
                            Id = b.Id,
                            vTitle = b.vTitle,
                            vthumb = b.vThumb,
                            vLink = b.vLink,
                            vNum = b.vNum,
                            listNum = b.listNum,
                            listid = b.ListBoxId,
                            vId = b.vId
                        };

            if (videos == null)
            {
                return NotFound();
            }

            return Ok(videos);
        }

        // PUT: api/ListBoxes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutListBox(int id, ListBox listBox)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != listBox.Id)
            {
                return BadRequest();
            }

            db.Entry(listBox).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ListBoxExists(id))
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

        // POST: api/ListBoxes
        [ResponseType(typeof(ListBox))]
        public async Task<IHttpActionResult> PostListBox(string listname)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ListBox listBox = new ListBox();
            listBox.Name = listname;

            db.ListBoxes.Add(listBox);
            await db.SaveChangesAsync();
            

            return CreatedAtRoute("DefaultApi", new { id = listBox.Id }, listBox);
        }

        // DELETE: api/ListBoxes/5
        [ResponseType(typeof(ListBox))]
        public async Task<IHttpActionResult> DeleteListBox(int id)
        {
            ListBox listBox = await db.ListBoxes.FindAsync(id);
            if (listBox == null)
            {
                return NotFound();
            }

            db.ListBoxes.Remove(listBox);
            await db.SaveChangesAsync();

            return Ok(listBox);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ListBoxExists(int id)
        {
            return db.ListBoxes.Count(e => e.Id == id) > 0;
        }
    }
}