import { NextResponse } from 'next/server';
import { getTrainingService } from '@/services/TrainingProgrammeService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const mode = searchParams.get('mode') || '';

    const trainingService = getTrainingService();
    const filters = {};
    if (mode) filters.mode = mode;

    const programmes = query || mode
      ? trainingService.searchProgrammes(query, filters)
      : trainingService.getAllProgrammes();

    return NextResponse.json({ programmes, total: programmes.length });
  } catch (error) {
    console.error('[API] Training error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training programmes', details: error.message },
      { status: 500 }
    );
  }
}
