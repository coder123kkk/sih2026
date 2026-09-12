import { NextResponse } from 'next/server';
import { getRecommendationService } from '@/services/RecommendationService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const competencyId = searchParams.get('competencyId');
    const competencyName = searchParams.get('competencyName');
    const userId = searchParams.get('userId') || 'USR001';

    const currentScore = searchParams.get('currentScore');
    const requiredScore = searchParams.get('requiredScore');
    const gapScore = searchParams.get('gapScore');
    const gapStatus = searchParams.get('gapStatus');

    const service = getRecommendationService();
    const data = await service.getRecommendationsForCompetency({
      competencyId,
      competencyName,
      userId,
      currentScore,
      requiredScore,
      gapScore,
      gapStatus
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Competency recommendation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
