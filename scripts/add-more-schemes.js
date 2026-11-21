import fs from 'fs';

const moreCentral = [
  {
    id: 'ayushman-senior-70',
    name: {
      en: 'Ayushman Bharat – Vayo Vandana (Universal Health Cover for All 70+)',
      hi: 'आयुष्मान भारत – वयो वंदना (70 वर्ष से अधिक के सभी बुजुर्गों के लिए)',
      as: 'আয়ুষ্মান ভাৰত – বয়ো বন্দনা (৭০ বছৰৰ ঊৰ্ধ্বৰ সকলোৰে বাবে স্বাস্থ্য বীমা)'
    },
    level: 'central',
    state: 'ALL',
    category: ['health', 'pension'],
    summary: {
      en: 'Universal free health insurance coverage of ₹5 Lakh per year for every Indian citizen aged 70 years and above, irrespective of family income or economic status.',
      hi: '70 वर्ष और उससे अधिक आयु के प्रत्येक भारतीय नागरिक के लिए पारिवारिक आय या आर्थिक स्थिति की परवाह किए बिना प्रति वर्ष ₹5 लाख का मुफ्त स्वास्थ्य बीमा।',
      as: 'পৰিয়ালৰ আয় নিৰ্বিশেষে ৭০ বছৰ বা তাতকৈ অধিক বয়সৰ প্ৰতিগৰাকী ভাৰতীয় নাগৰিকৰ বাবে বছৰি ₹৫ লাখ পৰ্যন্ত বিনামূলীয়া স্বাস্থ্য বীমা।'
    },
    benefit: {
      type: 'insurance',
      amount: '₹5,00,000 free annual hospital cover (independent of family income)',
      frequency: 'Cashless hospitalisation across all empaneled hospitals'
    },
    deadline: 'Open Year-Round (Enrollment open for all seniors 70+)',
    deadlineType: 'rolling',
    eligibility: {
      all: [
        { field: 'age', op: 'gte', value: 70 }
      ],
      any: [],
      none: []
    },
    documents: ['aadhaar'],
    howToApply: [
      { step: 1, text: { en: 'Visit beneficiary.nha.gov.in or download the Ayushman App on your smartphone.', hi: 'beneficiary.nha.gov.in पर जाएं या स्मार्टफोन पर आयुष्मान ऐप डाउनलोड करें।', as: 'beneficiary.nha.gov.in ত যাওক বা আয়ুষ্মান এপ ডাউনলোড কৰক।' } },
      { step: 2, text: { en: 'Select Senior Citizen 70+, enter Aadhaar number, and complete e-KYC using Aadhaar OTP or FaceRD.', hi: 'सीनियर सिटीजन 70+ चुनें, आधार दर्ज करें और ई-केवाईसी पूरा करें।', as: 'ছিনিয়ৰ চিটিজেন ৭০+ বাছনি কৰি আধাৰৰ দ্বাৰা ই-কেৱাইচি কৰক।' } },
      { step: 3, text: { en: 'Download your Ayushman Vayo Vandana Card instantly.', hi: 'अपना विशेष आयुष्मान वयो वंदना कार्ड तुरंत डाउनलोड करें।', as: 'আপোনাৰ আয়ুষ্মান বয়ো বন্দনা কাৰ্ড সংগ্ৰহ কৰক।' } }
    ],
    links: {
      official: 'https://beneficiary.nha.gov.in/',
      myscheme: 'https://www.myscheme.gov.in/schemes/ab-pmjay',
      helpline: '14555'
    },
    applyOnline: true,
    lastVerified: '2026-11-20',
    verifiedBy: 'schemesetu-maintainer',
    status: 'active',
    source: 'https://beneficiary.nha.gov.in/'
  },
  {
    id: 'pm-jdy',
    name: {
      en: 'Pradhan Mantri Jan Dhan Yojana (PMJDY - Universal Banking)',
      hi: 'प्रधानमंत्री जन धन योजना (PMJDY - शून्य शेष बैंक खाता)',
      as: 'প্ৰধানমন্ত্ৰী জন ধন যোজনা (PMJDY - শূন্য বেলেঞ্চৰ বেংক একাউণ্ট)'
    },
    level: 'central',
    state: 'ALL',
    category: ['income-support'],
    summary: {
      en: 'Universal zero-balance savings bank account with RuPay debit card, ₹2 Lakh free accident insurance, and ₹10,000 overdraft facility for households.',
      hi: 'शून्य शेष बचत बैंक खाता, रुपे डेबिट कार्ड, ₹2 लाख का मुफ्त दुर्घटना बीमा और पात्र परिवारों के लिए ₹10,000 की ओवरड्राफ्ट सुविधा।',
      as: 'সকলোৰে বাবে শূন্য বেলেঞ্চৰ বেংক একাউণ্ট, বিনামূলীয়া ৰূপে ডেবিট কাৰ্ড, ₹২ লাখৰ দুৰ্ঘটনা বীমা আৰু ₹১০,০০০ ৰ অভাৰড্ৰাফট সুবিধা।'
    },
    benefit: {
      type: 'banking & insurance',
      amount: 'Zero balance account + ₹2 Lakh accident cover + ₹10,000 overdraft',
      frequency: 'Continuous banking access'
    },
    deadline: 'Open Year-Round (Open at any Bank Branch or Bank Mitra)',
    deadlineType: 'rolling',
    eligibility: {
      all: [
        { field: 'age', op: 'gte', value: 10 }
      ],
      any: [],
      none: []
    },
    documents: ['aadhaar', 'photo'],
    howToApply: [
      { step: 1, text: { en: 'Visit any public/private commercial bank branch, regional rural bank or Bank Mitra kiosk.', hi: 'किसी भी बैंक शाखा या बैंक मित्र कियोस्क पर जाएं।', as: 'যিকোনো বেংক শাখা বা বেংক মিত্ৰ কেন্দ্ৰলৈ যাওক।' } },
      { step: 2, text: { en: 'Submit Account Opening Form with Aadhaar card; no initial deposit is required.', hi: 'आधार के साथ खाता खोलने का फॉर्म जमा करें; कोई प्रारंभिक जमा राशि आवश्यक नहीं है।', as: 'আধাৰ কাৰ্ডৰ সৈতে ফৰ্ম জমা দিয়ক; কোনো টকা জমা দিয়াৰ প্ৰয়োজন নাই।' } }
    ],
    links: {
      official: 'https://pmjdy.gov.in/',
      myscheme: 'https://www.myscheme.gov.in/schemes/pmjdy',
      helpline: '18001801111'
    },
    applyOnline: false,
    lastVerified: '2026-11-20',
    verifiedBy: 'schemesetu-maintainer',
    status: 'active',
    source: 'https://pmjdy.gov.in/'
  },
  {
    id: 'onorc-ration',
    name: {
      en: 'One Nation One Ration Card (ONORC - Food Security)',
      hi: 'वन नेशन वन राशन कार्ड (ONORC - राष्ट्रीय खाद्य सुरक्षा)',
      as: 'ৱান নেচন ৱান ৰেচন কাৰ্ড (ONORC - খাদ্য সুৰক্ষা)'
    },
    level: 'central',
    state: 'ALL',
    category: ['income-support'],
    summary: {
      en: 'Enables migrant workers and NFSA beneficiaries to collect their entitled subsidized or free foodgrains from any Fair Price Shop across India using their existing ration card and biometric ePoS verification.',
      hi: 'प्रवासी मजदूरों और राशन कार्ड धारकों को भारत भर में किसी भी उचित मूल्य की दुकान से बायोमेट्रिक सत्यापन के जरिए अपना हकदार अनाज लेने की सुविधा।',
      as: 'প্ৰব্ৰজনকাৰী শ্ৰমিক আৰু ৰেচন কাৰ্ডধাৰীসকলে ভাৰতৰ যিকোনো সুলভ মূল্যৰ দোকানৰ পৰা বিনামূলীয়া খাদ্য সামগ্ৰী সংগ্ৰহ কৰাৰ সুবিধা।'
    },
    benefit: {
      type: 'in-kind',
      amount: 'Free foodgrains (Rice/Wheat/Coarse grains) under PMGKAY / NFSA',
      frequency: 'Monthly quota distribution'
    },
    deadline: 'Open Year-Round (Active across all 36 States & UTs)',
    deadlineType: 'rolling',
    eligibility: {
      all: [],
      any: [
        { field: 'bpl', op: 'eq', value: true },
        { field: 'annualIncome', op: 'lte', value: 250000 }
      ],
      none: [
        { field: 'incomeTaxPayer', op: 'eq', value: true }
      ]
    },
    documents: ['ration-card', 'aadhaar'],
    howToApply: [
      { step: 1, text: { en: 'Ensure your Aadhaar is linked to your Ration Card in your home state.', hi: 'सुनिश्चित करें कि आपका आधार आपके गृह राज्य में राशन कार्ड से जुड़ा है।', as: 'আপোনাৰ ৰেচন কাৰ্ডৰ সৈতে আধাৰ সংযোগ নিশ্চিত কৰক।' } },
      { step: 2, text: { en: 'Visit any Fair Price Shop (FPS) anywhere in India and authenticate on the ePoS machine via fingerprint.', hi: 'भारत में किसी भी राशन की दुकान पर जाएं और बायोमेट्रिक अंगूठे के निशान से सत्यापन करें।', as: 'ভাৰতৰ যিকোনো সুলভ মূল্যৰ দোকানত বায়\'মেট্ৰিক আঙুলিৰ ছাপেৰে খাদ্য সংগ্ৰহ কৰক।' } }
    ],
    links: {
      official: 'https://nfsa.gov.in/',
      myscheme: 'https://www.myscheme.gov.in/schemes/onorc',
      helpline: '1967'
    },
    applyOnline: false,
    lastVerified: '2026-11-20',
    verifiedBy: 'schemesetu-maintainer',
    status: 'active',
    source: 'https://nfsa.gov.in/'
  },
  {
    id: 'pm-kisan-maandhan',
    name: {
      en: 'Pradhan Mantri Kisan Maan-Dhan Yojana (PM-KMY Farmer Pension)',
      hi: 'प्रधानमंत्री किसान मानधन योजना (PM-KMY किसान पेंशन)',
      as: 'প্ৰধানমন্ত্ৰী কিষাণ মান-ধন যোজনা (কৃষক পেঞ্চন)'
    },
    level: 'central',
    state: 'ALL',
    category: ['agriculture', 'pension'],
    summary: {
      en: 'Old age pension of ₹3,000 per month for small and marginal farmers (having cultivable land up to 2 hectares) aged 18 to 40 years upon reaching 60 years.',
      hi: '18 से 40 वर्ष के छोटे और सीमांत किसानों के लिए 60 वर्ष की आयु के बाद ₹3,000 प्रति माह की वृद्धावस्था पेंशन।',
      as: '১৮ ৰ পৰা ৪০ বছৰ বয়সৰ ক্ষুদ্ৰ আৰু উপান্ত কৃষকসকলৰ বাবে ৬০ বছৰৰ পিছত মাহে ₹৩,০০০ বৃদ্ধ পেঞ্চন।'
    },
    benefit: {
      type: 'pension',
      amount: 'Assured ₹3,000 per month lifelong pension',
      frequency: 'Monthly credit after attaining 60 years of age'
    },
    deadline: 'Open Year-Round (Enrollment age 18 to 40)',
    deadlineType: 'rolling',
    eligibility: {
      all: [
        { field: 'occupation', op: 'in', value: ['farmer'] },
        { field: 'landOwner', op: 'eq', value: true },
        { field: 'age', op: 'between', value: [18, 40] }
      ],
      any: [],
      none: [
        { field: 'incomeTaxPayer', op: 'eq', value: true }
      ]
    },
    documents: ['aadhaar', 'land-record', 'bank-passbook'],
    howToApply: [
      { step: 1, text: { en: 'Visit nearest CSC or apply online at maandhan.in with Aadhaar and land record (Khasra/Patta).', hi: 'निकटतम सीएससी पर जाएं या आधार और भूमि अभिलेख के साथ maandhan.in पर ऑनलाइन आवेदन करें।', as: 'ওচৰৰ চিএছচিলৈ যাওক বা maandhan.in ত আধাৰ আৰু মাটিৰ নথিপত্ৰৰে আবেদন কৰক।' } }
    ],
    links: {
      official: 'https://maandhan.in/',
      myscheme: 'https://www.myscheme.gov.in/schemes/pm-kmy',
      helpline: '1800-267-6888'
    },
    applyOnline: true,
    lastVerified: '2026-11-20',
    verifiedBy: 'schemesetu-maintainer',
    status: 'active',
    source: 'https://maandhan.in/'
  },
  {
    id: 'nmmss-scholarship',
    name: {
      en: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
      hi: 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना (NMMSS)',
      as: 'ৰাষ্ট্ৰীয় মেধা বৃত্তি আঁচনি (NMMSS)'
    },
    level: 'central',
    state: 'ALL',
    category: ['education'],
    summary: {
      en: 'Scholarship of ₹12,000 per year (₹1,000/month) for meritorious students of Class 9 through 12 from economically weaker sections to arrest dropouts after Class 8.',
      hi: 'आर्थिक रूप से कमजोर वर्ग के कक्षा 9 से 12 तक के मेधावी छात्रों के लिए ₹12,000 प्रति वर्ष (₹1,000/माह) की छात्रवृत्ति।',
      as: 'অৰ্থনৈতিকভাৱে পিছপৰা শ্ৰেণীৰ মেধাৱী শিক্ষাৰ্থীসকলৰ বাবে নৱমৰ পৰা দ্বাদশ শ্ৰেণীলৈ বছৰি ₹১২,০০০ (মাহে ₹১,০০০) জলপানি।'
    },
    benefit: {
      type: 'cash',
      amount: '₹12,000 per year directly to student bank account',
      frequency: 'Annual DBT for 4 consecutive years (Classes 9 to 12)'
    },
    deadline: 'Annual Window: Closes 31 October / 30 November on NSP',
    deadlineType: 'annual',
    eligibility: {
      all: [
        { field: 'occupation', op: 'in', value: ['student'] },
        { field: 'annualIncome', op: 'lte', value: 350000 }
      ],
      any: [],
      none: []
    },
    documents: ['aadhaar', 'income-certificate', 'marksheet-10th', 'bank-passbook'],
    howToApply: [
      { step: 1, text: { en: 'Students must qualify the State Level Selection Test in Class 8.', hi: 'कक्षा 8 में राज्य स्तरीय चयन परीक्षा उत्तीर्ण करनी होगी।', as: 'অষ্টম শ্ৰেণীত ৰাজ্যিক নিৰ্বাচনী পৰীক্ষাত উত্তীৰ্ণ হ\'ব লাগিব।' } },
      { step: 2, text: { en: 'Selected scholars register on the National Scholarship Portal (scholarships.gov.in) with OTR.', hi: 'चयनित छात्र राष्ट्रीय छात्रवृत्ति पोर्टल पर ओटीआर के साथ पंजीकरण करें।', as: 'নিৰ্বাচিত শিক্ষাৰ্থীসকলে ৰাষ্ট্ৰীয় জলপানি প\'ৰ্টেলত পঞ্জীয়ন কৰিব।' } }
    ],
    links: {
      official: 'https://scholarships.gov.in/',
      myscheme: 'https://www.myscheme.gov.in/schemes/nmmss',
      helpline: '0120-6619540'
    },
    applyOnline: true,
    lastVerified: '2026-11-20',
    verifiedBy: 'schemesetu-maintainer',
    status: 'active',
    source: 'https://scholarships.gov.in/'
  }
];

