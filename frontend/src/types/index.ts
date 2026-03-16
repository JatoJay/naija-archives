export interface Branch {
  id: string;
  name: string;
  slug: string;
  region: string;
  city: string;
  state: string;
  established: number;
  description: string;
  imageUrl: string | null;
  collectionCount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BranchDetail extends Branch {
  itemsByType: Record<MediaType, number>;
}

export interface Collection {
  id: string;
  branchId: string;
  title: string;
  description: string;
  category: CollectionCategory;
  startYear: number | null;
  endYear: number | null;
  thumbnailUrl: string | null;
  itemCount: number;
  branch: {
    name: string;
    slug: string;
    region: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CollectionDetail extends Collection {
  items: ArchiveItem[];
  itemsByType: Record<MediaType, number>;
}

export interface ArchiveItem {
  id: string;
  collectionId: string;
  title: string;
  description: string | null;
  mediaType: MediaType;
  fileUrl: string;
  fileSizeBytes: number | null;
  mimeType: string | null;
  extractedText: string | null;
  language: string | null;
  tags: string[];
  metadata: Record<string, unknown> | null;
  indexingStatus: IndexingStatus;
  uploadedBy: string | null;
  recordDate: string | null;
  createdAt: string;
  updatedAt: string;
  collection?: {
    title: string;
    branch: {
      name: string;
      slug: string;
    };
  };
}

export type MediaType = 'DOCUMENT' | 'IMAGE' | 'AUDIO' | 'VIDEO';

export type CollectionCategory =
  | 'COLONIAL_ERA'
  | 'INDEPENDENCE_ERA'
  | 'MILITARY_ERA'
  | 'DEMOCRATIC_ERA'
  | 'CULTURAL_HERITAGE'
  | 'LAND_RECORDS'
  | 'JUDICIAL'
  | 'MILITARY_RECORDS'
  | 'DIPLOMATIC'
  | 'PHOTOGRAPHS'
  | 'ORAL_HISTORY';

export type IndexingStatus = 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'PUBLIC' | 'ARCHIVIST';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  createdAt: string;
}

export interface ChatSource {
  title: string;
  collection: string;
  branch: string;
  excerpt: string;
  itemId: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  sessionId: string;
}

export interface TranslateResponse {
  translated: string | string[];
  detectedSourceLanguage?: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  native: string;
}

export interface PortalStats {
  branches: number;
  collections: number;
  totalItems: number;
  documents: number;
  images: number;
  audioRecordings: number;
  videoRecords: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UploadResponse {
  message: string;
  items: ArchiveItem[];
}
