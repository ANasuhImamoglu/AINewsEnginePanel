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

    // GET: api/Haberler?page=1&pageSize=10
    [HttpGet]
    public async Task<ActionResult<object>> GetHaberler(
        int page = 1,
        int pageSize = 10)
    {
        // Sayfa numarası 1'den başlamalı
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; // Maksimum limit

        // Toplam kayıt sayısı
        var totalCount = await _context.Haberler.CountAsync();

        // Sayfalama ile veri çekme
        var haberler = await _context.Haberler
            .OrderByDescending(h => h.YayinTarihi) // En yeni haberler önce
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            data = haberler,
            totalCount = totalCount
        });
    }

    // GET: api/Haberler/search?term=kelime&page=1&pageSize=10
    [HttpGet("search")]
    public async Task<ActionResult<object>> SearchHaberler(
        string term,
        int page = 1,
        int pageSize = 10)
    {
        // Sayfa numarası 1'den başlamalı
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; // Maksimum limit

        IQueryable<Haber> query = _context.Haberler;

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

        // Sayfalama ile veri çekme
        var haberler = await query
            .OrderByDescending(h => h.YayinTarihi) // En yeni haberler önce
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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
}
