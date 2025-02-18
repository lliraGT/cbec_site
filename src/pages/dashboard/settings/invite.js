// src/pages/dashboard/settings/invite.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';

export default function InviteUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Only admin and staff can access settings
  const AUTHORIZED_ROLES = ['admin', 'staff'];

  useEffect(() => {
    if (session?.user?.role && AUTHORIZED_ROLES.includes(session.user.role.toLowerCase())) {
      fetchPendingInvitations();
    }
  }, [session]);

  const fetchPendingInvitations = async () => {
    try {
      const response = await fetch('/api/invitations/pending');
      const data = await response.json();
      setPendingInvitations(data.invitations || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Invitation sent successfully!');
        setEmail('');
        setRole('user');
        fetchPendingInvitations(); // Refresh the list
      } else {
        setMessage(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      setMessage('An error occurred while sending the invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeInvitation = async (invitationId) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/revoke`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchPendingInvitations(); // Refresh the list
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to revoke invitation');
      }
    } catch (error) {
      setMessage('An error occurred while revoking the invitation');
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
            <h1 className="text-2xl font-semibold text-burgundy-700 mb-8">Invite Users</h1>
            
            {/* Invite New User Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-medium text-burgundy-700 mb-6">Invite New User</h2>
              
              <form onSubmit={handleInvite} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 bg-white border focus:border-burgundy-500 focus:ring-burgundy-500"
                    required
                  />
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 bg-white border focus:border-burgundy-500 focus:ring-burgundy-500 text-gray-900"
                    >
                        <option value="user" className="py-2">Usuario</option>
                        <option value="staff" className="py-2">Equipo Ministerial</option>
                        <option value="elder" className="py-2">Anciano</option>
                        {session.user.role === 'admin' && (
                        <option value="admin" className="py-2">Administrador</option>
                        )}
                    </select>
                </div>

                {message && (
                  <div className={`p-4 rounded-md ${
                    message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-burgundy-600 hover:bg-burgundy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500 disabled:bg-burgundy-300"
                >
                  {isLoading ? 'Sending...' : 'Send Invitation'}
                </button>
              </form>
            </div>

            {/* Pending Invitations Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-burgundy-700 mb-6">Pending Invitations</h2>
              
              {isLoadingInvitations ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-burgundy-600 mx-auto"></div>
                </div>
              ) : pendingInvitations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingInvitations.map((invitation) => (
                        <tr key={invitation._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invitation.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invitation.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invitation.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invitation.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleRevokeInvitation(invitation._id)}
                              className="text-burgundy-600 hover:text-burgundy-900"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending invitations</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}