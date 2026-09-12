import { NextResponse } from 'next/server';
import { getGeminiAIService } from '@/services/GeminiAIService';

export async function POST(request) {
  try {
    const { competencyName, level } = await request.json();

    if (!competencyName) {
      return NextResponse.json(
        { error: 'competencyName is required' },
        { status: 400 }
      );
    }

    const aiService = getGeminiAIService();
    const result = await aiService.generateAssessment({
      competencyName,
      level: level || 'Intermediate'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Assessment API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
