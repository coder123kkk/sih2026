import { NextResponse } from 'next/server';
import { IGOTIntegrationService } from '@/services/iGOTIntegrationService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'USR001';

    const igotService = IGOTIntegrationService.getInstance();
    const [enrollments, completions, profile] = await Promise.all([
      igotService.getLearnerEnrollments(userId),
      igotService.getLearnerCompletions(userId),
      igotService.getLearnerProfile(userId)
    ]);

    const certificates = enrollments.filter(e => e.certificateUrl || e.status === 'completed');
    const totalLearningHours = (profile?.learningHistory || []).reduce((acc, curr) => acc + (curr.hours || 0), 0) || (completions.length * 8 + 8);

    return NextResponse.json({
      learnerId: userId,
      enrollments,
      completions,
      totalEnrolled: enrollments.length,
      totalCompleted: completions.length,
      totalHours: totalLearningHours,
      certificatesCount: certificates.length,
      certificates,
      learningHistory: profile?.learningHistory || [],
      source: igotService.isDemoMode() ? 'demo' : 'igot-api'
    });
  } catch (error) {
    console.error('[API] iGOT learner error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learner data', details: error.message },
      { status: 500 }
    );
  }
}
