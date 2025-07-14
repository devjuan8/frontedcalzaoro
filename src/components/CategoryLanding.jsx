import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { FaShoppingCart, FaHeart } from 'react-icons/fa'
import zapatoImg from '../assets/zapato.jpg'
import CategoryCard from './CategoryCard'

function ProductCard({ product, categoriasMap }) {
  const { cart, addToCart, removeFromCart } = useCart()
  const { favorites, toggleFavorite } = useFavorites()
  const [showModal, setShowModal] = useState(false)
  const [manualTalla, setManualTalla] = useState("")
  const [error, setError] = useState("")
  // Estado para mostrar imagen completa
  const [showImageModal, setShowImageModal] = useState(false)

  // Mejorada: busca "calzado" en toda la jerarquía usando categoriasMap
  function isCalzado(prod) {
    let cat = prod.categoria
    let intentos = 0
    while (cat && intentos < 10) {
      if (cat.nombre && cat.nombre.toLowerCase().includes("calzado")) return true
      // Si tiene padre, busca en categoriasMap
      if (cat.padre && categoriasMap && categoriasMap[cat.padre]) {
        cat = categoriasMap[cat.padre]
      } else {
        break
      }
      intentos++
    }
    return false
  }

  // Toggle: si está en el carrito, lo quita; si no, lo agrega
  const inCart = cart.some(p => {
    if (isCalzado(product)) {
      return p._id === product._id && p.variante && p.variante.talla === manualTalla
    } else {
      return p._id === product._id && !p.variante
    }
  })
  const inFavorites = favorites.some(p => p._id === product._id)

  const handleAddToCart = () => {
    if (isCalzado(product)) {
      if (!manualTalla.trim()) {
        setError("Por favor escribe la talla")
        return
      }
      addToCart({ ...product, variante: { talla: manualTalla } })
      setShowModal(false)
      setError("")
      setManualTalla("")
    } else {
      addToCart(product)
    }
  }

  // Nuevo: toggle del carrito
  const handleCartClick = () => {
    if (isCalzado(product)) {
      setShowModal(true)
      setManualTalla("")
      setError("")
    } else {
      // Si ya está en el carrito, quitarlo
      if (cart.some(p => p._id === product._id && !p.variante)) {
        removeFromCart(product._id)
        return
      }
      handleAddToCart()
    }
  }

  // En el modal, si ya está en el carrito con esa talla, quitarlo; si no, agregarlo
  const handleAddOrRemoveCalzado = () => {
    if (!manualTalla.trim()) {
      setError("Por favor escribe la talla")
      return
    }
    const yaEnCarrito = cart.some(p => p._id === product._id && p.variante && p.variante.talla === manualTalla)
    if (yaEnCarrito) {
      removeFromCart(product._id, { talla: manualTalla })
      setShowModal(false)
      setManualTalla("")
      setError("")
    } else {
      addToCart({ ...product, variante: { talla: manualTalla } })
      setShowModal(false)
      setManualTalla("")
      setError("")
    }
  }

  return (
    <div className="flex flex-col items-center bg-white border border-gold rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow group">
      <div className="w-full aspect-square overflow-hidden rounded-xl mb-3 cursor-pointer" onClick={handleCartClick}>
        <img
          src={product.imagen || zapatoImg}
          alt={product.nombre}
          className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105 bg-white"
          onClick={e => { e.stopPropagation(); setShowImageModal(true); }}
          style={{ cursor: 'zoom-in' }}
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
            onClick={handleCartClick}
            aria-label={inCart ? "Quitar del carrito" : "Agregar al carrito"}
            style={{ background: 'transparent' }}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
      {/* Modal para ver imagen completa */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-2xl shadow-lg p-4 max-w-2xl w-full flex flex-col items-center relative animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 bg-transparent text-black text-xl font-bold" onClick={() => setShowImageModal(false)}>&times;</button>
            <img
              src={product.imagen || zapatoImg}
              alt={product.nombre}
              className="w-full max-h-[80vh] object-contain rounded-xl"
              style={{ background: '#fff' }}
            />
            <div className="mt-2 text-center text-black font-bold">{product.nombre}</div>
            <div className="text-black/70 text-sm text-center">{product.descripcion}</div>
          </div>
        </div>
      )}
      {/* Modal de talla solo para calzado */}
      {showModal && isCalzado(product) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs relative animate-fade-in">
            <button className="absolute top-2 right-2 bg-transparent text-black text-xl font-bold" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-lg font-bold text-gold mb-2 font-serif">Escribe la talla</h3>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full text-black mb-2"
              placeholder="Ej: 38, 39, 40..."
              value={manualTalla}
              onChange={e => { setManualTalla(e.target.value); setError("") }}
              autoFocus
            />
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button
              className="w-full bg-gold text-dark font-bold py-2 rounded mt-2 hover:bg-dark hover:text-gold transition"
              onClick={handleAddOrRemoveCalzado}
            >{cart.some(p => p._id === product._id && p.variante && p.variante.talla === manualTalla) ? 'Quitar del carrito' : 'Agregar al carrito'}</button>
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
  if (selectedSub && (!selectedSub.subcategories || selectedSub.subcategories.length === 0)) {
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
              <ProductCard key={product._id} product={product} categoriasMap={categoriasMap} />
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
              <ProductCard key={product._id} product={product} categoriasMap={categoriasMap} />
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