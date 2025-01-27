import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const MCITrackingSystem = () => {
  const { data: session } = useSession();
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState({ meta1: [], meta2: [] });
  const [progressData, setProgressData] = useState({});
  const [activeTab, setActiveTab] = useState('meta1');
  const [loading, setLoading] = useState(true);

  // Get current date info
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/mci/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [meta1Response, meta2Response] = await Promise.all([
          fetch('/api/mci/tasks?meta=meta1'),
          fetch('/api/mci/tasks?meta=meta2')
        ]);
        const meta1Data = await meta1Response.json();
        const meta2Data = await meta2Response.json();
        
        setTasks({
          meta1: meta1Data,
          meta2: meta2Data
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Fetch progress data when user or week changes
  useEffect(() => {
    const fetchProgress = async () => {
      if (!selectedUser) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/mci?userId=${selectedUser}&week=${activeWeek}&month=${currentMonth}&year=${currentYear}`
        );
        const data = await response.json();
        
        if (data.length > 0) {
          setProgressData(data[0].taskProgress || {});
        } else {
          setProgressData({});
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [selectedUser, activeWeek, currentMonth, currentYear]);

  const handleProgressUpdate = async (taskId, newValue) => {
    if (!selectedUser) return;

    try {
      const updatedProgress = {
        ...progressData,
        [taskId]: {
          progress: newValue,
          updatedAt: new Date().toISOString(),
          completed: newValue === 100
        }
      };

      const response = await fetch('/api/mci', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          week: activeWeek,
          month: currentMonth,
          year: currentYear,
          taskProgress: updatedProgress
        }),
      });

      if (response.ok) {
        setProgressData(updatedProgress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Group tasks by measure
  const groupedTasks = tasks[activeTab].reduce((acc, task) => {
    if (!acc[task.measure]) {
      acc[task.measure] = [];
    }
    acc[task.measure].push(task);
    return acc;
  }, {});

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">MCI Tracking System</h2>
        <p className="text-gray-600">Week {activeWeek} - {currentMonth}/{currentYear}</p>
      </div>

      <div className="mb-4 flex space-x-2">
        {[1, 2, 3, 4].map(week => (
          <button
            key={week}
            className={`px-4 py-2 rounded ${
              activeWeek === week 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveWeek(week)}
          >
            Week {week}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-6 py-2 ${activeTab === 'meta1' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab('meta1')}
          >
            Meta 1
          </button>
          <button
            className={`px-6 py-2 ${activeTab === 'meta2' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab('meta2')}
          >
            Meta 2
          </button>
        </div>

        <div className="mt-6">
          {Object.entries(groupedTasks).map(([measure, measureTasks]) => (
            <div key={measure} className="mb-8 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-4">{measure}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Task</th>
                      <th className="px-4 py-2 text-left">Target</th>
                      <th className="px-4 py-2 text-left">Progress</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measureTasks.map((task) => (
                      <tr key={task.taskId} className="border-t">
                        <td className="px-4 py-2">{task.name}</td>
                        <td className="px-4 py-2">{task.target} {task.unit}</td>
                        <td className="px-4 py-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ 
                                width: `${progressData[task.taskId]?.progress || 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 mt-1">
                            {progressData[task.taskId]?.progress || 0}%
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className={`px-3 py-1 rounded ${
                              selectedUser 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                            onClick={() => handleProgressUpdate(
                              task.taskId,
                              Math.min(100, (progressData[task.taskId]?.progress || 0) + 20)
                            )}
                            disabled={!selectedUser}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold mb-4">Select User</h3>
        <div className="flex flex-wrap gap-2">
          {users.map(user => (
            <button
              key={user._id}
              className={`px-4 py-2 rounded ${
                selectedUser === user._id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedUser(user._id)}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MCITrackingSystem;