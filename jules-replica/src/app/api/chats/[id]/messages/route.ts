import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const messages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(messages);
  } catch (error: unknown) {
    console.error('Error fetching messages:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch messages', details: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { role, content, agentName } = body;

    const message = await prisma.message.create({
      data: {
        chatId: id,
        role,
        content,
        agentName,
      },
    });

    await prisma.chat.update({
      where: { id: id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error: unknown) {
    console.error('Error creating message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create message', details: errorMessage }, { status: 500 });
  }
}
