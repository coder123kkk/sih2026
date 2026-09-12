/**
 * Training Programme Service
 * 
 * Manages NSSTA/TPAC training programmes.
 * Provides search, filtering, and programme details.
 */

import { mockNSSTAProgrammes } from '@/data/mock-nssta-programmes';
import { IGOTCourseAdapter } from '@/integrations/igot/iGOTCourseAdapter';

export class TrainingProgrammeService {
  /**
   * Get all training programmes
   */
  getAllProgrammes() {
    return mockNSSTAProgrammes.map(p => IGOTCourseAdapter.toTrainingProgramme(p));
  }

  /**
   * Get a single programme by ID
   */
  getProgrammeById(id) {
    const prog = mockNSSTAProgrammes.find(p => p.id === id);
    return prog ? IGOTCourseAdapter.toTrainingProgramme(prog) : null;
  }

  /**
   * Search programmes
   */
  searchProgrammes(query = '', filters = {}) {
    let results = [...mockNSSTAProgrammes];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.competencies || []).some(c => c.name.toLowerCase().includes(q))
      );
    }

    if (filters.mode) {
      results = results.filter(p => p.mode === filters.mode);
    }

    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }

    return results.map(p => IGOTCourseAdapter.toTrainingProgramme(p));
  }

  /**
   * Get upcoming programmes
   */
  getUpcomingProgrammes(limit = 5) {
    const now = new Date().toISOString().split('T')[0];
    return mockNSSTAProgrammes
      .filter(p => p.startDate >= now)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, limit)
      .map(p => IGOTCourseAdapter.toTrainingProgramme(p));
  }
}

let trainInstance = null;
export function getTrainingService() {
  if (!trainInstance) trainInstance = new TrainingProgrammeService();
  return trainInstance;
}
