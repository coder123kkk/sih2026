import { NextResponse } from 'next/server';
import { getRecommendationService } from '@/services/RecommendationService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'USR001';

    const recService = getRecommendationService();
    const recommendations = await recService.getAllRecommendations(userId);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('[API] Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: error.message },
      { status: 500 }
    );
  }
}
