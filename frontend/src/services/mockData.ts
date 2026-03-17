import type { Branch, Collection, PortalStats, PaginatedResponse } from '@/types';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: '1',
    name: 'Lagos State Archives',
    slug: 'lagos',
    region: 'South-West',
    city: 'Lagos',
    state: 'Lagos',
    established: 1960,
    description: 'The Lagos State Archives houses an extensive collection of colonial and post-independence records, including administrative documents, land records, and photographs documenting the growth of Lagos as Nigeria\'s commercial capital.',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format',
    collectionCount: 24,
    itemCount: 1250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Kaduna Regional Archives',
    slug: 'kaduna',
    region: 'North-West',
    city: 'Kaduna',
    state: 'Kaduna',
    established: 1958,
    description: 'The Kaduna Regional Archives preserves the administrative and cultural heritage of Northern Nigeria, with records dating back to the pre-colonial era including Islamic manuscripts and colonial administrative files.',
    imageUrl: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=800&auto=format',
    collectionCount: 18,
    itemCount: 890,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Enugu State Archives',
    slug: 'enugu',
    region: 'South-East',
    city: 'Enugu',
    state: 'Enugu',
    established: 1962,
    description: 'The Enugu State Archives contains valuable records of Eastern Nigeria, including documents related to the coal mining industry, regional administration, and cultural artifacts from the Igbo heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format',
    collectionCount: 15,
    itemCount: 720,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: '1',
    branchId: '1',
    title: 'Colonial Administrative Records (1900-1960)',
    description: 'Comprehensive collection of administrative documents from the colonial period, including government correspondence, policy directives, and official gazettes.',
    category: 'COLONIAL_ERA',
    startYear: 1900,
    endYear: 1960,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format',
    itemCount: 342,
    branch: { name: 'Lagos State Archives', slug: 'lagos', region: 'South-West' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    branchId: '1',
    title: 'Independence Movement Documents',
    description: 'Historical documents chronicling Nigeria\'s journey to independence, including speeches, political party manifestos, and constitutional conference papers.',
    category: 'INDEPENDENCE_ERA',
    startYear: 1950,
    endYear: 1963,
    thumbnailUrl: 'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=400&auto=format',
    itemCount: 156,
    branch: { name: 'Lagos State Archives', slug: 'lagos', region: 'South-West' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    branchId: '2',
    title: 'Northern Nigeria Land Records',
    description: 'Collection of land tenure documents, survey maps, and property records from Northern Nigeria spanning over a century.',
    category: 'LAND_RECORDS',
    startYear: 1903,
    endYear: 1990,
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format',
    itemCount: 478,
    branch: { name: 'Kaduna Regional Archives', slug: 'kaduna', region: 'North-West' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    branchId: '3',
    title: 'Igbo Cultural Heritage Collection',
    description: 'Photographs, oral history recordings, and documents preserving the rich cultural heritage of the Igbo people.',
    category: 'CULTURAL_HERITAGE',
    startYear: 1920,
    endYear: 2000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format',
    itemCount: 234,
    branch: { name: 'Enugu State Archives', slug: 'enugu', region: 'South-East' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_STATS: PortalStats = {
  branches: 6,
  collections: 45,
  totalItems: 3250,
  documents: 1850,
  images: 890,
  audioRecordings: 320,
  videoRecords: 190,
};

export function getMockCollectionsPaginated(
  params: { page?: number; limit?: number } = {}
): PaginatedResponse<Collection> {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = MOCK_COLLECTIONS.slice(start, end);

  return {
    data,
    pagination: {
      page,
      limit,
      total: MOCK_COLLECTIONS.length,
      totalPages: Math.ceil(MOCK_COLLECTIONS.length / limit),
    },
  };
}
