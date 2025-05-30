'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function InfoPage() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const colors = {
    burgundy: '#8B4B6B',
    darkGray: '#4A4A4A',
    white: '#FFFFFF',
    lightGray: '#f8f6f3'
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: colors.lightGray }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom border-4" style={{ borderColor: colors.burgundy }}>
        <div className="container py-5">
          <h1 className="display-4 text-center mb-2 fw-bold" style={{ 
            color: colors.burgundy,
            fontFamily: 'Georgia, serif'
          }}>
            Centro Bíblico El Camino
          </h1>
          <p className="text-center text-secondary fs-4" style={{ fontFamily: 'Georgia, serif' }}>
            Información para nuestra congregación
          </p>
        </div>
      </header>

      <div className="container py-5">
        {/* First Row: Why We Do + Values */}
        <div className="row mb-5">
          {/* Why We Do Section */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card shadow h-100">
              <div className="card-body p-5">
                <h2 className="display-5 fw-bold mb-4" style={{ color: colors.burgundy }}>
                  ¿Por qué hacemos lo que hacemos?
                </h2>
                <div className="row g-4">
                  {/* Mission */}
                  <div className="col-lg-12 mb-4">
                    <div className="card h-100 border-0" style={{ backgroundColor: colors.white }}>
                      <div className="card-body">
                        <h3 className="card-title h4 fw-bold mb-3" style={{ 
                          color: colors.darkGray,
                          fontFamily: 'Georgia, serif'
                        }}>
                          Misión
                        </h3>
                        <p className="card-text fs-5" style={{ fontFamily: 'Georgia, serif' }}>
                          Centro Bíblico El Camino existe para <strong style={{ color: colors.burgundy }}>glorificar a Dios</strong>, 
                          desarrollando discípulos incondicionales de Jesucristo en todo lugar
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Vision */}
                  <div className="col-lg-12">
                    <div className="card h-100 border-0" style={{ backgroundColor: colors.white }}>
                      <div className="card-body">
                        <h3 className="card-title h4 fw-bold mb-3" style={{ 
                          color: colors.darkGray,
                          fontFamily: 'Georgia, serif'
                        }}>
                          Visión
                        </h3>
                        <p className="card-text fs-5" style={{ fontFamily: 'Georgia, serif' }}>
                          Ser una <strong style={{ color: colors.burgundy }}>comunidad de cristianos verdaderos</strong> que están centrados 
                          en el Evangelio y que impactan al mundo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="col-lg-6">
            <div className="card shadow h-100">
              <div className="card-body p-5">
                <h2 className="display-5 fw-bold mb-4" style={{ color: colors.burgundy }}>
                  Valores que nos guían
                </h2>
                <div className="d-flex flex-column gap-4">
                  <blockquote className="blockquote p-4 rounded" style={{ backgroundColor: colors.white }}>
                    <p className="fs-4 fst-italic mb-0" style={{ fontFamily: 'Georgia, serif' }}>
                      "Dios se glorifica cuando nos <span className="fw-bold" style={{ color: colors.burgundy }}>enfocamos en personas</span>"
                    </p>
                  </blockquote>
                  <blockquote className="blockquote p-4 rounded" style={{ backgroundColor: colors.white }}>
                    <p className="fs-4 fst-italic mb-0" style={{ fontFamily: 'Georgia, serif' }}>
                      "Dios se exalta en medio de una <span className="fw-bold" style={{ color: colors.burgundy }}>cultura de servicio</span> como estilo de vida."
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: How We Do + What We Do */}
        <div className="row mb-5">
          {/* How We Do Section */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card shadow h-100">
              <div className="card-body p-5">
                <h2 className="display-5 fw-bold mb-4" style={{ color: colors.burgundy }}>
                  ¿Cómo lo hacemos?
                </h2>
                <div className="row g-4">
                  {[
                    { title: 'Creemos', subtitle: 'Como cristianos verdaderos', color: colors.burgundy },
                    { title: 'Conectamos', subtitle: 'Como parte de ésta comunidad', color: colors.burgundy },
                    { title: 'Crecemos', subtitle: 'Como discípulos relacionales', color: colors.burgundy },
                    { title: 'Compartimos', subtitle: 'Como embajadores del reino', color: colors.burgundy }
                  ].map((item, index) => (
                    <div key={index} className="col-md-6 mb-4">
                      <div className="card h-100 border-0" style={{ backgroundColor: `${item.color}20` }}>
                        <div className="card-body text-center p-4">
                          <h3 className="h4 mb-2" style={{ color: item.color }}>{item.title}</h3>
                          <p className="mb-0" style={{ color: colors.burgundy }}>{item.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <blockquote className="blockquote mt-4 p-4 rounded" style={{ backgroundColor: colors.white }}>
                  <p className="mb-0 fst-italic">
                    "La incondicionalidad es apasionadamente comprometernos con el Reino de nuestro trino Dios..."
                  </p>
                  <footer className="blockquote-footer mt-2">
                    Guillermo Taylor, Fundador de Centro Bíblico El Camino
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="col-lg-6">
            <div className="card shadow h-100">
              <div className="card-body p-5">
                <h2 className="display-5 fw-bold mb-4" style={{ color: colors.burgundy }}>
                  ¿Qué hacemos?
                </h2>
                <div className="row g-4">
                  {[
                    { title: 'Misiones', color: colors.burgundy },
                    { title: 'Enseñanza', color: colors.burgundy },
                    { title: 'Cuidado Pastoral', color: colors.burgundy },
                    { title: 'Comunión', color: colors.burgundy },
                    { title: 'Ayuda Social', color: colors.burgundy }
                  ].map((item, index) => (
                    <div key={index} className="col-md-4 mb-4">
                      <div className="card h-100 border-0 text-center p-4" 
                           style={{ backgroundColor: `${item.color}20` }}>
                        <div className="card-body d-flex align-items-center justify-content-center">
                          <h3 className="h4 mb-0" style={{ color: item.color }}>{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-5">
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className="accordion-button"
                  type="button"
                  onClick={toggleCollapse}
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.burgundy} 0%, ${colors.darkGray} 100%)`,
                    color: colors.white
                  }}
                >
                  Preguntas de la Sesión
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${!isCollapsed ? 'show' : ''}`}>
                <div className="accordion-body text-center fst-italic">
                  Las preguntas y respuestas de la sesión se agregarán aquí próximamente.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}