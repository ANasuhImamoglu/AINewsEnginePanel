# 📰 AINewsEngine - Yönetim Paneli (Frontend)

## 🚀 Proje Amacı
Bu proje, staj dönemimde ekip arkadaşlarımla birlikte geliştirdiğimiz, yapay zeka destekli haber motorunun vitrinidir. RSS kaynaklarından beslenen verileri son kullanıcıya modern, hızlı ve duyarlı bir arayüzle sunmak amacıyla tasarlanmıştır.

## ✨ Temel Özellikler
* **🔄 Dinamik Veri Akışı:** Backend API üzerinden anlık olarak çekilen haber listesi.
* **📂 Akıllı Kategorizasyon:** Haberlerin kategorilere göre otomatik gruplandırılması ve filtrelenmesi.
* **🛡️ Güvenli Erişim:** Sadece editör onayı almış (OnayDurumu: 1) haberlerin kullanıcıya sunulması.
* **📱 Responsive Design:** Tüm mobil cihazlar ve tabletlerle tam uyumlu kullanıcı arayüzü.
* **⚡ State Management:** RxJS ve Angular servisleri ile optimize edilmiş veri iletişimi.

## 🛠️ Kullanılan Teknolojiler
* **⚙️ Framework:** Angular (v16+)
* **🟦 Dil:** TypeScript
* **🎨 Tasarım:** HTML5, CSS3 / SCSS
* **📡 İletişim:** HttpClient & RxJS Observables
* **🛡️ Güvenlik:** Angular Route Guards & JWT Interceptors

## ⚙️ Kurulum & Çalıştırma
1. Bağımlılıkları yükleyin: `npm install`
2. Uygulamayı başlatın: `ng serve`
3. Tarayıcıda `http://localhost:4200` adresine gidin.

## 💡 Geliştirici Notları
Projenin yönetim süreçleri (CRUD), operasyonel hız ve merkezi veri kontrolü sağlamak amacıyla Backend tarafındaki **Swagger/OpenAPI** arayüzü üzerinden API-First yaklaşımıyla yürütülmektedir.
