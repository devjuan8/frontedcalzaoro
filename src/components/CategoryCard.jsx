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
        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
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
    <div className="relative w-full h-full">
      <img
        src={images[index]}
        alt={alt || "Imagen producto"}
        className="w-full h-full object-contain object-center transition-all duration-500 rounded-2xl bg-white"
      />
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gold text-black rounded-full p-2 shadow"
            onClick={handlePrev}
            aria-label="Anterior"
            type="button"
          >
            <FaChevronLeft />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gold text-black rounded-full p-2 shadow"
            onClick={handleNext}
            aria-label="Siguiente"
            type="button"
          >
            <FaChevronRight />
          </button>
        </>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === index ? 'bg-gold' : 'bg-gray-300'} block`}
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
    <div className="flex flex-col items-center bg-transparent shadow-none border-none p-0 group">
      <div className="w-full aspect-square overflow-hidden rounded-2xl">
        <ProductCarousel images={images && images.length > 0 ? images : [bgImg]} alt={name} />
      </div>
      <div className="w-full mt-3 flex flex-col items-center">
        <span className="text-xl font-bold text-black font-serif text-center">{name}</span>
        <span className="text-black text-sm text-center">{description}</span>
      </div>
    </div>
  )
}

export default CategoryCard