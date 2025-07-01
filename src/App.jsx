import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedSection from './components/FeaturedSection'
import Footer from './components/Footer'
import CategoryCard from './components/CategoryCard'
import CategoryLanding from './components/CategoryLanding'
import bgTexture from './assets/bg-texture.png'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [categoriaTree, setCategoriaTree] = useState({})
  const [mainCategories, setMainCategories] = useState([])
  const [productos, setProductos] = useState([])

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
    <div
      className="bg-white min-h-screen flex flex-col"
      
    >
      <Navbar onCategoryNav={handleCategoryNav} />
      <main className="container mx-auto px-4 pt-20 sm:pt-28 pb-12 flex-1">
        <Hero />
        <section id="categorias" className="mt-8">
          {!selectedCategory ? (
            <>
              <h2 className="text-3xl font-bold mb-8 text-black text-center font-serif">Categorías de productos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {mainCategories.map(cat => {
                  // Obtener IDs de la categoría y todas sus subcategorías (hijos y nietos)
                  const subIds = [cat._id]
                  cat.subcategories?.forEach(sub => {
                    subIds.push(sub._id)
                    sub.subcategories?.forEach(ssub => {
                      subIds.push(ssub._id)
                    })
                  })
                  // Filtrar productos que pertenezcan a la categoría o subcategorías
                  const catProducts = productos.filter(p => p.categoria && subIds.includes(p.categoria._id) && p.imagen)
                  const images = catProducts.map(p => p.imagen)
                  return (
                    <div
                      key={cat._id}
                      className="cursor-pointer focus:outline-none bg-transparent shadow-none border-none p-0"
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
