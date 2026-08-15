/** Uygulamanın logosu ve adı. */
export default function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/panolo-logo.png"
        alt=""
        aria-hidden="true"
        width={36}
        height={36}
        className="size-9 shrink-0"
      />
      <span className="font-brand text-2xl leading-none font-bold tracking-[0.16em] uppercase sm:text-[26px]">
        Panolo
      </span>
    </div>
  )
}
