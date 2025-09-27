'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // For now, just simulate login
    setTimeout(() => {
      if (email && password === 'password') {
        // Simulate successful login
        const mockUser = {
          id: 1,
          email: email,
          role: 'admin',
          tenantId: 1,
          createdAt: new Date().toISOString()
        };
        
        const mockTenant = {
          id: 1,
          name: email.includes('acme') ? 'Acme Corporation' : 'Globex Corporation',
          slug: email.includes('acme') ? 'acme' : 'globex',
          plan: 'free' as const,
          createdAt: new Date().toISOString()
        };

        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('tenant', JSON.stringify(mockTenant));
        
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Use password: "password"');
      }
      setIsLoading(false);
    }, 1000);
  };

  const testAccounts = [
    { email: 'admin@acme.test', role: 'Admin', tenant: 'Acme' },
    { email: 'user@acme.test', role: 'Member', tenant: 'Acme' },
    { email: 'admin@globex.test', role: 'Admin', tenant: 'Globex' },
    { email: 'user@globex.test', role: 'Member', tenant: 'Globex' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Multi-tenant SaaS Notes Application
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test Accounts</h3>
          <p className="text-sm text-gray-600 mb-4">All passwords: <strong>password</strong></p>
          <div className="space-y-2">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => setEmail(account.email)}
                className="w-full text-left p-3 border rounded hover:bg-gray-50"
              >
                <div className="font-medium text-sm">{account.email}</div>
                <div className="text-xs text-gray-500">
                  {account.role} • {account.tenant} Corporation
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
