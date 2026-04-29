import { NextResponse } from 'next/server';
import { getConversation, deleteConversation } from '@/app/lib/db/conversations';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conversation = await getConversation(id);
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Conversation GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteConversation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Conversation DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}
