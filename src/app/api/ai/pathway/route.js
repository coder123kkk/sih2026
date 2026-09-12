import { NextResponse } from 'next/server';
import { getGeminiAIService } from '@/services/GeminiAIService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { currentRole, targetRole, department, skillGaps, targetTimeline } = body;

    const aiService = getGeminiAIService();
    const result = await aiService.generateCareerPathway({
      currentRole: currentRole || 'Statistical Officer',
      targetRole: targetRole || 'Deputy Director (National Accounts)',
      department: department || 'MoSPI',
      skillGaps: skillGaps || [],
      targetTimeline: targetTimeline || '12 Months'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Pathway API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
