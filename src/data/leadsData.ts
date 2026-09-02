export interface StudentLead {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  city: string;
  percentage: string;
  targetUniversity: string;
  preferredCourse: string;
  budgetLakhs: string;
  intake: string;
  status: 'Lead New' | 'Contacted' | 'Docs Submitted' | 'Offer Issued' | 'Scholarship Approved' | 'Visa Processing' | 'Enrolled' | 'Follow Up Needed';
  aiScore: number; // e.g. 75 - 99
  counselorAssigned: string;
  createdAt: string;
  notes?: string;
}

const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Kabir', 'Rohan', 'Dhruv', 'Aryan', 'Kian', 'Rishi',
  'Ananya', 'Diya', 'Aadhya', 'Pari', 'Saanvi', 'Myra', 'Ira', 'Avani', 'Riya', 'Kavya',
  'Meera', 'Sneha', 'Tanvi', 'Anushka', 'Ishita', 'Pooja', 'Shreya', 'Divya', 'Priyanka', 'Neha',
  'Vikram', 'Sameer', 'Rahul', 'Manish', 'Siddharth', 'Varun', 'Karan', 'Nikhil', 'Gaurav', 'Abhishek'
];

const lastNames = [
  'Sharma', 'Verma', 'Iyer', 'Patel', 'Reddy', 'Deshmukh', 'Kapoor', 'Sen', 'Joshi', 'Bose',
  'Gupta', 'Singh', 'Chopra', 'Nair', 'Menon', 'Rao', 'Bhat', 'Agarwal', 'Mehta', 'Kulkarni',
  'Mukherjee', 'Chatterjee', 'Banerjee', 'Ghosh', 'Das', 'Dutta', 'Pandey', 'Mishra', 'Tripathi', 'Trivedi',
  'Malhotra', 'Bhatia', 'Saxena', 'Soni', 'Thakur', 'Goyal', 'Bansal', 'Jain', 'Shah', 'Patil'
];

const cities = [
  'Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad',
  'Jaipur', 'Chandigarh', 'Kochi', 'Indore', 'Lucknow', 'Surat', 'Nagpur', 'Coimbatore', 'Vadodara', 'Visakhapatnam'
];

const universities = [
  'University of Birmingham Dubai',
  'Middlesex University Dubai',
  'Heriot-Watt University Dubai',
  'University of Wollongong in Dubai',
  'BITS Pilani Dubai Campus',
  'Curtin University Dubai',
  'Amity University Dubai',
  'Rochester Institute of Technology Dubai',
  'Manipal Academy of Higher Education Dubai',
  'Canadian University Dubai'
];

const courses = [
  'MSc Computer Science & Artificial Intelligence',
  'BSc (Hons) Computer Science & Cloud Systems',
  'Data Science & Advanced Analytics (MSc)',
  'MBA Global Business & International Strategy',
  'MSc FinTech, Blockchain & Quantitative Finance',
  'BBA International Management & Marketing',
  'BEng Mechanical Engineering & Robotics',
  'BEng Civil Engineering & Infrastructure',
  'MSc Cyber Security & Digital Forensics',
  'BA International Tourism & Hospitality Management',
  'MSc Luxury Brand Management',
  'BSc Biomedical Sciences & Healthcare Tech',
  'LLM International Commercial Law & Arbitration'
];

const statuses: StudentLead['status'][] = [
  'Lead New',
  'Contacted',
  'Docs Submitted',
  'Offer Issued',
  'Scholarship Approved',
  'Visa Processing',
  'Enrolled',
  'Follow Up Needed'
];

const counselors = [
  'Priya Sengupta (Senior Lead)',
  'Amitav Roy (STEM Advisor)',
  'Farida Khan (Visa Specialist)',
  'Deepak Verma (Business Faculty)',
  'Sneha Kulkarni (Scholarships Lead)'
];

const intakes = ['Sep 2026', 'Jan 2027', 'Sep 2027'];
const budgets = ['₹18.0 - ₹22.0 Lakhs', '₹22.0 - ₹28.0 Lakhs', '₹28.0 - ₹35.0 Lakhs', '₹35.0+ Lakhs', '₹15.0 - ₹18.0 Lakhs'];

