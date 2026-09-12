import { NextResponse } from 'next/server';
import { getGeminiAIService } from '@/services/GeminiAIService';

export async function POST(request) {
  try {
    const { messages, userContext } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    const aiService = getGeminiAIService();
    const result = await aiService.chatWithCopilot(messages, userContext || {});

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
