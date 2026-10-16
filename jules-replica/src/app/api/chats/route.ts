import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const chats = await prisma.chat.findMany({
    orderBy: { updatedAt: 'desc' }
  });
  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, repoPath, branch } = body;

  const chat = await prisma.chat.create({
    data: { title, repoPath, branch },
  });

  return NextResponse.json(chat);
}
