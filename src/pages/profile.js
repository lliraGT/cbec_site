import { useSession, getSession } from 'next-auth/react';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-monaco">
      <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`pt-16 min-h-screen ${sidebarOpen ? 'ml-64' : ''} transition-margin duration-300`}>
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Perfil</h1>
            
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">Información</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-700">Nombre</label>
                    <div className="mt-1 text-lg font-medium text-gray-900">{session?.user?.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Email</label>
                    <div className="mt-1 text-lg text-blue-600">{session?.user?.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Rol</label>
                    <div className="mt-1">
                      <span className="px-3 py-1 text-sm bg-[#8B2332] text-white rounded-md">
                        {session?.user?.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session }
  };
}