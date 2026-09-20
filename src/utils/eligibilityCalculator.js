/**
 * Weighted 8-Factor Scheme Eligibility Calculator
 * Weightage:
 *  - Age = 20%
 *  - Annual Income = 20%
 *  - Occupation = 20%
 *  - Gender = 10%
 *  - State = 10%
 *  - Category = 10%
 *  - Disability Status = 5%
 *  - Special Status = 5%
 */
export const calculateWeightedEligibility = (userProfile = {}, schemeCriteria = {}) => {
  let score = 0;

  // 1. Age check (20%)
  const userAge = userProfile.age ? Number(userProfile.age) : 25;
  const minAge = schemeCriteria.minAge !== undefined ? schemeCriteria.minAge : 0;
  const maxAge = schemeCriteria.maxAge !== undefined ? schemeCriteria.maxAge : 100;
  if (userAge >= minAge && userAge <= maxAge) {
    score += 20;
  } else if (userAge < minAge && minAge - userAge <= 3) {
    score += 10;
  }

  // 2. Annual Income check (20%)
  const userIncome = userProfile.annualIncome !== undefined && userProfile.annualIncome !== null ? Number(userProfile.annualIncome) : 300000;
  const maxIncome = schemeCriteria.maxIncome !== undefined ? schemeCriteria.maxIncome : 100000000;
  if (userIncome <= maxIncome) {
    score += 20;
  } else if (userIncome <= maxIncome * 1.25) {
    score += 10;
  }

  // 3. Occupation check (20%)
  const userOccupation = (userProfile.occupation || '').toLowerCase();
  const schemeOccupations = (schemeCriteria.eligibleOccupations || ['All']).map((o) => o.toLowerCase());
  if (schemeOccupations.includes('all') || schemeOccupations.includes(userOccupation)) {
    score += 20;
  }

  // 4. Gender check (10%)
  const userGender = (userProfile.gender || 'All').toLowerCase();
  const schemeGender = (schemeCriteria.gender || 'All').toLowerCase();
  if (schemeGender === 'all' || schemeGender === userGender) {
    score += 10;
  }

  // 5. State check (10%)
  const userState = (userProfile.state || 'All').toLowerCase();
  const schemeStates = (schemeCriteria.eligibleStates || ['All']).map((s) => s.toLowerCase());
  if (schemeStates.includes('all') || schemeStates.includes(userState)) {
    score += 10;
  }

  // 6. Category check (10%)
  const userCategory = (userProfile.category || 'All').toLowerCase();
  const schemeCategories = (schemeCriteria.eligibleCategories || ['All']).map((c) => c.toLowerCase());
  if (schemeCategories.includes('all') || schemeCategories.includes(userCategory)) {
    score += 10;
  }

  // 7. Disability Status check (5%)
  const requiresDisability = schemeCriteria.requiresDisability || false;
  if (!requiresDisability || userProfile.disabilityStatus === true) {
    score += 5;
  }

  // 8. Special Status check (5%)
  const requiredSpecial = (schemeCriteria.requiredSpecialStatus || []).map((s) => s.toLowerCase());
  const userSpecial = (userProfile.specialStatus || []).map((s) => s.toLowerCase());
  if (requiredSpecial.length === 0) {
    score += 5;
  } else {
    const hasSpecial = requiredSpecial.some((req) => userSpecial.includes(req));
    if (hasSpecial) {
      score += 5;
    }
  }

  return Math.min(100, Math.round(score));
};

export const getEligibilityBadgeProps = (matchPercentage) => {
  if (matchPercentage === 100) {
    return {
      badgeClass: 'badge-eligible-100',
      label: '100% Eligible',
      text: 'You are 100% eligible for this scheme.',
      color: 'green',
    };
  } else if (matchPercentage >= 50) {
    return {
      badgeClass: 'badge-eligible-50',
      label: `${matchPercentage}% Match`,
      text: `Your profile matches this scheme by ${matchPercentage}%.`,
      color: 'orange',
    };
  } else {
    return {
      badgeClass: 'badge-eligible-low',
      label: `${matchPercentage}% Match`,
      text: `Your profile matches this scheme by ${matchPercentage}%.`,
      color: 'red',
    };
  }
};
