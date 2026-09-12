import { NextResponse } from 'next/server';
import { getCompetencyService } from '@/services/CompetencyService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const compService = getCompetencyService();

    if (userId) {
      // Get user's competency profile
      const profile = compService.getUserCompetencyProfile(userId);
      if (!profile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(profile);
    }

    // Get the full competency framework
    return NextResponse.json({
      framework: compService.getFramework(),
      allCompetencies: compService.getAllCompetencies()
    });
  } catch (error) {
    console.error('[API] Competencies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competencies', details: error.message },
      { status: 500 }
    );
  }
}
