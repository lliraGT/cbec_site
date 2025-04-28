// src/pages/dashboard/descubre/admin.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { AlertCircle, Trash2, RefreshCw, Check, X, Search, Filter } from 'lucide-react';

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Define authorized roles
  const AUTHORIZED_ROLES = ['admin', 'staff'];

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch invitations
  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/all-invitations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }
      
      const data = await response.json();
      setInvitations(data.invitations || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete invitation 
  const deleteInvitation = async (invitationId) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/invitations/${invitationId}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete invitation');
      }

      // Remove the deleted invitation from the list
      setInvitations(invitations.filter(inv => inv._id !== invitationId));
      setShowDeleteConfirm(false);
      setInvitationToDelete(null);
    } catch (err) {
      console.error('Error deleting invitation:', err);
      setError(`Error deleting invitation: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role && AUTHORIZED_ROLES.includes(session.user.role.toLowerCase())) {
        fetchInvitations();
      } else {
        router.push('/dashboard');
      }
    } else if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to handle invitation deletion
  const handleDeleteClick = (invitation) => {
    setInvitationToDelete(invitation);
    setShowDeleteConfirm(true);
  };

  // Filter invitations based on search term and status filter
  const filteredInvitations = invitations.filter(invitation => {
    // Filter by search term (email)
    const matchesSearch = invitation.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || invitation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge styles
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'revoked':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if test results exist for an invitation
  const hasTestResults = (tests) => {
    return tests && tests.length > 0;
  };

  // Render loading state
  if (isLoading && invitations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B2332] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando invitaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-monaco">
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`pt-16 min-h-screen ${sidebarOpen ? 'ml-64' : ''} transition-margin duration-300`}>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold text-[#8B2332]">Administración de Invitaciones</h1>
              <button 
                onClick={fetchInvitations} 
                className="flex items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-300 text-red-700 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-[#8B2332] focus:border-[#8B2332] sm:text-sm"
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-44 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-700 focus:outline-none focus:ring-[#8B2332] focus:border-[#8B2332] sm:text-sm"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="completed">Completados</option>
                    <option value="revoked">Revocados</option>
                    <option value="expired">Expirados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invitations Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enviada</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvitations.length > 0 ? (
                      filteredInvitations.map((invitation) => (
                        <tr key={invitation._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invitation.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invitation.type === 'testInvitation' ? 'Tests' : 'Usuario'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invitation.type === 'testInvitation' && invitation.tests ? (
                              <div className="flex flex-wrap gap-1">
                                {invitation.tests.map(test => (
                                  <span key={test} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {test === 'personalidad' ? 'Personalidad' :
                                     test === 'dones' ? 'Dones' :
                                     test === 'habilidades' ? 'Habilidades' :
                                     test === 'pasion' ? 'Pasión' :
                                     test === 'experiencia' ? 'Experiencia' : test}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeStyle(invitation.status)}`}>
                              {invitation.status === 'pending' ? 'Pendiente' :
                               invitation.status === 'completed' ? 'Completado' :
                               invitation.status === 'revoked' ? 'Revocado' :
                               invitation.status === 'expired' ? 'Expirado' : invitation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(invitation.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(invitation.expiresAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {invitation.status === 'pending' && (
                              <button
                                onClick={() => handleDeleteClick(invitation)}
                                className="text-red-600 hover:text-red-900 focus:outline-none"
                                title="Eliminar invitación"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm || statusFilter !== 'all'
                            ? 'No se encontraron invitaciones con los filtros aplicados.'
                            : 'No hay invitaciones disponibles.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-sm text-gray-500 mb-4">
              ¿Estás seguro de que deseas eliminar esta invitación enviada a <span className="font-medium">{invitationToDelete?.email}</span>?
              {hasTestResults(invitationToDelete?.tests) && (
                <span className="block mt-2 text-red-600">
                  Si hay resultados de tests asociados a esta invitación, también serán eliminados.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setInvitationToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteInvitation(invitationToDelete._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}