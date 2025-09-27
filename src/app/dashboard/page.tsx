'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Tenant, Note } from '@/lib/types';
import { PlusCircle, Edit, Trash2, LogOut, Crown } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const tenantData = localStorage.getItem('tenant');

    if (!token || !userData || !tenantData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setTenant(JSON.parse(tenantData));
    fetchNotes();
  }, [router]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Fetch notes error:', error);
      setError('Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                {user?.email} • {tenant?.name}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900">Welcome to Notes Dashboard</h2>
              <p className="text-gray-500 mt-2">Your notes will appear here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
