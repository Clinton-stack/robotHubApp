import { useEffect, useState } from 'react'
import type { LoginSlide } from '../data/loginSlides'

type LoginSlideshowProps = {
  slides: LoginSlide[]
}

export function LoginSlideshow({ slides }: LoginSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedSources, setFailedSources] = useState<Set<string>>(new Set())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const activeSlide = slides[activeIndex]
  const activeImageSrc = failedSources.has(activeSlide.imageSrc)
    ? activeSlide.fallbackImageSrc
    : activeSlide.imageSrc
  const hasImage = !failedSources.has(activeImageSrc)

  return (
    <section className="relative min-h-[420px] overflow-hidden bg-slate-100 lg:min-h-svh">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc,#e5e7eb)]" />

      {hasImage && (
        <img
          key={activeImageSrc}
          src={activeImageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => {
            setFailedSources((current) => new Set(current).add(activeImageSrc))
          }}
        />
      )}

      {!hasImage && (
        <div className="absolute inset-0 grid place-items-center px-8 text-center text-slate-500">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">Image pending</p>
            <p className="mt-3 max-w-sm text-base leading-7">
              Add robot photos to <span className="font-semibold text-slate-700">public/robot-images</span>.
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-8 text-white sm:p-10 lg:min-h-svh xl:p-16">
        <div className="max-w-xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-white/80">
            Manufacturing inspection workflow
          </p>
          <h2 className="text-4xl font-black tracking-normal xl:text-5xl">{activeSlide.title}</h2>
          <p className="mt-4 max-w-lg text-lg leading-8 text-white/85">{activeSlide.caption}</p>
        </div>

        <div className="mt-10 flex gap-3" aria-label="Slideshow position">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? 'w-12 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
              }`}
              aria-label={`Show ${slide.title}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
