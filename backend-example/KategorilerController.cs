using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class KategorilerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public KategorilerController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Kategoriler
    [HttpGet]
    public async Task<ActionResult<List<Kategori>>> GetKategoriler()
    {
        var kategoriler = await _context.Kategoriler
            .Where(k => k.Aktif) // Sadece aktif kategoriler
            .OrderBy(k => k.Sira) // Sıraya göre
            .ToListAsync();

        return Ok(kategoriler);
    }

    // GET: api/Kategoriler/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Kategori>> GetKategori(int id)
    {
        var kategori = await _context.Kategoriler.FindAsync(id);

        if (kategori == null)
        {
            return NotFound();
        }

        return Ok(kategori);
    }

    // GET: api/Kategoriler/aktif
    [HttpGet("aktif")]
    public async Task<ActionResult<List<object>>> GetAktifKategoriler()
    {
        // Doğru kategori ID eşleştirmesi
        var kategoriler = new List<object>
        {
            new { id = 0, name = "Tüm Kategoriler", description = "Tüm kategorilerdeki haberler" },
            new { id = 1, name = "Gündem", description = "Gündem haberleri" },
            new { id = 2, name = "Teknoloji", description = "Teknoloji haberleri" },
            new { id = 3, name = "Spor", description = "Spor haberleri" },
            new { id = 4, name = "Dünya", description = "Dünya haberleri" },
            new { id = 5, name = "Sağlık", description = "Sağlık haberleri" },
            new { id = 6, name = "Politika", description = "Politika haberleri" }
        };

        // Eğer veritabanında kategoriler varsa onları kullan, yoksa sabit listeyi döndür
        try
        {
            var dbKategoriler = await _context.Kategoriler
                .Where(k => k.Aktif)
                .OrderBy(k => k.Sira)
                .Select(k => new
                {
                    id = k.Id,
                    name = k.Ad,
                    description = k.Aciklama
                })
                .ToListAsync();

            if (dbKategoriler.Any())
            {
                var result = new List<object>
                {
                    new { id = 0, name = "Tüm Kategoriler", description = "Tüm kategorilerdeki haberler" }
                };
                result.AddRange(dbKategoriler);
                return Ok(result);
            }
        }
        catch
        {
            // Veritabanı hatası durumunda sabit listeyi döndür
        }

        return Ok(kategoriler);
    }

    // POST: api/Kategoriler
    [HttpPost]
    public async Task<ActionResult<Kategori>> PostKategori(Kategori kategori)
    {
        _context.Kategoriler.Add(kategori);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetKategori", new { id = kategori.Id }, kategori);
    }

    // PUT: api/Kategoriler/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutKategori(int id, Kategori kategori)
    {
        if (id != kategori.Id)
        {
            return BadRequest();
        }

        _context.Entry(kategori).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!KategoriExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Kategoriler/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteKategori(int id)
    {
        var kategori = await _context.Kategoriler.FindAsync(id);
        if (kategori == null)
        {
            return NotFound();
        }

        // Soft delete - aktifliği false yap
        kategori.Aktif = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool KategoriExists(int id)
    {
        return _context.Kategoriler.Any(e => e.Id == id);
    }
}

// Model sınıfları
public class Kategori
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public bool Aktif { get; set; } = true;
    public int Sira { get; set; } = 0;
    public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;

    // Navigation properties
    public virtual ICollection<Haber> Haberler { get; set; } = new List<Haber>();
}

// Haber sınıfına eklenmesi gereken property
public class Haber
{
    public int Id { get; set; }
    public string Baslik { get; set; } = string.Empty;
    public string Icerik { get; set; } = string.Empty;
    public string? ResimUrl { get; set; }
    public DateTime YayinTarihi { get; set; } = DateTime.Now;
    public bool Onaylandi { get; set; } = false;
    public int? KategoriId { get; set; } // Foreign key
    public int OkunmaSayisi { get; set; } = 0;
    public int TiklanmaSayisi { get; set; } = 0;

    // Navigation property
    public virtual Kategori? Kategori { get; set; }
}
