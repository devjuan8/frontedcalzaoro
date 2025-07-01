import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-dark text-cream py-10 border-t-2 border-gold mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-gold font-bold mb-2 text-lg">Contacto</h4>
            <p className="text-accent-gray">Tel: 320 000 0000</p>
            <p className="text-accent-gray">Email: info@calzaoro.com</p>
            <p className="text-accent-gray">Horario: Lun-Sab 9am-7pm</p>
          </div>
          <div>
            <h4 className="text-gold font-bold mb-2 text-lg">Información</h4>
            <ul>
              <li><a href="#" className="hover:text-gold transition">Quiénes Somos</a></li>
              <li><a href="#" className="hover:text-gold transition">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-gold transition">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-gold transition">Preguntas Frecuentes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-bold mb-2 text-lg">Puntos físicos</h4>
            <p className="text-accent-gray">Dirección 1: Calle 00 #00-00, Ciudad</p>
            <p className="text-accent-gray">Dirección 2: Calle 00 #00-00, Ciudad</p>
            <h4 className="text-gold font-bold mt-4 mb-2 text-lg">Síguenos</h4>
            <div className="flex gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="text-gold hover:text-cream text-2xl"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram" className="text-gold hover:text-cream text-2xl"><FaInstagram /></a>
              <a href="#" aria-label="TikTok" className="text-gold hover:text-cream text-2xl"><FaTiktok /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-cream/60 mt-8 text-xs">© 2025 CalzaOro. Todos los derechos reservados.</div>
      </div>
    </footer>
  )
}
export default Footer