import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(chats);
  } catch (error: unknown) {
    console.error('Error fetching chats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch chats', details: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, repoPath, branch } = body;

    const chat = await prisma.chat.create({
      data: { title, repoPath, branch },
    });

    return NextResponse.json(chat);
  } catch (error: unknown) {
    console.error('Error creating chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create chat', details: errorMessage }, { status: 500 });
  }
}
