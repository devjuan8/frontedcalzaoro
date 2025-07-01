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
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/categorias`)
      .then((r) => r.json())
      .then(setCategorias);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/productos`)
      .then((r) => r.json())
      .then(setProductos);
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
    } else {
      showError("Error al cambiar estado");
    }
  };

  // Función para poner la primera letra en mayúscula
  function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (checking) return <div className="text-center py-20 text-black">Verificando acceso...</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <button
        className="md:hidden p-3 text-gold font-bold text-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰ Menú
      </button>
      <aside className={`bg-white border-r border-gold p-4 flex flex-col gap-2 w-full md:w-56 md:static fixed z-50 top-0 left-0 h-full transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <h2 className="text-lg font-bold text-gold mb-2 font-serif">Admin</h2>
        <button
          className={`py-2 px-3 rounded text-left font-semibold border ${view === "productos" ? "bg-gold text-dark border-gold" : "bg-white text-black border-gold hover:bg-gold/20"}`}
          onClick={() => { setView("productos"); setSidebarOpen(false); }}
        >
          Ver productos
        </button>
        <button
          className={`py-2 px-3 rounded text-left font-semibold border ${view === "crearProducto" ? "bg-gold text-dark border-gold" : "bg-white text-black border-gold hover:bg-gold/20"}`}
          onClick={() => { setView("crearProducto"); setSidebarOpen(false); }}
        >
          Crear producto
        </button>
        <button
          className={`py-2 px-3 rounded text-left font-semibold border ${view === "crearCategoria" ? "bg-gold text-dark border-gold" : "bg-white text-black border-gold hover:bg-gold/20"}`}
          onClick={() => { setView("crearCategoria"); setSidebarOpen(false); }}
        >
          Crear categoría
        </button>
      </aside>
      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gold font-serif">Dashboard de Administración</h1>
          <a
            href="/"
            className="bg-gold text-dark font-bold px-4 py-2 rounded shadow border-2 border-gold hover:bg-dark hover:text-gold transition"
          >
            Ver tienda
          </a>
        </div>
        {mensaje && (
          <div className="mb-4 text-center text-base font-bold text-gold">{mensaje}</div>
        )}

        {/* Ver productos */}
        {view === "productos" && (
          <div>
            <h2 className="text-base md:text-lg font-bold text-black mb-2">Productos recientes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gold rounded-xl text-xs md:text-base">
                <thead>
                  <tr className="bg-gold text-dark">
                    <th className="py-2 px-2 md:px-4">Imagen</th>
                    <th className="py-2 px-2 md:px-4">Nombre</th>
                    <th className="py-2 px-2 md:px-4">Referencia</th>
                    <th className="py-2 px-2 md:px-4">Precio Normal</th>
                    <th className="py-2 px-2 md:px-4">Precio Oferta</th>
                    <th className="py-2 px-2 md:px-4">Descuento</th>
                    <th className="py-2 px-2 md:px-4">¿Oferta?</th>
                    <th className="py-2 px-2 md:px-4">Categoría</th>
                    <th className="py-2 px-2 md:px-4">Activa</th>
                    <th className="py-2 px-2 md:px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="py-2 px-2 md:px-4">
                        {p.imagen ? (
                          <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <span className="text-gray-400">Sin imagen</span>
                        )}
                      </td>
                      <td className="py-2 px-2 md:px-4 text-black">{p.nombre}</td>
                      <td className="py-2 px-2 md:px-4 text-black">{p.referencia}</td>
                      <td className="py-2 px-2 md:px-4 text-black">${p.precioNormal?.toLocaleString()}</td>
                      <td className="py-2 px-2 md:px-4 text-black">{p.esOferta ? `$${p.precioOferta?.toLocaleString()}` : '-'}</td>
                      <td className="py-2 px-2 md:px-4 text-black">{p.esOferta && p.descuento ? `${p.descuento}%` : '-'}</td>
                      <td className="py-2 px-2 md:px-4 text-black">{p.esOferta ? 'Sí' : 'No'}</td>
                      <td className="py-2 px-2 md:px-4 text-black">{p.categoria?.nombre}</td>
                      <td className="py-2 px-2 md:px-4 text-black">{p.activa ? "Sí" : "No"}</td>
                      <td className="py-2 px-2 md:px-4 flex flex-col gap-1">
                        <button 
                          className="bg-blue-500 text-white rounded px-2 py-1 text-xs mb-1 hover:bg-blue-700 transition"
                          onClick={() => iniciarEdicion(p)}
                        >
                          Editar
                        </button>
                        <button 
                          className="bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-700 transition"
                          onClick={() => handleEliminarProducto(p)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Crear producto */}
        {view === "crearProducto" && (
          <div className="max-w-lg mx-auto bg-white border border-gold rounded-xl p-4 md:p-6 shadow">
            <h2 className="text-base md:text-lg font-bold mb-3 text-gold">Crear Producto</h2>
            <form onSubmit={handleCrearProducto} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nombre"
                className="border rounded px-3 py-2 text-black"
                value={prodData.nombre}
                onChange={e => setProdData({ ...prodData, nombre: capitalizeFirst(e.target.value) })}
                required
              />
              <input
                type="text"
                placeholder="Referencia (SKU)"
                className="border rounded px-3 py-2 text-black"
                value={prodData.referencia}
                onChange={(e) => setProdData({ ...prodData, referencia: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                className="border rounded px-3 py-2 text-black"
                value={prodData.descripcion}
                onChange={(e) => setProdData({ ...prodData, descripcion: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Precio Normal"
                  className="border rounded px-3 py-2 text-black w-1/2"
                  value={prodData.precioNormal}
                  onChange={e => setProdData({ ...prodData, precioNormal: e.target.value })}
                  required
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Precio Oferta"
                  className="border rounded px-3 py-2 text-black w-1/2"
                  value={prodData.precioOferta}
                  onChange={e => setProdData({ ...prodData, precioOferta: e.target.value })}
                  min={0}
                  disabled={!prodData.esOferta}
                />
              </div>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="checkbox"
                  id="esOferta"
                  checked={prodData.esOferta}
                  onChange={e => {
                    const checked = e.target.checked;
                    let precioOferta = prodData.precioOferta;
                    let descuento = prodData.descuento;
                    if (checked && prodData.precioNormal && !prodData.precioOferta) {
                      // Si activa oferta y hay precio normal, calcula oferta con descuento si existe
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
                {prodData.esOferta && (
                  <>
                    <input
                      type="number"
                      placeholder="Descuento %"
                      className="border rounded px-2 py-1 text-black w-24 ml-2"
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
                    <span className="text-black text-sm ml-1">%</span>
                  </>
                )}
              </div>
              <select
                className="border rounded px-3 py-2 text-black"
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
                className="border rounded px-3 py-2 text-black"
                onChange={e => setProdImagen(e.target.files[0])}
                required
              />
              <div>
                <label className="font-bold text-black">Variantes:</label>
                <div className="flex flex-col gap-2">
                  {prodData.variantes.map((v, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_80px] gap-2 w-full items-end"
                    >
                      <input
                        type="text"
                        placeholder="Color"
                        className="border rounded px-2 py-1 text-black w-full"
                        value={v.color}
                        onChange={(e) => handleVarianteChange(i, "color", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Talla"
                        className="border rounded px-2 py-1 text-black w-full"
                        value={v.talla}
                        onChange={(e) => handleVarianteChange(i, "talla", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        className="border rounded px-2 py-1 text-black w-full"
                        value={v.stock}
                        min={0}
                        onChange={(e) => handleVarianteChange(i, "stock", e.target.value)}
                      />
                      {prodData.variantes.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 font-bold px-2 py-1 rounded bg-black/80 hover:bg-red-700 transition w-full"
                          onClick={() => quitarVariante(i)}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="text-gold font-bold mt-2"
                  onClick={agregarVariante}
                >
                  + Agregar variante
                </button>
              </div>
              <button className="bg-gold text-dark font-bold py-2 rounded shadow border-2 border-gold hover:bg-dark hover:text-gold transition">
                Crear Producto
              </button>
            </form>
          </div>
        )}

        {/* Editar producto */}
        {view === "editarProducto" && editandoProducto && (
          <div className="max-w-lg mx-auto bg-white border border-gold rounded-xl p-4 md:p-6 shadow">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base md:text-lg font-bold text-gold">Editar Producto</h2>
              <button
                onClick={cancelarEdicion}
                className="bg-gray-500 text-white font-bold px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
            <form onSubmit={handleEditarProducto} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nombre"
                className="border rounded px-3 py-2 text-black"
                value={prodData.nombre}
                onChange={e => setProdData({ ...prodData, nombre: capitalizeFirst(e.target.value) })}
                required
              />
              <input
                type="text"
                placeholder="Referencia (SKU)"
                className="border rounded px-3 py-2 text-black"
                value={prodData.referencia}
                onChange={(e) => setProdData({ ...prodData, referencia: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                className="border rounded px-3 py-2 text-black"
                value={prodData.descripcion}
                onChange={(e) => setProdData({ ...prodData, descripcion: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Precio Normal"
                  className="border rounded px-3 py-2 text-black w-1/2"
                  value={prodData.precioNormal}
                  onChange={e => setProdData({ ...prodData, precioNormal: e.target.value })}
                  required
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Precio Oferta"
                  className="border rounded px-3 py-2 text-black w-1/2"
                  value={prodData.precioOferta}
                  onChange={e => setProdData({ ...prodData, precioOferta: e.target.value })}
                  min={0}
                  disabled={!prodData.esOferta}
                />
              </div>
              <div className="flex gap-2 items-center mt-1">
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
                {prodData.esOferta && (
                  <>
                    <input
                      type="number"
                      placeholder="Descuento %"
                      className="border rounded px-2 py-1 text-black w-24 ml-2"
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
                    <span className="text-black text-sm ml-1">%</span>
                  </>
                )}
              </div>
              <select
                className="border rounded px-3 py-2 text-black"
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
              <div>
                <label className="font-bold text-black">Imagen actual:</label>
                {editandoProducto.imagen && (
                  <img src={editandoProducto.imagen} alt="Imagen actual" className="w-32 h-32 object-cover rounded mt-1" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="border rounded px-3 py-2 text-black mt-2"
                  onChange={e => setEditProdImagen(e.target.files[0])}
                />
                <p className="text-sm text-gray-600 mt-1">Deja vacío para mantener la imagen actual</p>
              </div>
              <div>
                <label className="font-bold text-black">Variantes:</label>
                <div className="flex flex-col gap-2">
                  {prodData.variantes.map((v, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_80px] gap-2 w-full items-end"
                    >
                      <input
                        type="text"
                        placeholder="Color"
                        className="border rounded px-2 py-1 text-black w-full"
                        value={v.color}
                        onChange={(e) => handleVarianteChange(i, "color", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Talla"
                        className="border rounded px-2 py-1 text-black w-full"
                        value={v.talla}
                        onChange={(e) => handleVarianteChange(i, "talla", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        className="border rounded px-2 py-1 text-black w-full"
                        value={v.stock}
                        min={0}
                        onChange={(e) => handleVarianteChange(i, "stock", e.target.value)}
                      />
                      {prodData.variantes.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 font-bold px-2 py-1 rounded bg-black/80 hover:bg-red-700 transition w-full"
                          onClick={() => quitarVariante(i)}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="text-gold font-bold mt-2"
                  onClick={agregarVariante}
                >
                  + Agregar variante
                </button>
              </div>
              <button className="bg-gold text-dark font-bold py-2 rounded shadow border-2 border-gold hover:bg-dark hover:text-gold transition">
                Actualizar Producto
              </button>
            </form>
          </div>
        )}

        {/* Crear categoría */}
        {view === "crearCategoria" && (
          <div className="w-full">
            <div className="max-w-lg mx-auto bg-white border border-gold rounded-xl p-4 md:p-6 shadow">
              <h2 className="text-base md:text-lg font-bold mb-3 text-gold">Crear Categoría</h2>
              <form onSubmit={handleCrearCategoria} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Nombre de la categoría"
                  className="border rounded px-3 py-2 text-black"
                  value={catNombre}
                  onChange={e => setCatNombre(capitalizeFirst(e.target.value))}
                  required
                />
                <select
                  className="border rounded px-3 py-2 text-black"
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
                <button className="bg-gold text-dark font-bold py-2 rounded shadow border-2 border-gold hover:bg-dark hover:text-gold transition">
                  Crear Categoría
                </button>
              </form>
            </div>

            <div className="mt-8 px-2">
              <h3 className="text-lg font-bold mb-2 text-gold">Categorías existentes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {categoriaPaths.map((cat) => (
                  <div key={cat._id} className="border border-gold rounded-xl p-4 bg-white shadow flex flex-col gap-2">
                    {editCatId === cat._id ? (
                      <>
                        <input
                          className="border rounded px-2 py-1 text-black"
                          value={editCatNombre}
                          onChange={e => setEditCatNombre(capitalizeFirst(e.target.value))}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            className="bg-gold text-dark font-bold px-3 py-1 rounded"
                            onClick={() => handleGuardarEdit(cat._id, editCatNombre)}
                          >Guardar</button>
                          <button
                            className="bg-red-500 text-white font-bold px-3 py-1 rounded"
                            onClick={() => setEditCatId(null)}
                          >Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-lg text-gold">{cat.nombre}</div>
                        <div className="text-sm text-gray-700">Padre: <span className="font-semibold">{cat.path.slice(0, -1).join(" > ") || "Raíz"}</span></div>
                        <div className="text-sm">Activa: <span className={cat.activa ? "text-green-600" : "text-red-600"}>{cat.activa ? "Sí" : "No"}</span></div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <button
                            className="text-gold font-bold border border-gold px-2 py-1 rounded"
                            onClick={() => {
                              setEditCatId(cat._id);
                              setEditCatNombre(cat.nombre);
                            }}
                          >Editar</button>
                          <button
                            className="text-red-500 font-bold border border-red-500 px-2 py-1 rounded"
                            onClick={() => handleBorrarCategoria(cat._id)}
                          >Borrar</button>
                          <button
                            className="text-blue-500 font-bold border border-blue-500 px-2 py-1 rounded"
                            onClick={() => handleToggleActiva(cat._id, !cat.activa)}
                          >{cat.activa ? "Desactivar" : "Activar"}</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;