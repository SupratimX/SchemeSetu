// explain.js - Human-readable reason explanation in EN / HI / AS

const LABELS = {
  en: {
    state: 'State',
    area: 'Area',
    age: 'Age',
    gender: 'Gender',
    income: 'Income',
    annualIncome: 'Annual Income',
    category: 'Social Category',
    occupation: 'Occupation',
    special: 'Special Category',
    bpl: 'BPL Card',
    disability: 'Disability Status',
    widow: 'Widow/Widower Status',
    minority: 'Minority Status',
    girlChild: 'Girl Child',
    landOwner: 'Agricultural Land',
    incomeTaxPayer: 'Income Tax Payer',
    streetVendor: 'Street Vendor Status',
    qualifies: 'matches requirement',
    doesNotMatch: 'does not meet requirement',
    disqualifies: 'disqualifies from this scheme',
    unknown: 'to be confirmed'
  },
  hi: {
    state: 'राज्य',
    area: 'क्षेत्र',
    age: 'आयु',
    gender: 'लिंग',
    income: 'आय',
    annualIncome: 'वार्षिक आय',
    category: 'सामाजिक श्रेणी',
    occupation: 'व्यवसाय',
    special: 'विशेष श्रेणी',
    bpl: 'बीपीएल कार्ड',
    disability: 'दिव्यांगता स्थिति',
    widow: 'विधवा / विधुर',
    minority: 'अल्पसंख्यक',
    girlChild: 'बालिका',
    landOwner: 'कृषि भूमि',
    incomeTaxPayer: 'आयकर दाता',
    streetVendor: 'स्ट्रीट वेंडर स्थिति',
    qualifies: 'शर्त पूरी करता है',
    doesNotMatch: 'आवश्यकता पूरी नहीं करता',
    disqualifies: 'इस योजना से बाहर करता है',
    unknown: 'पुष्टि की जानी बाकी है'
  },
  as: {
    state: 'ৰাজ্য',
    area: 'অঞ্চল',
    age: 'বয়স',
    gender: 'লিংগ',
    income: 'আয়',
    annualIncome: 'বাৰ্ষিক আয়',
    category: 'সামাজিক শ্ৰেণী',
    occupation: 'পেশা',
    special: 'বিশেষ শ্ৰেণী',
    bpl: 'বিপিএল কাৰ্ড',
    disability: 'প্ৰতিবন্ধী স্থিতি',
    widow: 'বিধৱা / বিধুৰ',
    minority: 'সংখ্যালঘু',
    girlChild: 'কন্যা সন্তান',
    landOwner: 'কৃষি ভূমি',
    incomeTaxPayer: 'আয়কৰ দাতা',
    streetVendor: 'হকাৰ স্থিতি',
    qualifies: 'চৰ্ত পূৰণ কৰে',
    doesNotMatch: 'প্ৰয়োজনীয়তা পূৰণ নকৰে',
    disqualifies: 'এই আঁচনিৰ বাবে যোগ্য নহয়',
    unknown: 'নিশ্চিত কৰিবলগীয়া'
  }
};

export function explainReason(reason, lang = 'en') {
  const dict = LABELS[lang] || LABELS.en;
  const fieldName = dict[reason.field] || reason.field;

  if (reason.message) {
    return reason.message;
  }

  if (reason.type === 'unknown' || reason.result === null) {
    return `${fieldName}: ${dict.unknown}`;
  }

  if (reason.type === 'disqualifier_none') {
    return `${fieldName}: ${dict.disqualifies}`;
  }

  if (reason.type === 'disqualifier') {
    let detail = '';
    if (reason.op === 'lte') detail = `(limit ≤ ${reason.value})`;
    else if (reason.op === 'gte') detail = `(minimum ≥ ${reason.value})`;
    else if (reason.op === 'in') detail = `(required: ${Array.isArray(reason.value) ? reason.value.join(', ') : reason.value})`;
    return `${fieldName} ${dict.doesNotMatch} ${detail}`;
  }

  if (reason.type.startsWith('qualifier')) {
    return `${fieldName} ${dict.qualifies} ✓`;
  }

  return `${fieldName}: ${reason.result ? dict.qualifies : dict.doesNotMatch}`;
}
