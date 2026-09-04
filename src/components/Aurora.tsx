/**
 * Ambient background field.
 *
 * Three large, heavily blurred radial blobs fixed behind the page — the
 * thing that stops a glass surface from looking like grey plastic, since
 * backdrop-filter needs something worth blurring.
 *
 * Purely decorative: aria-hidden, pointer-events none, and frozen by the
 * reduced-motion rule in index.css.
 */
export default function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-[20%] -right-[10%] size-[46rem] rounded-full blur-[120px]"
        style={{ background: 'var(--aurora-1)', animation: 'float-slow 22s ease-in-out infinite' }}
      />
      <div
        className="absolute top-[45%] -left-[15%] size-[38rem] rounded-full blur-[120px]"
        style={{
          background: 'var(--aurora-2)',
          animation: 'float-slow 28s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[45%] size-[32rem] rounded-full blur-[120px]"
        style={{ background: 'var(--aurora-3)', animation: 'float-slow 34s ease-in-out infinite' }}
      />
    </div>
  )
}
