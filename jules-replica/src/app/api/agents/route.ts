import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const agents = await prisma.agent.findMany();
    return NextResponse.json(agents);
  } catch (error: unknown) {
    console.error('Error fetching agents:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch agents', details: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, model, systemPrompt } = body;

    if (!name || !model || !systemPrompt) {
      return NextResponse.json({ error: 'Missing required fields: name, model, systemPrompt' }, { status: 400 });
    }

    const agent = await prisma.agent.create({
      data: { name, model, systemPrompt },
    });

    return NextResponse.json(agent);
  } catch (error: unknown) {
    console.error('Error creating agent:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create agent', details: errorMessage }, { status: 500 });
  }
}
