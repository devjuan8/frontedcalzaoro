import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedSection from './components/FeaturedSection'
import Footer from './components/Footer'
import CategoryCard from './components/CategoryCard'
import CategoryLanding from './components/CategoryLanding'
import bgTexture from './assets/bg-texture.png'
import logo from './assets/logo.png'
function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [categoriaTree, setCategoriaTree] = useState({})
  const [mainCategories, setMainCategories] = useState([])
  const [productos, setProductos] = useState([])
  const [showInfoModal, setShowInfoModal] = useState(true)

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

  // Construir categorías principales para mostrar en la página principal
  const buildMainCategories = (categorias, tree) => {
    const mainCats = []
    
    // Encontrar categorías raíz (sin padre)
    const rootCategories = categorias.filter(cat => !cat.padre && cat.activa)
    
    // Para cada categoría raíz, construir su estructura
    rootCategories.forEach(root => {
      const rootNode = tree[root._id]
      if (rootNode && rootNode.hijos.length > 0) {
        mainCats.push({
          _id: root._id,
          nombre: root.nombre,
          activa: root.activa,
          subcategories: rootNode.hijos
            .filter(hijo => hijo.activa)
            .map(hijo => ({
              _id: hijo._id,
              nombre: hijo.nombre,
              activa: hijo.activa,
              subcategories: hijo.hijos
                .filter(nieto => nieto.activa)
                .map(nieto => ({
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

  // Nuevo handler para navegación desde el Navbar
  const handleCategoryNav = (cat, sub, subsub) => {
    if (cat && sub && subsub) {
      // Para categorías con sub-subcategorías
      setSelectedCategory({
        ...cat,
        _initialSub: sub,
        _initialSubSub: subsub,
      })
    } else if (cat && sub) {
      // Para categorías con solo subcategorías
      setSelectedCategory({
        ...cat,
        _initialSub: sub,
      })
    } else {
      setSelectedCategory(cat)
    }
    // Scroll al main
    setTimeout(() => {
      document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Modal informativo al ingresar */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/70 z-[9998] flex items-center justify-center animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center relative border-2 border-gold/50 overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
            
            <button
              className="absolute top-3 right-3 text-gold hover:text-dark transition-all duration-300 text-2xl p-2 bg-white/80 hover:bg-gold/20 rounded-full hover:scale-110 shadow-lg"
              onClick={() => setShowInfoModal(false)}
              aria-label="Cerrar"
              type="button"
            >
              ×
            </button>
            
            <div className="relative mb-6">
              <img src={logo} alt="CalzaOro logo" className="h-24 w-24 object-contain drop-shadow-lg" />
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl opacity-60"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-gold text-center mb-4 font-serif bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
              ¿Cómo comprar?
            </h2>
            
            <div className="space-y-3 text-center">
              <p className="text-black text-base leading-relaxed">
                Agrega los productos que te interesen al carrito y luego haz tu pedido fácilmente por 
                <span className="font-bold text-green-600 mx-1">WhatsApp</span>.
              </p>
              <p className="text-black text-sm text-gray-600">
                ¡Así de simple! Si tienes dudas, escríbenos.
              </p>
            </div>
            
            {/* Botón de acción */}
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
      <Navbar onCategoryNav={handleCategoryNav} />
      <main className="container mx-auto px-4 pt-20 sm:pt-28 pb-12 flex-1">
        <Hero />
        <section id="categorias" className="mt-12">
          {!selectedCategory ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-black font-serif bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                  Categorías de productos
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Explora nuestra amplia colección de productos organizados por categorías para encontrar exactamente lo que buscas
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-500 mx-auto mt-4 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                {mainCategories.map(cat => {
                  const subIds = [cat._id]
                  cat.subcategories?.forEach(sub => {
                    subIds.push(sub._id)
                    sub.subcategories?.forEach(ssub => {
                      subIds.push(ssub._id)
                    })
                  })
                  const catProducts = productos.filter(p => p.categoria && subIds.includes(p.categoria._id) && p.imagen)
                  const images = catProducts.map(p => p.imagen)
                  return (
                    <div
                      key={cat._id}
                      className="cursor-pointer focus:outline-none bg-transparent shadow-none border-none p-0 group"
                      onClick={() => setSelectedCategory(cat)}
                      tabIndex={0}
                      role="button"
                      onKeyPress={e => { if (e.key === 'Enter') setSelectedCategory(cat) }}
                    >
                      <CategoryCard
                        name={cat.nombre}
                        subcategories={cat.subcategories}
                        description={`Explora nuestra colección de ${cat.nombre.toLowerCase()}`}
                        images={images}
                      />
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <CategoryLanding
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
              initialSub={selectedCategory._initialSub}
              initialSubSub={selectedCategory._initialSubSub}
            />
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
