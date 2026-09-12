import { NextResponse } from 'next/server';
import { getGeminiAIService } from '@/services/GeminiAIService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, userContext = {}, userId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    const resolvedUserId = userId || userContext.userId || userContext.id || 'USR001';
    const enrichedContext = {
      ...userContext,
      userId: resolvedUserId
    };

    const aiService = getGeminiAIService();
    const result = await aiService.chatWithCopilot(messages, enrichedContext);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
