# Panolo

React, TypeScript ve Tailwind CSS ile geliştirilmiş bir görev yönetim uygulaması.
Görevler projeler altında toplanır, zorluk derecesi alır ve üç sütunlu bir kanban
panosunda sürüklenerek durumları değişir. Bütün veri tarayıcının `LocalStorage`'ında
saklanır, arka uç gerektirmez.

**Canlı demo:** https://taskmanager-dusky-one.vercel.app

## Özellikler

| İşlem        | Karşılığı                                                                  |
| ------------ | -------------------------------------------------------------------------- |
| **Ekle**     | Açılır panelden başlık, açıklama ve zorluk derecesi girerek görev oluşturma |
| **Listele**  | Kanban panosu ve tek parça liste olmak üzere iki görünüm                    |
| **Güncelle** | Satır içi başlık, açıklama ve zorluk düzenleme, sütunlar arası taşıma       |
| **Sil**      | Tek görev silme, biten sütununu ve örnek verileri toplu temizleme           |

Ek olarak:

- **Projeler** — Görevler bir projeye bağlıdır. Uygulama ilk açıldığında kullanıcıdan
  proje adı istenir, sonrasında başlıktaki menüden yeni proje açılabilir, ad
  değiştirilebilir ve proje silinebilir. Her projenin görevleri, sayaçları ve ilerlemesi
  birbirinden bağımsızdır
- **Kanban panosu** — Yapılacak, Devam ediyor ve Bitti sütunları, her birinde renkli
  etiket ve canlı sayaç
- **Sürükle bırak** — kartlar sütunlar arasında sürüklenerek taşınır, hedef sütun
  vurgulanır. Sürükleme kullanamayanlar için karttaki ok butonları aynı işi yapar
- **Zorluk derecesi** — Basit, Orta, Zor. Renkli noktayla gösterilir, sütunlarda zor
  görevler üste çıkar
- **Açıklama** — her göreve isteğe bağlı serbest metin, kartta başlığın altında görünür
- **Örnek veri** — panoyu denemek için hazır listeyi tek tuşla yükleme. Aynı buton
  yüklendikten sonra silmeye dönüşür ve yalnızca örnek kayıtları kaldırır
- **Kalıcılık** — her değişiklik `LocalStorage`'a yazılır. Okuma sırasında bozuk
  kayıtlar elenir, eski şemadan gelen veriler dönüştürülür, projesi kalmamış görevler
  ilk projeye bağlanır
- **İlerleme** — açık projenin tamamlanma oranı başlıkta ince bir çubukla gösterilir
- Mobil, tablet ve geniş ekran için duyarlı (responsive) yerleşim
- Klavye desteği: `Enter` ile kaydetme, `Esc` ile vazgeçme ve menü kapatma
- Erişilebilirlik: `aria` etiketleri, görünür odak halkaları, ekran okuyucu etiketleri
- Beklenmeyen bir render hatasında boş sayfa yerine anlaşılır bir uyarı ekranı

## Tasarım

Arayüz Apple'ın sistem arayüzlerine yakın bir dil kullanır. Zeminde yumuşak renk
geçişleri vardır; paneller, kartlar ve butonlar `backdrop-filter` ile arkalarını
bulanıklaştıran cam yüzeylerdir. Butonlarda üst kenar parlaması, yumuşak dış gölge ve
basıldığında içeri gömülme hareketi bulunur. Tipografi SF Pro sistem yazı tipine dayanır,
Inter yedek olarak yüklenir.

Logo, üçe bölünmüş yuvarlatılmış bir karedir; ortadaki sütun dolu, yandakiler soluktur.
Panonun üç sütunlu yapısını temsil eder.

## Kullanılan Teknolojiler

- **React 19** — bileşen tabanlı arayüz
- **TypeScript** — tip güvenliği (`src/interfaces` altında tip tanımları)
- **Vite** — geliştirme sunucusu ve derleme aracı
- **Tailwind CSS 4** — stil
- **Vitest** — birim testleri
- **LocalStorage** — kalıcı veri saklama

