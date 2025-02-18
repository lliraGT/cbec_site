import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DonesResults = ({ giftResults, personalityResults }) => {
  const [expandedGift, setExpandedGift] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPersonalityOpen, setIsPersonalityOpen] = useState(true);

  if (!giftResults || Object.keys(giftResults).length === 0) {
    return <div className="text-center p-4">No hay resultados de dones disponibles.</div>;
  }

  const handleNext = () => {
    if (currentCardIndex + 3 < top5Gifts.length) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const giftLabels = {
    evangelismo: 'Evangelismo',
    liderazgo: 'Liderazgo',
    misericordia: 'Misericordia',
    administracion: 'Administración',
    profecia: 'Profecía',
    dar: 'Dar',
    ensenanza: 'Enseñanza',
    pastoreo: 'Pastoreo',
    fe: 'Fe',
    exhortacion: 'Exhortación',
    servicio: 'Servicio',
    ayuda: 'Ayuda',
    sabiduria: 'Sabiduría',
    conocimiento: 'Conocimiento',
    hospitalidad: 'Hospitalidad',
    discernimiento: 'Discernimiento'
  };

  // Gift descriptions dictionary - Would contain long descriptions for each gift
  const giftDescriptions = {
    evangelismo: 'El don del evangelismo es el atributo especial dado por el Espíritu Santo a miembros del cuerpo de Cristo para compartir con los no cristianos la forma en que una persona se convierte en cristiana, y provocar en ellos el deseo de convertirse.',
    liderazgo: 'El don del liderazgo es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para proveer dirección y metas a un grupo, y recolectar recursos y personas que trabajen juntas para lograr las metas.',
    misericordia: 'El don de la misericordia es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para sentir el dolor de los demás y expresarles compasión y consuelo genuinos.',
    administracion: 'El don de la administración es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para entender cuáles son los recursos necesarios para lograr planes y metas y dirigir al pueblo de Dios hacia canales eficaces de servicio.',
    profecia: 'El don de profecía es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para proclamar la Palabra de Dios con audacia y seguridad.',
    dar: 'El don del dar es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para poner (con un espíritu alegre y bien dispuesto) sus recursos y dinero (más allá de lo exigido por el diezmo) a disposición de la obra de Dios.',
    ensenanza: 'El don de la enseñanza es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para comunicar verdades bíblicas de una manera que los demás puedan entenderlas y aprenderlas.',
    pastoreo: 'El don del pastoreo es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para guiar, proteger, nutrir y alimentar a un grupo de creyentes con el fin de que crezcan espiritualmente.',
    fe: 'El don de la fe es el atributo especial dado por el Espíritu de Dios a miembros del cuerpo de Cristo para creer en las promesas de Dios y actuar con una confianza inquebrantable al llevar a cabo Su voluntad.',
    exhortacion: 'El don de la exhortación es el atributo especial dado por el Espíritu de Dios a ciertos miembros del cuerpo de Cristo para animar y consolar a los afligidos e indicarles medidas prácticas y positivas para salir adelante.',
    servicio: 'El don del servicio es el atributo especial dado por el Espíritu de Dios a ciertos miembros del cuerpo de Cristo para detectar, ayudar y apoyar a los ministerios del Cuerpo, permitiendo de esa manera que logren eficazmente los resultados deseados.',
    ayuda: 'El don de la ayuda es el atributo especial dado por el Espíritu de Dios a ciertos miembros del cuerpo de Cristo para ayudar a otros miembros a ser más eficaces en la utilización de sus dones dentro del Cuerpo.',
    sabiduria: 'El don de la sabiduría es el atributo especial dado por el Espíritu de Dios a ciertos miembros del cuerpo de Cristo para entender, discernir y aplicar las verdades bíblicas.',
    conocimiento: 'El don del conocimiento es el atributo especial dado por el Espíritu de Dios a ciertos miembros del cuerpo de Cristo para lograr una profunda comprensión de la Palabra de Dios y traer iluminación a aspectos de la Palabra que no pueden explicarse mediante la razón humana.',
    hospitalidad: 'El don de la hospitalidad es el atributo especial dado por el Espíritu de Dios a ciertos miembros del cuerpo de Cristo para abrir las puertas de su casa con alegría a los necesitados de alimentación y alojamiento.',
    discernimiento: 'El don del discernimiento es el atributo especial dado por el Espíritu de Dios a ciertos miembros del cuerpo de Cristo consistente en saber con toda seguridad si las personas, enseñanzas o motivaciones provienen de Dios.'
  };

  // Scripture references dictionary - Would contain arrays of references for each gift
  const scriptureReferences = {
    evangelismo: ['Hechos 8:26-40', 'Hechos 21:8', 'II Timoteo 4:5'],
    liderazgo: ['Romanos 12:6-8', 'I Timoteo 5:17', 'Hebreos 13:17'],
    misericordia: ['Mateo 20:29-34', 'Marcos 9:41', 'Romanos 12:8'],
    administracion: ['Lucas 14:28-30', 'Hechos 6:1-7', 'I Corintios 12:28', 'Tito 1:5'],
    profecia: ['Hechos 15:32', 'Romanos 12:6', 'I Corintios 12:10, 28', 'Efesios 4:11-14'],
    dar: ['Marcos 12:41-44', 'II Corintios 8:1-7', 'II Corintios 9:2-8'],
    ensenanza: ['Hechos 18:24-28', 'Romanos 12:7', 'I Corintios 12:28', 'Efesios 4:11-14'],
    pastoreo: ['Juan 10:1-18', 'Efesios 4:11-14', 'I Pedro 5:1-4'],
    fe: ['Hechos 11:22-24', 'Hechos 27:21-25', 'Romanos 4:18-21', 'I Corintios 12:9'],
    exhortacion: ['Hechos 14:22', 'Romanos 12:8', 'Hebreos 10:25'],
    servicio: ['Hechos 6:1-7', 'Romanos 12:7', 'Gálatas 6:2, 10'],
    ayuda: ['Marcos 15:40-41', 'Hechos 9:36', 'Romanos 16:1-2', 'I Corintios 12:28'],
    sabiduria: ['Hechos 6:3', 'I Corintios 2:1-13', 'I Corintios 12:8'],
    conocimiento: ['I Corintios 2:14', 'II Corintios 11:6', 'Colosenses 2:2-3'],
    hospitalidad: ['Hechos 16:14-15', 'Romanos 12:9-13', 'I Pedro 4:9'],
    discernimiento: ['Mateo 16:21-23', 'Hechos 5:1-11', 'Hechos 16:16-18', 'I Corintios 12:10']
  };

  // Transform results for chart and get top 5 gifts
  const chartData = Object.entries(giftResults)
    .map(([gift, score]) => ({
      name: giftLabels[gift],
      value: score,
      gift: gift
    }))
    .sort((a, b) => b.value - a.value);

  const top5Gifts = chartData.slice(0, 5);

  // Get personality blend
  const personalityBlend = Object.entries(personalityResults)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([type]) => type);

    const getPersonalityGiftCombination = (gift, personalityType) => {
      const combinations = {
        administracion: {
          D: "No tienen dificultad en delegar tareas. Asignan con decisión las tareas a realizar. Son buenos para ver el panorama general. Trabajan bien en varios proyectos a la vez. Se enfocan más en las tareas que en la gente.",
          I: "Se aprovechan de sus habilidades y simpatía. Son buenos comunicadores del panorama general. Motivan a la gente a participar. Logran grandes cosas a través de la gente. Se comprometen en demasiadas cosas.",
          C: "Reconocen las necesidades y saben cómo satisfacerlas. Proveen detalles precisos y concisos. No tienen que ajustar sus planes porque desde un principio piensan en todos los detalles. Conocen bien los recursos necesarios.",
          S: "Trabajan eficientemente con equipos para lograr las tareas. Crean un ambiente de armonía entre quienes reciben instrucción. Trabajan regularmente en los detalles de los planes. Tienen equilibrio entre la realización de las tareas y el interés por la gente."
        },
        discernimiento: {
          D: "Son rápidos, decididos y acertados para evaluar a las personas. Confrontan a las personas cuya motivación no proviene de Dios. Distinguen intuitivamente entre el bien y el mal. Pueden ser frios y severos al confrontar a quienes se han desviado.",
          I: "Influyen sus conclusiones en otros fácilmente. Se sienten motivados a ayudar a otros a discernir. No utilizan palabras condescendientes para comunicar los errores que ven en las enseñanzas o individuos.",
          C: "Son precisos al evaluar a las personas, enseñanzas y motivaciones. Investigan y analizan minuciosamente todos los hechos antes de tomar una decisión. Tienen una naturaleza inflexible que les impide hacer juicios basados en los sentimientos.",
          S: "Son reservados al evaluar las motivaciones de los demás. No buscan oportunidades de revelar las motivaciones o enseñanzas impuras de los demás. Desean utilizar su don para edificar no para destruir."
        },
        evangelismo: {
          D: "Muestran confianza al compartir a Cristo. No se desaniman fácilmente, son persistentes. Presentan el evangelio en forma sencilla, franca y directa. Presentan el evangelio de forma lógica persuasiva.",
          I: "Ayudan a los demás a ver el lado atractivo del cristianismo. Enfatizan los beneficios de convertirse en cristiano. Ven la testificación como algo natural y divertido. Cuentan vívidas historias al compartir a Cristo.",
          C: "Comparten el evangelio a fondo. Son eficaces con los intelectuales no cristianos. Conocen las escrituras ampliamente. De buena gana investigan preguntas y objeciones.",
          S: "Prefieren el evangelismo relacional. No presionan a la gente. No necesitan reconocimiento público. Son pacientes al compartir a Cristo."
        },
        exhortacion: {
          D: "Se sienten impulsados a demostrar la aplicación práctica de las verdades del evangelio para animar a la gente. Sugieren medidas sencillas, concisas y directas a quienes necesitan ser alentados.",
          I: "Hacen que los demás crean que pueden vencer retos. Convencen a los demás de que las medidas que les aconsejan para vencer un problema son exactamente lo que necesitan. Sus consejos para vencer los desafíos no siempre son realistas.",
          C: "Aconsejan pasos concisos para vencer los problemas. Dan aliento y un plan orientado a tareas. Son buenos para escuchar antes de alentar. Batallan con el lenguaje verbal y no verbal al dar aliento.",
          S: "Alientan a la gente sin presionarla. La animan aconsejándole medidas prácticas y sencillas. Son muy pacientes con quienes necesitan aliento, pero no siempre los acompañan en el seguimiento."
        },
        fe: {
          D: "Continúan persiguiendo metas cuando el sentido común dice que las abandonen. Persiguen metas con una pasión inquebrantable y decidida. No necesitan conocer todos los detalles antes de actuar.",
          I: "Inspiran e influyen en otros para aumentar su fe. Exudan optimismo en sus actitudes hacia lo imposible, que ellos ven como posible. Pueden ser dominados por emociones e impresiones que ellos interpretan como fe.",
          C: "Son analíticos y calculadores al determinar cómo se debe actuar para obtener las promesas de Dios. Son prácticos y están en contacto con la realidad al determinar cómo pueden hacer que las promesas de Dios actúen en ellos.",
          S: "Esperan pacientemente que Dios cumpla sus promesas. Viven una vida de fe equilibrada entre lo que ellos deben hacer y lo que Dios debe hacer. Son reservados y contemplativos en lugar de actuar en el ejercicio de su fe."
        },
        ayuda: {
          D: "Deciden ayudar a los demás detrás de escena. Se ofrecen rápidamente a dar ayuda, se les pida o no. Son propensos a reclutar a otros para ayudar. Determinan intuitivamente dónde se necesita ayuda y reaccionan con energía.",
          I: "Inspiran eficazmente a los demás a acercarse a ayudar. Motivan a la gente a buscar oportunidades de ayudar a los demás. Se ofrecen voluntariamente a ayudar a los demás sin pensar mucho.",
          C: "Se aseguran de que al ayudar a los demás los detalles estén cubiertos. Ayudan a los demás haciendo tareas que pueden parecer mundanas. Ayudan a los demás a triunfar durante largos períodos de tiempo.",
          S: "Les interesa ayudar a otros al punto que sacrifica sus propias necesidades. Se sienten necesitados cuando están ayudando a los demás. Son muy leales con la gente a quien ayudan."
        },
        hospitalidad: {
          D: "Buscan activamente oportunidades de prestar su casa para la celebración de reuniones o para ayudar a los necesitados de alimentación y alojamiento. Dirigen a los demás en sus esfuerzos de ofrecer ayuda y albergue a los necesitados.",
          I: "Acogen a la gente sin pensar en las molestias que pueden causar a su familia. Ayudan a personas necesitadas de alimentación y albergue aun cuando es evidente que les harían un bien mayor permitiendo que Dios tratara con esas personas a través de las dificultades.",
          C: "Saben quiénes realmente necesitan alimentación y albergue. Son precavidos y reservados al ofrecer su hospitalidad. Necesitan que su casa esté en perfecto orden antes de invitar a otras personas.",
          S: "Son sensibles a las necesidades de alimentación y albergue de los demás. Crean un ambiente de tranquilidad y paz para la gente a quien acogen. Son lentos para invitar a otros a su casa, no porque no deseen acogerlos."
        },
        liderazgo: {
          D: "Se muestran confiados al comunicar un grupo hacia dónde debe ir. Dan seguridad acerca de las metas y dirección del grupo. Están bien dispuestos a tomar decisiones difíciles e impopulares.",
          I: "Utilizan su gran facilidad de palabra para inspirar a otros. Crean un ambiente de equipo donde las personas sienten que están contribuyendo a dar dirección al grupo. Tienen talento para juntar grupos opuestos y ponerlos a trabajar en metas comunes.",
          C: "Presentan con precisión los hechos antes de pedir a los demás que los sigan. Planean y presentan habilidosamente el plan a quienes podrían llevarlo a cabo. Esperan que sus seguidores hagan las cosas con calidad y atención a los detalles.",
          S: "Son pacientes para hacer que los demás los sigan. Están más cómodos detrás de escena que al frente del grupo. Muestran sensibilidad hacia las necesidades del grupo que están dirigiendo."
        },
        misericordia: {
          D: "Reaccionan rápidamente a las necesidades de los afligidos. Muestran amor y preocupación por los necesitados y actúan para ayudarlos. Buscan activamente a quienes sufren y tienen necesidad de compasión.",
          I: "Los demás pueden sentir su empatía y preocupación. Son capaces de expresar preocupación por los afligidos. Inspiran a los demás a interesarse por los afligidos.",
          C: "Expresan consuelo con su presencia más que con palabras. Consuelan lealmente a los necesitados durante largos períodos. Analizan con precisión a la gente y detectan a quienes de verdad necesitan consuelo.",
          S: "La gente necesitada se siente atraída hacia ellos. Sienten cuando los demás necesitan consuelo y compasión. Desean dar consuelo inmediato a los que sufren."
        },
        pastoreo: {
          D: "Se sienten atraídos al pastoreo grupal, más que al individual. Guían a su rebaño con visión y dirección. Toman decisiones rápidas sobre el grupo que supervisan.",
          I: "Su deseo de alimentar a su rebaño atrae a las personas. Motivan e inspiran a sus ovejas a crecer espiritualmente. Son buenos para reunir al rebaño y guiar su crecimiento conjunto.",
          C: "Son precavidos y analíticos respecto a quién quieren dirigir. Sospechan de cualquiera que parezca tener motivos ocultos. Dirigen sistemáticamente a su rebaño; saben exactamente a dónde quieren guiarlo.",
          S: "Son sensibles para cuidar a las personas, más que a grupos. Atienden regular y fielmente a las personas necesitadas de guía para su crecimiento espiritual. Se interesan profunda y genuinamente por el bienestar emocional de sus ovejas."
        },
        profecia: {
          D: "Proclaman y sostienen valerosamente lo que justo y correcto. Pueden ser ofensivos debido a su celo por proclamar y defender la verdad. Son francos y directos al poner en evidencia un error.",
          I: "Son eficaces para proclamar la verdad de forma positiva. Inspiran a los demás a unirse a ellos para proclamar la verdad. Influyen en los demás para actuar en defensa de la verdad o para poner en evidencia el error.",
          C: "Proclaman la verdad con precisión y eficacia. Recopilan y analizan los hechos antes de proclamar la verdad. Su fuerte sensación de estar en lo correcto los obliga a ser inflexibles.",
          S: "Proclaman y defienden la verdad firme pero gentilmente. Batallan para proclamar verdades que ofenderán a otros porque no desean causar conflictos ni disensión. Son pacientes con quienes rechazan su proclamación de la verdad."
        },
        ensenanza: {
          D: "Se comunican con hechos e información y breve y específica. Inspiran a sus oyentes a reaccionar con acciones. Su lenguaje y estilo de comunicación son enérgicos. Al enseñar dan la impresión de ser muy aferrados a sus opiniones.",
          I: "Cuentan grandes historias para inspirar a sus alumnos. Exageran la verdad. Emocionan e inspiran a los demás con instrucciones para cambiar. Inspiran a los grupos a trabajar juntos para poner en práctica lo que han aprendido.",
          C: "Disfrutan investigando tanto como presentando los resultados. Desean una respuesta más reflexiva que activa de su audiencia. Enseñan de una forma fáctica que puede parecer fría y falta de aplicación práctica.",
          S: "Son sensibles a la receptividad de quienes los escuchan. Presentan la información calmadamente y sin emoción. Se comunican sistemáticamente y en forma práctica."
        },
        servicio: {
          D: "Se sienten atraídos a servir en organizaciones o instituciones que giren en torno a proyectos orientados a la realización de tareas. Con frecuencia sirven sin determinar cuál es el mejor uso de los recursos para ayudar a una organización. Son disciplinados al ayudar a las organizaciones.",
          I: "Influyen en los demás para que sirvan junto con ellos. Desean servir donde no haya muchas reglas qué seguir. Inspiran emoción y crean un ambiente divertido para servir. Se sienten atraídos a servir directamente a grupos dentro de una organización.",
          C: "Analizan eficazmente en qué lugar de una organización pueden servir mejor. Traen organización a los grupos donde sirven. Esperan ser informados sobre las funciones exactas de ellos mismos y de sus compañeros.",
          S: "Buscan oportunidades de servir en una organización estable y segura. Desean que se les diga qué se espera de ellos en una organización antes de comprometerse a servir. Son más productivos en el servicio cuando conocen los límites."
        },
        sabiduria: {
          D: "Se aferran a sus opiniones al discutir con los demás la manera de aplicar las verdades bíblicas a la vida diaria. Aplican las verdades bíblicas en la realización de tareas. Al aconsejar a los demás se apoyan en la palabra de Dios, no en opiniones. Son intuitivos y perceptivos cuando se trata de aplicar las verdades bíblicas a situaciones de la vida diaria.",
          I: "Inspiran a los demás a aplicar las verdades bíblicas en la vida diaria. Se concentran en las verdades bíblicas y en la palabra de Dios, y las aplican de una manera positiva y entusiasta. Procesan las verdades bíblicas sin reflexionar demasiado. Sus percepciones sobre la aplicación de las verdades bíblicas suele carecer de pasos específicos para implementarlas.",
          C: "Aplican precavida y metódicamente las verdades bíblicas a situaciones prácticas. Analizan las verdades bíblicas y las relacionan con situaciones prácticas de la vida diaria. Analizan con extremada precisión las verdades bíblicas y la forma de aplicarlas a situaciones de la vida diaria.",
          S: "Pueden tomar verdades difíciles de entender y simplificarlas para su aplicación práctica. Son capaces de llevar a la práctica las ideas brillantes de los demás. Presentan las verdades bíblicas de una forma que no ofende a los demás, por lo que son aceptadas rápidamente."
        },
        conocimiento: {
          D: "Son directos y decididos al hacer descubrimientos sobre la Biblia. Actúan guiados por lo que descubren en la palabra de Dios. Guían a los demás para que descubran cosas en la palabra de Dios y las pongan en práctica. Son arrogantes y orgullosos acerca de sus conocimientos.",
          I: "Motivan a los demás a aprender de la palabra de Dios. Usan sus conocimientos bíblicos para motivar a los demás a tomar una dirección positiva. Tienen intuiciones sobre la palabra de Dios que los impulsan a actuar. Lo nuevo los distrae fácilmente, por lo que no profundizan en el conocimiento de la palabra de Dios.",
          C: "Analizan las verdades de la Biblia y las explican a la iglesia. Organizan sus ideas de manera concisa y fácil de entender. Su pasión les hace dedicarle gran tiempo al estudio. Son propensos a querer adquirir conocimientos de las verdades bíblicas solo por adquirirlos, y no motivados por compartirlos con los demás.",
          S: "Son lo suficientemente sensibles para no herir u ofender a los demás con sus conocimientos. Son tímidos y reservados al compartir su conocimiento. Adquieren un profundo conocimiento sin ser sacudidos por las emociones. Prefieren especializar sus conocimientos en un área en particular."
        },
        dar: {
          D: "Son quienes proveen con mayor facilidad recursos económicos para los ministerios. Sin embargo, también pueden ser los primeros en retirar su apoyo cuando el impacto de su apoyo no es el que esperaban. Disfrutan apoyando proyectos importantes e innovadores que no solo mantengan la norma. Aunque no les interesan los detalles, quieren saber que quien pide los recursos ha pensado en ellos. Este tipo de personas puede caer en la trampa de creer que los recursos son más importantes que el Espíritu de Dios. Dan mucho ánimo a los ministerios a los cuales proveen recursos económicos; el reverso de la moneda es que pueden desanimarlos al retirar los recursos por motivos equivocados.",
          I: "Inspiran a los demás a apoyar causas. Lo logran mediante el ejemplo y sus palabras. Algunas veces sus contribuciones pueden ser percibidas como extravagantes y llamativas. No precisan información para involucrarse en una causa, sino que contribuyen cuando se emocionan por una necesidad relacionada con la gente. Suelen ser amigables y mostrar una gran fe.",
          C: "Suelen estar detrás de escena en lo referente a la aportación de recursos. Estas personas buscan comprometerse en tareas que a su juicio valen la pena. Si una organización no tiene finanzas sanas, estas personas ni siquiera pensarán en apoyarla. Buscan organizaciones establecidas y las apoyan fielmente",
          S: "Contribuyen a satisfacer necesidades a corto plazo donde el resultado es inmediato. Se sienten atraídos hacia quienes están en desventaja. Prefieren apoyar económicamente a personas que a proyectos. No es raro que este tipo de personas tenga también el don de la misericordia."
        }
      };
  
      return combinations[gift]?.[personalityType] || "Combinación no disponible";
    };

  return (
    <div className="max-w-[90rem] mx-auto space-y-8 px-4">
      {/* Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-[#8B2332] mb-4">
          Tus 5 Dones Espirituales Predominantes
        </h2>
        <div className="relative px-12">
          <div className="flex items-center">
            <button
              onClick={handlePrev}
              className={`absolute left-2 z-10 p-2 rounded-full bg-white shadow-md text-[#8B2332] ${
                currentCardIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="w-full">
              <div className="flex gap-6">
                {top5Gifts.slice(currentCardIndex, currentCardIndex + 3).map((gift, index) => (
                  <div 
                    key={gift.gift}
                    className="w-full p-6 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-[#8B2332]">
                        {currentCardIndex + index + 1}. {gift.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {giftDescriptions[gift.gift]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className={`absolute right-2 z-10 p-2 rounded-full bg-white shadow-md text-[#8B2332] ${
                currentCardIndex + 3 >= top5Gifts.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              disabled={currentCardIndex + 3 >= top5Gifts.length}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: Math.ceil(top5Gifts.length / 3) }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  Math.floor(currentCardIndex / 3) === idx ? 'bg-[#8B2332]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
          Distribución de tus dones
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 35]} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '10px',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [`${value}`, 'Puntuación']}
                labelStyle={{
                  color: '#1a1a1a',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}
                itemStyle={{
                  color: '#4a4a4a',
                  padding: '4px 0'
                }}
                wrapperStyle={{
                  zIndex: 100,
                  outline: 'none'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#8B2332"
                radius={[4, 4, 0, 0]}
                name="Puntuación"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] p-6 border-b">
          Análisis Detallado de tus Dones Principales
        </h3>
        <div className="grid gap-6 p-6">
          {top5Gifts.map((gift, index) => (
            <div 
              key={gift.gift}
              className={`p-6 rounded-lg ${
                expandedGift === gift.gift ? 'bg-gray-50 border' : 'bg-white border'
              }`}
            >
              <button
                onClick={() => setExpandedGift(expandedGift === gift.gift ? null : gift.gift)}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B2332] text-white font-bold">
                      {index + 1}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900">{gift.name}</h4>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-900">
                      Puntuación: {gift.value}
                    </span>
                  </div>
                  {expandedGift === gift.gift ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {expandedGift === gift.gift && (
                <div className="mt-6 space-y-6">
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="text-[#8B2332] font-semibold mb-3">Descripción:</h5>
                    <p className="text-gray-800 leading-relaxed">
                      {giftDescriptions[gift.gift]}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="text-[#8B2332] font-semibold mb-3">Referencias Bíblicas:</h5>
                    <div className="flex flex-wrap gap-2">
                      {scriptureReferences[gift.gift].map((reference) => (
                        <span 
                          key={reference}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
                        >
                          {reference}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Personality Combinations Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <button
          onClick={() => setIsPersonalityOpen(!isPersonalityOpen)}
          className="w-full p-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#8B2332]">¿Cómo se combinan mis dones con mi personalidad?</h2>
          </div>
          {isPersonalityOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>

        {isPersonalityOpen && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {top5Gifts.map((gift, index) => (
                <div key={gift.gift} className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B2332] text-white font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-[#8B2332]">
                      {gift.name}
                    </h3>
                  </div>
                  {personalityBlend.map((personalityType) => (
                    <div 
                      key={`${gift.gift}-${personalityType}`} 
                      className="bg-gray-50 p-6 rounded-lg border"
                    >
                      <h4 className="font-semibold mb-3 text-gray-900">
                        Personalidad {personalityType}
                      </h4>
                      <p className="text-gray-800 leading-relaxed">
                        {getPersonalityGiftCombination(gift.gift, personalityType)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Biblical Context */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#8B2332] mb-4">
          Nota Importante
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Este análisis destaca tus 5 dones espirituales más prominentes, otorgados por el Espíritu Santo 
          para la edificación de la iglesia y el servicio en el Reino de Dios. Aunque estos son tus dones 
          más fuertes, recuerda que:
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
          <li>Cada don es valioso y tiene un propósito específico en el cuerpo de Cristo</li>
          <li>Los dones pueden desarrollarse y fortalecerse con el tiempo y la práctica</li>
          <li>Es importante buscar orientación de líderes espirituales para maximizar el uso de tus dones</li>
          <li>La efectividad de tus dones aumenta cuando los usas en comunidad y con humildad</li>
        </ul>
      </div>
    </div>
  );
};

export default DonesResults;