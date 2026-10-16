import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const agents = await prisma.agent.findMany();
  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, model, systemPrompt } = body;

  const agent = await prisma.agent.create({
    data: { name, model, systemPrompt },
  });

  return NextResponse.json(agent);
}
