// ===========================================
// TimeBudget - Landing Page
// ===========================================

import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                T
              </div>
              <span className="font-bold text-xl text-dark-900 tracking-tight">TimeBudget</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-dark-600 hover:text-dark-900 font-medium transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn-primary">
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Gestiona tu tiempo como tu dinero
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-dark-900 tracking-tight mb-8 leading-tight">
            Deja de gastar tiempo,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">
              empieza a invertirlo
            </span>
          </h1>
          <p className="text-xl text-dark-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            TimeBudget te ayuda a tratar tus horas con el mismo rigor que tus finanzas. 
            Define presupuestos, elimina desperdicios y asegura tiempo para lo que realmente importa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all transform hover:-translate-y-1">
              Crear mi presupuesto gratis
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl font-semibold text-dark-600 hover:bg-dark-50 transition-colors">
              Ver Demo
            </Link>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-primary-200/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
          <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[20%] left-[40%] w-96 h-96 bg-purple-200/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-4">El sistema operativo para tu vida</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">
              Más que un calendario, una metodología completa para alinear tu tiempo con tus valores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Presupuesto Base Cero</h3>
              <p className="text-dark-500">
                Asigna cada minuto antes de que empiece la semana. Asegúrate de que tus prioridades (salud, familia, proyectos) tengan fondos garantizados.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Eliminación Radical</h3>
              <p className="text-dark-500">
                Identifica y recorta actividades de bajo valor. Visualiza cuánto tiempo recuperas al decir "no" a lo que no importa.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Analytics Reales</h3>
              <p className="text-dark-500">
                Métricas honestas sobre tu uso del tiempo. Compara tu presupuesto ideal contra tu realidad semanal y ajusta el rumbo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-dark-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Tu tiempo es tu recurso más valioso.</h2>
          <p className="text-xl text-dark-300 mb-10">
            Deja de preguntarte a dónde se fue tu semana. Toma el control hoy mismo.
          </p>
          <Link to="/register" className="inline-block bg-primary-500 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30">
            Empezar ahora - Es gratis
          </Link>
          <p className="mt-6 text-dark-400 text-sm">
            Sin tarjeta de crédito requerida. Libre para uso personal.
          </p>
        </div>
      </div>
    </div>
  );
}
