import { AssessmentConfig } from '../types';

export const DEFAULT_ASSESSMENT_CONFIG: AssessmentConfig = {
  portalTitle: 'Student Eligibility Assessment',
  portalSubtitle:
    'Check your preliminary eligibility for international university admissions. Answer a few structured questions about your academic background, course preference, and study plans to receive instant preliminary classification.',
  badgeText: 'Official PrimiPassi Assessment • Version 1.0',
  disclaimerText:
    'Important Notice: This is a preliminary eligibility assessment. Final admission eligibility depends on the selected university, course, intake, documents and university-specific requirements.',
  estimatedTime: 'Takes approximately 5–7 minutes',
  categories: [
    {
      id: 'personal_study',
      stepNumber: 1,
      title: 'Step 1: Personal & Study Interest',
      description: 'Basic applicant profile, target study country, program level, academic field, and intake.',
      iconName: 'User',
      questions: [
        {
          id: 'fullName',
          step: 1,
          category: 'personal_study',
          questionNumberLabel: 'Q1',
          title: 'Full Name',
          subtitle: 'Enter your legal name as printed on your official passport or academic marksheets',
          type: 'text',
          required: true,
          placeholder: 'e.g. Rahul Sharma / Maria Rossi'
        },
        {
          id: 'email',
          step: 1,
          category: 'personal_study',
          questionNumberLabel: 'Q2',
          title: 'Email Address',
          subtitle: 'Your evaluation report and preliminary decision will be emailed here',
          type: 'text',
          required: true,
          placeholder: 'e.g. rahul.sharma@example.com'
        },
        {
          id: 'phone',
          step: 1,
          category: 'personal_study',
          questionNumberLabel: 'Q3',
          title: 'Mobile / WhatsApp Number',
          subtitle: 'Include country code (e.g., +91, +971, +39) for advisor WhatsApp consultation',
          type: 'text',
          required: true,
          placeholder: 'e.g. +91 98765 43210'
        },
        {
          id: 'targetCountry',
          step: 1,
          category: 'personal_study',
          questionNumberLabel: 'Q4',
          title: 'Which country do you want to study in?',
          subtitle: 'Select your primary destination of interest. You can also explore multi-country applications.',
          type: 'select-grid',
          required: true,
          allowOther: true,
          otherPlaceholder: 'Enter custom country name...',
          options: [
            { id: 'c-italy', label: 'Italy', value: 'Italy', description: '100% Regional DSU Scholarships & 0€ Tuition' },
            { id: 'c-uk', label: 'United Kingdom', value: 'United Kingdom', description: '1-Year Master’s & 2-Year Graduate Route' },
            { id: 'c-usa', label: 'United States', value: 'USA', description: 'World-Leading Research & 3-Year STEM OPT' },
            { id: 'c-germany', label: 'Germany', value: 'Germany', description: '0€ Tuition Public Universities & High Tech' },
            { id: 'c-france', label: 'France', value: 'France', description: '5-Year Circulation Visa & Elite Grandes Écoles' },
            { id: 'c-ireland', label: 'Ireland', value: 'Ireland', description: 'European Tech Hub & 2-Year Post-Study Visa' },
            { id: 'c-canada', label: 'Canada', value: 'Canada', description: 'Post-Graduation Work Permit & Quality Colleges' },
            { id: 'c-australia', label: 'Australia', value: 'Australia', description: 'Group of Eight Unis & High Living Standards' },
            { id: 'c-dubai', label: 'Dubai (UAE)', value: 'Dubai', description: 'Tax-Free Career Hub & Branch Campuses' },
            { id: 'c-nz', label: 'New Zealand', value: 'New Zealand', description: 'Safe Environment & Industry-Linked Education' }
          ]
        },
        {
          id: 'studyLevel',
          step: 1,
          category: 'personal_study',
          questionNumberLabel: 'Q5',
          title: 'What degree level are you seeking to apply for?',
          subtitle: 'Select Undergraduate or Postgraduate to load tailored academic qualification checks',
          type: 'radio',
          required: true,
          options: [
            {
              id: 'sl-masters',
              label: "Master's Degree (Laurea Magistrale / MSc / MA / MBA)",
              value: "Master's",
              description: 'Requires a recognized 3 or 4-year Bachelor’s degree'
            },
            {
              id: 'sl-bachelors',
              label: "Bachelor's Degree (Laurea Triennale / BSc / BA / BEng)",
              value: "Bachelor's",
              description: 'Requires Class 12 (10+2) or equivalent 12 years of schooling'
            }
          ]
        },
        {
          id: 'intendedField',
          step: 1,
          category: 'personal_study',
          questionNumberLabel: 'Q6',
          title: 'What is your intended field or course of interest?',
          subtitle: 'Choose your desired area of study to check university department requirements',
          type: 'select-grid',
          required: true,
          allowOther: true,
          otherPlaceholder: 'Specify your exact field (e.g. Cybersecurity, Fashion Marketing)...',
          options: [
            { id: 'f-cs', label: 'Computer Science / IT', value: 'Computer Science / IT' },
            { id: 'f-ai', label: 'Data Science & Artificial Intelligence', value: 'Data Science & Artificial Intelligence' },
            { id: 'f-biz', label: 'Business, Management & MBA', value: 'Business, Management & MBA' },
            { id: 'f-eng', label: 'Engineering (Mechanical, Civil, Electrical)', value: 'Engineering (Mechanical, Civil, Electrical)' },
            { id: 'f-econ', label: 'Economics, Finance & Banking', value: 'Economics, Finance & Banking' },
            { id: 'f-arts', label: 'Arts, Humanities & Social Sciences', value: 'Arts, Humanities & Social Sciences' },
            { id: 'f-arch', label: 'Architecture & Interior Design', value: 'Architecture & Interior Design' },
            { id: 'f-bio', label: 'Biotechnology, Healthcare & Pharmacy', value: 'Biotechnology, Healthcare & Pharmacy' },
            { id: 'f-hosp', label: 'Hospitality, Tourism & Event Management', value: 'Hospitality, Tourism & Event Management' },
            { id: 'f-law', label: 'Law & International Relations', value: 'Law & International Relations' }
          ]
        },
        {
          id: 'intake',
          step: 1,
          category: 'personal_study',
          questionNumberLabel: 'Q7',
          title: 'Target University Intake',
          subtitle: 'Select the academic semester when you intend to commence your studies',
          type: 'select-grid',
          required: true,
          allowOther: true,
          otherPlaceholder: 'Enter custom intake (e.g. Summer 2027)...',
          options: [
            { id: 'in-sep26', label: 'Fall / September 2026 Intake', value: 'September 2026 Intake', description: 'Primary European & Global Intake' },
            { id: 'in-jan27', label: 'Spring / January 2027 Intake', value: 'January 2027 Intake', description: 'Secondary Mid-Year Intake' },
            { id: 'in-sep27', label: 'Fall / September 2027 Intake', value: 'September 2027 Intake', description: 'Long-term Planning' },
            { id: 'in-now', label: 'Immediate / Next Available Intake', value: 'Immediate / Next Available Intake', description: 'Fast-track rolling admissions' }
          ]
        }
      ]
    },
    {
      id: 'academic_background',
      stepNumber: 2,
      title: 'Step 2: Academic Background & Scores',
      description: 'Prior schooling, Class 12 board marks, Bachelor degrees, CGPA/percentage, and diploma credentials.',
      iconName: 'GraduationCap',
      questions: [
        {
          id: 'completedClass12',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q8 (Bachelors)',
          title: 'Have you completed your Class 12 / Higher Secondary board exam?',
          subtitle: 'Required for Bachelor applicants to verify 12-year formal education criterion',
          type: 'radio',
          targetDegreeLevel: 'bachelors',
          options: [
            { id: 'c12-yes', label: 'Yes, passed Class 12 Board Exams', value: 'Yes' },
            { id: 'c12-pursuing', label: 'Currently in Class 12 (Appearing / Awaiting Final Results)', value: 'No, currently pursuing' }
          ]
        },
        {
          id: 'class12Percentage',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q9 (Bachelors)',
          title: 'Class 12 Aggregate Percentage / Board Score',
          subtitle: 'Enter your overall percentage (e.g. 74.5) across all subjects',
          type: 'number',
          targetDegreeLevel: 'bachelors',
          placeholder: 'e.g. 75.5'
        },
        {
          id: 'applyingDiplomaRoute',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q10 (Bachelors)',
          title: 'Did you complete a 3-Year Polytechnic Diploma after 10th instead of traditional 12th?',
          subtitle: 'Alternative vocational pathway recognition check',
          type: 'radio',
          targetDegreeLevel: 'bachelors',
          options: [
            { id: 'dip-no', label: 'No (Regular 10+2 Schooling)', value: 'No' },
            { id: 'dip-yes', label: 'Yes (10th + 3-Year State Board Technical Diploma)', value: 'Yes' }
          ]
        },
        {
          id: 'diplomaPercentage',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q11 (Bachelors)',
          title: '3-Year Polytechnic Diploma Aggregate Percentage',
          subtitle: 'Overall percentage obtained across all 6 semesters',
          type: 'number',
          targetDegreeLevel: 'bachelors',
          placeholder: 'e.g. 78.0'
        },
        {
          id: 'bachelorsDegreeName',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q8 (Masters)',
          title: 'What Bachelor’s degree have you completed or are pursuing?',
          subtitle: 'Choose from common degree types or select Other to type yours',
          type: 'select-grid',
          targetDegreeLevel: 'masters',
          allowOther: true,
          otherPlaceholder: 'Type your exact Bachelor degree name...',
          options: [
            { id: 'bd-btech', label: 'B.Tech / B.E. (Engineering)', value: 'B.Tech / B.E.' },
            { id: 'bd-bsc', label: 'B.Sc (Bachelor of Science)', value: 'B.Sc' },
            { id: 'bd-bca', label: 'BCA (Bachelor of Computer Applications)', value: 'BCA' },
            { id: 'bd-bcom', label: 'B.Com (Commerce & Accounting)', value: 'B.Com' },
            { id: 'bd-bba', label: 'BBA / BMS (Business Administration)', value: 'BBA' },
            { id: 'bd-ba', label: 'BA (Bachelor of Arts)', value: 'BA' }
          ]
        },
        {
          id: 'bachelorsSpecialisation',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q9 (Masters)',
          title: 'Bachelor’s Major / Specialisation',
          subtitle: 'Subject stream of your undergraduate study',
          type: 'text',
          targetDegreeLevel: 'masters',
          placeholder: 'e.g. Computer Science, Mechanical, Finance, Biotechnology'
        },
        {
          id: 'completedBachelors',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q10 (Masters)',
          title: 'Have you graduated / completed your Bachelor’s degree?',
          subtitle: 'Indicate whether you possess your final degree certificate or are in final year',
          type: 'radio',
          targetDegreeLevel: 'masters',
          options: [
            { id: 'cb-yes', label: 'Yes, graduated and have degree / marksheets', value: 'Yes' },
            { id: 'cb-pursuing', label: 'Currently in final year / 7th or 8th semester', value: 'No, currently pursuing' }
          ]
        },
        {
          id: 'scoreType',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q11 (Masters)',
          title: 'Score Evaluation System',
          subtitle: 'Select whether your university evaluates in Percentage or CGPA',
          type: 'radio',
          targetDegreeLevel: 'masters',
          options: [
            { id: 'st-pct', label: 'Percentage (out of 100%)', value: 'Percentage' },
            { id: 'st-cgpa', label: 'CGPA Grade Point Average', value: 'CGPA' }
          ]
        },
        {
          id: 'specificItDegree',
          step: 2,
          category: 'academic_background',
          questionNumberLabel: 'Q12 (Masters)',
          title: 'Degree Discipline Classification (for Tech & Management matching)',
          subtitle: 'Ensures course prerequisites and curriculum credit alignment',
          type: 'select-grid',
          targetDegreeLevel: 'masters',
          options: [
            { id: 'sit-btech', label: 'B.Tech / B.E. (Computer / IT / Software)', value: 'B.Tech / B.E. (Computer / IT)' },
            { id: 'sit-bsc-cs', label: 'B.Sc Computer Science', value: 'B.Sc Computer Science' },
            { id: 'sit-bsc-it', label: 'B.Sc Information Technology', value: 'B.Sc Information Technology' },
            { id: 'sit-bca', label: 'BCA (Computer Applications)', value: 'BCA' },
            { id: 'sit-other-eng', label: 'Other Engineering Branch', value: 'Other Computer/IT degree' },
            { id: 'sit-non-tech', label: 'Non-Technical / Commerce / Arts', value: 'Other' }
          ]
        }
      ]
    },
    {
      id: 'gap_work_exp',
      stepNumber: 3,
      title: 'Step 3: Education Gap & Work Experience',
      description: 'Study hiatus justifications, professional career history, job roles, and industrial sectors.',
      iconName: 'Briefcase',
      questions: [
        {
          id: 'hasEducationGap',
          step: 3,
          category: 'gap_work_exp',
          questionNumberLabel: 'Q13 / Gap 1',
          title: 'Do you have any study or education gap after your last completed qualification?',
          subtitle: 'A gap is any period of 6+ months without formal academic enrollment',
          type: 'radio',
          options: [
            { id: 'gap-no', label: 'No gap (Continuous academic progression)', value: 'No' },
            { id: 'gap-yes', label: 'Yes, I have an academic gap', value: 'Yes' }
          ]
        },
        {
          id: 'gapYears',
          step: 3,
          category: 'gap_work_exp',
          questionNumberLabel: 'Gap Duration',
          title: 'Total duration of education gap',
          subtitle: 'Cumulative gap years after completion of prior degree',
          type: 'dropdown',
          options: [
            { id: 'gy-1', label: 'Less than 1 year', value: '1' },
            { id: 'gy-2', label: '1 to 2 years', value: '2' },
            { id: 'gy-3', label: '2 to 3 years', value: '3' },
            { id: 'gy-5', label: '3 to 5 years', value: '4' },
            { id: 'gy-5plus', label: 'More than 5 years', value: '6' }
          ]
        },
        {
          id: 'gapReason',
          step: 3,
          category: 'gap_work_exp',
          questionNumberLabel: 'Gap Justification',
          title: 'Primary reason for your education gap',
          subtitle: 'Universities and visa consulates review this to verify bona fide intent',
          type: 'select-grid',
          allowOther: true,
          otherPlaceholder: 'Detail custom gap reason...',
          options: [
            { id: 'gr-work', label: 'Professional Work Experience', value: 'Work experience' },
            { id: 'gr-exam', label: 'Exam Preparation (GATE, CAT, UPSC, GRE)', value: 'Preparing for competitive exams' },
            { id: 'gr-personal', label: 'Family & Personal Commitments', value: 'Family / personal reasons' },
            { id: 'gr-med', label: 'Medical or Health Reasons', value: 'Medical reasons' },
            { id: 'gr-upskill', label: 'Independent Upskilling & Freelancing', value: 'Freelance & Upskilling' }
          ]
        },
        {
          id: 'hasWorkExperience',
          step: 3,
          category: 'gap_work_exp',
          questionNumberLabel: 'Work Exp Check',
          title: 'Do you have any full-time professional work experience?',
          subtitle: 'Relevant job experience significantly strengthens admission & scholarship profiles',
          type: 'radio',
          options: [
            { id: 'wx-no', label: 'No full-time experience (Fresher)', value: 'No' },
            { id: 'wx-yes', label: 'Yes, have professional experience', value: 'Yes' }
          ]
        },
        {
          id: 'workExperienceYears',
          step: 3,
          category: 'gap_work_exp',
          questionNumberLabel: 'Work Duration',
          title: 'Total years of full-time professional experience',
          subtitle: 'Total months or years in corporate / registered employment',
          type: 'dropdown',
          options: [
            { id: 'wy-1', label: 'Less than 1 year', value: '1' },
            { id: 'wy-2', label: '1 to 2 years', value: '2' },
            { id: 'wy-3', label: '2 to 4 years', value: '3' },
            { id: 'wy-5', label: '4 to 6 years', value: '5' },
            { id: 'wy-6plus', label: '6+ years', value: '7' }
          ]
        },
        {
          id: 'industry',
          step: 3,
          category: 'gap_work_exp',
          questionNumberLabel: 'Work Industry',
          title: 'Industry Sector of Your Employment',
          subtitle: 'Select the commercial or technical domain of your career',
          type: 'select-grid',
          allowOther: true,
          otherPlaceholder: 'Specify industry...',
          options: [
            { id: 'ind-it', label: 'Information Technology & Software', value: 'IT / Technology' },
            { id: 'ind-fin', label: 'Banking, Finance & Fintech', value: 'Banking / Finance' },
            { id: 'ind-mfg', label: 'Manufacturing & Engineering', value: 'Manufacturing / Automotive' },
            { id: 'ind-health', label: 'Healthcare & Pharmaceuticals', value: 'Healthcare / Pharma' },
            { id: 'ind-ed', label: 'Education & EdTech', value: 'Education' },
            { id: 'ind-media', label: 'Marketing, Media & Design', value: 'Marketing / Media' }
          ]
        }
      ]
    },
    {
      id: 'language_requirements',
      stepNumber: 4,
      title: 'Step 4: Language Proficiency & Requirements',
      description: 'IELTS/TOEFL scores, Medium of Instruction (MOI) waivers, and creative portfolio status.',
      iconName: 'Globe2',
      questions: [
        {
          id: 'ieltsStatus',
          step: 4,
          category: 'language_requirements',
          questionNumberLabel: 'Q16 / English Test',
          title: 'What is your English Language Proficiency test status?',
          subtitle: 'Assess university English language entry requirements & waiver options',
          type: 'select-grid',
          options: [
            { id: 'es-plan', label: 'Planning to take IELTS / TOEFL soon', value: 'Planning to take IELTS' },
            { id: 'es-done', label: 'Already taken IELTS (Have scorecard)', value: 'Yes' },
            { id: 'es-no', label: 'No test yet (Seeking MOI English Waiver)', value: 'No' }
          ]
        },
        {
          id: 'moiAvailable',
          step: 4,
          category: 'language_requirements',
          questionNumberLabel: 'MOI Certificate',
          title: 'Can you provide an English Medium of Instruction (MOI) certificate from your college?',
          subtitle: 'Certifies that your prior degree was taught entirely in English; waives IELTS in many institutions',
          type: 'radio',
          options: [
            { id: 'moi-yes', label: 'Yes, college can issue MOI Certificate', value: 'Yes' },
            { id: 'moi-no', label: 'No, degree was not in English', value: 'No' },
            { id: 'moi-not-sure', label: 'Not sure / Need counselor guidance', value: 'Not sure' }
          ]
        },
        {
          id: 'isArchitectureDesign',
          step: 4,
          category: 'language_requirements',
          questionNumberLabel: 'Creative Portfolio',
          title: 'Are you applying for Architecture, Design, Fashion, or Fine Arts?',
          subtitle: 'These programs require portfolio review alongside academic scores',
          type: 'radio',
          options: [
            { id: 'ad-no', label: 'No (General / STEM / Business Course)', value: 'No' },
            { id: 'ad-yes', label: 'Yes (Architecture, Design, Fashion, Arts)', value: 'Yes' }
          ]
        },
        {
          id: 'hasPortfolio',
          step: 4,
          category: 'language_requirements',
          questionNumberLabel: 'Portfolio Readiness',
          title: 'Do you have a design or creative portfolio ready?',
          subtitle: 'A curated showcase of your creative or architectural projects',
          type: 'radio',
          options: [
            { id: 'pf-yes', label: 'Yes, portfolio is ready', value: 'Yes' },
            { id: 'pf-prep', label: 'Can prepare one / In progress', value: 'Can prepare one' },
            { id: 'pf-no', label: 'No portfolio / Need guidance', value: 'No' }
          ]
        }
      ]
    },
    {
      id: 'documents_scholarship',
      stepNumber: 5,
      title: 'Step 5: Documents & Scholarship Readiness',
      description: 'Document inventory checklist, annual family income bands, financial proof, and target timelines.',
      iconName: 'FileCheck',
      questions: [
        {
          id: 'availableDocuments',
          step: 5,
          category: 'documents_scholarship',
          questionNumberLabel: 'Q18 / Documents',
          title: 'Which academic and personal documents do you currently have available?',
          subtitle: 'Check all documents you currently possess (or can readily retrieve within 1-2 weeks)',
          type: 'multi-select',
          options: [
            { id: 'doc-pass', label: 'Passport (Valid for at least 1–2 years)', value: 'Passport' },
            { id: 'doc-10', label: 'Class 10 Marksheet / Certificate', value: 'Class 10 marksheet' },
            { id: 'doc-12', label: 'Class 12 Marksheet / Certificate', value: 'Class 12 marksheet' },
            { id: 'doc-dip', label: 'Diploma Marksheets & Certificate (if applicable)', value: 'Diploma certificate/marksheet (if applicable)' },
            { id: 'doc-bm', label: 'Bachelor’s Marksheets (All individual semesters)', value: "Bachelor's marksheets (all semesters)" },
            { id: 'doc-bd', label: 'Bachelor’s Provisional / Original Degree Certificate', value: "Bachelor's degree certificate / Provisional" },
            { id: 'doc-ielts', label: 'IELTS / TOEFL / PTE Test Scorecard', value: 'IELTS result scorecard' },
            { id: 'doc-moi', label: 'English Medium of Instruction (MOI) Letter', value: 'Medium of Instruction (MOI) certificate' },
            { id: 'doc-cv', label: 'Updated Curriculum Vitae (CV / Resume)', value: 'Curriculum Vitae (CV / Resume)' },
            { id: 'doc-sop', label: 'Statement of Purpose (SOP)', value: 'Statement of Purpose (SOP)' },
            { id: 'doc-lor', label: 'Letters of Recommendation (LORs) from Professors/Managers', value: 'Letters of Recommendation (LORs)' },
            { id: 'doc-trans', label: 'Official University Academic Transcript', value: 'Official Academic Transcript' },
            { id: 'doc-port', label: 'Design / Creative Portfolio', value: 'Creative Portfolio (Architecture / Design)' }
          ]
        },
        {
          id: 'scholarshipInterest',
          step: 5,
          category: 'documents_scholarship',
          questionNumberLabel: 'Scholarship Grant',
          title: 'Are you interested in applying for Government, Regional or Merit Scholarships?',
          subtitle: 'Provides 100% tuition waiver plus living stipends up to €7,500/year (or country equivalent)',
          type: 'radio',
          options: [
            { id: 'sc-yes', label: 'Yes, definitely interested in scholarships', value: 'Yes' },
            { id: 'sc-know', label: 'I would like to know more about grant requirements', value: 'I would like to know more' },
            { id: 'sc-no', label: 'No, self-funded / will apply through education loan', value: 'No' }
          ]
        },
        {
          id: 'familyIncomeRange',
          step: 5,
          category: 'documents_scholarship',
          questionNumberLabel: 'Income Band',
          title: 'Estimated Gross Annual Family Income (for Means-Tested Scholarship Eligibility)',
          subtitle: 'Regional government grants (like Italy DSU) require family income under ~₹22 Lakhs (€25,000)',
          type: 'select-grid',
          options: [
            { id: 'inc-1', label: 'Below ₹2.5 Lakhs (Top priority for 100% full grant)', value: 'Below ₹2.5 lakh' },
            { id: 'inc-2', label: '₹2.5 Lakhs – ₹5 Lakhs (High eligibility for grants)', value: '₹2.5–5 lakh' },
            { id: 'inc-3', label: '₹5 Lakhs – ₹10 Lakhs (Eligible for regional grants)', value: '₹5–10 lakh' },
            { id: 'inc-4', label: '₹10 Lakhs – ₹15 Lakhs (Moderate eligibility)', value: '₹10–15 lakh' },
            { id: 'inc-5', label: '₹15 Lakhs – ₹22 Lakhs (Borderline eligibility)', value: '₹15–20 lakh' },
            { id: 'inc-6', label: 'Above ₹22 Lakhs (Merit-based scholarships only)', value: 'Above ₹20 lakh' }
          ]
        },
        {
          id: 'canProvideFinancialDocs',
          step: 5,
          category: 'documents_scholarship',
          questionNumberLabel: 'Financial Proof',
          title: 'Can your family provide income tax returns, salary slips, or property certificates for scholarship filing?',
          subtitle: 'Required for embassy legalization and scholarship regional parity calculation',
          type: 'radio',
          options: [
            { id: 'fd-yes', label: 'Yes, family can provide official financial documentation', value: 'Yes' },
            { id: 'fd-help', label: 'Need guidance from PrimiPassi on financial certificates', value: 'Not sure' }
          ]
        },
        {
          id: 'applicationIntent',
          step: 5,
          category: 'documents_scholarship',
          questionNumberLabel: 'Timeline Intent',
          title: 'When do you intend to officially commence your university application filing?',
          subtitle: 'Helps us assign admission deadlines and quota priorities',
          type: 'select-grid',
          options: [
            { id: 'ti-imm', label: 'Immediately (Within 2 weeks)', value: 'Immediately' },
            { id: 'ti-1m', label: 'Within 1 month', value: 'Within 1 month' },
            { id: 'ti-3m', label: 'Within 1 to 3 months', value: 'Within 3 months' },
            { id: 'ti-6m', label: '3 to 6 months from now', value: '3–6 months' },
            { id: 'ti-exp', label: 'Just researching & exploring options', value: 'Just exploring' }
          ]
        }
      ]
    }
  ]
};
