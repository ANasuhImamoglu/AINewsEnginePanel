// ApplicationDbContext.cs dosyasına eklenecek
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Haber> Haberler { get; set; }
    public DbSet<Kategori> Kategoriler { get; set; } // Bu satır eklenmeli

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Haber - Kategori ilişkisi
        modelBuilder.Entity<Haber>()
            .HasOne(h => h.Kategori)
            .WithMany(k => k.Haberler)
            .HasForeignKey(h => h.KategoriId)
            .OnDelete(DeleteBehavior.SetNull); // Kategori silinirse haberin kategori ID'si null olur

        // Kategori tablosu konfigürasyonu
        modelBuilder.Entity<Kategori>(entity =>
        {
            entity.HasKey(k => k.Id);
            entity.Property(k => k.Ad).IsRequired().HasMaxLength(100);
            entity.Property(k => k.Aciklama).HasMaxLength(500);
            entity.Property(k => k.Aktif).HasDefaultValue(true);
            entity.Property(k => k.Sira).HasDefaultValue(0);
            entity.Property(k => k.OlusturmaTarihi).HasDefaultValueSql("GETDATE()");
        });

        // Haber tablosu konfigürasyonu
        modelBuilder.Entity<Haber>(entity =>
        {
            entity.HasKey(h => h.Id);
            entity.Property(h => h.Baslik).IsRequired().HasMaxLength(500);
            entity.Property(h => h.Icerik).IsRequired();
            entity.Property(h => h.ResimUrl).HasMaxLength(1000);
            entity.Property(h => h.YayinTarihi).HasDefaultValueSql("GETDATE()");
            entity.Property(h => h.Onaylandi).HasDefaultValue(false);
            entity.Property(h => h.OkunmaSayisi).HasDefaultValue(0);
            entity.Property(h => h.TiklanmaSayisi).HasDefaultValue(0);
        });

        base.OnModelCreating(modelBuilder);
    }
}
