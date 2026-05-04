import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getOrCreateVisitor, incrementMessageCount, isRateLimited } from './db/visitors';

export async function checkRateLimit(req?: Request): Promise<{
  limited: boolean;
  message?: string;
}> {
  // Bypass for internal calls from the orchestrator
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

  await getOrCreateVisitor(
    email,
    name || 'Anonymous',
    image || ''
  );

  const limited = await isRateLimited(email);

  if (limited) {
    return {
      limited: true,
      message: 'You have reached the demo limit of 20 messages. Contact me at thomas@email.com to discuss your project!',
    };
  }

  await incrementMessageCount(email);

  return { limited: false };
}