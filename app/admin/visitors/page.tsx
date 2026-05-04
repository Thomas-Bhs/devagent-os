'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ADMIN_EMAIL = 'bourchisthomas@gmail.com';

interface Visitor {
  email: string;
  name: string;
  image: string;
  messageCount: number;
  firstVisit: string;
  lastVisit: string;
  isBlocked: boolean;
}

export default function AdminVisitors() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // ← attendre que la session soit chargée

    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    if (session?.user?.email !== ADMIN_EMAIL) {
      router.push('/');
      return;
    }
    fetchVisitors();
  }, [session, status]);

  const fetchVisitors = async () => {
    const res = await fetch('/api/admin/visitors');
    const data = await res.json();
    setVisitors(data.visitors || []);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-950'>
        <p className='text-green-400 font-mono'>Loading visitors...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-950 p-8'>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-white mb-1'>Visitors</h1>
          <p className='text-gray-400 text-sm'>{visitors.length} total visitors</p>
        </div>

        <div className='bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-800'>
                <th className='text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                  Visitor
                </th>
                <th className='text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                  Email
                </th>
                <th className='text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                  Messages
                </th>
                <th className='text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                  First visit
                </th>
                <th className='text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                  Last visit
                </th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor, i) => (
                <tr
                  key={visitor.email}
                  className='border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors'
                >
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      {visitor.image ? (
                        <Image
                          src={visitor.image}
                          alt={visitor.name}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400'>
                          {visitor.name.slice(0, 1)}
                        </div>
                      )}
                      <span className='text-sm text-white font-medium'>{visitor.name}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-sm text-gray-300'>{visitor.email}</span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <div className='w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden'>
                        <div
                          className='h-full rounded-full transition-all'
                          style={{
                            width: `${Math.min((visitor.messageCount / 20) * 100, 100)}%`,
                            background: visitor.messageCount >= 20 ? '#ef4444' : '#22c55e',
                          }}
                        />
                      </div>
                      <span
                        className='text-sm font-mono'
                        style={{
                          color: visitor.messageCount >= 20 ? '#ef4444' : '#22c55e',
                        }}
                      >
                        {visitor.messageCount}/20
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-sm text-gray-400'>
                      {new Date(visitor.firstVisit).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-sm text-gray-400'>
                      {new Date(visitor.lastVisit).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visitors.length === 0 && (
            <div className='px-6 py-12 text-center'>
              <p className='text-gray-500 text-sm'>No visitors yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