## Proje Yapısı

```
src/
├── components/               # Yeniden kullanılabilir arayüz bileşenleri
│   ├── ProjectMenu.tsx       # Başlıktaki proje seçici ve proje işlemleri
│   ├── ProjectOnboarding.tsx # İlk açılışta gösterilen karşılama ekranı
│   ├── TaskForm.tsx          # Açılır görev ekleme paneli
│   ├── BoardView.tsx         # Kanban sütunları ve bırakma alanları
│   ├── ListView.tsx          # Tek parça liste görünümü
│   ├── TaskCard.tsx          # Görev kartının okuma hali
│   ├── TaskCardEditor.tsx    # Görev kartının düzenleme formu
│   ├── DifficultyBadge.tsx   # Zorluk göstergesi
│   ├── DifficultySelect.tsx  # Basit, Orta, Zor seçimi
│   ├── StatusChip.tsx        # Renkli durum etiketi
│   ├── IconButton.tsx        # Kart üzerindeki ikon butonu
│   ├── Toolbar.tsx           # Görünüm değiştirici ve toplu işlemler
│   ├── EmptyState.tsx        # Görev bulunmayan alanlarda gösterilen kutu
│   └── ErrorBoundary.tsx     # Render hatalarını yakalayan sarmalayıcı
├── pages/
│   └── HomePage.tsx          # Ana sayfa
├── interfaces/
│   ├── task.ts               # Task, TaskStatus, TaskDifficulty, TaskStats tipleri
│   └── project.ts            # Project ve BoardState tipleri
├── hooks/
│   ├── useBoard.ts           # Projeler ve görevler için durum yönetimi
│   └── useBoard.test.ts
├── lib/
│   ├── storage.ts            # LocalStorage okuma, yazma ve göç katmanı
│   ├── storage.test.ts
│   ├── sampleTasks.ts        # Hazır örnek görev listesi
│   ├── sampleTasks.test.ts
│   ├── taskMeta.ts           # Etiketler, sıralama ve zorluk ağırlıkları
│   └── createId.ts           # Benzersiz kimlik üreteci
├── App.tsx
├── main.tsx
└── index.css
```

Tip tanımları `interfaces`, saf yardımcılar `lib`, durum yönetimi `hooks`, arayüz
`components` ve `pages` altında durur. Bağımlılık tek yönlüdür: bileşenler doğrudan
`LocalStorage`'a dokunmaz, her şey `useBoard` üzerinden geçer.

## Kurulum

Gereksinim: Node.js 20 veya üzeri.

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (http://localhost:5173)
npm run dev

# Testleri çalıştır
npm run test

# Üretim derlemesi al
npm run build

# Derlemeyi yerelde önizle
npm run preview
```

Diğer komutlar: `npm run lint` kod denetimi yapar, `npm run format` dosyaları Prettier
ile biçimlendirir.

## Testler

Vitest ve jsdom ile 42 birim testi bulunur:

- `storage.test.ts` — bozuk JSON, eksik alan, eski şema göçü ve projesiz görevlerin
  bağlanması
- `sampleTasks.test.ts` — örnek verinin projeye bağlanması, işaretlenmesi ve dağılımı
- `useBoard.test.ts` — proje açma, ad değiştirme, silme, projeler arası yalıtım, görev
  ekleme, güncelleme, taşıma, silme, sıralama ve kalıcılık

## Yayına Alma

Proje Vercel üzerinde yayınlanmıştır. Depo Vercel'e bağlandığında çerçeve **Vite**
olarak otomatik tanınır; derleme komutu `npm run build`, çıktı klasörü `dist` olarak
kendiliğinden ayarlanır, ek yapılandırma gerekmez.

`main` dalına yapılan her gönderim yeni bir yayın tetikler.

## Lisans

Eğitim amaçlı geliştirilmiştir.
