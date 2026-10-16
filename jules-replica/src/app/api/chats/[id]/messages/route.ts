import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const messages = await prisma.message.findMany({
    where: { chatId: id },
    orderBy: { createdAt: 'asc' }
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
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
}
