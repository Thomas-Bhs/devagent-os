import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getAllVisitors } from '@/app/lib/db/visitors';

const ADMIN_EMAIL = 'bourchisthomas@gmail.com';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const visitors = await getAllVisitors();

  return new Response(JSON.stringify({ visitors }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
