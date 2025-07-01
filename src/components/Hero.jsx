import heroImg from '../assets/hero.jpeg'
import { FaArrowRight } from 'react-icons/fa'

function Hero() {
  return (
    <section className="w-full relative flex items-center justify-center min-h-[340px] sm:min-h-[420px] md:min-h-[520px] bg-white overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={heroImg}
        alt="Oferta CalzaOro"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{ minHeight: 340, maxHeight: 600 }}
      />
      {/* Overlay oscuro para mejorar contraste */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      {/* Contenido alineado a la izquierda y sobre la zona oscura */}
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-6 py-16 max-w-xl"
        style={{ marginLeft: 'max(2rem, 5vw)' }}
      >
        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow mb-2 tracking-widest uppercase">
          HASTA 50% OFF
        </span>
        <span className="bg-white text-black font-bold text-lg sm:text-xl px-2 py-1 rounded mb-2 shadow tracking-wide uppercase">
          OFERTAS DE FINAL DE TEMPORADA
        </span>
        <p className="bg-white text-black text-base sm:text-lg px-2 py-1 rounded mb-3 shadow max-w-xl font-medium">
          Tus estilos favoritos, ahora con precios especiales.<br />
          ¡Corre por tus imprescindibles con HASTA 50% OFF!
        </p>
        <a
          href="#categorias"
          className="inline-flex items-center gap-2 bg-white border-2 border-black text-black font-bold px-6 py-3 rounded shadow hover:bg-black hover:text-white transition text-base mt-2"
        >
          COMPRAR AHORA <FaArrowRight />
        </a>
      </div>
    </section>
  )
}

export default Hero