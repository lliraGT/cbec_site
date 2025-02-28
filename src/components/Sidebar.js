// src/components/Sidebar.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Sidebar({ isOpen }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [descubreOpen, setDescubreOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Define authorized roles for MCI access
  const MCI_AUTHORIZED_ROLES = ['admin', 'elder', 'staff'];
  const SETTINGS_AUTHORIZED_ROLES = ['admin', 'staff'];
  const DESCUBRE_AUTHORIZED_ROLES = ['admin', 'elder', 'staff', 'user'];

  // Check user permissions
  const canAccessMCI = session?.user?.role && MCI_AUTHORIZED_ROLES.includes(session.user.role.toLowerCase());
  const canAccessSettings = session?.user?.role && SETTINGS_AUTHORIZED_ROLES.includes(session.user.role.toLowerCase());
  const canAccessDescubre = session?.user?.role && DESCUBRE_AUTHORIZED_ROLES.includes(session.user.role.toLowerCase());

  // Base menu items
  const baseMenuItems = [
    { title: 'Home', path: '/dashboard', icon: '🏠' },
  ];

  // Conditional menu items
  const mciMenuItem = { title: 'MCI', path: '/dashboard/mci', icon: '📈' };
  const descubreMenuItems = [
    { title: 'Dones', path: '/dashboard/descubre/dones', icon: '✅' },
    { title: 'Resultados', path: '/dashboard/descubre/resultados', icon: '📊' }
  ];
  const settingsItems = [
    { title: 'Invite Users', path: '/dashboard/settings/invite', icon: '📧' },
    { title: 'Users', path: '/dashboard/settings/users', icon: '👥' },
  ];

  // Combine menu items based on permissions
  const menuItems = [
    ...baseMenuItems,
    ...(canAccessMCI ? [mciMenuItem] : []),
    { 
      title: 'Descubre', 
      icon: '🔍', 
      submenu: canAccessDescubre ? descubreMenuItems : [] 
    },
    { 
      title: 'Settings', 
      icon: '⚙️', 
      submenu: canAccessSettings ? settingsItems : [] 
    }
  ];

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
              <li key={item.title}>
                {item.submenu ? (
                  // Submenu handling
                  <>
                    <button
                      onClick={() => {
                        if (item.title === 'Descubre') setDescubreOpen(!descubreOpen);
                        if (item.title === 'Settings') setSettingsOpen(!settingsOpen);
                      }}
                      className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                        router.pathname.startsWith(item.title === 'Descubre' ? '/dashboard/descubre' : '/dashboard/settings') 
                          ? 'bg-gray-100' 
                          : ''
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                      <span className={`ml-auto transform transition-transform duration-200 ${
                        item.title === 'Descubre' 
                          ? (descubreOpen ? 'rotate-180' : '') 
                          : (settingsOpen ? 'rotate-180' : '')
                      }`}>
                        ▼
                      </span>
                    </button>

                    {/* Submenu for Descubre */}
                    {item.title === 'Descubre' && (
                      <ul className={`mt-2 ${descubreOpen ? 'block' : 'hidden'}`}>
                        {item.submenu.map((subitem) => (
                          <li key={subitem.path}>
                            <Link
                              href={subitem.path}
                              className={`flex items-center pl-12 pr-6 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                router.pathname === subitem.path ? 'bg-gray-100' : ''
                              }`}
                            >
                              <span className="mr-3">{subitem.icon}</span>
                              {subitem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Submenu for Settings */}
                    {item.title === 'Settings' && (
                      <ul className={`mt-2 ${settingsOpen ? 'block' : 'hidden'}`}>
                        {item.submenu.map((subitem) => (
                          <li key={subitem.path}>
                            <Link
                              href={subitem.path}
                              className={`flex items-center pl-12 pr-6 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                router.pathname === subitem.path ? 'bg-gray-100' : ''
                              }`}
                            >
                              <span className="mr-3">{subitem.icon}</span>
                              {subitem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // Regular menu item
                  <Link
                    href={item.path}
                    className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                      router.pathname === item.path ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}