const academicQualifications = [
  '89% (12th CBSE PCM)',
  '92% (BTech Computer Science)',
  '85% (BBA Finance 8.8 CGPA)',
  '78% (12th ISC Commerce)',
  '94% (BSc Mathematics & Stats)',
  '81% (12th State Board)',
  '88% (BCom Honours)',
  '91% (12th CBSE PCB)',
  '83% (BTech Mechanical)',
  '87% (BA Economics 8.5 CGPA)'
];

// Deterministic pseudorandom generator so initial 1000 items stay consistent across page loads
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generate1000StudentLeads(): StudentLead[] {
  const leads: StudentLead[] = [];
  const baseDate = new Date('2026-08-30T10:00:00Z');

  for (let i = 1; i <= 1000; i++) {
    const fnIndex = Math.floor(pseudoRandom(i * 13) * firstNames.length);
    const lnIndex = Math.floor(pseudoRandom(i * 17) * lastNames.length);
    const cityIndex = Math.floor(pseudoRandom(i * 19) * cities.length);
    const uniIndex = Math.floor(pseudoRandom(i * 23) * universities.length);
    const courseIndex = Math.floor(pseudoRandom(i * 29) * courses.length);
    const statusIndex = Math.floor(pseudoRandom(i * 31) * statuses.length);
    const counselorIndex = Math.floor(pseudoRandom(i * 37) * counselors.length);
    const intakeIndex = Math.floor(pseudoRandom(i * 41) * intakes.length);
    const budgetIndex = Math.floor(pseudoRandom(i * 43) * budgets.length);
    const acadIndex = Math.floor(pseudoRandom(i * 47) * academicQualifications.length);

    const firstName = firstNames[fnIndex];
    const lastName = lastNames[lnIndex];
    const studentName = `${firstName} ${lastName}`;
    const cleanName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(pseudoRandom(i * 53) * 89 + 10)}`;
    const email = `${cleanName}@gmail.com`;
    const phone = `+91 ${Math.floor(7000000000 + pseudoRandom(i * 59) * 2999999999)}`;
    const aiScore = Math.floor(72 + pseudoRandom(i * 61) * 27); // 72 to 98
    
    // Create staggered dates
    const dateOffsetHours = Math.floor(pseudoRandom(i * 67) * 720); // within last 30 days
    const leadDate = new Date(baseDate.getTime() - dateOffsetHours * 3600 * 1000);
    const dateStr = leadDate.toISOString().split('T')[0];

    leads.push({
      id: `LEAD-${1000 + i}`,
      studentName,
      email,
      phone,
      city: cities[cityIndex],
      percentage: academicQualifications[acadIndex],
      targetUniversity: universities[uniIndex],
      preferredCourse: courses[courseIndex],
      budgetLakhs: budgets[budgetIndex],
      intake: intakes[intakeIndex],
      status: statuses[statusIndex],
      aiScore,
      counselorAssigned: counselors[counselorIndex],
      createdAt: dateStr,
      notes: `Targeting ${universities[uniIndex]} with scholarship grant potential. Academic score: ${academicQualifications[acadIndex]}.`
    });
  }

  return leads;
}

export function exportLeadsToCSV(leads: StudentLead[], filename = 'PrimiPassi_Dubai_Student_Leads_1000.csv'): void {
  const headers = [
    'Lead ID',
    'Student Name',
    'Email',
    'Phone',
    'City',
    'Academic Percentage',
    'Target University',
    'Preferred Course',
    'Budget',
    'Intake',
    'Lead Status',
    'AI Suitability Score',
    'Assigned Counselor',
    'Created Date',
    'Notes'
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map((l) => [
    escapeCSV(l.id),
    escapeCSV(l.studentName),
    escapeCSV(l.email),
    escapeCSV(l.phone),
    escapeCSV(l.city),
    escapeCSV(l.percentage),
    escapeCSV(l.targetUniversity),
    escapeCSV(l.preferredCourse),
    escapeCSV(l.budgetLakhs),
    escapeCSV(l.intake),
    escapeCSV(l.status),
    escapeCSV(`${l.aiScore}/100`),
    escapeCSV(l.counselorAssigned),
    escapeCSV(l.createdAt),
    escapeCSV(l.notes || '')
  ]);

  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
