import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

function AdminDashboard() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [catNombre, setCatNombre] = useState("");
  const [catPadre, setCatPadre] = useState("");
  const [prodData, setProdData] = useState({
    nombre: "",
    referencia: "",
    descripcion: "",
    precioNormal: "",
    precioOferta: "",
    descuento: "",
    esOferta: false,
    categoria: "",
    variantes: [{ color: "", talla: "", stock: 0 }],
  });
  const [prodImagen, setProdImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [checking, setChecking] = useState(true);
  const [view, setView] = useState("productos"); // productos | crearProducto | crearCategoria | editarProducto
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editCatNombre, setEditCatNombre] = useState("");
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [editProdImagen, setEditProdImagen] = useState(null);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Validar token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid) window.location.href = "/";
        else setChecking(false);
      })
      .catch(() => window.location.href = "/");
  }, []);

  // Cargar categorías y productos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [categoriasRes, productosRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
        ]);
        
        const categoriasData = await categoriasRes.json();
        const productosData = await productosRes.json();
        
        setCategorias(categoriasData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    cargarDatos();
  }, [mensaje]);

  // Crear categoría
  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    setMensaje("");
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre: catNombre, padre: catPadre || null }),
    });
    if (res.ok) {
      setCatNombre("");
      setCatPadre("");
      setMensaje("Categoría creada");
      showSuccess("Categoría creada correctamente");
      // Recargar datos
      const [categoriasRes, productosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
      ]);
      const categoriasData = await categoriasRes.json();
      const productosData = await productosRes.json();
      setCategorias(categoriasData);
      setProductos(productosData);
    } else {
      setMensaje("Error al crear categoría");
      showError("Error al crear categoría");
    }
  };

  // Crear producto (con archivo)
  const handleCrearProducto = async (e) => {
    e.preventDefault();
    setMensaje("");
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("nombre", prodData.nombre);
    formData.append("referencia", prodData.referencia);
    formData.append("descripcion", prodData.descripcion);
    formData.append("precioNormal", Number(prodData.precioNormal));
    formData.append("precioOferta", prodData.precioOferta ? Number(prodData.precioOferta) : "");
    formData.append("descuento", prodData.descuento ? Number(prodData.descuento) : "");
    formData.append("esOferta", prodData.esOferta);
    formData.append("categoria", prodData.categoria);
    formData.append("variantes", JSON.stringify(prodData.variantes));
    if (prodImagen) formData.append("imagen", prodImagen);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      setProdData({
        nombre: "",
        referencia: "",
        descripcion: "",
        precioNormal: "",
        precioOferta: "",
        descuento: "",
        esOferta: false,
        categoria: "",
        variantes: [{ color: "", talla: "", stock: 0 }],
      });
      setProdImagen(null);
      setMensaje("Producto creado");
      showSuccess("Producto creado correctamente");
      // Recargar datos
      const [categoriasRes, productosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
      ]);
      const categoriasData = await categoriasRes.json();
      const productosData = await productosRes.json();
      setCategorias(categoriasData);
      setProductos(productosData);
    } else {
      setMensaje("Error al crear producto");
      showError("Error al crear producto");
    }
  };

  // Editar producto
  const handleEditarProducto = async (e) => {
    e.preventDefault();
    setMensaje("");
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("nombre", prodData.nombre);
    formData.append("referencia", prodData.referencia);
    formData.append("descripcion", prodData.descripcion);
    formData.append("precioNormal", Number(prodData.precioNormal));
    formData.append("precioOferta", prodData.precioOferta ? Number(prodData.precioOferta) : "");
    formData.append("descuento", prodData.descuento ? Number(prodData.descuento) : "");
    formData.append("esOferta", prodData.esOferta);
    formData.append("categoria", prodData.categoria);
    formData.append("variantes", JSON.stringify(prodData.variantes));
    if (editProdImagen) formData.append("imagen", editProdImagen);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos/${editandoProducto._id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      setProdData({
        nombre: "",
        referencia: "",
        descripcion: "",
        precioNormal: "",
        precioOferta: "",
        descuento: "",
        esOferta: false,
        categoria: "",
        variantes: [{ color: "", talla: "", stock: 0 }],
      });
      setEditProdImagen(null);
      setEditandoProducto(null);
      setView("productos");
      setMensaje("Producto actualizado");
      showSuccess("Producto actualizado correctamente");
      // Recargar datos
      const [categoriasRes, productosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
      ]);
      const categoriasData = await categoriasRes.json();
      const productosData = await productosRes.json();
      setCategorias(categoriasData);
      setProductos(productosData);
    } else {
      setMensaje("Error al actualizar producto");
      showError("Error al actualizar producto");
    }
  };

  // Eliminar producto
  const handleEliminarProducto = async (producto) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el producto "${producto.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos/${producto._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showSuccess("Producto eliminado correctamente");
        setMensaje("Producto eliminado");
        // Recargar datos
        const [categoriasRes, productosRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
        ]);
        const categoriasData = await categoriasRes.json();
        const productosData = await productosRes.json();
        setCategorias(categoriasData);
        setProductos(productosData);
      } else {
        showError("Error al eliminar producto");
      }
    }
  };

  // Iniciar edición de producto
  const iniciarEdicion = (producto) => {
    setEditandoProducto(producto);
    setProdData({
      nombre: producto.nombre,
      referencia: producto.referencia,
      descripcion: producto.descripcion || "",
      precioNormal: producto.precioNormal?.toString() || "",
      precioOferta: producto.precioOferta?.toString() || "",
      descuento: producto.descuento?.toString() || "",
      esOferta: producto.esOferta || false,
      categoria: producto.categoria?._id || "",
      variantes: producto.variantes?.length > 0 ? producto.variantes : [{ color: "", talla: "", stock: 0 }],
    });
    setEditProdImagen(null);
    setView("editarProducto");
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoProducto(null);
    setProdData({
      nombre: "",
      referencia: "",
      descripcion: "",
      precioNormal: "",
      precioOferta: "",
      descuento: "",
      esOferta: false,
      categoria: "",
      variantes: [{ color: "", talla: "", stock: 0 }],
    });
    setEditProdImagen(null);
    setView("productos");
  };

  // Manejar variantes dinámicas
  const handleVarianteChange = (i, field, value) => {
    const nuevas = prodData.variantes.map((v, idx) =>
      idx === i ? { ...v, [field]: value } : v
    );
    setProdData({ ...prodData, variantes: nuevas });
  };

  const agregarVariante = () => {
    setProdData({
      ...prodData,
      variantes: [...prodData.variantes, { color: "", talla: "", stock: 0 }],
    });
  };

  const quitarVariante = (i) => {
    setProdData({
      ...prodData,
      variantes: prodData.variantes.filter((_, idx) => idx !== i),
    });
  };

  // Construir árbol de categorías y obtener hojas con su camino
  function getCategoryLeavesWithPath(categorias) {
    const map = {};
    categorias.forEach(cat => { map[cat._id] = { ...cat, hijos: [] }; });
    categorias.forEach(cat => {
      if (cat.padre && map[cat.padre]) map[cat.padre].hijos.push(map[cat._id]);
    });

    const leaves = [];
    function dfs(cat, path) {
      const newPath = [...path, cat.nombre];
      if (!cat.hijos || cat.hijos.length === 0) {
        leaves.push({ ...cat, path: newPath });
      } else {
        cat.hijos.forEach(hijo => dfs(hijo, newPath));
      }
    }
    categorias.filter(cat => !cat.padre).forEach(root => dfs(map[root._id], []));
    return leaves;
  }

  function getCategoryPaths(categorias) {
    const map = {};
    categorias.forEach(cat => { map[cat._id] = { ...cat, hijos: [] }; });
    categorias.forEach(cat => {
      if (cat.padre && map[cat.padre]) map[cat.padre].hijos.push(map[cat._id]);
    });

    const paths = [];
    function dfs(cat, path) {
      const newPath = [...path, cat.nombre];
      paths.push({ ...cat, path: newPath });
      cat.hijos.forEach(hijo => dfs(hijo, newPath));
    }
    categorias.filter(cat => !cat.padre).forEach(root => dfs(map[root._id], []));
    return paths;
  }

  const categoriaLeaves = getCategoryLeavesWithPath(categorias);
  const categoriaPaths = getCategoryPaths(categorias);

  // ALERTAS CON SWAL
  const showSuccess = (msg) => Swal.fire({ icon: 'success', title: msg, timer: 1500, showConfirmButton: false });
  const showError = (msg) => Swal.fire({ icon: 'error', title: msg, timer: 2000, showConfirmButton: false });

  // EDITAR CATEGORÍA
  const handleGuardarEdit = async (id, nuevoNombre) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre: nuevoNombre }),
    });
    if (res.ok) {
      showSuccess("Categoría actualizada");
      setEditCatId(null);
      setEditCatNombre("");
      setMensaje("Categoría actualizada");
      // Recargar datos
      const [categoriasRes, productosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
      ]);
      const categoriasData = await categoriasRes.json();
      const productosData = await productosRes.json();
      setCategorias(categoriasData);
      setProductos(productosData);
    } else {
      showError("Error al actualizar categoría");
    }
  };

  // BORRAR CATEGORÍA
  const handleBorrarCategoria = async (id) => {
    const token = localStorage.getItem("token");
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showSuccess("Categoría eliminada");
        setMensaje("Categoría eliminada");
        // Recargar datos
        const [categoriasRes, productosRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
        ]);
        const categoriasData = await categoriasRes.json();
        const productosData = await productosRes.json();
        setCategorias(categoriasData);
        setProductos(productosData);
      } else {
        showError("Error al eliminar categoría");
      }
    }
  };

  // CAMBIAR ESTADO
  const handleToggleActiva = async (id, activa) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias/${id}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activa }),
    });
    if (res.ok) {
      showSuccess("Estado actualizado");
      setMensaje("Estado actualizado");
      // Recargar datos
      const [categoriasRes, productosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
      ]);
      const categoriasData = await categoriasRes.json();
      const productosData = await productosRes.json();
      setCategorias(categoriasData);
      setProductos(productosData);
    } else {
      showError("Error al cambiar estado");
    }
  };

  // Función para poner la primera letra en mayúscula
  function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Filtrar productos
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = !busquedaProducto || 
      p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      p.referencia.toLowerCase().includes(busquedaProducto.toLowerCase());
    const coincideCategoria = !filtroCategoria || p.categoria?._id === filtroCategoria;
    const coincideEstado = filtroEstado === "todos" || 
      (filtroEstado === "activos" && p.activa) ||
      (filtroEstado === "inactivos" && !p.activa);
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  // Estadísticas
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => p.activa).length;
  const productosOferta = productos.filter(p => p.esOferta).length;

  if (checking) return <div className="text-center py-20 text-black">Verificando acceso...</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      {/* Botón ☰ flotante solo en móvil, ahora a la derecha */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 right-4 z-50 md:hidden bg-gold text-dark text-2xl font-bold rounded-full shadow-lg p-2 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside className={`bg-white border-r border-gold p-4 flex flex-col gap-2 w-64 fixed top-0 left-0 h-full z-40 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:h-auto md:w-64 md:block`}>
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-bold text-gold font-serif">Admin</h2>
          <button
            className="text-gold text-2xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        
        <button
          className={`py-3 px-4 rounded-lg text-left font-semibold border transition-all ${view === "productos" ? "bg-gold text-dark border-gold shadow-md" : "bg-white text-black border-gold hover:bg-gold/10"}`}
          onClick={() => { setView("productos"); setSidebarOpen(false); }}
        >
          📦 Ver productos
        </button>
        <button
          className={`py-3 px-4 rounded-lg text-left font-semibold border transition-all ${view === "crearProducto" ? "bg-gold text-dark border-gold shadow-md" : "bg-white text-black border-gold hover:bg-gold/10"}`}
          onClick={() => { setView("crearProducto"); setSidebarOpen(false); }}
        >
          ➕ Crear producto
        </button>
        <button
          className={`py-3 px-4 rounded-lg text-left font-semibold border transition-all ${view === "crearCategoria" ? "bg-gold text-dark border-gold shadow-md" : "bg-white text-black border-gold hover:bg-gold/10"}`}
          onClick={() => { setView("crearCategoria"); setSidebarOpen(false); }}
        >
          🏷️ Crear categoría
        </button>
      </aside>
      
      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gold font-serif">Dashboard de Administración</h1>
          <a
            href="/"
            className="bg-gold text-dark font-bold px-4 py-2 rounded-lg shadow border-2 border-gold hover:bg-dark hover:text-gold transition whitespace-nowrap"
          >
            🏪 Ver tienda
          </a>
        </div>
        
        {mensaje && (
          <div className="mb-6 text-center text-base font-bold text-gold bg-gold/10 py-2 px-4 rounded-lg border border-gold">
            {mensaje}
          </div>
        )}

        {/* Ver productos */}
        {view === "productos" && (
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-gold rounded-xl p-4 shadow-md">
                <div className="text-sm text-gray-600 mb-1">Total Productos</div>
                <div className="text-3xl font-bold text-gold">{totalProductos}</div>
              </div>
              <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-md">
                <div className="text-sm text-gray-600 mb-1">Productos Activos</div>
                <div className="text-3xl font-bold text-green-600">{productosActivos}</div>
              </div>
              <div className="bg-white border-2 border-red-500 rounded-xl p-4 shadow-md">
                <div className="text-sm text-gray-600 mb-1">En Oferta</div>
                <div className="text-3xl font-bold text-red-600">{productosOferta}</div>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white border border-gold rounded-xl p-4 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Buscar producto</label>
                  <input
                    type="text"
                    placeholder="Nombre o referencia..."
                    className="w-full border border-gold rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gold"
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Filtrar por categoría</label>
                  <select
                    className="w-full border border-gold rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gold"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                  >
                    <option value="">Todas las categorías</option>
                    {categoriaLeaves.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.path.join(" > ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Filtrar por estado</label>
                  <select
                    className="w-full border border-gold rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gold"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                  </select>
                </div>
              </div>
              {productosFiltrados.length !== productos.length && (
                <div className="mt-4 text-sm text-gray-600">
                  Mostrando {productosFiltrados.length} de {productos.length} productos
                </div>
              )}
            </div>

            {/* Tabla de productos mejorada */}
            <div className="bg-white border border-gold rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-gold bg-gold/10">
                <h2 className="text-lg md:text-xl font-bold text-black">Lista de Productos</h2>
              </div>
              <div className="overflow-x-auto">
                {productosFiltrados.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-lg">No se encontraron productos</p>
                    <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gold/20">
                    <thead className="bg-gold">
                      <tr>
                        <th className="py-4 px-6 text-left font-bold text-dark text-sm">Imagen</th>
                        <th className="py-4 px-6 text-left font-bold text-dark text-sm">Producto</th>
                        <th className="py-4 px-6 text-left font-bold text-dark text-sm hidden md:table-cell">Referencia</th>
                        <th className="py-4 px-6 text-left font-bold text-dark text-sm">Precio</th>
                        <th className="py-4 px-6 text-left font-bold text-dark text-sm hidden lg:table-cell">Oferta</th>
                        <th className="py-4 px-6 text-left font-bold text-dark text-sm hidden lg:table-cell">Categoría</th>
                        <th className="py-4 px-6 text-left font-bold text-dark text-sm hidden md:table-cell">Estado</th>
                        <th className="py-4 px-6 text-center font-bold text-dark text-sm">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gold/20">
                      {productosFiltrados.map((p, index) => (
                        <tr key={p._id} className={`hover:bg-gold/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="py-4 px-6">
                            {p.imagen ? (
                              <img src={p.imagen} alt={p.nombre} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-gold/30 shadow-sm" />
                            ) : (
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex items-center justify-center border border-gold/30">
                                <span className="text-gray-400 text-xs">Sin img</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-black text-sm md:text-base">{p.nombre}</div>
                            <div className="text-gray-600 text-xs md:hidden mt-1">{p.referencia}</div>
                          </td>
                          <td className="py-4 px-6 text-black text-sm hidden md:table-cell">
                            <span className="text-gray-600">{p.referencia}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-black text-sm md:text-base font-semibold">
                              ${p.precioNormal?.toLocaleString()}
                            </div>
                            {p.esOferta && p.precioOferta && (
                              <div className="text-red-600 text-xs md:text-sm font-bold mt-1">
                                Oferta: ${p.precioOferta?.toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-black text-sm hidden lg:table-cell">
                            {p.esOferta ? (
                              <div className="flex flex-col">
                                <span className="text-green-600 font-bold">Sí</span>
                                {p.descuento && (
                                  <span className="text-xs text-red-600 font-semibold">-{p.descuento}%</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">No</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-black text-sm hidden lg:table-cell">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{p.categoria?.nombre || "Sin categoría"}</span>
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {p.activa ? "Activa" : "Inactiva"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col md:flex-row gap-2 justify-center">
                              <button 
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 text-xs md:text-sm font-semibold transition shadow-sm"
                                onClick={() => iniciarEdicion(p)}
                              >
                                Editar
                              </button>
                              <button 
                                className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 text-xs md:text-sm font-semibold transition shadow-sm"
                                onClick={() => handleEliminarProducto(p)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Crear producto */}
        {view === "crearProducto" && (
          <div className="max-w-2xl mx-auto bg-white border border-gold rounded-xl p-4 md:p-6 shadow">
            <h2 className="text-base md:text-lg font-bold mb-4 text-gold">Crear Producto</h2>
            <form onSubmit={handleCrearProducto} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.nombre}
                  onChange={e => setProdData({ ...prodData, nombre: capitalizeFirst(e.target.value) })}
                  required
                />
                <input
                  type="text"
                  placeholder="Referencia (SKU)"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.referencia}
                  onChange={(e) => setProdData({ ...prodData, referencia: e.target.value })}
                  required
                />
              </div>
              
              <textarea
                placeholder="Descripción"
                className="border rounded-lg px-3 py-2 text-black"
                value={prodData.descripcion}
                onChange={(e) => setProdData({ ...prodData, descripcion: e.target.value })}
                rows={3}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Precio Normal"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.precioNormal}
                  onChange={e => setProdData({ ...prodData, precioNormal: e.target.value })}
                  required
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Precio Oferta"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.precioOferta}
                  onChange={e => setProdData({ ...prodData, precioOferta: e.target.value })}
                  min={0}
                  disabled={!prodData.esOferta}
                />
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="esOferta"
                    checked={prodData.esOferta}
                    onChange={e => {
                      const checked = e.target.checked;
                      let precioOferta = prodData.precioOferta;
                      let descuento = prodData.descuento;
                      if (checked && prodData.precioNormal && !prodData.precioOferta) {
                        if (prodData.descuento) {
                          precioOferta = (prodData.precioNormal * (1 - prodData.descuento / 100)).toFixed(0);
                        } else {
                          precioOferta = prodData.precioNormal;
                        }
                      }
                      setProdData({ ...prodData, esOferta: checked, precioOferta });
                    }}
                  />
                  <label htmlFor="esOferta" className="text-black font-bold">¿Es oferta?</label>
                </div>
                {prodData.esOferta && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Descuento %"
                      className="border rounded-lg px-3 py-2 text-black w-24"
                      value={prodData.descuento}
                      min={0}
                      max={90}
                      onChange={e => {
                        const descuento = e.target.value;
                        let precioOferta = prodData.precioNormal;
                        if (prodData.precioNormal && descuento) {
                          precioOferta = (prodData.precioNormal * (1 - descuento / 100)).toFixed(0);
                        }
                        setProdData({ ...prodData, descuento, precioOferta });
                      }}
                    />
                    <span className="text-black text-sm">%</span>
                  </div>
                )}
              </div>
              
              <select
                className="border rounded-lg px-3 py-2 text-black"
                value={prodData.categoria}
                onChange={(e) => setProdData({ ...prodData, categoria: e.target.value })}
                required
              >
                <option value="">Selecciona categoría</option>
                {categoriaLeaves.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.path.join(" > ")}
                  </option>
                ))}
              </select>
              
              <input
                type="file"
                accept="image/*"
                className="border rounded-lg px-3 py-2 text-black"
                onChange={e => setProdImagen(e.target.files[0])}
                required
              />
              
              <button className="bg-gold text-dark font-bold py-3 rounded-lg shadow border-2 border-gold hover:bg-dark hover:text-gold transition">
                Crear Producto
              </button>
            </form>
          </div>
        )}

        {/* Editar producto */}
        {view === "editarProducto" && editandoProducto && (
          <div className="max-w-2xl mx-auto bg-white border border-gold rounded-xl p-4 md:p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base md:text-lg font-bold text-gold">Editar Producto</h2>
              <button
                onClick={cancelarEdicion}
                className="bg-gray-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
            <form onSubmit={handleEditarProducto} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.nombre}
                  onChange={e => setProdData({ ...prodData, nombre: capitalizeFirst(e.target.value) })}
                  required
                />
                <input
                  type="text"
                  placeholder="Referencia (SKU)"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.referencia}
                  onChange={(e) => setProdData({ ...prodData, referencia: e.target.value })}
                  required
                />
              </div>
              
              <textarea
                placeholder="Descripción"
                className="border rounded-lg px-3 py-2 text-black"
                value={prodData.descripcion}
                onChange={(e) => setProdData({ ...prodData, descripcion: e.target.value })}
                rows={3}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Precio Normal"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.precioNormal}
                  onChange={e => setProdData({ ...prodData, precioNormal: e.target.value })}
                  required
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Precio Oferta"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={prodData.precioOferta}
                  onChange={e => setProdData({ ...prodData, precioOferta: e.target.value })}
                  min={0}
                  disabled={!prodData.esOferta}
                />
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editEsOferta"
                    checked={prodData.esOferta}
                    onChange={e => {
                      const checked = e.target.checked;
                      let precioOferta = prodData.precioOferta;
                      let descuento = prodData.descuento;
                      if (checked && prodData.precioNormal && !prodData.precioOferta) {
                        if (prodData.descuento) {
                          precioOferta = (prodData.precioNormal * (1 - prodData.descuento / 100)).toFixed(0);
                        } else {
                          precioOferta = prodData.precioNormal;
                        }
                      }
                      setProdData({ ...prodData, esOferta: checked, precioOferta });
                    }}
                  />
                  <label htmlFor="editEsOferta" className="text-black font-bold">¿Es oferta?</label>
                </div>
                {prodData.esOferta && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Descuento %"
                      className="border rounded-lg px-3 py-2 text-black w-24"
                      value={prodData.descuento}
                      min={0}
                      max={90}
                      onChange={e => {
                        const descuento = e.target.value;
                        let precioOferta = prodData.precioNormal;
                        if (prodData.precioNormal && descuento) {
                          precioOferta = (prodData.precioNormal * (1 - descuento / 100)).toFixed(0);
                        }
                        setProdData({ ...prodData, descuento, precioOferta });
                      }}
                    />
                    <span className="text-black text-sm">%</span>
                  </div>
                )}
              </div>
              
              <select
                className="border rounded-lg px-3 py-2 text-black"
                value={prodData.categoria}
                onChange={(e) => setProdData({ ...prodData, categoria: e.target.value })}
                required
              >
                <option value="">Selecciona categoría</option>
                {categoriaLeaves.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.path.join(" > ")}
                  </option>
                ))}
              </select>
              
              <div className="border border-gold/30 rounded-lg p-4">
                <label className="font-bold text-black mb-3 block">Imagen actual:</label>
                {editandoProducto.imagen && (
                  <img src={editandoProducto.imagen} alt="Imagen actual" className="w-32 h-32 object-cover rounded-lg mb-3" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="border rounded-lg px-3 py-2 text-black w-full"
                  onChange={e => setEditProdImagen(e.target.files[0])}
                />
                <p className="text-sm text-gray-600 mt-2">Deja vacío para mantener la imagen actual</p>
              </div>
              
              <button className="bg-gold text-dark font-bold py-3 rounded-lg shadow border-2 border-gold hover:bg-dark hover:text-gold transition">
                Actualizar Producto
              </button>
            </form>
          </div>
        )}

        {/* Crear categoría */}
        {view === "crearCategoria" && (
          <div className="w-full">
            <div className="max-w-lg mx-auto bg-white border border-gold rounded-xl p-4 md:p-6 shadow mb-8">
              <h2 className="text-base md:text-lg font-bold mb-4 text-gold">Crear Categoría</h2>
              <form onSubmit={handleCrearCategoria} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nombre de la categoría"
                  className="border rounded-lg px-3 py-2 text-black"
                  value={catNombre}
                  onChange={e => setCatNombre(capitalizeFirst(e.target.value))}
                  required
                />
                <select
                  className="border rounded-lg px-3 py-2 text-black"
                  value={catPadre}
                  onChange={(e) => setCatPadre(e.target.value)}
                >
                  <option value="">Sin padre (raíz)</option>
                  {categoriaPaths.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.path.join(" > ")}
                    </option>
                  ))}
                </select>
                <button className="bg-gold text-dark font-bold py-3 rounded-lg shadow border-2 border-gold hover:bg-dark hover:text-gold transition">
                  Crear Categoría
                </button>
              </form>
            </div>

            <div className="w-full">
              <h3 className="text-lg font-bold mb-4 text-gold">Categorías existentes</h3>
              <div className="bg-white border border-gold rounded-xl overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gold text-dark">
                        <th className="py-3 px-4 text-left font-bold">Nombre</th>
                        <th className="py-3 px-4 text-left font-bold hidden md:table-cell">Ruta</th>
                        <th className="py-3 px-4 text-left font-bold">Estado</th>
                        <th className="py-3 px-4 text-left font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriaPaths.map((cat, index) => (
                        <tr key={cat._id} className={`border-t border-gold/20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="py-3 px-4">
                            {editCatId === cat._id ? (
                              <input
                                className="border rounded-lg px-3 py-2 text-black w-full"
                                value={editCatNombre}
                                onChange={e => setEditCatNombre(capitalizeFirst(e.target.value))}
                                autoFocus
                              />
                            ) : (
                              <div>
                                <span className="font-semibold text-black">{cat.nombre}</span>
                                <div className="text-sm text-gray-600 md:hidden">
                                  {cat.path.slice(0, -1).join(" > ") || "Raíz"}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 hidden md:table-cell">
                            {cat.path.slice(0, -1).join(" > ") || "Raíz"}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${cat.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {cat.activa ? "Activa" : "Inactiva"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {editCatId === cat._id ? (
                              <div className="flex gap-2">
                                <button
                                  className="bg-gold text-dark font-bold px-3 py-1 rounded-lg text-xs hover:bg-dark hover:text-gold transition"
                                  onClick={() => handleGuardarEdit(cat._id, editCatNombre)}
                                >
                                  Guardar
                                </button>
                                <button
                                  className="bg-gray-500 text-white font-bold px-3 py-1 rounded-lg text-xs hover:bg-gray-700 transition"
                                  onClick={() => setEditCatId(null)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  className="bg-blue-500 text-white font-bold px-2 py-1 rounded-lg text-xs hover:bg-blue-700 transition"
                                  onClick={() => {
                                    setEditCatId(cat._id);
                                    setEditCatNombre(cat.nombre);
                                  }}
                                >
                                  Editar
                                </button>
                                <button
                                  className="bg-red-500 text-white font-bold px-2 py-1 rounded-lg text-xs hover:bg-red-700 transition"
                                  onClick={() => handleBorrarCategoria(cat._id)}
                                >
                                  Eliminar
                                </button>
                                <button
                                  className={`font-bold px-2 py-1 rounded-lg text-xs border transition ${
                                    cat.activa 
                                      ? 'bg-orange-500 text-white hover:bg-orange-700' 
                                      : 'bg-green-500 text-white hover:bg-green-700'
                                  }`}
                                  onClick={() => handleToggleActiva(cat._id, !cat.activa)}
                                >
                                  {cat.activa ? "Desactivar" : "Activar"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;