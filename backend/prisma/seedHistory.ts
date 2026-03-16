import { PrismaClient, MediaType, IndexingStatus } from '@prisma/client';

const prisma = new PrismaClient();

const historicalDocuments = [
  {
    branch: 'ibadan',
    collection: 'Cocoa Board Records 1950–1970',
    title: 'Western Region Cocoa Marketing Board Annual Report 1960',
    content: `The Western Region Cocoa Marketing Board Annual Report for 1960 documents the peak of Nigeria's cocoa export industry. Nigeria was the world's second-largest cocoa producer, with the Western Region accounting for over 95% of national production. The report details: Total cocoa exports reached 154,000 tons valued at £42 million. Over 500,000 farming families were registered with the Board. The guaranteed producer price was set at £110 per ton. Major export destinations included the United Kingdom, Netherlands, and United States. The Board established 47 new buying stations across Ondo, Oyo, and Abeokuta provinces. Quality control measures were strengthened with the introduction of the Nigerian Cocoa Research Institute grading system.`,
  },
  {
    branch: 'ibadan',
    collection: 'Western Region Legislative Assembly Minutes',
    title: 'First Session of Western Nigeria House of Assembly - October 1960',
    content: `Minutes of the First Session of the Western Nigeria House of Assembly following Independence, October 1960. Premier Chief Obafemi Awolowo presided over the historic session. Key deliberations included: Ratification of Nigeria's independence constitution. Establishment of the Western Nigeria Development Corporation. Approval of the Free Education Scheme expansion to secondary schools. Discussion of the Western Nigeria Television (WNTV) broadcast reach. Budget allocation of £2.3 million for road construction connecting major towns. The Assembly passed 12 bills during this session, including the Local Government Reform Act and the Agricultural Credit Scheme Act.`,
  },
  {
    branch: 'ibadan',
    collection: 'Ibadan City Photographs 1900–1960',
    title: 'Photographic Documentation of Cocoa House Construction 1963',
    content: `This photographic collection documents the construction of Cocoa House (Ile Cocoa) in Ibadan, completed in 1965. At 26 stories and 105 meters, it became the tallest building in tropical Africa. Key details from the documentation: Construction began in 1963 under the Western Nigeria Development Corporation. The building was designed by Godwin and Hopwood Architects. It served as headquarters for the Western Region Marketing Board. The total construction cost was £2.5 million. The building featured the first high-speed elevators in Nigeria. Ground floor housed the Western Nigeria Finance Corporation. The rooftop offered panoramic views of Ibadan, then Nigeria's largest city by area.`,
  },
  {
    branch: 'enugu',
    collection: 'Eastern Region Government Correspondence 1957–1967',
    title: 'Official Correspondence on Nigerian Independence Preparations 1959',
    content: `Official correspondence between the Eastern Regional Government and the Federal Government regarding independence preparations, 1959. Premier Dr. Nnamdi Azikiwe outlined the Eastern Region's position on constitutional arrangements. Key correspondence topics included: Federal revenue allocation formula discussions. Representation quotas in the Federal Parliament. Eastern Region's proposal for mineral rights retention. Coordination of independence celebration events in Enugu. Appointment of Eastern Region representatives to independence delegation in London. The correspondence reveals detailed negotiations on the structure of post-independence Nigeria, including discussions on regional autonomy, federal powers, and economic arrangements.`,
  },
  {
    branch: 'enugu',
    collection: 'Biafran Civil War Documentation',
    title: 'Humanitarian Aid Coordination Report - Joint Church Aid 1969',
    content: `Report on Joint Church Aid humanitarian operations during the Nigerian Civil War, 1969. The document details the largest civilian airlift in history at that time. Key information: Over 5,000 nighttime flights delivered food and medical supplies. An estimated 1 million tons of relief supplies were delivered. Operations were coordinated from São Tomé island. Medical teams treated over 200,000 malnourished children. The International Committee of the Red Cross worked alongside church organizations. Kwashiorkor treatment protocols were developed and documented. Post-war reconciliation efforts included reintegration programs for displaced persons. The report contains names of coordinating officials and flight manifests.`,
  },
  {
    branch: 'enugu',
    collection: 'Coal Mining Records 1930–1980',
    title: 'Enugu Colliery Production Records and Worker Register 1945',
    content: `Comprehensive records from the Enugu Government Colliery for 1945. The Enugu coal mines, discovered in 1909, were the foundation of Nigeria's industrial development. Production statistics: Annual coal output reached 584,000 tons in 1945. Total workforce numbered 6,842 miners and support staff. Daily wages ranged from 1 shilling 6 pence to 4 shillings depending on role. Safety incidents recorded: 23 minor injuries, 2 fatalities. The Nigerian Railway transported 95% of coal to Port Harcourt for export. Major buyers included the Nigerian Railway Corporation, electricity generating stations, and cement factories. The Iva Valley incident of 1949 is referenced as a pivotal labor dispute that shaped Nigeria's independence movement.`,
  },
  {
    branch: 'kaduna',
    collection: 'Northern Nigerian Emirate Council Records',
    title: 'Sultan of Sokoto Correspondence with British Resident 1914',
    content: `Historical correspondence between Sultan Muhammadu Attahiru II of Sokoto and the British Resident following the amalgamation of Nigeria in 1914. The documents reveal the negotiations that shaped Northern Nigeria's administrative structure. Key topics discussed: Recognition of Islamic law (Sharia) in personal matters. Appointment procedures for District Heads (Hakimai). Tax collection arrangements under the Native Authority system. Educational policy and establishment of provincial schools. Land tenure systems and the preservation of traditional land rights. The Sultan's role as spiritual leader of Nigerian Muslims. These documents demonstrate the indirect rule system implemented by Lord Lugard and its impact on Northern Nigerian governance.`,
  },
  {
    branch: 'kaduna',
    collection: 'Groundnut Pyramid Photographs',
    title: 'Kano Groundnut Trade Documentation 1962',
    content: `Documentation of the groundnut (peanut) trade that dominated Northern Nigeria's economy in the mid-20th century. The famous groundnut pyramids of Kano became an iconic symbol of Nigerian agricultural prosperity. Key records include: 1962 groundnut harvest totaled 1.1 million tons. Export value reached £65 million, Nigeria's largest agricultural export. The Kano groundnut pyramids contained over 500,000 bags at peak storage. Northern Nigeria Groundnut Marketing Board employed 15,000 seasonal workers. Railway transport to Lagos port involved 2,800 dedicated freight cars. Major buyers included European oil processors in Liverpool, Marseille, and Rotterdam. Decline began in the 1970s due to drought, disease, and the oil boom shift in Nigeria's economy.`,
  },
  {
    branch: 'kaduna',
    collection: 'Independence Celebrations 1960 — Northern Region',
    title: 'Northern Region Independence Day Ceremonies - October 1960',
    content: `Official program and documentation of Northern Region independence celebrations, October 1, 1960. The Sardauna of Sokoto, Sir Ahmadu Bello, served as Premier. Celebration highlights: Ceremonial parade at Kaduna racecourse attended by 50,000 people. Traditional Durbar featuring 3,000 horsemen from across the North. Lowering of Union Jack and raising of Nigerian Green-White-Green flag at midnight. Reading of independence proclamation by the Premier. Release of 1,000 white doves symbolizing peace. Special prayers at Sultan Bello Mosque and St. Joseph's Cathedral. Independence medals awarded to 500 distinguished Northern Nigerians. The celebrations emphasized unity while honoring Northern Nigeria's unique cultural heritage and the role of traditional institutions in the new nation.`,
  },
  {
    branch: 'ibadan',
    collection: 'Western Region Legislative Assembly Minutes',
    title: 'Action Group Party Formation Documents 1951',
    content: `Historical documents relating to the formation of the Action Group political party in Ibadan, 1951. Chief Obafemi Awolowo led the formation of this influential Western Nigerian party. Key documents include: Party constitution and manifesto emphasizing federalism and regional autonomy. Minutes from founding convention at Oke-Bola, Ibadan. List of 127 founding members including Chief S.L. Akintola, Chief Bode Thomas, and Chief Anthony Enahoro. Platform priorities: free education, industrialization, and agricultural modernization. Party symbol (palm tree) and colors (green and white) selection. The Action Group would go on to control the Western Region government and play a crucial role in Nigeria's independence movement and First Republic politics.`,
  },
  {
    branch: 'enugu',
    collection: 'Eastern Region Government Correspondence 1957–1967',
    title: 'Dr. Nnamdi Azikiwe Address to Eastern House of Assembly 1958',
    content: `Transcript of Premier Dr. Nnamdi Azikiwe's historic address to the Eastern Region House of Assembly, 1958. The speech outlined the vision for an independent Nigeria. Key excerpts: "We stand on the threshold of a new era. Nigeria shall take her rightful place among the nations of the world." Discussion of the Eastern Region's economic development plans including the Niger Delta Development Board. Proposals for the University of Nigeria at Nsukka. Plans for the Port Harcourt industrial zone expansion. The Premier emphasized Pan-African unity and Nigeria's role in African liberation movements. The address referenced ongoing constitutional conferences in London and the timeline for independence. Dr. Azikiwe would later become Nigeria's first President (1963-1966).`,
  },
  {
    branch: 'kaduna',
    collection: 'Northern Nigerian Emirate Council Records',
    title: 'Ahmadu Bello University Foundation Charter 1962',
    content: `Foundation charter and establishment documents for Ahmadu Bello University, Zaria, 1962. Named after the Sardauna of Sokoto, Sir Ahmadu Bello, it became Northern Nigeria's premier university. Charter details: Established by the Northern Nigeria Government Act of 1962. Initial faculties: Arts and Sciences, Engineering, Law, Agriculture. First Vice-Chancellor: Dr. Norman G. Gruchy. Opening enrollment: 500 students from across Northern Nigeria. Campus built on 7,000 acres in Samaru, Zaria. Institute of Administration for civil service training. Agricultural research station for Northern Nigerian crops. The university was designed to provide higher education for Northern Nigerians and reduce the educational gap with Southern regions. Today ABU remains one of Nigeria's largest universities.`,
  },
  {
    branch: 'ibadan',
    collection: 'Cocoa Board Records 1950–1970',
    title: 'Report on the 1954 Cocoa Holdback Crisis',
    content: `Detailed report on the 1954 Cocoa Holdback (Agbekoya) crisis in Western Nigeria. Farmers protested against low producer prices while world market prices soared. Key findings: Farmers received only 60% of world market price. Marketing Board retained £15 million in surplus funds. Protests organized across Ibadan, Ife, and Ondo provinces. Government deployed police to prevent farmer blockades. Negotiations led to 15% price increase for 1955 season. The crisis exposed tensions between colonial economic policies and farmer interests. This event foreshadowed the Agbekoya Rebellion of 1968-1969 and shaped debates about agricultural policy in independent Nigeria.`,
  },
  {
    branch: 'enugu',
    collection: 'Coal Mining Records 1930–1980',
    title: 'The Iva Valley Massacre Investigation Report 1949',
    content: `Official investigation report into the Iva Valley Massacre of November 18, 1949. Police fired on striking coal miners at the Enugu Colliery, killing 21 workers. Report contents: Miners demanded improved working conditions and pay increases. Strike began November 8, 1949 involving 4,000 workers. Police Superintendent Ninlan ordered troops to disperse workers. 21 miners confirmed killed, 51 wounded. Public outcry across Nigeria and internationally. The Fitzgerald Commission investigated and assigned blame to colonial authorities. This event galvanized the Nigerian independence movement and is commemorated annually. The massacre site at Iva Valley remains a memorial to the workers who died.`,
  },
  {
    branch: 'kaduna',
    collection: 'Northern Nigerian Emirate Council Records',
    title: 'Lord Lugard Amalgamation Documents 1914',
    content: `Collection of official documents related to the amalgamation of the Northern and Southern Protectorates of Nigeria on January 1, 1914. Lord Frederick Lugard served as first Governor-General. Key documents include: Royal proclamation merging the two protectorates. Administrative framework for indirect rule in the North. Revenue sharing arrangements between regions. Railway integration plans connecting North and South. Telegraph and postal service unification. The documents reveal Lugard's vision of maintaining Northern traditional structures while modernizing administration. Critics note the amalgamation was primarily for economic efficiency rather than cultural or political unity, creating tensions that persist in Nigerian federalism today.`,
  },
  {
    branch: 'ibadan',
    collection: 'Ibadan City Photographs 1900–1960',
    title: 'University of Ibadan Foundation Photographs 1948',
    content: `Photographic record of the establishment of University College Ibadan (now University of Ibadan) in 1948. As Nigeria's first university, it marked a milestone in higher education. Collection includes: Groundbreaking ceremony attended by Governor Sir John Macpherson. Architectural plans showing the distinctive modernist campus design. Photographs of first student intake of 104 students. Images of Kenneth Mellanby, first Principal. Construction of iconic buildings including the chapel and library. Early laboratory and research facilities. Student life photographs showing the first Nigerian undergraduates. The university was affiliated with the University of London and awarded London degrees until Nigerian independence.`,
  },
];

