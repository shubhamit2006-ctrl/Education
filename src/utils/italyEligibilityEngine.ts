import { ItalyEligibilityFormData, PreliminaryEligibilityStatus } from '../types';

export interface EligibilityResult {
  status: PreliminaryEligibilityStatus;
  statusLabel: string;
  reasons: string[];
  flags: string[];
  rulesTriggered: string[];
  summaryMessage: string;
}

/**
 * Calculates preliminary eligibility for studying in Italy based on PrimiPassi admission guidelines.
 *
 * NOTE: This is a preliminary screening tool, NOT a guaranteed university admission decision.
 * Final admission eligibility depends on the selected university, course, intake, documents,
 * and university-specific requirements.
 */
export function calculateItalyPreliminaryEligibility(
  data: ItalyEligibilityFormData
): EligibilityResult {
  const reasons: string[] = [];
  const flags: string[] = [];
  const rulesTriggered: string[] = [];

  let academicCriterionMet = false;
  let academicCriterionFailed = false;

  // 1. ACADEMIC EVALUATION
  if (data.studyLevel === "Bachelor's") {
    rulesTriggered.push('RULE_BACHELORS_ACADEMIC');

    if (data.applyingDiplomaRoute === 'Yes') {
      const diploma = Number(data.diplomaPercentage) || 0;
      if (diploma >= 70) {
        academicCriterionMet = true;
        reasons.push(`✓ 10th + Diploma route: Diploma score of ${diploma}% meets the 70% preliminary criterion.`);
      } else {
        academicCriterionFailed = true;
        reasons.push(`✗ 10th + Diploma route: Diploma score of ${diploma}% is below the 70% preliminary criterion.`);
      }
    } else {
      const class12 = Number(data.class12Percentage) || 0;
      if (class12 >= 70) {
        academicCriterionMet = true;
        reasons.push(`✓ Class 12 percentage: ${class12}% meets the 70% preliminary criterion.`);
      } else {
        academicCriterionFailed = true;
        reasons.push(`✗ Class 12 percentage: ${class12}% is below the 70% preliminary criterion.`);
      }

      if (data.completedClass12 === 'No, currently pursuing') {
        flags.push('Currently pursuing Class 12; admission eligibility contingent on final board examination results (≥70%).');
      }
    }
  } else {
    // Master's flow
    rulesTriggered.push('RULE_MASTERS_ACADEMIC');

    const isComputerField =
      data.intendedField === 'Computer Science / IT' ||
      data.intendedField?.toLowerCase().includes('computer') ||
      data.intendedField?.toLowerCase().includes('it') ||
      (data.intendedFieldOther && /computer|software|data|cyber|ai|information/i.test(data.intendedFieldOther));

    const isSpecificItDegree =
      data.specificItDegree === 'B.Sc Computer Science' ||
      data.specificItDegree === 'B.Sc Information Technology' ||
      data.specificItDegree === 'BCA';

    // Parse score (handling percentage or CGPA)
    let effectivePercentage = 0;
    if (data.scoreType === 'CGPA') {
      const cgpa = Number(data.bachelorsCgpa) || 0;
      const scale = Number(data.cgpaScale) || 10;
      // Normalization guideline for 10-point scale: approx CGPA * 9.5 or (CGPA / scale) * 100
      effectivePercentage = scale === 10 ? cgpa * 9.5 : (cgpa / scale) * 100;
      effectivePercentage = Math.min(100, Math.max(0, effectivePercentage));
    } else {
      effectivePercentage = Number(data.bachelorsPercentage) || 0;
    }

    if (data.completedBachelors === 'No, currently pursuing') {
      const latest = Number(data.latestSemesterPercentage) || 0;
      const predicted = Number(data.predictedFinalPercentage) || 0;

      if (latest >= 65 && predicted >= 65) {
        academicCriterionMet = true;
        reasons.push(
          `✓ Currently pursuing Bachelor's: Latest semester (${latest}%) and predicted final (${predicted}%) meet the 65% guideline.`
        );
      } else {
        academicCriterionFailed = true;
        reasons.push(
          `✗ Pursuing Bachelor's: Scores (latest ${latest}%, predicted ${predicted}%) are below the 65% guideline.`
        );
      }
      flags.push("Currently pursuing Bachelor's; conditional assessment subject to final degree transcripts.");
    } else {
      // Completed Bachelor's
      if (effectivePercentage >= 65) {
        academicCriterionMet = true;
        reasons.push(
          `✓ Bachelor's academic performance (${effectivePercentage.toFixed(1)}%) meets the 65% preliminary criterion.`
        );
      } else {
        academicCriterionFailed = true;
        reasons.push(
          `✗ Bachelor's academic performance (${effectivePercentage.toFixed(1)}%) is below the 65% preliminary criterion.`
        );
      }
    }

    // Special IT / CS Rule
    if (isComputerField && isSpecificItDegree) {
      rulesTriggered.push('RULE_SPECIAL_IT_CS_BCA_80_PERCENT');
      if (effectivePercentage >= 80) {
        reasons.push(
          `✓ Special IT screening: Your ${data.specificItDegree} qualification meets the 80% criterion for Computer Master's.`
        );
      } else {
        flags.push(
          `Special IT screening note: B.Sc IT/CS or BCA applicants for Computer Master's typically require ≥80% (your score: ${effectivePercentage.toFixed(1)}%). Profile review required for university syllabus matching.`
        );
      }
    }
  }

  // 2. EDUCATION GAP EVALUATION
  if (data.hasEducationGap === 'Yes') {
    rulesTriggered.push('RULE_EDUCATION_GAP');
    const gapYears = Number(data.gapYears) || 0;
    const maxGapAllowed = data.studyLevel === "Bachelor's" ? 3 : 10;

    if (gapYears <= maxGapAllowed) {
      reasons.push(
        `✓ Education gap: ${gapYears} year(s) is within the preliminary guideline (max ${maxGapAllowed} years).`
      );
      if (data.gapReason) {
        reasons.push(`• Gap reason: ${data.gapReason}`);
      }
    } else {
      flags.push(
        `Education gap: ${gapYears} years exceeds the standard ${maxGapAllowed}-year guideline for ${data.studyLevel}; requires justification, work experience documentation, and counsellor review.`
      );
    }
  } else {
    reasons.push('✓ No education gap reported.');
  }

  // 3. WORK EXPERIENCE
  if (data.hasWorkExperience === 'Yes') {
    rulesTriggered.push('RULE_WORK_EXPERIENCE');
    const expYears = Number(data.workExperienceYears) || 0;
    reasons.push(
      `✓ Work Experience: ${expYears} year(s) in ${data.industry || 'Industry'} (${data.jobRole || 'Professional Role'}). Adds profile strength for Master's admissions.`
    );
  }

  // 4. ENGLISH PROFICIENCY & MOI
  rulesTriggered.push('RULE_ENGLISH_PROFICIENCY');
  if (data.ieltsStatus === 'Yes') {
    const score = Number(data.ieltsScore) || 0;
    if (score >= 6.0) {
      reasons.push(`✓ IELTS result available: Band ${score} meets typical Italian university English requirements.`);
    } else if (score >= 5.5) {
      reasons.push(`✓ IELTS result available: Band ${score} meets minimum thresholds for many Italian universities.`);
    } else {
      flags.push(`IELTS band ${score} may be borderline for select universities; retake or MOI review suggested.`);
    }
  } else if (data.ieltsStatus === 'Planning to take IELTS') {
    flags.push('Planning to take IELTS; counsellor will guide target band score requirements for chosen universities.');
  } else {
    // IELTS = No
    if (data.moiAvailable === 'Yes') {
      flags.push('Medium of Instruction (MOI) certificate indicated; counsellor will verify university-specific MOI acceptance.');
    } else {
      flags.push('No IELTS or MOI confirmed; English proficiency pathway needs evaluation with counsellor.');
    }
  }

  // 5. ARCHITECTURE / DESIGN PORTFOLIO CHECK
  const isArchDesign =
    data.isArchitectureDesign === 'Yes' ||
    data.intendedField === 'Architecture' ||
    data.intendedField === 'Design / Fashion Design';

  if (isArchDesign) {
    rulesTriggered.push('RULE_PORTFOLIO_REQUIRED');
    if (data.hasPortfolio === 'Yes') {
      reasons.push('✓ Creative portfolio is ready for Architecture / Design admissions review.');
    } else if (data.hasPortfolio === 'Can prepare one') {
      flags.push('Portfolio is required for Architecture/Design in Italy; PrimiPassi portfolio mentor review advised.');
    } else {
      flags.push('No portfolio currently; required for Architecture/Design courses in Italian polytechnics/academies.');
    }
  }

  // 6. SCHOLARSHIP & FINANCIAL
  if (data.scholarshipInterest === 'Yes') {
    rulesTriggered.push('RULE_SCHOLARSHIP_INTEREST');
    reasons.push(`• Expressed interest in Italy Regional Scholarships (DSU/ER.GO/DiSCo) with income range: ${data.familyIncomeRange || 'To be discussed'}.`);
  }

  // -------------------------------------------------------------------------
  // FINAL CLASSIFICATION LOGIC
  // -------------------------------------------------------------------------
  let status: PreliminaryEligibilityStatus = 'PROFILE_REVIEW';
  let statusLabel = 'Profile Review Required';
  let summaryMessage = '';

  if (academicCriterionFailed) {
    status = 'NOT_ELIGIBLE';
    statusLabel = 'Does Not Meet Preliminary Criteria';
    summaryMessage =
      'Based on the information provided, your profile does not currently meet our basic preliminary screening criteria for the selected study route. A counsellor may still review your profile for alternative options.';
  } else if (academicCriterionMet && flags.length === 0) {
    status = 'ELIGIBLE';
    statusLabel = 'Preliminarily Eligible';
    summaryMessage =
      'Your profile appears to meet our basic preliminary eligibility criteria for studying in Italy. Our counsellor will review your course and university options and contact you for the next steps.';
  } else {
    // Has academic minimum, but flags require profile review
    status = 'PROFILE_REVIEW';
    statusLabel = 'Profile Review Required';
    summaryMessage =
      'Your profile requires a detailed counsellor review because some eligibility factors depend on the university, course or supporting documents. Our counsellor will contact you to discuss your options.';
  }

  return {
    status,
    statusLabel,
    reasons,
    flags,
    rulesTriggered,
    summaryMessage
  };
}
