import { useState, useEffect } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import logo from '../assets/logo.png'
import mujer4 from '../assets/mujer4.jpeg'
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaWhatsapp, FaTimes, FaChevronRight, FaChevronLeft, FaShoePrints, FaUserAlt, FaChild, FaFemale, FaMale, FaHome, FaGem, FaShoppingBag } from 'react-icons/fa'

function Navbar({ onCategoryNav }) {
  const [open, setOpen] = useState(false)
  const [mobileMenuLevel, setMobileMenuLevel] = useState('main') // 'main', 'cat', 'sub'
  const [mobileSelectedCat, setMobileSelectedCat] = useState(null)
  const [mobileSelectedSub, setMobileSelectedSub] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)
  const { favorites, toggleFavorite } = useFavorites();
  const { cart, removeFromCart, clearCart } = useCart();
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  // Estados para datos dinámicos
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [categoriaTree, setCategoriaTree] = useState({})
  const [mainCategories, setMainCategories] = useState([])

  // Cargar datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar categorías
        const catRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`)
        const categoriasData = await catRes.json()
        setCategorias(categoriasData)

        // Cargar productos
        const prodRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
        const productosData = await prodRes.json()
        setProductos(productosData)

        // Construir árbol de categorías
        const tree = buildCategoryTree(categoriasData)
        setCategoriaTree(tree)

        // Construir categorías principales
        const mainCats = buildMainCategories(categoriasData, tree)
        setMainCategories(mainCats)
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    }

    fetchData()
  }, [])

  // Construir árbol de categorías
  const buildCategoryTree = (categorias) => {
    const tree = {}
    
    // Crear mapa de categorías
    categorias.forEach(cat => {
      tree[cat._id] = { ...cat, hijos: [] }
    })
    
    // Construir jerarquía
    categorias.forEach(cat => {
      if (cat.padre && tree[cat.padre]) {
        tree[cat.padre].hijos.push(tree[cat._id])
      }
    })
    
    return tree
  }

  // Construir categorías principales para el navbar
  const buildMainCategories = (categorias, tree) => {
    const mainCats = []
    
    // Encontrar categorías raíz (sin padre)
    const rootCategories = categorias.filter(cat => !cat.padre)
    
    // Para cada categoría raíz, construir su estructura
    rootCategories.forEach(root => {
      const rootNode = tree[root._id]
      if (rootNode && rootNode.hijos.length > 0) {
        mainCats.push({
          _id: root._id,
          nombre: root.nombre,
          activa: root.activa,
          subcategories: rootNode.hijos.map(hijo => ({
            _id: hijo._id,
            nombre: hijo.nombre,
            activa: hijo.activa,
            subcategories: hijo.hijos.map(nieto => ({
              _id: nieto._id,
              nombre: nieto.nombre,
              activa: nieto.activa
            }))
          }))
        })
      }
    })
    
    return mainCats
  }

  // Obtener subcategorías dinámicamente
  const getSubcategories = (catId) => {
    const categoria = mainCategories.find(cat => cat._id === catId)
    return categoria?.subcategories || []
  }

  // Obtener productos por categoría
  const getProductsByCategory = (categoriaId) => {
    return productos.filter(prod => prod.categoria?._id === categoriaId && prod.activa)
  }

  // Obtener productos por subcategoría
  const getProductsBySubcategory = (subcategoriaId) => {
    return productos.filter(prod => prod.categoria?._id === subcategoriaId && prod.activa)
  }

  // --- Modal Carrito ---
  // Calcular el total usando el precio de oferta si existe y es menor
  const cartTotal = cart.reduce((sum, p) => {
    if (p.precioOferta && p.precioOferta < p.precioNormal) {
      return sum + p.precioOferta;
    }
    return sum + (p.precioNormal || 0);
  }, 0);
  const cartWppMsg = encodeURIComponent(
    `¡Hola! 😊\n\n` +
    `Me gustaría hacer el siguiente pedido:\n\n` +
    cart.map(p => {
      const precio = (p.precioOferta && p.precioOferta < p.precioNormal)
        ? p.precioOferta
        : p.precioNormal;
      return `• ${p.nombre}${p.variante && p.variante.talla ? ` (Talla: ${p.variante.talla})` : ''} - $${precio?.toLocaleString('es-CO') || ''}`;
    }).join('\n') +
    `\n\n*Total:* $${cartTotal.toLocaleString('es-CO')}\n\n` +
    `Quedo atento/a para coordinar el pago y la entrega. ¡Muchas gracias!`
  );
  const cartWppUrl = `https://wa.me/573022815927?text=${cartWppMsg}`;

  const handleMobileCatClick = (cat) => {
    setMobileSelectedCat(cat)
    setMobileMenuLevel('cat')
  }

  const handleMobileSubClick = (sub) => {
    setMobileSelectedSub(sub)
    setMobileMenuLevel('sub')
  }

  const handleMobileBack = () => {
    if (mobileMenuLevel === 'sub') {
      setMobileMenuLevel('cat')
      setMobileSelectedSub(null)
    } else if (mobileMenuLevel === 'cat') {
      setMobileMenuLevel('main')
      setMobileSelectedCat(null)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    if (value.trim().length === 0) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }
    // Coincidencia parcial en nombre (case-insensitive)
    const results = productos.filter(p =>
      p.nombre.toLowerCase().includes(value.toLowerCase()) && p.activa
    )
    setSearchResults(results)
    setShowSearchResults(true)
  }

  const handleSearchSelect = (product) => {
    setShowSearchResults(false)
    setSearch('')
    setOpen(false)
    
    // Navegar a la categoría del producto
    if (product.categoria) {
      const categoria = categoriaTree[product.categoria._id]
      if (categoria) {
        // Encontrar la categoría padre
        const categoriaPadre = categorias.find(cat => cat._id === categoria.padre)
        if (categoriaPadre) {
          onCategoryNav(
            { _id: categoriaPadre._id, nombre: categoriaPadre.nombre },
            { _id: categoria._id, nombre: categoria.nombre }
          )
        } else {
          onCategoryNav({ _id: categoria._id, nombre: categoria.nombre })
        }
      }
    }
  }

  // Manejar login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoadingLogin(true)
    setLoginError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error de autenticación')
      localStorage.setItem('token', data.token)
      setShowLogin(false)
      setLoginData({ email: '', password: '' })
      window.location.href = '/admin'
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoadingLogin(false)
    }
  }

  // Iconos para categorías
  const getCategoryIcon = (nombre) => {
    const lowerName = nombre.toLowerCase()
    if (lowerName.includes('calzado') || lowerName.includes('zapato')) return <FaShoePrints className="inline mr-2 text-lg text-gold" />
    if (lowerName.includes('hombre')) return <FaMale className="inline mr-2 text-lg text-gold" />
    if (lowerName.includes('mujer') || lowerName.includes('dama')) return <FaFemale className="inline mr-2 text-lg text-gold" />
    if (lowerName.includes('niño') || lowerName.includes('nino')) return <FaChild className="inline mr-2 text-lg text-gold" />
    if (lowerName.includes('accesorio')) return <FaGem className="inline mr-2 text-lg text-gold" />
    if (lowerName.includes('hogar') || lowerName.includes('casa')) return <FaHome className="inline mr-2 text-lg text-gold" />
    return <FaShoppingBag className="inline mr-2 text-lg text-gold" />
  }

  return (
    <nav className="bg-white border-b border-gold fixed w-full top-0 left-0 z-50 font-sans">
      <div className="container mx-auto flex items-center justify-between px-2 py-2">
        {/* Logo grande sin borde */}
        <div className="flex items-center gap-2 min-w-0">
          <a href="/" onClick={() => window.location.href = '/'} className="flex items-center">
            <img src={logo} alt="CalzaOro logo" className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />
          </a>
          <span className="text-2xl font-extrabold text-gold tracking-tight font-serif hidden sm:inline ml-1">CalzaOro</span>
        </div>
        {/* Menú principal */}
        <ul className="hidden md:flex gap-6 items-center text-dark text-base relative">
          {mainCategories.map(cat => (
            <li
              key={cat._id}
              className="relative"
              onMouseEnter={() => setHovered(cat._id)}
            >
              <button
                className={`uppercase px-2 py-1 transition bg-transparent shadow-none border-none outline-none font-bold ${hovered === cat._id ? 'text-gold' : 'text-dark'}`}
                onClick={() => onCategoryNav(cat)}
              >
                {cat.nombre}
              </button>
              {/* Mega menú */}
              {hovered === cat._id && (
                <div
                  className="fixed left-0 right-0 bottom-0 top-[88px] bg-white/95 z-50 flex justify-center items-start pt-10 animate-fade-in-up"
                  onMouseEnter={() => setHovered(cat._id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="w-full max-w-6xl mx-auto flex px-10 py-10 gap-10">
                    {/* Columna izquierda */}
                    <div className="hidden md:flex flex-col items-center justify-start pr-10 border-r border-gold min-w-[220px]">
                      <img src={logo} alt="Colección" className="w-28 h-28 object-contain mb-4" />
                      <span className="font-bold text-gold text-lg mb-2">Colecciones</span>
                      <ul className="text-dark text-base">
                        <li className="mb-1 hover:text-gold cursor-pointer">Novedades</li>
                        <li className="mb-1 hover:text-gold cursor-pointer">Ofertas</li>
                        <li className="mb-1 hover:text-gold cursor-pointer">Más vendidos</li>
                      </ul>
                    </div>
                    {/* Subcategorías en columnas */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div
                        className="flex-1 grid gap-8 pl-8"
                        style={{
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          maxHeight: '420px',
                          overflowY: 'auto',
                        }}
                      >
                        {cat.subcategories.map(sub => (
                          <div key={sub._id}>
                            {sub.subcategories && sub.subcategories.length > 0 ? (
                              <>
                                <div className="font-bold text-dark mb-2 text-lg">{sub.nombre}</div>
                                <ul>
                                  {sub.subcategories.map(ssub => (
                                    <li key={ssub._id}>
                                      <button
                                        className="bg-transparent border-none outline-none text-dark hover:text-gold transition text-base font-normal mb-1 text-left p-0"
                                        style={{ boxShadow: 'none', background: 'none' }}
                                        onClick={() => {
                                          onCategoryNav(cat, sub, ssub)
                                          setHovered(null)
                                        }}
                                      >
                                        {ssub.nombre}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <button
                                className="font-bold text-dark mb-2 text-lg hover:text-gold transition"
                                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
                                onClick={() => {
                                  onCategoryNav(cat, sub)
                                  setHovered(null)
                                }}
                              >
                                {sub.nombre}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        {/* Buscador + iconos */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-white rounded-full px-2 py-1 border border-gold min-w-0 max-w-[180px] mx-2 relative">
            <FaSearch className="text-gold mr-1 text-base" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none text-dark placeholder:text-warm-gray w-full min-w-0 text-xs"
              style={{ fontWeight: 500 }}
              value={search}
              onChange={handleSearchChange}
              onFocus={() => search && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <ul className="absolute left-0 top-12 w-full bg-white border border-gold rounded shadow z-50 max-h-60 overflow-y-auto">
                {searchResults.map(product => (
                  <li
                    key={product._id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gold/20 cursor-pointer text-black text-sm"
                    onMouseDown={() => handleSearchSelect(product)}
                  >
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-8 h-8 object-cover rounded border border-gold"
                    />
                    <span>{product.nombre}</span>
                  </li>
                ))}
              </ul>
            )}
            {showSearchResults && searchResults.length === 0 && (
              <div className="absolute left-0 top-12 w-full bg-white border border-gold rounded shadow z-50 px-3 py-2 text-black text-sm">
                No se encontraron productos.
              </div>
            )}
          </div>
          <button
            className="relative text-black hover:text-gold transition text-2xl p-0 bg-transparent ml-2"
            onClick={() => setShowCart(true)}
          >
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full px-1">{cart.length}</span>
            )}
          </button>
          <button
            className="relative text-gold hover:text-dark transition text-2xl p-0 bg-transparent"
            onClick={() => setShowFavorites(true)}
          >
            <FaHeart />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full px-1">{favorites.length}</span>
            )}
          </button>
          <button className="text-black hover:text-gold transition text-2xl p-0 bg-transparent"
            onClick={() => setShowLogin(true)}
          >
            <FaUser />
          </button>
          {/* Hamburguesa solo en móvil */}
          <button className="text-gold text-2xl ml-2 md:hidden bg-transparent p-0" onClick={() => setOpen(!open)} aria-label="Abrir menú">
            <FaBars />
          </button>
        </div>
      </div>
      {/* Menú móvil */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-white/95 z-40 flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gold">
            <img src={logo} alt="CalzaOro logo" className="h-16 w-16 object-contain" />
            <button
              className="text-gold text-2xl"
              style={{ background: 'transparent', boxShadow: 'none' }}
              onClick={() => {
                setOpen(false)
                setMobileMenuLevel('main')
                setMobileSelectedCat(null)
                setMobileSelectedSub(null)
              }}
            >
              <FaTimes className="text-black" />
            </button>
          </div>
          <div className="flex items-center bg-white rounded-full px-3 py-2 border border-gold m-4 relative">
            <FaSearch className="text-gold mr-2 text-base" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none text-dark placeholder:text-warm-gray w-full text-sm"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => search && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <ul className="absolute left-0 top-12 w-full bg-white border border-gold rounded shadow z-50 max-h-60 overflow-y-auto">
                {searchResults.map(product => (
                  <li
                    key={product._id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gold/20 cursor-pointer text-black text-sm"
                    onMouseDown={() => handleSearchSelect(product)}
                  >
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-8 h-8 object-cover rounded border border-gold"
                    />
                    <span>{product.nombre}</span>
                  </li>
                ))}
              </ul>
            )}
            {showSearchResults && searchResults.length === 0 && (
              <div className="absolute left-0 top-12 w-full bg-white border border-gold rounded shadow z-50 px-3 py-2 text-black text-sm">
                No se encontraron productos.
              </div>
            )}
          </div>
          {/* Menú principal */}
          {mobileMenuLevel === 'main' && (
            <ul className="flex flex-col gap-4 px-6 mt-4 font-bold text-dark text-base">
              {mainCategories.map(cat => (
                <li key={cat._id}>
                  <button
                    className="uppercase px-2 py-1 transition font-bold bg-transparent shadow-none border-none outline-none flex justify-between items-center w-full"
                    onClick={() => handleMobileCatClick(cat)}
                  >
                    <span className="flex items-center">
                      {getCategoryIcon(cat.nombre)} {cat.nombre}
                    </span>
                    <FaChevronRight className="text-black text-lg" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {/* Subcategorías */}
          {mobileMenuLevel === 'cat' && mobileSelectedCat && (
            <div className="flex flex-col flex-1">
              <button
                className="flex items-center gap-2 text-gold font-bold px-6 py-2 bg-transparent border-none shadow-none text-lg"
                onClick={() => {
                  setMobileMenuLevel('main')
                  setMobileSelectedCat(null)
                }}
              >
                <FaChevronLeft className="text-black" /> {mobileSelectedCat.nombre}
              </button>
              <ul className="flex flex-col gap-2 px-6 mt-2 text-dark text-base">
                {mobileSelectedCat.subcategories?.map(sub => (
                  <li key={sub._id}>
                    {sub.subcategories && sub.subcategories.length > 0 ? (
                      <button
                        className="flex justify-between items-center w-full bg-transparent border-none shadow-none outline-none px-0 py-2"
                        onClick={() => handleMobileSubClick(sub)}
                      >
                        {sub.nombre}
                        <FaChevronRight className="text-black text-lg" />
                      </button>
                    ) : (
                      <button
                        className="w-full text-left bg-transparent border-none shadow-none outline-none px-0 py-2"
                        onClick={() => {
                          setOpen(false)
                          setMobileMenuLevel('main')
                          setMobileSelectedCat(null)
                          setMobileSelectedSub(null)
                          onCategoryNav(mobileSelectedCat, sub)
                        }}
                      >
                        {sub.nombre}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Sub-subcategorías */}
          {mobileMenuLevel === 'sub' && mobileSelectedSub && (
            <div className="flex flex-col flex-1">
              <button
                className="flex items-center gap-2 text-gold font-bold px-6 py-2 bg-transparent border-none shadow-none text-lg"
                onClick={handleMobileBack}
              >
                <FaChevronLeft className="text-black" /> {mobileSelectedSub.nombre}
              </button>
              <ul className="flex flex-col gap-2 px-6 mt-2 text-dark text-base">
                {mobileSelectedSub.subcategories?.map(ssub => (
                  <li key={ssub._id}>
                    <button
                      className="w-full text-left bg-transparent border-none shadow-none outline-none px-0 py-2"
                      onClick={() => {
                        setOpen(false)
                        setMobileMenuLevel('main')
                        setMobileSelectedCat(null)
                        setMobileSelectedSub(null)
                        onCategoryNav(mobileSelectedCat, mobileSelectedSub, ssub)
                      }}
                    >
                      {ssub.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Iconos abajo */}
          <div className="flex gap-6 mt-8 justify-center">
            <button className="text-black hover:text-gold transition relative text-2xl p-0 bg-transparent">
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full px-1">{cart.length}</span>
              )}
            </button>
            <button className="text-gold hover:text-dark transition text-2xl p-0 bg-transparent">
              <FaUserAlt />
            </button>
            <button className="text-black hover:text-gold transition relative text-2xl p-0 bg-transparent">
              <FaHeart />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full px-1">{favorites.length}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal Carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl relative min-w-[340px] max-w-lg w-full animate-fade-in-up">
            <button
              className="absolute top-2 right-2 text-gold text-2xl p-0 bg-transparent border-none shadow-none hover:text-dark transition"
              onClick={() => setShowCart(false)}
              style={{ background: 'transparent' }}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-black text-center font-serif flex items-center justify-center gap-2">
              <FaShoppingCart className="inline text-gold" /> Tu carrito
            </h3>
            {cart.length === 0 ? (
              <p className="text-black text-center mb-4">Tu carrito está vacío.</p>
            ) : (
              <>
                <ul className="divide-y divide-gold/30 mb-4 max-h-72 overflow-y-auto">
                  {cart.map(item => (
                    <li key={item._id + (item.variante ? `-${item.variante.color}-${item.variante.talla}` : '')} className="flex items-center gap-4 py-3">
                      <img src={item.imagen} alt={item.nombre} className="w-14 h-14 object-cover rounded-lg border border-gold" />
                      <div className="flex-1">
                        <div className="font-bold text-black">{item.nombre}</div>
                        {item.variante && (
                          <div className="text-sm text-black/80">{item.variante.color} | Talla {item.variante.talla}</div>
                        )}
                        <div className="text-gold font-bold text-base">
                          {item.precioOferta && item.precioOferta < item.precioNormal ? (
                            <>
                              <span className="line-through text-black/50 mr-2">${item.precioNormal?.toLocaleString()}</span>
                              <span>${item.precioOferta?.toLocaleString()}</span>
                            </>
                          ) : (
                            <>${item.precioNormal?.toLocaleString()}</>
                          )}
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-gold text-xl ml-2 p-0 bg-transparent border-none shadow-none"
                        onClick={() => removeFromCart(item._id)}
                        title="Quitar del carrito"
                        style={{ background: 'transparent' }}
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mb-6 mt-2 px-1">
                  <span className="font-bold text-black text-lg">Total:</span>
                  <span className="font-bold text-gold text-xl">${cartTotal.toLocaleString()}</span>
                </div>
                <a
                  href={cartWppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" w-full text-center bg-gold text-dark font-bold py-3 rounded-full text-lg shadow hover:bg-dark hover:text-gold border-2 border-gold transition mb-2 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-green-600 text-2xl" />
                  HACER PEDIDO POR WHATSAPP
                </a>
                <button
                  className="block w-full text-center text-sm text-red-500 hover:text-gold mt-1 p-2 bg-transparent border-none shadow-none"
                  onClick={clearCart}
                  style={{ background: 'transparent' }}
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Favoritos */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl relative min-w-[340px] max-w-lg w-full animate-fade-in-up">
            <button
              className="absolute top-2 right-2 text-gold text-2xl p-0 bg-transparent border-none shadow-none hover:text-dark transition"
              onClick={() => setShowFavorites(false)}
              style={{ background: 'transparent' }}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gold text-center font-serif flex items-center justify-center gap-2">
              <FaHeart className="inline text-pink-500" /> Favoritos
            </h3>
            {favorites.length === 0 ? (
              <p className="text-black text-center mb-4">No tienes productos favoritos.</p>
            ) : (
              <ul className="divide-y divide-gold/30 max-h-80 overflow-y-auto">
                {favorites.map(item => (
                  <li key={item._id} className="flex items-center gap-4 py-3">
                    <img src={item.imagen} alt={item.nombre} className="w-14 h-14 object-cover rounded-lg border border-gold" />
                    <div className="flex-1">
                      <div className="font-bold text-black">{item.nombre}</div>
                      <div className="text-gold font-bold text-base">${item.precioNormal?.toLocaleString()}</div>
                    </div>
                    <button
                      className="text-red-500 hover:text-gold text-xl ml-2 p-0 bg-transparent border-none shadow-none"
                      onClick={() => toggleFavorite(item)}
                      title="Eliminar de favoritos"
                      style={{ background: 'transparent' }}
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Modal Login */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <form
            className="bg-white rounded-2xl p-8 shadow-2xl relative min-w-[320px] max-w-xs w-full animate-fade-in-up flex flex-col gap-4"
            onSubmit={handleLogin}
          >
            <button
              className="absolute top-2 right-2 text-gold text-2xl p-0 bg-transparent border-none shadow-none hover:text-dark transition"
              onClick={() => setShowLogin(false)}
              type="button"
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold text-gold text-center font-serif mb-2">Iniciar sesión</h3>
            <input
              type="input"
              placeholder="Correo"
              className="border border-gold rounded px-3 py-2 text-black"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value.toLowerCase() })}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="border border-gold rounded px-3 py-2 text-black"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
            <button
              type="submit"
              className="bg-gold text-dark font-bold py-2 rounded shadow hover:bg-dark hover:text-gold border-2 border-gold transition"
              disabled={loadingLogin}
            >
              {loadingLogin ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      )}
    </nav>
  )
}

export default Navbar