const moreAssam = [
  {
    id: 'assam-atal-amrit-abhiyan',
    name: {
      en: 'Atal Amrit Abhiyan (Assam Critical Illness Health Cover)',
      hi: 'अटल अमृत अभियान (असम गंभीर बीमारी स्वास्थ्य बीमा)',
      as: 'অটল অমৃত অভিযান (অসম জটিল ৰোগৰ বিনামূলীয়া চিকিৎসা)'
    },
    level: 'state',
    state: 'AS',
    category: ['health', 'insurance'],
    summary: {
      en: 'Free cashless medical treatment up to ₹2 Lakh per individual per year in Assam for 6 critical disease groups (Cardiovascular, Cancer, Kidney, Neo-natal, Burns, Neuro).',
      hi: 'असम में 6 गंभीर बीमारियों (हृदय, कैंसर, किडनी, नवजात, जलने, न्यूरोलॉजी) के लिए प्रति व्यक्ति प्रति वर्ष ₹2 लाख तक का मुफ्त कैशलेस इलाज।',
      as: 'অসমত ৬টা জটিল ৰোগৰ (হৃদৰোগ, কেন্সাৰ, বৃক্ক, নৱজাতক, স্নায়ুৰোগ আদি) বাবে প্ৰতিগৰাকী ব্যক্তিক বছৰি ₹২ লাখ পৰ্যন্ত বিনামূলীয়া চিকিৎসা।'
    },
    benefit: {
      type: 'insurance',
      amount: '₹2,00,000 per individual per year',
      frequency: 'Cashless treatment at empaneled hospitals across Assam and referral hospitals'
    },
    deadline: 'Open Year-Round (Continuous enrollment at Joint Director of Health Services)',
    deadlineType: 'rolling',
    eligibility: {
      all: [
        { field: 'state', op: 'in', value: ['AS', 'ALL'] },
        { field: 'annualIncome', op: 'lte', value: 500000 }
      ],
      any: [],
      none: [
        { field: 'incomeTaxPayer', op: 'eq', value: true }
      ]
    },
    documents: ['aadhaar', 'voter-id', 'income-certificate'],
    howToApply: [
      { step: 1, text: { en: 'Visit your District Joint Director of Health Services office or nearest Medical College Hospital.', hi: 'अपने जिला स्वास्थ्य सेवा संयुक्त निदेशक कार्यालय या नजदीकी मेडिकल कॉलेज अस्पताल में जाएं।', as: 'জিলা স্বাস্থ্য সেৱা কাৰ্যালয় বা ওচৰৰ চিকিৎসা মহাবিদ্যালয়লৈ যাওক।' } },
      { step: 2, text: { en: 'Obtain your smart biometric Atal Amrit Abhiyan card after income & address verification.', hi: 'सत्यापन के बाद अपना स्मार्ट बायोमेट्रिक अटल अमृत कार्ड प्राप्त करें।', as: 'সত্যাপনৰ পিছত স্মাৰ্ট কাৰ্ড সংগ্ৰহ কৰক।' } }
    ],
    links: {
      official: 'https://atalamritabhiyan.assam.gov.in/',
      myscheme: 'https://www.myscheme.gov.in/schemes/atal-amrit-abhiyan',
      helpline: '18001027480'
    },
    applyOnline: false,
    lastVerified: '2026-11-20',
    verifiedBy: 'schemesetu-maintainer',
    status: 'active',
    source: 'https://atalamritabhiyan.assam.gov.in/'
  },
  {
    id: 'assam-krishi-sa-sajuli',
    name: {
      en: 'Mukhyamantri Krishi Sa-Sajuli Yojana (Farm Equipment Grant)',
      hi: 'मुख्यमंत्री कृषि सा-साजुली योजना (कृषि उपकरण अनुदान)',
      as: 'মুখ্যমন্ত্ৰী কৃষি সা-সঁজুলি যোজনা (কৃষি সঁজুলি ক্ৰয়ৰ অনুদান)'
    },
    level: 'state',
    state: 'AS',
    category: ['agriculture'],
    summary: {
      en: 'Financial assistance of ₹5,000 directly transferred to small and marginal farmers in Assam to procure modern agricultural tools, sprayers, and implements.',
      hi: 'आधुनिक कृषि उपकरण और औजार खरीदने के लिए असम के छोटे और सीमांत किसानों को सीधे ₹5,000 की वित्तीय सहायता।',
      as: 'আধুনিক কৃষি সঁজুলি আৰু যন্ত্ৰ-পাতি ক্ৰয়ৰ বাবে অসমৰ ক্ষুদ্ৰ কৃষকসকললৈ ₹৫,০০০ পোনপটীয়া আৰ্থিক সাহায্য।'
    },
    benefit: {
      type: 'cash',
      amount: '₹5,000 one-time DBT grant into farmer bank account',
      frequency: 'Direct Benefit Transfer'
    },
    deadline: 'District Annual Drive (Announced by Directorate of Agriculture, Assam)',
    deadlineType: 'annual',
    eligibility: {
      all: [
        { field: 'state', op: 'in', value: ['AS', 'ALL'] },
        { field: 'occupation', op: 'in', value: ['farmer'] }
      ],
      any: [],
      none: [
        { field: 'incomeTaxPayer', op: 'eq', value: true }
      ]
    },
    documents: ['aadhaar', 'land-record', 'bank-passbook'],
    howToApply: [
      { step: 1, text: { en: 'Apply through your local Agricultural Development Officer (ADO) or Block Agriculture Office.', hi: 'अपने स्थानीय कृषि विकास अधिकारी (ADO) या ब्लॉक कृषि कार्यालय के माध्यम से आवेदन करें।', as: 'স্থানীয় কৃষি বিষয়া (ADO) কাৰ্যালয়ৰ জৰিয়তে আবেদন দাখিল কৰক।' } }
    ],
    links: {
      official: 'https://agri-horti.assam.gov.in/',
      myscheme: 'https://www.myscheme.gov.in/schemes/krishi-sa-sajuli',
      helpline: '1800-345-3574'
    },
    applyOnline: false,
    lastVerified: '2026-11-20',
    verifiedBy: 'schemesetu-maintainer',
    status: 'active',
    source: 'https://agri-horti.assam.gov.in/'
  }
];

const centralData = JSON.parse(fs.readFileSync('src/data/schemes/central.json'));
const assamData = JSON.parse(fs.readFileSync('src/data/schemes/assam.json'));

const existingCentralIds = new Set(centralData.map(s => s.id));
moreCentral.forEach(s => {
  if (!existingCentralIds.has(s.id)) centralData.push(s);
});

const existingAssamIds = new Set(assamData.map(s => s.id));
moreAssam.forEach(s => {
  if (!existingAssamIds.has(s.id)) assamData.push(s);
});

fs.writeFileSync('src/data/schemes/central.json', JSON.stringify(centralData, null, 2));
fs.writeFileSync('src/data/schemes/assam.json', JSON.stringify(assamData, null, 2));

console.log('Central total:', centralData.length);
console.log('Assam total:', assamData.length);
console.log('Grand total schemes:', centralData.length + assamData.length);
