import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getOrCreateVisitor, incrementMessageCount } from './db/visitors';

export async function checkRateLimit(req?: Request): Promise<{
  limited: boolean;
  message?: string;
}> {
  // Bypass for sub-agent calls from the orchestrator pipeline — quota is already
  // checked by checkAgentAccess on the orchestrator entry point.
  if (req?.headers.get('x-internal-call') === 'orchestrator') {
    return { limited: false };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      limited: true,
      message: 'You must be signed in to use DevAgent OS.',
    };
  }

  const { email, name, image } = session.user;
  await getOrCreateVisitor(email, name || 'Anonymous', image || '');
  await incrementMessageCount(email);

  return { limited: false };
}