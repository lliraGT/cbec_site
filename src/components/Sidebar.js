import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Sidebar({ isOpen }) {
  const router = useRouter();
  const { data: session } = useSession();

  // Define authorized roles for MCI access
  const MCI_AUTHORIZED_ROLES = ['admin', 'elder', 'staff'];

  // Check if user has permission to see MCI
  const canAccessMCI = session?.user?.role && MCI_AUTHORIZED_ROLES.includes(session.user.role.toLowerCase());

  // Base menu items that everyone can see
  const baseMenuItems = [
    { title: 'Home', path: '/dashboard', icon: '🏠' },
    { title: 'Dones', path: '/dashboard/dones', icon: '✅' },
  ];

  // MCI menu item only for authorized roles
  const mciMenuItem = { title: 'MCI', path: '/dashboard/mci', icon: '📈' };

  // Combine menu items based on permissions
  const menuItems = canAccessMCI 
    ? [...baseMenuItems.slice(0, 1), mciMenuItem, ...baseMenuItems.slice(1)]
    : baseMenuItems;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 font-monaco ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="mt-8">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                    router.pathname === item.path ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}