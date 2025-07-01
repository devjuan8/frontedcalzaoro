import { useEffect, useState } from 'react';

function LoginPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.valid) window.location.href = '/';
        else setChecking(false);
      })
      .catch(() => window.location.href = '/');
  }, []);

  if (checking) return <div className="text-center py-20">Verificando acceso...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-3xl font-bold text-gold mb-4 font-serif">Panel de administración</h2>
      <p className="text-black">¡Bienvenido! Aquí irá el dashboard privado.</p>
    </div>
  );
}

export default LoginPage;