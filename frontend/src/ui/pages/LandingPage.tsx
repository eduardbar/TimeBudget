// ===========================================
// TimeBudget - Landing Page (Redesign)
// ===========================================

import { Link } from 'react-router-dom';
import { 
  PieChart, 
  Scissors, 
  Shield, 
  ArrowRight, 
  Clock, 
  Target, 
  BarChart3, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';
import { useState } from 'react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar Minimalista */}
      <nav className="fixed w-full border-b border-slate-200 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">TimeBudget</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#metodo" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Método</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Funcionalidades</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md text-sm">
                Empezar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean & Direct */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 px-4 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            v2.0 Ahora con Presupuesto Base Cero
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Trata a tu tiempo con el rigor de tu <span className="text-indigo-600">dinero</span>.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            La mayoría de las personas no tienen un problema de tiempo, tienen un problema de asignación. TimeBudget es el sistema operativo para aplicar disciplina financiera a tus 168 horas semanales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
              Crear mi presupuesto
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-lg transition-all hover:bg-slate-50">
              Ver Demo Interactiva
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-slate-400">
            Sin tarjeta de crédito • Plan gratuito de por vida disponible
          </p>
        </div>
      </section>

      {/* Problem/Solution Contrast */}
      <section className="py-24 bg-slate-50 border-y border-slate-200" id="metodo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">El calendario tradicional está roto</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Los calendarios te dicen <strong>cuándo</strong> hacer las cosas, pero fallan en decirte si <strong>deberías</strong> hacerlas. Son contenedores pasivos que se llenan con las prioridades de otras personas.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-red-500"><Shield size={20} /></div>
                  <span className="text-slate-700">Sin límite de "gasto": Aceptas reuniones sin saber si tienes "fondos" de tiempo disponibles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-red-500"><Shield size={20} /></div>
                  <span className="text-slate-700">Sin auditoría: Llegas al viernes preguntándote a dónde se fue la semana.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Target className="text-indigo-600" />
                La Metodología TimeBudget
              </h3>
              <p className="text-slate-600 mb-6">
                Aplicamos el <strong>Presupuesto Base Cero (Zero-Based Budgeting)</strong>. Cada minuto recibe un trabajo antes de que empiece la semana.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-4">
                  <div className="font-mono text-indigo-600 font-bold text-xl">1</div>
                  <div>
                    <h4 className="font-semibold text-indigo-900">Ingresos Totales</h4>
                    <p className="text-sm text-indigo-700">Tienes 1440 minutos al día. Ni uno más.</p>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-4">
                  <div className="font-mono text-indigo-600 font-bold text-xl">2</div>
                  <div>
                    <h4 className="font-semibold text-indigo-900">Gastos Fijos</h4>
                    <p className="text-sm text-indigo-700">Restas sueño, salud y compromisos ineludibles.</p>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-4">
                  <div className="font-mono text-indigo-600 font-bold text-xl">3</div>
                  <div>
                    <h4 className="font-semibold text-indigo-900">Asignación Discrecional</h4>
                    <p className="text-sm text-indigo-700">El resto se invierte intencionalmente en proyectos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive - Zig Zag */}
      <section id="features" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-white rounded-3xl transform -rotate-3 scale-95 opacity-50"></div>
              <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl">
                {/* Mockup UI representation */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Presupuesto Semanal</span>
                    <span className="text-emerald-600">Balanceado</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-indigo-600 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Trabajo Profundo (75%)</span>
                      <span>30h / 40h</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-rose-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Administrativo (50%)</span>
                      <span>5h / 10h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <PieChart strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Contabilidad precisa de cada hora</h3>
              <p className="text-lg text-slate-600 mb-6">
                Deja de estimar y empieza a calcular. Define categorías precisas para tu vida (Salud, Carrera, Familia, Ocio) y asigna un presupuesto estricto.
              </p>
              <ul className="space-y-3">
                {['Alertas de sobregiro de tiempo', 'Categorización jerárquica', 'Plantillas semanales recurrentes'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 size={18} className="text-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-6">
                <Scissors strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Eliminación Radical</h3>
              <p className="text-lg text-slate-600 mb-6">
                No puedes hacer más si no haces menos. TimeBudget te obliga a confrontar la realidad: para agregar una nueva actividad de 2 horas, debes "pagarla" eliminando otra cosa.
              </p>
              <p className="text-slate-600">
                Identifica las actividades de bajo ROI (Retorno de Inversión) y elimínalas sistemáticamente de tu agenda para siempre.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-slate-100 rounded-3xl transform rotate-3 scale-95 opacity-50"></div>
              <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
                  <Scissors size={32} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Actividad Eliminada</h4>
                <p className="text-slate-500 mt-2 mb-6 text-sm">Has recuperado <strong>4.5 horas</strong> esta semana al eliminar "Reuniones de Status sin Agenda".</p>
                <div className="w-full bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tiempo Anual Ahorrado</div>
                  <div className="text-3xl font-bold text-slate-900">216 Horas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl text-white">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Varianza Semanal</div>
                    <div className="text-3xl font-bold">-12%</div>
                  </div>
                  <BarChart3 className="text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-end gap-1 h-32 justify-between">
                    {[40, 65, 45, 80, 55, 70, 40].map((h, i) => (
                      <div key={i} className="w-8 bg-indigo-500 rounded-t-sm hover:bg-indigo-400 transition-colors" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
                    <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <BarChart3 strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Analytics vs. Realidad</h3>
              <p className="text-lg text-slate-600 mb-6">
                Lo que planeas raramente es lo que sucede. TimeBudget compara tu <strong>Planificado vs. Actual</strong> en tiempo real.
              </p>
              <p className="text-slate-600">
                Entiende tus patrones de comportamiento. ¿Siempre subestimas el tráfico? ¿Sobrestimas tu capacidad de concentración? Ajusta tu presupuesto basándote en datos, no en optimismo.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <FAQItem 
              question="¿En qué se diferencia de Google Calendar?" 
              answer="Google Calendar es una herramienta de visualización (cuándo suceden las cosas). TimeBudget es una herramienta de asignación de recursos (cuánto 'cuesta' cada cosa). Usamos TimeBudget para planificar y Calendar para ejecutar."
            />
            <FAQItem 
              question="¿Tengo que rastrear cada minuto?" 
              answer="No necesariamente. Recomendamos rastrear bloques de 15 o 30 minutos. El objetivo no es la microgestión obsesiva, sino la consciencia direccional de a dónde va tu tiempo."
            />
            <FAQItem 
              question="¿Es para uso personal o equipos?" 
              answer="Actualmente TimeBudget está optimizado para la productividad personal y freelancers que necesitan controlar su rentabilidad por hora. Las funciones de equipo llegarán en la versión 3.0."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Recupera el control de tu recurso más escaso.</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            El dinero se puede recuperar. El tiempo, una vez gastado, se ha ido para siempre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/50">
              Comenzar Auditoría de Tiempo
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            © 2026 TimeBudget Inc. Todos los derechos reservados.
          </p>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-200 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-semibold text-slate-900">{question}</span>
        <ChevronDown 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <div 
        className={`px-6 text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 py-4 border-t border-slate-100' : 'max-h-0'}`}
      >
        {answer}
      </div>
    </div>
  );
}
