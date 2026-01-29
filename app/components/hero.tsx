import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/hogwarts-wallpaper.jpg"
        alt="Hogwarts Castle"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-wider font-heading" style={{ color: '#d4af37' }}>
          Hogwarts School <span className="block text-3xl sm:text-5xl md:text-6xl mt-2 font-heading" style={{ color: '#f5f1de' }}>of Magic</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed" style={{ color: '#d4af37' }}>
          Teaching wizardry for centuries (or so it seems).
        </p>

        <p className="mt-3 text-xs italic" style={{ color: '#a89968' }}>
          No muggles were harmed. Dashboards, however, were deeply inspected.
        </p>
      </div>
    </section>
  );
}