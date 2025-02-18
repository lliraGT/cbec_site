import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PersonalityResults = ({ results }) => {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);
  const [isTraitsOpen, setIsTraitsOpen] = useState(true);
  const [isBiblicalOpen, setBiblicalOpen] = useState(true);
  const [isThinkingOpen, setThinkingOpen] = useState(true);
  const [isEmotionalOpen, setEmotionalOpen] = useState(true);
  const [isWillpowerOpen, setWillpowerOpen] = useState(true);
  const [isRelationsOpen, setRelationsOpen] = useState(true);
  const [isLeadershipOpen, setLeadershipOpen] = useState(true);
  const [isCommunicationOpen, setCommunicationOpen] = useState(true);
  const [isOffenseOpen, setOffenseOpen] = useState(true);
  
  if (!results) {
    return <div className="text-center p-4"><p>No hay resultados disponibles.</p></div>;
  }

  const discOrder = ['D', 'I', 'S', 'C'];
  const discColors = {
    D: '#E63946',
    I: '#FFB703',
    S: '#2A9D8F',
    C: '#457B9D'
  };

  const sortedScores = Object.entries(results)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([type]) => type);
  const personalityBlend = sortedScores.join('/');

  const pieData = discOrder.map(type => ({
    name: type,
    value: Math.abs(results[type])
  }));

  const getBlendCharacteristics = (blend) => {
    const blendMap = {
      'D/I': 'Dinámico y persuasivo',
      'D/C': 'Orientado a resultados y analítico',
      'I/S': 'Motivador y colaborativo',
      'C/S': 'Metódico y constante',
    };
    return blendMap[blend] || 'Personalidad equilibrada';
  };

  return (
    <div className="max-w-[90rem] mx-auto space-y-8 px-4">
      {/* Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-[#8B2332] mb-2">
          Tu Perfil de Personalidad: {personalityBlend}
        </h2>
        <p className="text-gray-600">
          {getBlendCharacteristics(personalityBlend)}
        </p>
      </div>

      {/* Collapsible Analysis Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">Análisis</h2>
          </div>
          {isAnalysisOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isAnalysisOpen && (
          <div className="p-6 space-y-6">
            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Line Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-mono font-bold text-gray-800 mb-4">Tendencias DISC</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={discOrder.map(type => ({ name: type, value: results[type] }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#8B2332" />
                      <YAxis domain={[-28, 28]} />
                      <Tooltip 
                        formatter={(value) => [`${value}`, 'Intensidad']}
                        contentStyle={{ background: '#fff', border: '1px solid #ddd' }}
                      />
                      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8B2332"
                        strokeWidth={2}
                        dot={{ fill: "#8B2332", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-mono font-bold text-gray-800 mb-4">Distribución de Rasgos</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={discColors[discOrder[index]]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-mono font-bold text-gray-800 mb-6">Análisis Detallado</h3>
              <div className="grid gap-6">
                {discOrder.map(type => (
                  <div 
                    key={type}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: discColors[type] }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: discColors[type] }}>
                        {type === 'D' && 'Dominante'}
                        {type === 'I' && 'Influyente'}
                        {type === 'S' && 'Estable'}
                        {type === 'C' && 'Concienzudo'}
                      </h4>
                      <span className="text-2xl font-bold">{results[type]}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded">
                      <div
                        className="absolute top-0 left-0 h-full rounded"
                        style={{
                          width: `${(Math.abs(results[type]) / 28) * 100}%`,
                          backgroundColor: discColors[type]
                        }}
                      />
                    </div>
                    <p className="mt-2 text-gray-600">
                      {type === 'D' && 'Te enfocas en lograr resultados y superar desafíos. Eres directo y decisivo.'}
                      {type === 'I' && 'Motivas e influyes en otros. Eres entusiasta y optimista.'}
                      {type === 'S' && 'Valoras la estabilidad y cooperación. Eres paciente y buen oyente.'}
                      {type === 'C' && 'Buscas precisión y estructura. Eres analítico y organizado.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Personality Traits Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setIsTraitsOpen(!isTraitsOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Qué significa ser {personalityBlend}?</h2>
          </div>
          {isTraitsOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isTraitsOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {type === 'D' && [
                      'Aventurero', 'Decidido', 'Independiente', 'Dominante', 'Directo',
                      'Productivo', 'Eficaz', 'Práctico', 'Orientado a resultados'
                    ].map((trait, i) => <li key={i}>{trait}</li>)}
                    {type === 'I' && [
                      'Lleno de vida', 'Extrovertido', 'Amistoso', 'Entusiasta', 'Popular',
                      'Persuasivo', 'Sociable', 'Optimista', 'Expresivo'
                    ].map((trait, i) => <li key={i}>{trait}</li>)}
                    {type === 'S' && [
                      'Paciente', 'Leal', 'Constante', 'Confiable', 'Estable',
                      'Relajado', 'Tranquilo', 'Consistente', 'Buen oyente'
                    ].map((trait, i) => <li key={i}>{trait}</li>)}
                    {type === 'C' && [
                      'Analítico', 'Preciso', 'Organizado', 'Disciplinado', 'Detallista',
                      'Sistemático', 'Metódico', 'Perfeccionista', 'Cuidadoso'
                    ].map((trait, i) => <li key={i}>{trait}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Biblical Insights Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setBiblicalOpen(!isBiblicalOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Qué dice Dios acerca de mi personalidad?</h2>
          </div>
          {isBiblicalOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isBiblicalOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <ul className="space-y-4">
                    {type === 'D' && [
                      {
                        text: 'La gente con personalidad tipo D necesita aprender a escuchar en lugar de expresar siempre sus propias opiniones.',
                        verse: 'Santiago 1:19 "...sean lentos para hablar y lentos para enojarse"'
                      },
                      {
                        text: 'La gente con personalidad tipo D necesita estar consciente de su tendencia manipuladora.',
                        verse: 'Proverbios 16:32 "Más vale ser paciente que valiente; más vale dominarse a sí mismo que conquistar ciudades."'
                      },
                      {
                        text: 'La gente con personalidad tipo D necesita aprender que el amor, la alegría, la paz y la paciencia, la amabilidad, la bondad, la fidelidad, la ternura y el autocontrol no son opcionales para los cristianos.',
                        verse: 'Gálatas 5:22-23 "En cambio, el fruto del Espíritu es amor, alegría, paz, paciencia, amabilidad, bondad, fidelidad, humildad y dominio propio..."'
                      },
                      {
                        text: 'La gente con personalidad tipo D necesita perdonar a los demás.',
                        verse: 'Efesios 4:32 "Sean bondadosos y compasivos unos con otros, y perdónense mutuamente, así como Dios los perdonó a ustedes en Cristo."'
                      },
                      {
                        text: 'La gente con personalidad tipo D debe poner su fe en Dios en lugar de en su autosuficiencia.',
                        verse: 'Marcos 11:22 "Tengan fe en Dios —respondió Jesús—"'
                      },
                      {
                        text: 'La gente con personalidad tipo D generalmente tiene éxito debido a su fuerte voluntad y determinación.',
                        verse: 'Corintios 15:10 "...jamás pido las cosas del modo que lo arreglan [al pedirme]."'
                      },
                      {
                        text: 'La gente con personalidad tipo D es agresiva y muestra habilidades de liderazgo.',
                        verse: 'Hechos 17:4 "Algunos de los judíos se convencieron y se unieron a Pablo..."'
                      }
                    ].map((item, i) => (
                      <li key={i} className="text-gray-700">
                        <p>{item.text}</p>
                        <p className="text-sm italic mt-1">{item.verse}</p>
                      </li>
                    ))}
                    {type === 'I' && [
                      {
                        text: 'La gente con personalidad tipo I necesita reconocer la necesidad de tener estructura y organización.',
                        verse: '1 Corintios 14:40 "Pero todo debe hacerse de una manera apropiada y con orden."'
                      },
                      {
                        text: 'La gente con personalidad I necesita aprender a ser sensible a los sentimientos de los demás.',
                        verse: 'Colosenses 3:12 "...vístanse de afecto entrañable y de bondad, humildad, amabilidad y paciencia."'
                      },
                      {
                        text: 'La gente con personalidad tipo I debe trabajar para disciplinarse.',
                        verse: '1 Timoteo 2:15 "Esfuérzate por presentarte a Dios aprobado..."'
                      },
                      {
                        text: 'La gente de personalidad I es valiente a compartir su fe.',
                        verse: 'Hebreos 4:20 "...no podemos dejar de hablar de lo que hemos visto y oído."'
                      },
                      {
                        text: 'La gente con personalidad I busca oportunidades para ayudar a otros.',
                        verse: 'Gálatas 6:10 "...hagamos bien a todos."'
                      },
                      {
                        text: 'La gente con personalidad I no titubea una vez que recibió la entrega.',
                        verse: 'Marcos 1:17-18 "Y... -sígranme, les dijo Jesús... Al momento... lo siguieron."'
                      },
                      {
                        text: 'A la gente con personalidad tipo I no se le dificulta obedecer la orden de Dios de reunirse con otros cristianos.',
                        verse: 'Hebreos 10:25 "...No dejemos de congregarnos..."'
                      }
                    ].map((item, i) => (
                      <li key={i} className="text-gray-700">
                        <p>{item.text}</p>
                        <p className="text-sm italic mt-1">{item.verse}</p>
                      </li>
                    ))}
                    {type === 'S' && [
                      {
                        text: 'La gente con personalidad tipo S usa palabras suaves y sensibles para prevenir los conflictos.',
                        verse: 'Proverbios 15:1 "La respuesta amable calma el enojo..."'
                      },
                      {
                        text: 'La gente con personalidad tipo S permanece fiel aún cuando alguien la haya fallado.',
                        verse: 'Proverbios 17:17 "En todo tiempo ama el amigo..."'
                      },
                      {
                        text: 'La gente con personalidad del tipo S es capaz de lograr la paz en situaciones problemáticas a través de sus palabras y actos.',
                        verse: 'Efesios 1:2 "Que Dios nuestro Padre y el Señor Jesucristo les concedan gracia y paz."'
                      },
                      {
                        text: 'A la gente con personalidad del tipo S suele faltarle seguridad',
                        verse: 'Lucas 4:1 "El que salva no me casará ni me traicionará más..."'
                      },
                      {
                        text: 'La gente con personalidad del tipo S debe aprender que no todas las personas son sinceras y fieles.',
                        verse: 'Efesios 5:15 "Que nadie los engañe con argumentaciones vanas..."'
                      },
                      {
                        text: 'La gente con personalidad del tipo S necesita confiar en los dones que Dios le ha dado.',
                        verse: 'Timoteo 4:14s "No dejes de usar las capacidades especiales que Dios te dio..."'
                      },
                      {
                        text: 'La gente con personalidad del tipo S evita por timidez las responsabilidades de liderazgo.',
                        verse: 'Romanos 4:11 "...No tengan miedo a usar sus dones e influencias de la divinidad que más bien demuestran..."'
                      }
                    ].map((item, i) => (
                      <li key={i} className="text-gray-700">
                        <p>{item.text}</p>
                        <p className="text-sm italic mt-1">{item.verse}</p>
                      </li>
                    ))}
                    {type === 'C' && [
                      {
                        text: 'La gente con personalidad del tipo C necesita reconocer que parte de la vida cristiana soce lo...',
                        verse: '1 Corintios 13:12 "...vemos como espejo de manera imperfecta..."'
                      },
                      {
                        text: 'La gente con personalidad tipo C batalla para perdonar las ofensas.',
                        verse: 'Lucas 6:27 "...perdonen inmediatamente, así como Dios los perdona a ustedes en Cristo."'
                      },
                      {
                        text: 'La gente con personalidad tipo C suele dar cabida a pensamientos depresivos.',
                        verse: 'Filipenses 4:8 "...consideren bien todo lo verdadero, todo lo respetable, todo lo justo, todo lo puro, todo lo digno de admiración; en fin, todo lo que sea excelente o merezca elogio."'
                      },
                      {
                        text: 'La gente con personalidad del tipo C debe cuidarse de no criticar a los demás.',
                        verse: 'Timoteo 2:15 "...Esfuérzate por presentarte a Dios aprobado, como obrero que no tiene de qué avergonzarse y que interpreta rectamente la palabra de verdad."'
                      },
                      {
                        text: 'La gente con personalidad del tipo C batalla para ser humilde.',
                        verse: '1 Corintios 14:40 "Pero todo debe hacerse de una manera apropiada y con orden."'
                      },
                      {
                        text: 'La gente con personalidad del tipo C pone el ejemplo cuando se trata de hacer las cosas bien y en orden.',
                        verse: 'Filipenses 2:15 "...sean ejemplo de pureza y doctrina."'
                      },
                      {
                        text: 'La gente con personalidad del tipo C no batalla con el mandato de corregir las injusticias cuando son obvias.',
                        verse: 'Gálatas 6:1 "Hermanos, si alguien es sorprendido en pecado, ustedes que son espirituales deben restaurarlo con una actitud humilde."'
                      }
                    ].map((item, i) => (
                      <li key={i} className="text-gray-700">
                        <p>{item.text}</p>
                        <p className="text-sm italic mt-1">{item.verse}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Thinking Style Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setThinkingOpen(!isThinkingOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo influye mi personalidad en mi forma de pensar?</h2>
          </div>
          {isThinkingOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isThinkingOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <p className="text-gray-700">
                    {type === 'D' && 'Los de personalidad tipo D son conocidos por su mente aguda y rápida. Usan su perceptiva y muy intuitiva percepción acerca de la gente y las situaciones para "saber" lo que debe hacerse luego; se concentran y concentran a los demás en la acción ideal para lograr que se hagan las cosas. Por ser realista y relativamente práctico, es posible que piensen y profundicen apenas el tiempo necesario para crear un plan factible, sin preocuparse demasiado por la teoría subyacente.'}
                    {type === 'I' && 'Los de personalidad tipo I reaccionan a experiencias emocionales. Sus reacciones en la vida son directas y no muy reflexivas ni planificadas. Tienden a procesar el pensamiento espontáneamente y en voz alta, sin organizarlo de antemano. Su forma de pensar puede parecer confusa, ilógica, incongruente y superficial a otros tipos de personalidad. Sin embargo, debido a que siempre están buscando lo nuevo, con frecuencia pueden enfocar las cosas aburridas desde una perspectiva diferente.'}
                    {type === 'S' && 'Los de personalidad S tienden hacia el intelecto tranquilo y claro no obstruido por los sentimientos. Ellos pueden tener una buena gama de habilidades intelectuales, aunque quizá no tan profundas ni intuitivas como las de otros. Suelen ser capaces de poner en práctica las ideas brillantes de otras personas. Tienen una mente práctica y sensata, menos propensa a hacerse ilusiones.'}
                    {type === 'C' && 'Los de personalidad tipo C tienen las habilidades mentales más complejas de los cuatro tipos. Quieren llegar a fondo de todo y su pensamiento es profundo e integral y reflexivo. Nunca serán acusados de ser superficiales ni frívolos. Su viva imaginación tiende a conducirlos al romanticismo; sus análisis pueden volverlo rutinario e importantes y su gusto por el orden puede convertirlo en un perfeccionista. Su tendencia hacia el idealismo y el perfeccionismo puede desilusionarlos.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emotional Style Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setEmotionalOpen(!isEmotionalOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo influye mi personalidad en mis emociones y mi forma de controlarlas?</h2>
          </div>
          {isEmotionalOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isEmotionalOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <p className="text-gray-700">
                    {type === 'D' && 'En lo referente a las emociones, los de personalidad tipo D son conocidos por ser duros, bruscos y severos. Son los que con mayor probabilidad reaccionarán con ira. No sólo son fríos por naturaleza, sino que pueden llegar a considerar inútil la sensibilidad, por lo cual no se compadecen del dolor ajeno. Pueden parecer insensibles a las críticas, y no comprenden el significado de tierno, delicado o frágil en la vida. Puede ser difícil interesar a la gente del tipo D en la religión, ya que la consideran mero sentimentalismo.'}
                    {type === 'I' && 'Los sentimientos intensos pero inconstantes predominan en el mundo de los del tipo I. Son muy sensibles y tienen una vida emocional muy rica y variada. Sus emociones se disparan fácilmente debido a las impresiones provenientes del mundo exterior (ya sea en forma constructiva o destructiva), y con frecuencia sus reacciones exageradas determinan el humor en que están; pero sus emociones vuelan, y suelen experimentar un rápido cambio de sentimientos. Pueden ir del enojo a la euforia. Esta emotividad influye en su deseo de conocer causa, por las cuales se interesan fácil e intensamente... por el momento. Al expresar sus sentimientos, los del tipo I tienden a ser parlanchines, teatrales, intensos y emocionales.'}
                    {type === 'S' && 'Los del tipo S suelen ser confiables y tranquilos. Conservan su equilibrio emocional y pasan por desapercibidos y serenos en todas las situaciones. Debido a su sensatez y mental, no les inquietan ni molestan las imperfecciones. Nunca están desprevenidos ni tensos, y no les gustan las reformas ni los cambios. Tienen la fortaleza y presencia mental para evaluar calmadamente las situaciones de riesgo, considerar las posibilidades y elegir la mejor solución.'}
                    {type === 'C' && 'Los sentimientos predominan en lo del tipo C, por lo cual tienen una naturaleza rica y sensible (con frecuencia son hipersensibles y se sienten heridos fácilmente). Típicamente, suelen sentir más de lo que expresan. Por ejemplo, no se enojan con facilidad, pero pueden expresarlo por la acumulación de daños. Típicamente son pesimistas y lacturosos y se preocupan mucho por el sufrimiento emocional. Analizan constantemente las cosas y ven poco en el mundo que los anime.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Willpower Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setWillpowerOpen(!isWillpowerOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo influye mi personalidad en mi voluntad y autodisciplina?</h2>
          </div>
          {isWillpowerOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isWillpowerOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <p className="text-gray-700">
                    {type === 'D' && 'Para los de este tipo, la voluntad es el factor controlador; la toma de acción y trabajo en respuesta a factores externos. A los de personalidad D también les gusta tomar decisiones por los demás. Poseen mucha fuerza de voluntad, una mente aguda, enfoque y aunque que les permite actuar rápidamente, con valor y decisión, aunque quizá precipitada e impulsivamente. No desfallecan ante obstáculos y adversidades; ven las oposiciones como desafíos y huyen del riesgo y lo desconocido.'}
                    {type === 'I' && 'Los de tipo I tienen buen corazón, pero son poco confiables a la hora de perseverar. Su voluntad no es particularmente fuerte, así que sus acciones son impredecibles e inconstantes, aunque muestren iniciativa respecto a nuevas ideas. Los del tipo I pueden ser espontáneos y expresivos, pero también son superficiales y distraídos. Incluso pueden inventar excusas referentes a por qué no pudieron hacer tal o cual cosa (en realidad, la única razón es porque eno quisieron) cumplir con sus obligaciones.'}
                    {type === 'S' && 'La toma de decisiones y la autodisciplina son un problema para los del tipo S. Con frecuencia son lentos, indolentes y despreocupados. Como no les gusta batallar, no están dispuestos a esforzarse o a evitar con prisa. Tienen antes de actuar, pero aún así se les dificulta vencer su inercia y su tendencia a la postergación. Una vez que se ponen en marcha, pueden hacer buenos planes, ejecutarlos con eficacia y demostrar que son confiables para darles seguimiento.'}
                    {type === 'C' && 'Tomar decisiones y correr riesgos calculados no son características fuertes de los del tipo C, en parte debido a su naturaleza pasiva. Además, su capacidad de análisis interminable desde todos los ángulos paraliza los peligros. Entre más peligros posibles detecten, más difícil es para ellos decidir. Finalmente actúan sólo cuando tienen que hacerlo, con dudas constantes y pequeñas muestras de valentía. Los del tipo C también son relativamente disciplinados y conocen sus limitaciones.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Relationships Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setRelationsOpen(!isRelationsOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo influye mi personalidad en mis relaciones con los demás?</h2>
          </div>
          {isRelationsOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isRelationsOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <p className="text-gray-700">
                    {type === 'D' && 'Las relaciones pueden ser un problema para los del tipo D con frecuencia son egocéntricos en las formas que demuestran falta de respeto y consideración por los demás, quienes los consideran sobrados de confianza en sí mismos, orgullosos y altaneros. Aunque pueden ser buenos líderes, también pueden ser mandones, impacientes con su gente e insensitivos hacia las debilidades de los demás. A los del tipo D suele faltarles compasión. Debido a que ven a la gente como herramientas para la realización de sus planes, pueden ser fríos, manipuladores y mostrar una falsa preocupación para salirse con la suya.'}
                    {type === 'I' && 'En general, los del tipo I tienen la habilidad de entablar relaciones cálidas con una gran gama de tipos de personas. Son cálidos, alegres y extravagantes. Aceptan a la gente como es y no les molesta si la gente cumple o no con ciertos estándares. Su espíritu receptivo los ayuda a ajustarse a los demás e interesarse genuinamente en sus preocupaciones. Son líderes compasivos y consoladores. Consistentemente se alegran con quienes están alegres y lloran con quienes lloran. Esta característica los vuelve poco confiables y libres de cuidado. Afortunadamente, el I es el tipo de personalidad que menos esfuerzo tiene que hacer para ser humilde y disculparse.'}
                    {type === 'S' && 'Los del tipo S tienen una influencia estabilizadora en las relaciones, aún en medio de circunstancias perturbadoras. Son equilibrados, calmados y rara vez se exaltan. Son bondadosos, fáciles de tratar, agradables, corteses, relajados y simpáticos; pero pueden ser apáticos, desdeñosos, hoscos y fríos, hasta el punto de ser indiferentes hacia los demás. Con frecuencia los del tipo S estudian a la gente pero no se interesan por ella, excepto cuando ven algo en lo que puedan capitalizar sus tendencias oportunistas. Su presencia tiene un efecto calmante y conciliador en los demás, y su amor por la paz y la armonía les da una base para relacionarse eficazmente con muchos tipos diferentes de personas.'}
                    {type === 'C' && 'No hacen muchos amigos, pero mantienen a los que tienen mediante su fidelidad, lealtad y carácter confiable. Consideran las promesas como deudas de honor. Los del tipo C son difíciles de tratar y de emocionar, y son orgullosos. Su notable capacidad de análisis les permite ver claramente los errores de los demás, por lo cual se vuelven muy críticos. Su búsqueda romántica del ideal los hace inflexibles, los desilusiona y los obliga a protegerse. Los del tipo C se sienten heridos con facilidad, son desconfiados, distantes y fríos; pueden tener delirio de persecución. Tienden a ser despiertos y guardar rencores, los cuales pueden crecer hasta proporciones insoportables.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leadership Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setLeadershipOpen(!isLeadershipOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo influye mi personalidad en mi liderazgo?</h2>
          </div>
          {isLeadershipOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isLeadershipOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <p className="text-gray-700">
                    {type === 'D' && 'A los de personalidad D les encanta dirigir y con frecuencia se ofrecen para hacerlo. Típicamente quieren un ambiente de libertad y control, de manera que puedan hacer tu idea te plazca. Su orientación hacia la acción no significa que sus planes sean mejores que los desarrollados por personas con otros tipos de personalidad, pero su naturaleza agresiva, firme y constante impulsa sus planes. El estilo de liderazgo de los del tipo D tiende a ser enérgico, impulsivo, confiado, temerario, vigoroso, hábil, orientado a logros, dictatorial y mandón.'}
                    {type === 'I' && 'Irónicamente, los del tipo I disfrutan siendo libres y sin restricciones, a la vez que son controlados e impulsados por fuerzas externas. Les encanta la libertad, y no se dejan gobernar por reglas y reglamentos. Se dejan moldear fácilmente por el ambiente. También son susceptibles a engañarse a sí mismos y a los demás hasta seguir un camino donde el fin justifica los medios.'}
                    {type === 'S' && 'Los del tipo S suelen no asumir el liderazgo, sin embargo son bastante capaces cuando reciben el llamado a dirigir. Valoran la libertad, pero, irónicamente, se oponen al cambio y pueden controlar las situaciones bajo la lupa o incluso organizando algún proyecto en el cual no deseen participar en realidad. El ser forzados a participar en actividades de los demás puede sacar mal puede aumentar su resistencia a participar en futuras actividades.'}
                    {type === 'C' && 'Principalmente pasivos, los de personalidad tipo C prefieren ser seguidores, no líderes. Aún así, muestran características útiles de liderazgo tales como la abnegación y el servicio, naturaleza inflexible y disponibilidad a trabajar diestra les encanta. Los del tipo C son eficaces a la hora de analizar las fortalezas y debilidades de los planes. Desafortunadamente esta característica puede hacerlos parecer contrarios a cualquier proyecto.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Communication Style Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setCommunicationOpen(!isCommunicationOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo influye mi personalidad en mi estilo de comunicación?</h2>
          </div>
          {isCommunicationOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isCommunicationOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <p className="text-gray-700">
                    {type === 'D' && 'Los del tipo D pueden ser extrovertidos, pero eso no significa que se comuniquen con claridad o amabilidad. Con frecuencia son conocidos porque se les dificulta expresarse o mostrar aprobación, e incluso por expresar desaprobación. Pueden hablar en forma directa y sarcástica, cortante, mordaz, severa y nada efectiva. Se dejan absorber por sus propias metas hasta el punto en que tienden a no enfocarse en los demás ni escuchar lo que dicen. No les importa si la gente está en desacuerdo con ellos; hacen lo que quieren de todos modos.'}
                    {type === 'I' && 'Los del tipo I son sociables, las palabras les salen fácilmente. Piensan en voz alta en un flujo que no se caracteriza por pensar antes de hablar. Su estilo puede ser ruidoso, fanfarrón y ambicioso, impresionante, directo y fascinante. Atraen a la gente, pero dominan las discusiones con temas de interés personal. Aún así, su conversación y estado de ánimo son contagiosos. Hablan de modo encantador acerca de lo cotidiano, y son narradores pintorescos y teatrales.'}
                    {type === 'S' && 'Los del tipo S son muy variables en cuanto a su estilo de comunicación. Por un lado, se dice que algunas veces tienen modales nejados que les facilitan el escuchar a los demás, y que pueden estar fácilmente dispuestos a dar consejos. Por otro lado, se han distinguido por su indecisión para involucrarse con otras personas. Se comunican en tono calmado y pacífico, sin generar mucha emoción entre quienes los escuchan. Atraen la armonía con sus palabras.'}
                    {type === 'C' && 'Por lo general los del tipo C tienen opiniones y con frecuencia están bien informados acerca de muchos temas y problemas, pero no las externan en una conversación a menos que se les pregunte directamente que piensan. Son precisos y minuciosos y tienden a evitar aversión por la exageración y los argumentos mal respaldados. Suelen ser desconfiados y depresivos, lo cual no les gana la simpatía de los demás en una conversación.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Offense Reaction Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setOffenseOpen(!isOffenseOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo influye mi personalidad en mi forma de reaccionar a las ofensas?</h2>
          </div>
          {isOffenseOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isOffenseOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {sortedScores.map((type, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B2332]">
                    Personalidad {type}
                  </h3>
                  <p className="text-gray-700">
                    {type === 'D' && 'Los del tipo D son conocidos por vengativos. No perdonan ni olvidan fácilmente los insultos o heridas. En lugar de ello, dejan que éstos influyan en sus acciones futuras para vengarse de la gente por lo que perciben como injusticias cometidas contra ellos. Tienden a la amargura y la ira, que junto con las otras características de su forma de reaccionar a las ofensas los hace propensos a contraer úlceras.'}
                    {type === 'I' && 'En general, los del tipo I olvidan fácilmente el pasado y viven el presente. Por lo tanto, tienden a olvidar rápidamente las ofensas y seguir adelante.'}
                    {type === 'S' && 'Los del tipo S descartan las ofensas por considerarlas intrascendentes, así que no se ofenden tan fácilmente como los de otros tipos. Viven más en el presente que en el pasado, y no guardan resentimiento cuando sienten que los han ofendido. Aman la paz, aguantan mucho y rara vez estallan de ira, pero cuando llegan a reventar lo hacen con frialdad y deseos de venganza.'}
                    {type === 'C' && 'Los del tipo C son vengativos. En muchos sentidos viven en el pasado, y se les dificulta olvidar cualquier tipo de insulto u ofensa. Su espíritu implacable agrava el impacto de la ofensa y la transmite al futuro; la reflexión acerca de la herida la profundiza, ya que sus sentimientos de efecto retardado los hacen propensos a hervir de resentimiento. Van cargando resentimientos que los amargan y los llevan a estar predispuestos contra la gente debido a su implacabilidad.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityResults;