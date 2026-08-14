import type { Task, TaskDifficulty, TaskStatus } from '../interfaces/task'

interface SampleSeed {
  title: string
  description: string
  status: TaskStatus
  difficulty: TaskDifficulty
  /** Kaç saat önce oluşturulmuş sayılacağı. */
  hoursAgo: number
}

const SEEDS: SampleSeed[] = [
  {
    title: 'Proje teslim formunu doldur',
    description:
      'Depo adresini ve yayın linkini forma gir, göndermeden önce alanları bir daha kontrol et.',
    status: 'todo',
    difficulty: 'easy',
    hoursAgo: 1,
  },
  {
    title: 'Sunum için ekran görüntülerini hazırla',
    description:
      'Pano ve liste görünümünden birer görüntü al, kenar boşluklarını eşitleyip klasöre koy.',
    status: 'todo',
    difficulty: 'easy',
    hoursAgo: 3,
  },
  {
    title: 'Erişilebilirlik kontrollerini gözden geçir',
    description:
      'Sekme tuşuyla bütün alanları dolaş, odak halkalarının görünür olduğundan ve etiketlerin okunduğundan emin ol.',
    status: 'todo',
    difficulty: 'hard',
    hoursAgo: 6,
  },
  {
    title: 'Mobil görünümü telefonda test et',
    description:
      'Sütunların alt alta düzgün dizildiğini ve butonlara parmakla rahat basıldığını doğrula.',
    status: 'todo',
    difficulty: 'medium',
    hoursAgo: 9,
  },
  {
    title: 'Panodaki sürükle bırak akışını dene',
    description:
      'Bir kartı üç sütun arasında gezdir, bırakılan yerin doğru vurgulandığını ve sayaçların güncellendiğini izle.',
    status: 'progress',
    difficulty: 'hard',
    hoursAgo: 4,
  },
  {
    title: 'README dosyasını güncelle',
    description:
      'Kurulum adımlarını, klasör yapısını ve yayın talimatını son haline göre düzelt.',
    status: 'progress',
    difficulty: 'medium',
    hoursAgo: 8,
  },
  {
    title: 'Depoyu GitHub üzerinde public olarak aç',
    description:
      'Yeni bir depo oluştur, ilk gönderimi yap ve görünürlüğün herkese açık olduğunu kontrol et.',
    status: 'done',
    difficulty: 'easy',
    hoursAgo: 20,
  },
  {
    title: 'Tailwind kurulumunu tamamla',
    description:
      'Eklentiyi derleme ayarlarına tanıt, ana stil dosyasını içeri aktar ve sınıfların uygulandığını doğrula.',
    status: 'done',
    difficulty: 'medium',
    hoursAgo: 30,
  },
]

/** Verilen projeyi denemek için hazır Türkçe görev listesi üretir. */
export function createSampleTasks(projectId: string): Task[] {
  const now = Date.now()

  return SEEDS.map((seed, index) => ({
    id: `ornek-${index}-${now}`,
    projectId,
    title: seed.title,
    description: seed.description,
    status: seed.status,
    difficulty: seed.difficulty,
    isSample: true,
    createdAt: new Date(now - seed.hoursAgo * 3600000).toISOString(),
  }))
}
