"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Carrusel circular animado de cuidadores destacados (estilo Apple/Framer):
 * los avatares orbitan en una elipse; los de delante (abajo) se agrandan y
 * los de atrás se difuminan y encogen, dando sensación de profundidad 3D.
 * Movimiento por requestAnimationFrame (sin dependencias), pausa al hover
 * y respeto total a prefers-reduced-motion (queda estático y legible).
 *
 * Solo capa visual/ilustrativa del hero.
 */

const CUIDADORES = [
  { n: "María G.", t: "Personas mayores", ini: "M" },
  { n: "Lucía R.", t: "Niños", ini: "L" },
  { n: "Andrés P.", t: "Dependientes", ini: "A" },
  { n: "Carlos M.", t: "Infantil", ini: "C" },
  { n: "Ana R.", t: "Geriatría", ini: "A" },
  { n: "Nadia B.", t: "Personas mayores", ini: "N" },
];

const N = CUIDADORES.length;
const REVOLUCION_MS = 30000; // una vuelta completa

export default function OrbitDestacados() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pausado = useRef(false);
  const [size, setSize] = useState(380);

  // Medir el contenedor para escalar el radio de la órbita.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize(Math.max(260, Math.min(el.clientWidth, 460)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const R = size * 0.32; // radio horizontal
    const Ry = R * 0.64; // radio vertical (elipse → perspectiva)

    const colocar = (base: number) => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const th = base + (i / N) * Math.PI * 2;
        const x = Math.cos(th) * R;
        const y = Math.sin(th) * Ry;
        const depth = (Math.sin(th) + 1) / 2; // 0 (fondo) … 1 (frente/abajo)
        const scale = 0.68 + depth * 0.5;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(0.38 + depth * 0.62);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.35 ? "blur(1.5px)" : "none";
      });
    };

    // Punto de partida: primer cuidador al frente (abajo).
    let a = Math.PI / 2;
    if (reduce) {
      colocar(a);
      return;
    }

    let last = performance.now();
    let raf = 0;
    const speed = (Math.PI * 2) / REVOLUCION_MS;
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausado.current) a += dt * speed;
      colocar(a);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => (pausado.current = true)}
      onMouseLeave={() => (pausado.current = false)}
      className="relative mx-auto h-[360px] w-full select-none"
      role="img"
      aria-label="Cuidadores destacados orbitando: María, Lucía, Andrés, Carlos, Ana y Nadia."
    >
      {/* Anillo guía sutil */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand-200/60"
        style={{ width: size * 0.64, height: size * 0.64 * 0.64 }}
      />

      {/* Núcleo central */}
      <div className="absolute left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-brand-600 text-center shadow-lift ring-1 ring-inset ring-white/10">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none" aria-hidden>
            <path
              d="M24 36C24 36 10 27.5 10 18.5C10 14.1 13.4 11 17.5 11C20.2 11 22.6 12.5 24 14.8C25.4 12.5 27.8 11 30.5 11C34.6 11 38 14.1 38 18.5C38 27.5 24 36 24 36Z"
              fill="white"
            />
          </svg>
          <span className="mt-1 px-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.1em] text-brand-100">
            Destacados
          </span>
        </div>
      </div>

      {/* Cuidadores en órbita */}
      {CUIDADORES.map((c, i) => (
        <div
          key={c.n}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute left-1/2 top-1/2 flex w-max flex-col items-center gap-1.5 will-change-transform"
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-100 bg-white font-serif text-xl text-brand-700 shadow-card">
            {c.ini}
          </div>
          <div className="rounded-full border border-brand-100 bg-white/95 px-3 py-1 text-center shadow-sm backdrop-blur">
            <p className="text-xs font-semibold leading-tight text-brand-900">{c.n}</p>
            <p className="text-[10px] leading-tight text-brand-500">{c.t}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
