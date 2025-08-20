import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import nequiImg from '../assets/Nequi.png'
import sistecreditoImg from '../assets/sistecredito-logo.png'
import mastercardImg from '../assets/mastecard.png'
import visaImg from '../assets/visa.png'
import addiImg from '../assets/addi-logo.png'

function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-900 to-black text-cream py-16 border-t-2 border-gold/50 mt-12 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gold rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:justify-items-center">
          {/* Sección de contacto */}
          <div className="flex flex-col items-start md:items-center group">
            <div className="relative mb-6">
              <h4 className="text-gold font-bold mb-4 text-xl bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Contacto
              </h4>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500 group-hover:w-full transition-all duration-500"></div>
            </div>
            
            <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300">
              <a href="https://wa.me/573022815927" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-green-400 hover:text-green-300 text-2xl transition-colors duration-300">
                <FaWhatsapp />
              </a>
              <span className="text-accent-gray text-base font-medium">+57 302 2815927</span>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300">
              <p className="text-accent-gray text-center">Horario: Lunes - Sábado 9 am - 7 pm</p>
            </div>
          </div>
          
          {/* Sección de métodos de pago */}
          <div className="flex flex-col items-center group">
            <div className="relative mb-6">
              <h4 className="text-gold font-bold mb-4 text-xl bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Todas las formas de pago
              </h4>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500 group-hover:w-full transition-all duration-500"></div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300">
              <img src={nequiImg} alt="Nequi" className="object-contain hover:scale-110 transition-transform duration-300" style={{height: '40px', width: '90px', maxWidth: '90px'}} />
              <img src={sistecreditoImg} alt="Sistecrédito" className="object-contain hover:scale-110 transition-transform duration-300" style={{height: '48px', width: '64px', maxWidth: '64px'}} />
              <img src={mastercardImg} alt="Mastercard" className="object-contain hover:scale-110 transition-transform duration-300" style={{height: '32px', width: '64px', maxWidth: '64px'}} />
              <img src={visaImg} alt="Visa" className="object-contain hover:scale-110 transition-transform duration-300" style={{height: '32px', width: '64px', maxWidth: '64px'}} />
              <img src={addiImg} alt="Addi" className="object-contain hover:scale-110 transition-transform duration-300" style={{height: '32px', width: '64px', maxWidth: '64px'}} />
            </div>
            
            <div className="mt-4 text-center">
              <h4 className="text-gold font-bold mb-2 text-sm bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Sistema de separado
              </h4>
            </div>
          </div>
          
          {/* Sección de puntos físicos y redes sociales */}
          <div className="group">
            <div className="relative mb-6">
              <h4 className="text-gold font-bold mb-4 text-xl bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Puntos físicos
              </h4>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500 group-hover:w-full transition-all duration-500"></div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300">
                <p className="text-accent-gray text-sm leading-relaxed">
                  <span className="text-gold font-semibold">📍 Dirección 1:</span><br />
                  Calle 76 # 7P-14 Alfonso Lopez 3ra etapa, Cali
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300">
                <p className="text-accent-gray text-sm leading-relaxed">
                  <span className="text-gold font-semibold">📍 Dirección 2:</span><br />
                  Calle 13 # 43A-29 Barrio Panamericano, Enseguida de la Sevillana
                </p>
              </div>
            </div>
            
            <div className="relative mb-4">
              <h4 className="text-gold font-bold mb-3 text-lg bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Síguenos
              </h4>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500 group-hover:w-full transition-all duration-500"></div>
            </div>
            
            <div className="flex gap-4 mt-3">
              <a href="#" aria-label="Facebook" className="text-gold hover:text-blue-400 text-2xl p-2 bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram" className="text-gold hover:text-pink-400 text-2xl p-2 bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                <FaInstagram />
              </a>
              <a href="#" aria-label="TikTok" className="text-gold hover:text-cyan-400 text-2xl p-2 bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110">
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
        
        {/* Línea divisoria decorativa */}
        <div className="flex items-center justify-center my-8">
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          <div className="w-3 h-3 bg-gold rounded-full mx-4"></div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </div>
        
        <div className="text-center text-cream/60 text-sm">
          © 2025 CalzaOro. Todos los derechos reservados.
        </div>
        
        {/* Botón flotante de WhatsApp mejorado */}
        <a
          href="https://wa.me/573022815927"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-2xl p-4 flex items-center justify-center animate-gold-glow hover:scale-110 transition-all duration-300 group"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="text-white text-3xl group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        </a>
      </div>
    </footer>
  )
}

export default Footer