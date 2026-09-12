import { NextResponse } from 'next/server';
import { IGOTIntegrationService } from '@/services/iGOTIntegrationService';
import { mockIGOTCategories, mockIGOTSkills, mockIGOTDifficulties, mockIGOTDurations } from '@/data/mock-igot-courses';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const difficulty = searchParams.get('difficulty') || searchParams.get('level') || '';
    const skill = searchParams.get('skill') || searchParams.get('competency') || '';
    const duration = searchParams.get('duration') || '';
    const provider = searchParams.get('provider') || '';
    const maxDuration = searchParams.get('maxDuration') || '';
    const minDuration = searchParams.get('minDuration') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filters = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (skill) filters.skill = skill;
    if (duration) filters.duration = duration;
    if (provider) filters.provider = provider;
    if (maxDuration) filters.maxDuration = maxDuration;
    if (minDuration) filters.minDuration = minDuration;

    const igotService = IGOTIntegrationService.getInstance();
    const result = await igotService.searchCourses(query, filters, page, limit);

    return NextResponse.json({
      ...result,
      availableCategories: mockIGOTCategories,
      availableSkills: mockIGOTSkills,
      availableLevels: mockIGOTDifficulties,
      availableDurations: mockIGOTDurations
    });
  } catch (error) {
    console.error('[API] iGOT courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch iGOT courses', details: error.message },
      { status: 500 }
    );
  }
}
