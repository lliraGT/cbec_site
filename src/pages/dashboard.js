import { useState } from 'react';
import { useSession } from 'next-auth/react';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Set to true to show by default
  const { data: session } = useSession();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-monaco">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <main className={`pt-16 min-h-screen ${sidebarOpen ? 'ml-64' : ''} transition-margin duration-300`}>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome, {session.user.name}!</h1>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Dashboard content */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
                  {/* Add your dashboard content here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}