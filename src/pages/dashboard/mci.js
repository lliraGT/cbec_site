import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import MCITrackingSystem from '@/components/MCITrackingSystem';

export default function MCIPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Define authorized roles
  const MCI_AUTHORIZED_ROLES = ['admin', 'elder', 'staff'];

  useEffect(() => {
    // Redirect unauthorized users
    if (status !== 'loading' && (!session?.user?.role || 
        !MCI_AUTHORIZED_ROLES.includes(session.user.role.toLowerCase()))) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state while checking authorization
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or unauthorized, don't render anything (redirect will handle it)
  if (!session || !MCI_AUTHORIZED_ROLES.includes(session.user.role.toLowerCase())) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 font-monaco">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`pt-16 min-h-screen ${sidebarOpen ? 'ml-64' : ''} transition-margin duration-300`}>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">MCI Tracking System</h1>
            <MCITrackingSystem />
          </div>
        </div>
      </main>
    </div>
  );
}