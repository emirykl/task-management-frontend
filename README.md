# Görevler — Kanban Görev Yönetim Panosu

React, TypeScript ve Tailwind CSS ile geliştirilmiş bir görev yönetim uygulaması.
Görevler zorluk derecesi alır, üç sütunlu bir pano üzerinde sürüklenerek durumları
değişir ve hepsi tarayıcının `LocalStorage`'ında saklanır. Arka uç gerektirmez.

**Canlı demo:** _(Netlify linki buraya eklenecek)_

## Özellikler

| İşlem        | Karşılığı                                                                  |
| ------------ | -------------------------------------------------------------------------- |
| **Ekle**     | Açılır panelden başlık, açıklama ve zorluk derecesi girerek görev oluşturma |
| **Listele**  | Kanban panosu ve tek parça liste olmak üzere iki görünüm                    |
| **Güncelle** | Satır içi başlık, açıklama ve zorluk düzenleme, sütunlar arası taşıma       |
| **Sil**      | Tek görev silme, biten sütununu ve örnek verileri toplu temizleme           |

Ek olarak:

- **Kanban panosu** — Yapılacak, Devam ediyor ve Bitti sütunları, her birinde canlı sayaç
- **Sürükle bırak** — kartlar sütunlar arasında sürüklenerek taşınır, hedef sütun
  vurgulanır. Sürükleme kullanamayanlar için karttaki ok butonları aynı işi yapar
- **Zorluk derecesi** — Basit, Orta, Zor. Renkli noktayla gösterilir, sütunlarda zor
  görevler üste çıkar
- **Açıklama** — her göreve isteğe bağlı serbest metin, kartta başlığın altında görünür
- **Örnek veri** — panoyu denemek için hazır Türkçe görev listesini tek tuşla yükleme.
  Aynı buton yüklendikten sonra silmeye dönüşür ve yalnızca örnek kayıtları kaldırır,
  kullanıcının kendi eklediği görevlere dokunmaz
- **Kalıcılık** — her değişiklik `LocalStorage`'a yazılır, sayfa yenilendiğinde korunur
- **İlerleme** — biten görevlerin oranı başlıkta ince bir çubukla gösterilir
- Mobil, tablet ve geniş ekran için duyarlı (responsive) yerleşim
- Klavye desteği: `Esc` ile paneli kapatma ve düzenlemeden çıkma
- Erişilebilirlik: `aria` etiketleri, görünür odak halkaları, ekran okuyucu etiketleri

## Tasarım

Arayüz Apple'ın sistem arayüzlerine yakın bir dil kullanır. Zeminde yumuşak renk
geçişleri vardır; paneller, kartlar ve butonlar `backdrop-filter` ile arkalarını
bulanıklaştıran cam yüzeylerdir. Butonlarda üst kenar parlaması, yumuşak dış gölge ve
basıldığında içeri gömülme hareketi bulunur. Tipografi SF Pro sistem yazı tipine
dayanır, Inter yedek olarak yüklenir.

## Kullanılan Teknolojiler

- **React 19** — bileşen tabanlı arayüz
- **TypeScript** — tip güvenliği (`src/interfaces` altında tip tanımları)
- **Vite** — geliştirme sunucusu ve derleme aracı
- **Tailwind CSS 4** — stil
- **LocalStorage** — kalıcı veri saklama

## Proje Yapısı

```
src/
├── components/              # Yeniden kullanılabilir arayüz bileşenleri
│   ├── TaskForm.tsx         # Açılır görev ekleme paneli
│   ├── BoardView.tsx        # Kanban sütunları ve bırakma alanları
│   ├── ListView.tsx         # Tek parça liste görünümü
│   ├── TaskCard.tsx         # Görev kartı (taşı / düzenle / sil)
│   ├── DifficultyBadge.tsx  # Zorluk göstergesi
│   ├── DifficultySelect.tsx # Basit, Orta, Zor seçimi
│   ├── Toolbar.tsx          # Görünüm değiştirici ve toplu işlemler
│   └── EmptyState.tsx       # Liste boşken gösterilen alan
├── pages/
│   └── HomePage.tsx         # Ana sayfa
├── interfaces/
│   └── task.ts              # Task, TaskStatus, TaskDifficulty, TaskStats tipleri
├── hooks/
│   └── useTasks.ts          # Durum yönetimi ve görev işlemleri
├── lib/
│   ├── storage.ts           # LocalStorage okuma / yazma katmanı
│   └── sampleTasks.ts       # Hazır örnek görev listesi
├── App.tsx
├── main.tsx
└── index.css
```

## Kurulum

Gereksinim: Node.js 20 veya üzeri.

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (http://localhost:5173)
npm run dev

# Üretim derlemesi al
npm run build

# Derlemeyi yerelde önizle
npm run preview
```

## Yayına Alma (Netlify)

Depo Netlify'a bağlandığında `netlify.toml` dosyası ayarları otomatik uygular:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Alternatif olarak Netlify CLI ile:

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

## Lisans

Eğitim amaçlı geliştirilmiştir.
