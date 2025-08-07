using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class HaberlerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HaberlerController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Haberler?page=1&pageSize=10&kategoriId=1
    [HttpGet]
    public async Task<ActionResult<object>> GetHaberler(
        int page = 1,
        int pageSize = 10,
        int? kategoriId = null)
    {
        // Sayfa numarası 1'den başlamalı
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; // Maksimum limit

        // Base query
        IQueryable<Haber> query = _context.Haberler;

        // Kategori filtresi uygula
        if (kategoriId.HasValue && kategoriId.Value > 0)
        {
            query = query.Where(h => h.KategoriId == kategoriId.Value);
        }

        // Toplam kayıt sayısı (filtrelenmiş)
        var totalCount = await query.CountAsync();

        // Sayfalama ile veri çekme - kategori bilgileri ile birlikte
        var haberler = await query
            .Include(h => h.Kategori) // Kategori bilgilerini de getir
            .OrderByDescending(h => h.YayinTarihi) // En yeni haberler önce
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(h => new
            {
                h.Id,
                h.Baslik,
                h.Icerik,
                h.ResimUrl,
                h.YayinTarihi,
                h.Onaylandi,
                h.KategoriId,
                h.OkunmaSayisi,
                h.TiklanmaSayisi,
                KategoriAdi = h.Kategori != null ? h.Kategori.Ad : GetKategoriAdi(h.KategoriId)
            })
            .ToListAsync();

        return Ok(new
        {
            data = haberler,
            totalCount = totalCount
        });
    }

    // GET: api/Haberler/most-read
    [HttpGet("most-read")]
    public async Task<ActionResult<List<object>>> GetMostReadNews()
    {
        var mostReadNews = await _context.Haberler
            .Include(h => h.Kategori)
            .OrderByDescending(h => h.OkunmaSayisi)
            .Take(20) // Top 20 en çok okunan
            .Select(h => new
            {
                h.Id,
                h.Baslik,
                h.Icerik,
                h.ResimUrl,
                h.YayinTarihi,
                h.Onaylandi,
                h.KategoriId,
                h.OkunmaSayisi,
                h.TiklanmaSayisi,
                KategoriAdi = h.Kategori != null ? h.Kategori.Ad : GetKategoriAdi(h.KategoriId)
            })
            .ToListAsync();

        return Ok(mostReadNews);
    }

    // GET: api/Haberler/most-clicked  
    [HttpGet("most-clicked")]
    public async Task<ActionResult<List<object>>> GetMostClickedNews()
    {
        var mostClickedNews = await _context.Haberler
            .Include(h => h.Kategori)
            .OrderByDescending(h => h.TiklanmaSayisi)
            .Take(20) // Top 20 en çok tıklanan
            .Select(h => new
            {
                h.Id,
                h.Baslik,
                h.Icerik,
                h.ResimUrl,
                h.YayinTarihi,
                h.Onaylandi,
                h.KategoriId,
                h.OkunmaSayisi,
                h.TiklanmaSayisi,
                KategoriAdi = h.Kategori != null ? h.Kategori.Ad : GetKategoriAdi(h.KategoriId)
            })
            .ToListAsync();

        return Ok(mostClickedNews);
    }

    // GET: api/Haberler/search?term=kelime&page=1&pageSize=10&kategoriId=1
    [HttpGet("search")]
    public async Task<ActionResult<object>> SearchHaberler(
        string term,
        int page = 1,
        int pageSize = 10,
        int? kategoriId = null)
    {
        // Sayfa numarası 1'den başlamalı
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; // Maksimum limit

        IQueryable<Haber> query = _context.Haberler;

        // Kategori filtresi uygula
        if (kategoriId.HasValue && kategoriId.Value > 0)
        {
            query = query.Where(h => h.KategoriId == kategoriId.Value);
        }

        // Arama terimi varsa filtrele
        if (!string.IsNullOrWhiteSpace(term))
        {
            term = term.Trim().ToLower();
            query = query.Where(h =>
                h.Baslik.ToLower().Contains(term) ||
                h.Icerik.ToLower().Contains(term)
            );
        }

        // Toplam kayıt sayısı (filtrelenmiş)
        var totalCount = await query.CountAsync();

        // Sayfalama ile veri çekme - kategori bilgileri ile birlikte
        var haberler = await query
            .Include(h => h.Kategori) // Kategori bilgilerini de getir
            .OrderByDescending(h => h.YayinTarihi) // En yeni haberler önce
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(h => new
            {
                h.Id,
                h.Baslik,
                h.Icerik,
                h.ResimUrl,
                h.YayinTarihi,
                h.Onaylandi,
                h.KategoriId,
                h.OkunmaSayisi,
                h.TiklanmaSayisi,
                KategoriAdi = h.Kategori != null ? h.Kategori.Ad : GetKategoriAdi(h.KategoriId)
            })
            .ToListAsync();

        return Ok(new
        {
            data = haberler,
            totalCount = totalCount
        });
    }

    // Diğer mevcut metodlarınız...
    [HttpPut("{id}/approve")]
    public async Task<ActionResult<Haber>> ApproveHaber(int id)
    {
        var haber = await _context.Haberler.FindAsync(id);
        if (haber == null)
        {
            return NotFound();
        }

        haber.Onaylandi = true;
        await _context.SaveChangesAsync();

        return Ok(haber);
    }

    [HttpPut("{id}/increment-read")]
    public async Task<ActionResult> IncrementReadCount(int id)
    {
        var haber = await _context.Haberler.FindAsync(id);
        if (haber == null)
        {
            return NotFound();
        }

        haber.OkunduSayisi++;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id}/increment-click")]
    public async Task<ActionResult> IncrementClickCount(int id)
    {
        var haber = await _context.Haberler.FindAsync(id);
        if (haber == null)
        {
            return NotFound();
        }

        haber.TiklandiSayisi++;
        await _context.SaveChangesAsync();

        return Ok();
    }

    // GET: api/Haberler/kategori-dagilimi - Test için kategori dağılımını göster
    [HttpGet("kategori-dagilimi")]
    public async Task<ActionResult<object>> GetKategoriDagilimi()
    {
        var dagilim = await _context.Haberler
            .GroupBy(h => h.KategoriId)
            .Select(g => new
            {
                KategoriId = g.Key,
                KategoriAdi = GetKategoriAdi(g.Key),
                HaberSayisi = g.Count()
            })
            .OrderBy(x => x.KategoriId)
            .ToListAsync();

        return Ok(dagilim);
    }

    // Helper metod - Kategori ID'sine göre kategori adını döndür
    private string GetKategoriAdi(int? kategoriId)
    {
        return kategoriId switch
        {
            1 => "Gündem",
            2 => "Teknoloji",
            3 => "Spor",
            4 => "Dünya",
            5 => "Sağlık",
            6 => "Politika",
            _ => "Genel"
        };
    }
}
