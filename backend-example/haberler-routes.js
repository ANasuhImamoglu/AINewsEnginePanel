const express = require('express');
const router = express.Router();

// GET /api/haberler?page=1&pageSize=10
router.get('/', async (req, res) => {
    try {
        let { page = 1, pageSize = 10 } = req.query;
        
        // Parametreleri sayıya çevir ve doğrula
        page = parseInt(page);
        pageSize = parseInt(pageSize);
        
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; // Maksimum limit
        
        // Toplam kayıt sayısı
        const totalCount = await Haber.countDocuments();
        
        // Sayfalama ile veri çekme
        const haberler = await Haber.find()
            .sort({ yayinTarihi: -1 }) // En yeni haberler önce
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        
        res.json({
            data: haberler,
            totalCount: totalCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/haberler/search?term=kelime&page=1&pageSize=10
router.get('/search', async (req, res) => {
    try {
        let { term, page = 1, pageSize = 10 } = req.query;
        
        // Parametreleri sayıya çevir ve doğrula
        page = parseInt(page);
        pageSize = parseInt(pageSize);
        
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; // Maksimum limit
        
        let query = {};
        
        // Arama terimi varsa filtrele
        if (term && term.trim()) {
            term = term.trim();
            query = {
                $or: [
                    { baslik: { $regex: term, $options: 'i' } },
                    { icerik: { $regex: term, $options: 'i' } }
                ]
            };
        }
        
        // Toplam kayıt sayısı (filtrelenmiş)
        const totalCount = await Haber.countDocuments(query);
        
        // Sayfalama ile veri çekme
        const haberler = await Haber.find(query)
            .sort({ yayinTarihi: -1 }) // En yeni haberler önce
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        
        res.json({
            data: haberler,
            totalCount: totalCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Diğer endpoint'ler...
router.put('/:id/approve', async (req, res) => {
    try {
        const haber = await Haber.findByIdAndUpdate(
            req.params.id,
            { onaylandi: true },
            { new: true }
        );
        
        if (!haber) {
            return res.status(404).json({ error: 'Haber bulunamadı' });
        }
        
        res.json(haber);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/increment-read', async (req, res) => {
    try {
        const haber = await Haber.findByIdAndUpdate(
            req.params.id,
            { $inc: { okunduSayisi: 1 } },
            { new: true }
        );
        
        if (!haber) {
            return res.status(404).json({ error: 'Haber bulunamadı' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/increment-click', async (req, res) => {
    try {
        const haber = await Haber.findByIdAndUpdate(
            req.params.id,
            { $inc: { tiklandiSayisi: 1 } },
            { new: true }
        );
        
        if (!haber) {
            return res.status(404).json({ error: 'Haber bulunamadı' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
