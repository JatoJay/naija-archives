import type { CollectionCategory, MediaType, IndexingStatus } from '@/types';

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatYearRange(startYear: number | null, endYear: number | null): string {
  if (startYear && endYear) {
    return startYear === endYear ? `${startYear}` : `${startYear}–${endYear}`;
  }
  if (startYear) return `${startYear}–present`;
  if (endYear) return `Until ${endYear}`;
  return 'Date unknown';
}

export function formatCategory(category: CollectionCategory): string {
  const labels: Record<CollectionCategory, string> = {
    COLONIAL_ERA: 'Colonial Era',
    INDEPENDENCE_ERA: 'Independence Era',
    MILITARY_ERA: 'Military Era',
    DEMOCRATIC_ERA: 'Democratic Era',
    CULTURAL_HERITAGE: 'Cultural Heritage',
    LAND_RECORDS: 'Land Records',
    JUDICIAL: 'Judicial',
    MILITARY_RECORDS: 'Military Records',
    DIPLOMATIC: 'Diplomatic',
    PHOTOGRAPHS: 'Photographs',
    ORAL_HISTORY: 'Oral History',
  };
  return labels[category] || category;
}

export function formatMediaType(mediaType: MediaType): string {
  const labels: Record<MediaType, string> = {
    DOCUMENT: 'Document',
    IMAGE: 'Image',
    AUDIO: 'Audio',
    VIDEO: 'Video',
  };
  return labels[mediaType] || mediaType;
}

export function formatIndexingStatus(status: IndexingStatus): string {
  const labels: Record<IndexingStatus, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    INDEXED: 'Indexed',
    FAILED: 'Failed',
  };
  return labels[status] || status;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
