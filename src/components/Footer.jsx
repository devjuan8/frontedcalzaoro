import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import nequiImg from '../assets/Nequi.png'
import sistecreditoImg from '../assets/sistecredito-logo.png'
import mastercardImg from '../assets/mastecard.png'
import visaImg from '../assets/visa.png'
import addiImg from '../assets/addi-logo.png'

function Footer() {
  return (
    <footer className="bg-black text-cream py-10 border-t-2 border-gold mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:justify-items-center">
          <div className="flex flex-col items-start md:items-center">
            <h4 className="text-gold font-bold mb-2 text-lg">Contacto</h4>
            <div className="flex items-center gap-2 mb-2">
              <a href="https://wa.me/573022815927" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gold hover:text-cream text-2xl">
                <FaWhatsapp />
              </a>
              <span className="text-accent-gray text-base">+57 302 2815927</span>
            </div>
            <p className="text-accent-gray">Horario: Lunes - Sábado 9 am - 7 pm</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-gold font-bold mb-2 text-lg">Todas las formas de pago</h4>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-2">
              <img src={nequiImg} alt="Nequi" className="object-contain" style={{height: '40px', width: '90px', maxWidth: '90px'}} />
              <img src={sistecreditoImg} alt="Sistecrédito" className="object-contain" style={{height: '48px', width: '64px', maxWidth: '64px'}} />
              <img src={mastercardImg} alt="Mastercard" className="object-contain" style={{height: '32px', width: '64px', maxWidth: '64px'}} />
              <img src={visaImg} alt="Visa" className="object-contain" style={{height: '32px', width: '64px', maxWidth: '64px'}} />
              <img src={addiImg} alt="Addi" className="object-contain" style={{height: '32px', width: '64px', maxWidth: '64px'}} />
            </div>
            <h4 className="text-gold font-bold mb-2 text-sm">Sistema de separado</h4>

          </div>
          <div>
            <h4 className="text-gold font-bold mb-2 text-lg">Puntos físicos</h4>
            <p className="text-accent-gray">Dirección 1: Calle 76 # 7P-14 Alfonso Lopez 3ra etapa, Cali</p>
            <br />
            <p className="text-accent-gray">Dirección 2: Calle 13 # 43A-29 Barrio Panamericano, Enseguida de la Sevillana</p>
            <h4 className="text-gold font-bold mt-4 mb-2 text-lg">Síguenos</h4>
            <div className="flex gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="text-gold hover:text-cream text-2xl"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram" className="text-gold hover:text-cream text-2xl"><FaInstagram /></a>
              <a href="#" aria-label="TikTok" className="text-gold hover:text-cream text-2xl"><FaTiktok /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-cream/60 mt-8 text-xs">© 2025 CalzaOro. Todos los derechos reservados.</div>
        {/* Botón flotante de WhatsApp */}
        <a
          href="https://wa.me/573022815927"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 bottom-6 right-6 bg-green-500 hover:bg-green-600 rounded-full shadow-lg p-4 flex items-center justify-center animate-gold-glow"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="text-white text-3xl" />
        </a>
      </div>
    </footer>
  )
}
export default Footer