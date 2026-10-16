import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, agent, keys } = body;

  const systemPrompt = agent.systemPrompt || "You are a helpful assistant.";

  try {
    let responseText = '';

    if (agent.model.startsWith('gpt')) {
      const openai = createOpenAI({ apiKey: keys.openaiKey });
      const { text } = await generateText({
        model: openai(agent.model),
        system: systemPrompt,
        messages,
      });
      responseText = text;
    } else if (agent.model.includes('claude')) {
      const anthropic = createAnthropic({ apiKey: keys.claudeKey });
      const { text } = await generateText({
        model: anthropic(agent.model),
        system: systemPrompt,
        messages,
      });
      responseText = text;
    } else if (agent.model.includes('gemini')) {
      const google = createGoogleGenerativeAI({ apiKey: keys.geminiKey });
      const { text } = await generateText({
        model: google(agent.model),
        system: systemPrompt,
        messages,
      });
      responseText = text;
    } else if (agent.model === 'lmstudio') {
      const lmstudio = createOpenAI({
        baseURL: keys.lmStudioUrl,
        apiKey: 'not-needed'
      });
      const { text } = await generateText({
        model: lmstudio('local-model'),
        system: systemPrompt,
        messages,
      });
      responseText = text;
    }

    return NextResponse.json({ text: responseText });
  } catch (error: unknown) {
    console.error('AI Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown AI Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
