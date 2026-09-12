import { NextResponse } from 'next/server';
import { getAssessmentService } from '@/services/AssessmentService';

export async function GET(request) {
  try {
    const service = getAssessmentService();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId') || 'COURSE_ALL';
    
    const courses = service.getCourses();
    const questions = service.getQuestionsByCourse(courseId);
    const history = service.getAssessmentHistory('USR001');

    return NextResponse.json({
      courses,
      questions,
      history,
      totalQuestions: questions.length,
      selectedCourse: courseId
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, answers, courseId } = await request.json();
    const service = getAssessmentService();
    const result = service.submitAssessment({ userId: userId || 'USR001', answers: answers || {}, courseId: courseId || 'COURSE_ALL' });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
