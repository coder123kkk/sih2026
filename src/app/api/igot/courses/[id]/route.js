import { NextResponse } from 'next/server';
import { IGOTIntegrationService } from '@/services/iGOTIntegrationService';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const igotService = IGOTIntegrationService.getInstance();
    const course = await igotService.getCourseById(id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Also get learner progress if userId is provided
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    let enrollment = null;

    if (userId) {
      enrollment = await igotService.getLearnerProgress(userId, id);
    }

    return NextResponse.json({
      course,
      enrollment,
      source: igotService.isDemoMode() ? 'demo' : 'igot-api'
    });
  } catch (error) {
    console.error('[API] iGOT course detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course details', details: error.message },
      { status: 500 }
    );
  }
}
