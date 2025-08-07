-- Kategoriler tablosu için doğru kategori verileri
-- Bu script'i veritabanınızda çalıştırarak kategorileri ekleyebilirsiniz

-- Önce mevcut kategorileri temizle (isteğe bağlı)
-- DELETE FROM Kategoriler;

-- Doğru kategori ID'leri ile kategorileri ekle
INSERT INTO Kategoriler (Id, Ad, Aciklama, Aktif, Sira, OlusturmaTarihi) VALUES
(1, 'Gündem', 'Güncel gündem haberleri', 1, 1, GETDATE()),
(2, 'Teknoloji', 'Teknoloji ve bilişim haberleri', 1, 2, GETDATE()),
(3, 'Spor', 'Spor haberleri ve müsabakaları', 1, 3, GETDATE()),
(4, 'Dünya', 'Dünya haberleri ve uluslararası gelişmeler', 1, 4, GETDATE()),
(5, 'Sağlık', 'Sağlık ve tıp haberleri', 1, 5, GETDATE()),
(6, 'Politika', 'Politika ve siyaset haberleri', 1, 6, GETDATE());

-- Kategori ID'lerini kontrol et
SELECT * FROM Kategoriler ORDER BY Sira;

-- Mevcut haberlerin kategori dağılımını kontrol et
SELECT 
    h.KategoriId,
    k.Ad as KategoriAdi,
    COUNT(*) as HaberSayisi
FROM Haberler h
LEFT JOIN Kategoriler k ON h.KategoriId = k.Id
GROUP BY h.KategoriId, k.Ad
ORDER BY h.KategoriId;
