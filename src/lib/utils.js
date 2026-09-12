/**
 * Utility functions and constants
 */

/** Format a date string to a readable format */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Get severity color for skill gaps */
export function getGapColor(severity) {
  switch (severity) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#EAB308';
    case 'none': return '#22C55E';
    default: return '#6B7280';
  }
}

/** Get severity emoji */
export function getGapEmoji(severity) {
  switch (severity) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'medium': return '🟡';
    case 'none': return '🟢';
    default: return '⚪';
  }
}

/** Get difficulty color */
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'Beginner': return '#22C55E';
    case 'Intermediate': return '#3B82F6';
    case 'Advanced': return '#8B5CF6';
    default: return '#6B7280';
  }
}

/** Get mode icon */
export function getModeIcon(mode) {
  switch (mode) {
    case 'classroom': return '🏛️';
    case 'online': return '💻';
    case 'hybrid': return '🔀';
    default: return '📚';
  }
}

/** Truncate text */
export function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/** Get initials from name */
export function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/** Get gap status color */
export function getGapStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#EAB308';
    case 'low': return '#10B981';
    default: return '#6B7280';
  }
}
