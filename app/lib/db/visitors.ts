import clientPromise from '../mongodb';

const RATE_LIMIT = 20;
const ADMIN_EMAIL = 'bourchisthomas@gmail.com';

export interface Visitor {
  email: string;
  name: string;
  image: string;
  messageCount: number;
  firstVisit: Date;
  lastVisit: Date;
  isBlocked: boolean;
}

async function getCollection() {
  const client = await clientPromise;
  const db = client.db('agent-dev');
  return db.collection<Visitor>('visitors');
}

export async function getOrCreateVisitor(
  email: string,
  name: string,
  image: string
): Promise<Visitor> {
  const col = await getCollection();

  const visitor = await col.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        name,
        image,
        messageCount: 0,
        firstVisit: new Date(),
        isBlocked: false,
      },
      $set: { lastVisit: new Date() },
    },
    { upsert: true, returnDocument: 'after' }
  );

  return visitor!;
}

export async function incrementMessageCount(email: string): Promise<number> {
  const col = await getCollection();

  const result = await col.findOneAndUpdate(
    { email },
    { $inc: { messageCount: 1 }, $set: { lastVisit: new Date() } },
    { returnDocument: 'after' }
  );

  return result!.messageCount;
}

export async function isRateLimited(email: string): Promise<boolean> {
  if (email === ADMIN_EMAIL) return false;

  const col = await getCollection();
  const visitor = await col.findOne({ email });

  if (!visitor) return false;
  return visitor.messageCount >= RATE_LIMIT;
}

export async function getAllVisitors(): Promise<Visitor[]> {
  const col = await getCollection();
  return col.find({}).sort({ lastVisit: -1 }).toArray();
}