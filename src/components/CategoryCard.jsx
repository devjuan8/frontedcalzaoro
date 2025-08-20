import { useState, useEffect, useRef } from 'react'
import zapatoImg from '../assets/zapato.jpg'
import accesoriosImg from '../assets/accesorios.jpeg'
import hogarImg from '../assets/hogar.jpeg'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function ProductCarousel({ images, alt }) {
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!images || images.length <= 1) return
    intervalRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [images])

  if (!images || images.length === 0) {
    return (
      <img
        src={zapatoImg}
        alt={alt || "Sin imagen"}
        className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
      />
    )
  }

  const handlePrev = (e) => {
    e.stopPropagation()
    setIndex(prev => (prev - 1 + images.length) % images.length)
    clearInterval(intervalRef.current)
  }
  const handleNext = (e) => {
    e.stopPropagation()
    setIndex(prev => (prev + 1) % images.length)
    clearInterval(intervalRef.current)
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <img
        src={images[index]}
        alt={alt || "Imagen producto"}
        className="w-full h-full object-contain object-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-105 rounded-2xl bg-white"
      />
      {images.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-black hover:text-white rounded-full p-2.5 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl backdrop-blur-sm"
            onClick={handlePrev}
            aria-label="Anterior"
            type="button"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-black hover:text-white rounded-full p-2.5 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl backdrop-blur-sm"
            onClick={handleNext}
            aria-label="Siguiente"
            type="button"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </>
      )}
      {/* Indicador de imágenes */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? 'bg-gold scale-125' : 'bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryCard({ name, subcategories, description, images }) {
  let bgImg = zapatoImg
  if (name === 'Accesorios') bgImg = accesoriosImg
  if (name === 'Hogar y Descanso') bgImg = hogarImg

  return (
    <div className="flex flex-col items-center bg-transparent shadow-none border-none p-0 group cursor-pointer">
      {/* Contenedor de imagen con efectos mejorados */}
      <div className="w-full aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative">
        <ProductCarousel images={images && images.length > 0 ? images : [bgImg]} alt={name} />
        
        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        
        {/* Badge de subcategorías */}
        {subcategories && subcategories.length > 0 && (
          <div className="absolute top-3 right-3 bg-gold/90 backdrop-blur-sm text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {subcategories.length} {subcategories.length === 1 ? 'categoría' : 'categorías'}
          </div>
        )}
      </div>
      
      {/* Contenido de texto con mejor tipografía */}
      <div className="w-full mt-4 flex flex-col items-center text-center">
        <h3 className="text-xl font-bold text-black font-serif mb-2 group-hover:text-gold transition-colors duration-300">
          {name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xs group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>
        
        {/* Indicador de hover */}
        <div className="w-0 group-hover:w-8 h-0.5 bg-gradient-to-r from-gold to-yellow-500 mt-3 transition-all duration-500 rounded-full"></div>
      </div>
    </div>
  )
}

export default CategoryCard