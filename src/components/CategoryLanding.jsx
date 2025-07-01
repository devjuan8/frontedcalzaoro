import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { FaShoppingCart, FaHeart } from 'react-icons/fa'
import zapatoImg from '../assets/zapato.jpg'
import CategoryCard from './CategoryCard'

function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart()
  const { favorites, toggleFavorite } = useFavorites()
  const [showModal, setShowModal] = useState(false)
  const [selectedVar, setSelectedVar] = useState(null)
  const [error, setError] = useState("")

  const inCart = cart.some(p => p._id === product._id && (!selectedVar || (p.variante && selectedVar && p.variante.color === selectedVar.color && p.variante.talla === selectedVar.talla)))
  const inFavorites = favorites.some(p => p._id === product._id)

  const variantes = product.variantes || []
  const colores = [...new Set(variantes.map(v => v.color))]
  const tallas = [...new Set(variantes.map(v => v.talla))]

  const handleAddToCart = () => {
    if (!selectedVar) {
      setError("Selecciona color y talla")
      return
    }
    if (selectedVar.stock <= 0) {
      setError("Sin stock para esta variante")
      return
    }
    addToCart({ ...product, variante: selectedVar })
    setShowModal(false)
    setError("")
  }

  const handleOpenModal = () => {
    setShowModal(true)
    setSelectedVar(null)
    setError("")
  }

  return (
    <div className="flex flex-col items-center bg-white border border-gold rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow group">
      <div className="w-full aspect-square overflow-hidden rounded-xl mb-3 cursor-pointer" onClick={handleOpenModal}>
        <img
          src={product.imagen || zapatoImg}
          alt={product.nombre}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="w-full text-center">
        <h3 className="font-bold text-black text-lg mb-2 font-serif">{product.nombre}</h3>
        <p className="text-black/70 text-sm mb-3 line-clamp-2">{product.descripcion}</p>
        <div className="flex justify-center items-center gap-2 mb-3">
          {product.esOferta ? (
            <>
              <span className="text-red-500 font-bold text-lg">${product.precioOferta?.toLocaleString()}</span>
              <span className="text-black/50 line-through">${product.precioNormal?.toLocaleString()}</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{product.descuento}%</span>
            </>
          ) : (
            <span className="text-gold font-bold text-xl">${product.precioNormal?.toLocaleString()}</span>
          )}
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            className={`text-3xl bg-transparent p-0 m-0 shadow-none border-none transition ${inFavorites ? 'text-red-500' : 'text-gold hover:text-red-500'}`}
            onClick={() => toggleFavorite(product)}
            aria-label={inFavorites ? "Quitar de favoritos" : "Agregar a favoritos"}
            style={{ background: 'transparent' }}
          >
            <FaHeart />
          </button>
          <button
            className={`text-3xl bg-transparent p-0 m-0 shadow-none border-none transition ${inCart ? 'text-black' : 'text-gold hover:text-black'}`}
            onClick={handleOpenModal}
            aria-label={inCart ? "Quitar del carrito" : "Agregar al carrito"}
            style={{ background: 'transparent' }}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
      {/* Modal de variantes */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs relative animate-fade-in">
            <button className="absolute top-2 right-2 text- bg-transparent text-black text-xl font-bold" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-lg font-bold text-gold mb-2 font-serif">Selecciona variante</h3>
            <div className="mb-2">
              <label className="block text-black font-semibold mb-1">Color:</label>
              <select
                className="border rounded px-2 py-1 w-full text-black"
                value={selectedVar?.color || ''}
                onChange={e => {
                  const color = e.target.value
                  const talla = selectedVar?.talla
                  const variante = variantes.find(v => v.color === color && (!talla || v.talla === talla)) || variantes.find(v => v.color === color)
                  setSelectedVar(variante)
                  setError("")
                }}
              >
                <option value="">Selecciona color</option>
                {colores.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-black font-semibold mb-1">Talla:</label>
              <select
                className="border rounded px-2 py-1 w-full text-black"
                value={selectedVar?.talla || ''}
                onChange={e => {
                  const talla = e.target.value
                  const color = selectedVar?.color
                  const variante = variantes.find(v => v.talla === talla && (!color || v.color === color)) || variantes.find(v => v.talla === talla)
                  setSelectedVar(variante)
                  setError("")
                }}
              >
                <option value="">Selecciona talla</option>
                {tallas.map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {selectedVar && (
              <div className="mb-2 text-black text-sm">Stock: <span className={selectedVar.stock > 0 ? 'text-green-600' : 'text-red-600'}>{selectedVar.stock}</span></div>
            )}
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button
              className="w-full bg-gold text-dark font-bold py-2 rounded mt-2 hover:bg-dark hover:text-gold transition"
              onClick={handleAddToCart}
            >Agregar al carrito</button>
          </div>
        </div>
      )}
    </div>
  )
}

function getAllCategoryIds(cat, categoriasMap) {
  // Devuelve un array con el id de la categoría y todos sus descendientes
  let ids = [cat._id]
  if (cat.subcategories && cat.subcategories.length > 0) {
    cat.subcategories.forEach(sub => {
      ids = ids.concat(getAllCategoryIds(sub, categoriasMap))
    })
  } else if (categoriasMap && categoriasMap[cat._id] && categoriasMap[cat._id].hijos) {
    categoriasMap[cat._id].hijos.forEach(hijo => {
      ids = ids.concat(getAllCategoryIds(hijo, categoriasMap))
    })
  }
  return ids
}

