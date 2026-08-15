/** Uygulamanın logosu ve adı. */
export default function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-accent" />
        <rect x="6" y="8" width="5" height="16" rx="1.5" fill="#ffffff" opacity="0.45" />
        <rect x="13.5" y="8" width="5" height="16" rx="1.5" fill="#ffffff" />
        <rect x="21" y="8" width="5" height="16" rx="1.5" fill="#ffffff" opacity="0.45" />
      </svg>
      <span className="font-brand text-2xl leading-none font-bold tracking-[0.16em] uppercase sm:text-[26px]">
        Panolo
      </span>
    </div>
  )
}
