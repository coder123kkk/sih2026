import { NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/data/mock-users';
import { getDemoLearnerProfiles, getLearnerData } from '@/data/mock-igot-learner';
import { getIGOTConfig, isProduction } from '@/integrations/config';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'USR001';

    const user = getUserById(userId);
    const profiles = getDemoLearnerProfiles();
    const config = getIGOTConfig();

    return NextResponse.json({
      environment: isProduction() ? 'production' : 'demo',
      currentLinkedId: user?.igotLearnerId || null,
      profiles
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId = 'USR001', learnerId } = body;

    if (!learnerId) {
      return NextResponse.json({ error: 'learnerId is required' }, { status: 400 });
    }

    const profiles = getDemoLearnerProfiles();
    const selectedProfile = profiles.find(p => p.learnerId === learnerId);
    if (!selectedProfile) {
      return NextResponse.json({ error: 'Invalid demo learner profile selected' }, { status: 404 });
    }

    // Update user record persistently in memory
    const updatedUser = updateUser(userId, { igotLearnerId: learnerId });
    const learnerData = getLearnerData(learnerId);

    return NextResponse.json({
      success: true,
      message: `Successfully linked demo iGOT account: ${learnerId}`,
      learnerId,
      profile: selectedProfile,
      learnerData,
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        igotLearnerId: updatedUser?.igotLearnerId
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'USR001';

    const updatedUser = updateUser(userId, { igotLearnerId: null });

    return NextResponse.json({
      success: true,
      message: 'Demo iGOT account unlinked successfully',
      learnerId: null,
      user: {
        id: updatedUser?.id,
        igotLearnerId: null
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
