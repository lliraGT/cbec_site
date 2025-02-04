import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const MCITrackingSystem = () => {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [activeTab, setActiveTab] = useState('scoreboard');
  const [commitments, setCommitments] = useState({});
  
  const goals = [
    {
      id: 1,
      title: "ENFOCARNOS EN PERSONAS Y NO SOLAMENTE EN LAS ACTIVIDADES",
      leadMeasures: [
        {
          id: "1.1",
          title: "Predicando y enseñando la palabra de Dios",
          tasks: [
            { id: "1.1.1", description: "Compartir al menos una reflexión bíblica semanal" }
          ]
        },
        {
          id: "1.2",
          title: "Comunicarse con otros",
          tasks: [
            { id: "1.2.1", description: "Realizar al menos un contacto intencional de comunicación a la semana" }
          ]
        },
        {
          id: "1.3",
          title: "Orar por y con otros",
          tasks: [
            { id: "1.3.1", description: "Realizar al menos una oración semanal" }
          ]
        },
        {
          id: "1.4",
          title: "Ofrecer corrección y disciplina con amor",
          tasks: [
            { id: "1.4.1", description: "Realizar un informe semanal comunicando acciones que requieren corrección" },
            { id: "1.4.2", description: "Ejecutar semanalmente acciones de corrección para el 100% de casos" }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "PROMOVER CULTURA DONDE EL SERVICIO ES UNA FORMA DE VIDA",
      leadMeasures: [
        {
          id: "2.1",
          title: "Ofrecer apoyo material",
          tasks: [
            { id: "2.1.1", description: "Realizar un informe semanal comunicando necesidades detectadas" },
            { id: "2.1.2", description: "Cubrir semanalmente el 100% de las necesidades reportadas" }
          ]
        },
        {
          id: "2.2",
          title: "Fomentar la unidad y el amor en la comunidad",
          tasks: [
            { id: "2.2.1", description: "Realizar al menos una convivencia cada seis meses" }
          ]
        }
      ]
    }
  ];

  const teamMembers = [
    "Pastor Juan",
    "Diacono Pedro",
    "Ministro María",
    "Líder Ana",
    "Coordinador Carlos",
    "Servidor David",
    "Maestra Ruth",
    "Asistente Sara",
    "Voluntario José",
    "Consejero Daniel"
  ];

  function getCurrentWeek() {
    const now = new Date();
    // Adjust to previous Tuesday if not Tuesday
    const currentDay = now.getDay();
    const daysToTuesday = (currentDay >= 2) ? currentDay - 2 : currentDay + 5;
    const tuesday = new Date(now);
    tuesday.setDate(now.getDate() - daysToTuesday);
    
    // Calculate the week number starting from the first Tuesday of the year
    const firstDayOfYear = new Date(tuesday.getFullYear(), 0, 1);
    const firstTuesday = new Date(firstDayOfYear);
    firstTuesday.setDate(firstDayOfYear.getDate() + (2 - firstDayOfYear.getDay() + 7) % 7);
    
    const diffInTime = tuesday.getTime() - firstTuesday.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    const weekNumber = Math.floor(diffInDays / 7) + 1;
    
    return `${tuesday.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
  }

  function getWeekDates(weekStr) {
    const [year, week] = weekStr.split('-W').map(Number);
    
    // Find first Tuesday of the year
    const firstDayOfYear = new Date(year, 0, 1);
    const firstTuesday = new Date(firstDayOfYear);
    firstTuesday.setDate(firstDayOfYear.getDate() + (2 - firstDayOfYear.getDay() + 7) % 7);
    
    // Calculate start of selected week (Tuesday)
    const startDate = new Date(firstTuesday);
    startDate.setDate(firstTuesday.getDate() + (week - 1) * 7);
    
    // Calculate end date (Monday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return {
      start: startDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      end: endDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    };
  }

  function handleCommitmentToggle(memberId, taskId, completed) {
    setCommitments(prev => ({
      ...prev,
      [selectedWeek]: {
        ...prev[selectedWeek],
        [memberId]: {
          ...prev[selectedWeek]?.[memberId],
          [taskId]: completed
        }
      }
    }));
  }

  function calculateProgress(memberId) {
    if (!commitments[selectedWeek]?.[memberId]) return 0;
    const memberCommitments = commitments[selectedWeek][memberId];
    const totalTasks = getAllTaskIds().length;
    const completedTasks = Object.values(memberCommitments).filter(v => v).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }

  function getAllTaskIds() {
    return goals.flatMap(goal =>
      goal.leadMeasures.flatMap(measure =>
        measure.tasks.map(task => task.id)
      )
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">MCI Tracking System</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-40 px-3 py-2 border rounded-md bg-white text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {selectedWeek && (
              <span className="text-gray-600 text-sm">
                ({getWeekDates(selectedWeek).start} - {getWeekDates(selectedWeek).end})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'scoreboard' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={() => setActiveTab('scoreboard')}
          >
            Scoreboard
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Detailed View
          </button>
        </div>
      </div>

      {activeTab === 'scoreboard' && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Team Member</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Progress</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map(member => {
                const progress = calculateProgress(member);
                return (
                  <tr key={member}>
                    <td className="px-6 py-4 text-sm text-gray-900">{member}</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 mt-1">{progress}%</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {progress === 100 ? (
                        <span className="text-green-600">Completed</span>
                      ) : (
                        <span className="text-yellow-600">In Progress</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {teamMembers.map(member => (
            <div key={member} className="bg-white rounded-lg border p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{member}</h3>
              {goals.map(goal => (
                <div key={goal.id} className="mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">{goal.title}</h4>
                  {goal.leadMeasures.map(measure => (
                    <div key={measure.id} className="ml-4 mb-4">
                      <h5 className="font-medium mb-2 text-gray-700">{measure.title}</h5>
                      {measure.tasks.map(task => (
                        <div key={task.id} className="ml-4 flex items-center gap-2 mb-2">
                          <button
                            className="p-1 hover:bg-gray-100 rounded-full"
                            onClick={() => handleCommitmentToggle(
                              member,
                              task.id,
                              !commitments[selectedWeek]?.[member]?.[task.id]
                            )}
                          >
                            {commitments[selectedWeek]?.[member]?.[task.id] ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          <span className="text-sm text-gray-700">{task.description}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MCITrackingSystem;