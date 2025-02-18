// src/pages/dashboard/settings/users.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';

// Toggle Switch Component
const ToggleSwitch = ({ isActive, onToggle, isAdmin }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full 
        ${isActive ? 'bg-burgundy-600' : 'bg-gray-200'}
        ${isAdmin ? 'cursor-pointer hover:opacity-90' : 'cursor-not-allowed opacity-50'}`}
      disabled={!isAdmin}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
          ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
};

export default function UsersManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  // Only admin and staff can access settings
  const AUTHORIZED_ROLES = ['admin', 'staff'];

  // Role display mapping
  const ROLE_LABELS = {
    'user': 'Usuario',
    'staff': 'Equipo Ministerial',
    'elder': 'Anciano',
    'admin': 'Administrador',
  };

  useEffect(() => {
    if (session?.user?.role && AUTHORIZED_ROLES.includes(session.user.role.toLowerCase())) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      setMessage('');
      // If trying to change own role from admin, show warning
      if (userId === session.user.id && newRole !== 'admin') {
        if (!confirm('Warning: Changing your own role from admin will remove your administrative privileges. Are you sure?')) {
          fetchUsers(); // Reset the select to previous value
          return;
        }
      }

      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setMessage('User role updated successfully');
        
        // If admin changed their own role, redirect to dashboard
        if (userId === session.user.id && newRole !== 'admin') {
          router.push('/dashboard');
        }
      } else {
        setMessage(data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setMessage('An error occurred while updating user role');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setMessage('');
      // If trying to deactivate own account, show warning
      if (userId === session.user.id && currentStatus) {
        if (!confirm('Warning: Deactivating your own account will sign you out. Are you sure?')) {
          return;
        }
      }

      const endpoint = currentStatus ? 'deactivate' : 'activate';
      const response = await fetch(`/api/users/${userId}/${endpoint}`, {
        method: 'PUT',
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setMessage(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        
        // If admin deactivated their own account, redirect to login
        if (userId === session.user.id && currentStatus) {
          router.push('/auth/login');
        }
      } else {
        setMessage(data.error || `Failed to ${currentStatus ? 'deactivate' : 'activate'} user`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('An error occurred while updating user status');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not authorized
  if (!session || !session.user?.role || !AUTHORIZED_ROLES.includes(session.user.role.toLowerCase())) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-monaco">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`pt-16 min-h-screen ${sidebarOpen ? 'ml-64' : ''} transition-margin duration-300 bg-white`}>
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-burgundy-700 mb-8">User Management</h1>

            {message && (
              <div className={`p-4 rounded-md mb-6 ${
                message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-burgundy-600 mx-auto"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.user.role === 'admin' ? (
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm py-1 px-2 bg-white border focus:border-burgundy-500 focus:ring-burgundy-500"
                              >
                                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              ROLE_LABELS[user.role] || user.role
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <ToggleSwitch
                                isActive={user.active}
                                onToggle={() => handleToggleUserStatus(user._id, user.active)}
                                isAdmin={session.user.role === 'admin'}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No users found</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}