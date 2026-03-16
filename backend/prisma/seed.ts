import { PrismaClient, CollectionCategory, MediaType, IndexingStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const archivistEmail = process.env.DEFAULT_ARCHIVIST_EMAIL || 'archivist@nigeriaarchives.gov.ng';
  const archivistPassword = process.env.DEFAULT_ARCHIVIST_PASSWORD || 'ChangeMe123!';

  const existingArchivist = await prisma.user.findUnique({
    where: { email: archivistEmail },
  });

  if (!existingArchivist) {
    const passwordHash = await bcrypt.hash(archivistPassword, 12);
    await prisma.user.create({
      data: {
        email: archivistEmail,
        passwordHash,
        name: 'Default Archivist',
        role: 'ARCHIVIST',
      },
    });
    console.log('✅ Default archivist created');
  }

  const branches = [
    {
      name: 'Ibadan Branch',
      slug: 'ibadan',
      region: 'West',
      city: 'Ibadan',
      state: 'Oyo State',
      established: 1958,
      description:
        'The Ibadan Branch of the National Archives of Nigeria serves the Western region, housing extensive collections of colonial-era records, regional government documents, and cultural heritage materials from the Yoruba heartland. Established in 1958, it preserves invaluable documentation of Nigeria\'s political, economic, and social development.',
      imageUrl: '/assets/branches/ibadan.jpg',
    },
    {
      name: 'Enugu Branch',
      slug: 'enugu',
      region: 'East',
      city: 'Enugu',
      state: 'Enugu State',
      established: 1958,
      description:
        'The Enugu Branch serves the Eastern region, maintaining critical records including pre-independence colonial documents, civil war documentation, and the rich cultural heritage of the Igbo people. The branch holds significant historical records related to coal mining and early industrialization in Nigeria.',
      imageUrl: '/assets/branches/enugu.jpg',
    },
    {
      name: 'Kaduna Branch',
      slug: 'kaduna',
      region: 'North',
      city: 'Kaduna',
      state: 'Kaduna State',
      established: 1957,
      description:
        'The Kaduna Branch, the oldest of the three regional archives, serves Northern Nigeria. It houses extensive records of the Northern Nigerian Emirate system, colonial administration, and the groundnut trade that shaped the region\'s economy. The branch preserves important documents related to Nigeria\'s independence celebrations.',
      imageUrl: '/assets/branches/kaduna.jpg',
    },
  ];

  for (const branchData of branches) {
    const existing = await prisma.branch.findUnique({
      where: { slug: branchData.slug },
    });

    if (!existing) {
      await prisma.branch.create({ data: branchData });
      console.log(`✅ Branch created: ${branchData.name}`);
    }
  }

  const ibadanBranch = await prisma.branch.findUnique({ where: { slug: 'ibadan' } });
  const enugubranch = await prisma.branch.findUnique({ where: { slug: 'enugu' } });
  const kadunaBranch = await prisma.branch.findUnique({ where: { slug: 'kaduna' } });

  if (!ibadanBranch || !enugubranch || !kadunaBranch) {
    throw new Error('Branches not found');
  }

  const collections = [
    {
      branchId: ibadanBranch.id,
      title: 'Cocoa Board Records 1950–1970',
      description:
        'Comprehensive records of the Nigerian Cocoa Marketing Board including production statistics, export documentation, farmer registrations, and policy documents that shaped the Western region\'s agricultural economy.',
      category: CollectionCategory.COLONIAL_ERA,
      startYear: 1950,
      endYear: 1970,
    },
    {
      branchId: ibadanBranch.id,
      title: 'Western Region Legislative Assembly Minutes',
      description:
        'Complete proceedings and minutes of the Western Region House of Assembly, documenting legislative debates, bills, and resolutions from the First Republic era.',
      category: CollectionCategory.INDEPENDENCE_ERA,
      startYear: 1960,
      endYear: 1966,
    },
    {
      branchId: ibadanBranch.id,
      title: 'Ibadan City Photographs 1900–1960',
      description:
        'A remarkable photographic collection capturing the transformation of Ibadan from a traditional Yoruba city to a modern urban center, including images of markets, buildings, ceremonies, and daily life.',
      category: CollectionCategory.PHOTOGRAPHS,
      startYear: 1900,
      endYear: 1960,
    },
    {
      branchId: enugubranch.id,
      title: 'Eastern Region Government Correspondence 1957–1967',
      description:
        'Official correspondence and administrative records of the Eastern Regional Government, providing insight into the political developments leading to and following Nigerian independence.',
      category: CollectionCategory.INDEPENDENCE_ERA,
      startYear: 1957,
      endYear: 1967,
    },
    {
      branchId: enugubranch.id,
      title: 'Biafran Civil War Documentation',
      description:
        'A sensitive collection documenting the Nigerian Civil War (1967-1970), including official communications, humanitarian records, and post-war reconciliation documents.',
      category: CollectionCategory.MILITARY_ERA,
      startYear: 1967,
      endYear: 1970,
    },
    {
      branchId: enugubranch.id,
      title: 'Coal Mining Records 1930–1980',
      description:
        'Records of the Enugu Coal Mining operations including worker registers, production data, safety reports, and the eventual decline of the industry.',
      category: CollectionCategory.COLONIAL_ERA,
      startYear: 1930,
      endYear: 1980,
    },
    {
      branchId: kadunaBranch.id,
      title: 'Northern Nigerian Emirate Council Records',
      description:
        'Historical records of the traditional Emirate councils of Northern Nigeria, documenting the administrative structures, judicial proceedings, and ceremonial traditions of the Hausa-Fulani emirates.',
      category: CollectionCategory.CULTURAL_HERITAGE,
      startYear: 1900,
      endYear: 1966,
    },
    {
      branchId: kadunaBranch.id,
      title: 'Groundnut Pyramid Photographs',
      description:
        'Iconic photographic documentation of the famous groundnut pyramids of Kano and the Northern groundnut trade that was once the backbone of Nigeria\'s agricultural export economy.',
      category: CollectionCategory.PHOTOGRAPHS,
      startYear: 1950,
      endYear: 1975,
    },
    {
      branchId: kadunaBranch.id,
      title: 'Independence Celebrations 1960 — Northern Region',
      description:
        'Documentation of the independence celebrations in the Northern Region, including photographs, speeches, guest lists, and ceremonial programs from October 1960.',
      category: CollectionCategory.INDEPENDENCE_ERA,
      startYear: 1960,
      endYear: 1960,
    },
  ];

  for (const collectionData of collections) {
    const existing = await prisma.collection.findFirst({
      where: {
        title: collectionData.title,
        branchId: collectionData.branchId,
      },
    });

    if (!existing) {
      const collection = await prisma.collection.create({ data: collectionData });
      console.log(`✅ Collection created: ${collectionData.title}`);

      const sampleItems = [
        {
          collectionId: collection.id,
          title: `Sample Document from ${collectionData.title}`,
          description: `This is a sample archival document from the ${collectionData.title} collection.`,
          mediaType: MediaType.DOCUMENT,
          fileUrl: 'https://storage.googleapis.com/nigeria-archives-media/sample.pdf',
          extractedText: `This document contains historical records related to ${collectionData.title}. The records span from ${collectionData.startYear} to ${collectionData.endYear}. These materials are preserved for research and educational purposes. Nigeria's rich history deserves careful preservation and study.`,
          language: 'en',
          tags: ['sample', 'historical', collection.category.toLowerCase().replace('_', '-')],
          indexingStatus: IndexingStatus.INDEXED,
        },
        {
          collectionId: collection.id,
          title: `Historical Photograph from ${collectionData.title}`,
          description: `A historical photograph from the ${collectionData.title} collection.`,
          mediaType: MediaType.IMAGE,
          fileUrl: 'https://storage.googleapis.com/nigeria-archives-media/sample.jpg',
          extractedText: '',
          language: 'en',
          tags: ['photograph', 'historical'],
          indexingStatus: IndexingStatus.INDEXED,
        },
      ];

      for (const item of sampleItems) {
        await prisma.archiveItem.create({ data: item });
      }
    }
  }

  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
