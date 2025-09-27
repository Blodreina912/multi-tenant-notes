'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Tenant, Note } from '../../lib/types';
import { PlusCircle, Trash2, LogOut, Crown } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
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
        headers: { 'Authorization': `Bearer ${token}` },
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

  const createNote = async () => {
    if (!newNote.title.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });

      const data = await response.json();
      if (data.success) {
        setNotes([data.data, ...notes]);
        setNewNote({ title: '', content: '' });
        setIsCreating(false);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Create note error:', error);
      setError('Failed to create note');
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setNotes(notes.filter(note => note.id !== id));
        setError('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Delete note error:', error);
      setError('Failed to delete note');
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

  const canCreateNote = tenant?.plan === 'pro' || notes.length < 3;
  const showUpgradePrompt = tenant?.plan === 'free' && notes.length >= 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notes Dashboard</h1>
              <p className="text-sm text-gray-600">
                {user?.email} • {user?.role} • {tenant?.name}
                {tenant?.plan === 'pro' && <Crown className="inline h-4 w-4 ml-2 text-yellow-500" />}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {tenant?.plan === 'free' && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                  Free Plan ({notes.length}/3)
                </span>
              )}
              <button onClick={logout} className="flex items-center text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
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

          {showUpgradePrompt && user?.role === 'admin' && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900">Upgrade to Pro</h3>
              <p className="text-blue-700 mt-1">
                You've reached your note limit. Upgrade to Pro for unlimited notes.
              </p>
            </div>
          )}

          <div className="mb-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {!isCreating ? (
                <button
                  onClick={() => setIsCreating(true)}
                  disabled={!canCreateNote}
                  className="flex items-center text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create New Note
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button onClick={createNote} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Save
                    </button>
                    <button
                      onClick={() => { setIsCreating(false); setNewNote({ title: '', content: '' }); }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500">No notes yet. Create your first note!</p>
                </div>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                        <p className="mt-1 text-gray-600">{note.content}</p>
                        <p className="mt-2 text-xs text-gray-400">
                          Created: {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