function CategoryLanding({ category, onBack, initialSub, initialSubSub }) {
  const [selectedSub, setSelectedSub] = useState(null)
  const [selectedSubSub, setSelectedSubSub] = useState(null)
  const [productos, setProductos] = useState([])
  const [categoriasMap, setCategoriasMap] = useState({})

  // Cargar productos y categorías de la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
        const data = await res.json()
        setProductos(data)
      } catch (error) {
        console.error('Error cargando productos:', error)
      }
    }
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`)
        const data = await res.json()
        // Crear mapa para acceso rápido por id
        const map = {}
        data.forEach(cat => { map[cat._id] = { ...cat, hijos: [] } })
        data.forEach(cat => {
          if (cat.padre && map[cat.padre]) map[cat.padre].hijos.push(map[cat._id])
        })
        setCategoriasMap(map)
      } catch (error) {
        console.error('Error cargando categorías:', error)
      }
    }
    fetchProductos()
    fetchCategorias()
  }, [])

  // Si recibimos initialSub/initialSubSub, seleccionarlos automáticamente
  useEffect(() => {
    if (initialSub) setSelectedSub(initialSub)
    if (initialSubSub) setSelectedSubSub(initialSubSub)
  }, [initialSub, initialSubSub])

  // Si estamos en la raíz de la categoría
  if (!selectedSub) {
    return (
      <div className="rounded-2xl p-8 border-2 border-gold shadow-lg mt-8 bg-white">
        <button
          onClick={onBack}
          className="mb-6 text-black hover:underline font-bold bg-transparent"
        >
          ← Volver a categorías
        </button>
        <h2 className="text-4xl font-bold text-gold mb-4 font-serif">{category.nombre}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {category.subcategories?.map((sub) => {
            // Obtener todos los ids de la subcategoría y descendientes
            const ids = getAllCategoryIds(sub, categoriasMap)
            // Filtrar productos que pertenezcan a esos ids
            const subProducts = productos.filter(p => p.categoria && ids.includes(p.categoria._id) && p.imagen)
            const images = subProducts.map(p => p.imagen)
            return (
              <div
                key={sub._id}
                className="flex flex-col items-center cursor-pointer bg-transparent shadow-none border-none"
                onClick={() => setSelectedSub(sub)}
              >
                <CategoryCard
                  name={sub.nombre}
                  subcategories={sub.subcategories}
                  description={sub.subcategories && sub.subcategories.length > 0 ? sub.subcategories.map(ssub => ssub.nombre).join(', ') : ''}
                  images={images}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Si estamos en una subcategoría con sub-subcategorías
  if (selectedSub && selectedSub.subcategories && !selectedSubSub) {
    return (
      <div className="rounded-2xl p-8 border-2 border-gold shadow-lg mt-8 bg-white">
        <button
          onClick={() => setSelectedSub(null)}
          className="mb-6 text-black hover:underline font-bold bg-transparent"
        >
          ← Volver a {category.nombre}
        </button>
        <h2 className="text-3xl font-bold text-gold mb-4 font-serif">{selectedSub.nombre}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {selectedSub.subcategories.map((ssub) => {
            const ids = getAllCategoryIds(ssub, categoriasMap)
            const subProducts = productos.filter(p => p.categoria && ids.includes(p.categoria._id) && p.imagen)
            const images = subProducts.map(p => p.imagen)
            return (
              <div
                key={ssub._id}
                className="flex flex-col items-center cursor-pointer bg-transparent shadow-none border-none"
                onClick={() => setSelectedSubSub(ssub)}
              >
                <CategoryCard
                  name={ssub.nombre}
                  subcategories={ssub.subcategories}
                  description={''}
                  images={images}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Si estamos en una subcategoría SIN sub-subcategorías
  if (selectedSub && !selectedSub.subcategories) {
    // Filtra productos por categoría
    const filteredProducts = productos.filter(
      p => p.categoria?._id === selectedSub._id && p.activa
    )

    return (
      <div className="rounded-2xl p-8 border-2 border-gold shadow-lg mt-8 bg-white">
        <button
          onClick={() => setSelectedSub(null)}
          className="mb-6 text-black hover:underline font-bold bg-transparent"
        >
          ← Volver a {category.nombre}
        </button>
        <h2 className="text-3xl font-bold text-gold mb-4 font-serif">{selectedSub.nombre}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-black">No hay productos en esta subcategoría.</div>
          )}
        </div>
      </div>
    )
  }

  // Si estamos en una sub-subcategoría, mostramos productos
  if (selectedSub && selectedSubSub) {
    // Filtra productos por sub-subcategoría
    const filteredProducts = productos.filter(
      p => p.categoria?._id === selectedSubSub._id && p.activa
    )

    return (
      <div className="rounded-2xl p-8 border-2 border-gold shadow-lg mt-8 bg-white">
        <button
          onClick={() => setSelectedSubSub(null)}
          className="mb-6 text-black hover:underline font-bold bg-transparent"
        >
          ← Volver a {selectedSub.nombre}
        </button>
        <h2 className="text-3xl font-bold text-gold mb-4 font-serif">{selectedSubSub.nombre}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-black">No hay productos en esta subcategoría.</div>
          )}
        </div>
      </div>
    )
  }
}

export default CategoryLanding