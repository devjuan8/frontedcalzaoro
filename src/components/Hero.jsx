import heroImg from '../assets/hero.jpeg'
import { FaArrowRight } from 'react-icons/fa'

function Hero() {
  return (
    <section className="w-full relative flex items-center justify-center min-h-[340px] sm:min-h-[420px] md:min-h-[520px] bg-white overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={heroImg}
        alt="Oferta CalzaOro"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700 hover:scale-105"
        style={{ minHeight: 340, maxHeight: 600 }}
      />
      {/* Overlay con gradiente más sofisticado */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 z-10" />
      {/* Contenido alineado a la izquierda y sobre la zona oscura */}
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-6 py-16 max-w-xl"
        style={{ marginLeft: 'max(2rem, 5vw)' }}
      >
        {/* Badge de oferta con efecto de brillo */}
        <div className="relative mb-4">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-2xl mb-2 tracking-widest uppercase bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent animate-pulse">
            HASTA 50% OFF
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-yellow-400/20 to-gold/20 blur-xl -z-10"></div>
        </div>
        
        {/* Badge de temporada con borde dorado */}
        <span className="bg-white/95 backdrop-blur-sm text-black font-bold text-lg sm:text-xl px-4 py-2 rounded-full mb-3 shadow-2xl border-2 border-gold/30 transform hover:scale-105 transition-all duration-300">
          OFERTAS DE FINAL DE TEMPORADA
        </span>
        
        {/* Descripción con mejor contraste */}
        <div className="bg-white/90 backdrop-blur-sm text-black text-base sm:text-lg px-4 py-3 rounded-2xl mb-4 shadow-xl border border-gold/20 max-w-xl">
          <p className="font-medium leading-relaxed">
            Tus estilos favoritos, ahora con precios especiales.<br />
            <span className="font-bold text-gold">¡Corre por tus imprescindibles con HASTA 50% OFF!</span>
          </p>
        </div>
        
        {/* Botón con efectos mejorados */}
        <a
          href="#categorias"
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-gold to-yellow-500 border-2 border-gold text-black font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-gold/50 hover:scale-105 transition-all duration-300 text-base mt-2 transform hover:-translate-y-1"
        >
          <span>COMPRAR AHORA</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
      
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-10 right-10 z-20 hidden lg:block">
        <div className="w-20 h-20 bg-gold/20 rounded-full blur-xl animate-pulse"></div>
      </div>
      <div className="absolute bottom-20 left-20 z-20 hidden lg:block">
        <div className="w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </section>
  )
}

export default Hero