async function main() {
  console.log('Seeding Nigerian history data...\n');

  const branches = await prisma.branch.findMany();
  const collections = await prisma.collection.findMany({
    include: { branch: true },
  });

  if (branches.length === 0 || collections.length === 0) {
    console.log('Please run the main seed first: npx prisma db seed');
    return;
  }

  let created = 0;

  for (const doc of historicalDocuments) {
    const branch = branches.find((b) => b.slug === doc.branch);
    const collection = collections.find(
      (c) => c.title === doc.collection && c.branch.slug === doc.branch
    );

    if (!branch || !collection) {
      console.log(`Skipping: ${doc.title} - collection not found`);
      continue;
    }

    const existing = await prisma.archiveItem.findFirst({
      where: { title: doc.title, collectionId: collection.id },
    });

    if (existing) {
      console.log(`Already exists: ${doc.title}`);
      continue;
    }

    console.log(`Creating: ${doc.title}`);

    await prisma.archiveItem.create({
      data: {
        collectionId: collection.id,
        title: doc.title,
        description: doc.content.substring(0, 200) + '...',
        mediaType: MediaType.DOCUMENT,
        fileUrl: '',
        extractedText: doc.content,
        language: 'en',
        tags: 'history,nigeria,archive,independence,colonial',
        indexingStatus: IndexingStatus.INDEXED,
      },
    });

    created++;
    console.log(`  ✅ Created`);
  }

  console.log(`\n✅ Seeding completed. Created ${created} documents.`);
  console.log(`Total archive items: ${await prisma.archiveItem.count()}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
