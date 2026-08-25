export type RoleKey = 'chro' | 'clo' | 'ld' | 'cxo' | 'other';
export type ExposureKey = 'user' | 'non_user';
export type QuestionType = 'text' | 'email' | 'single_select' | 'multi_select' | 'likert_5' | 'open_text';

export interface OptionItem {
  label: string;
  value: string;
  hasTextInput?: boolean;
}

export interface LikertOption {
  value: number;
  label: string;
  description?: string;
}

export interface QuestionDefinition {
  id: string;
  code: string;
  tag: string;
  title: string;
  subtitle?: string;
  section: 'participant_info' | 'demographics' | 'core_strategy' | 'user_program' | 'user_impact' | 'non_user_route' | 'open_text' | 'follow_up';
  sectionTitle: string;
  type: QuestionType;
  options?: OptionItem[];
  maxSelections?: number;
  likertOptions?: LikertOption[];
  wordLimit?: { min: number; max: number; suggestion: string };
  placeholder?: string;
  route: 'all' | 'user_only' | 'non_user_only';
  roleMatrix?: Partial<Record<RoleKey, 'required' | 'optional' | 'skip'>>;
}

export const ROLE_OPTIONS: OptionItem[] = [
  { label: "CHRO / CPO / HR Head", value: "chro" },
  { label: "CLO / Talent Head", value: "clo" },
  { label: "Head L&D / OD / Leadership Development", value: "ld" },
  { label: "Business Leader / CXO sponsor", value: "cxo" },
  { label: "Other senior people leader", value: "other", hasTextInput: true },
];

export const STANDARD_LIKERT_1_5_ASSESS: LikertOption[] = [
  { value: 1, label: "1 - No observable contribution" },
  { value: 2, label: "2 - Small" },
  { value: 3, label: "3 - Moderate" },
  { value: 4, label: "4 - Strong" },
  { value: 5, label: "5 - Very strong" },
  { value: 99, label: "Too early / not able to assess" },
];

export const QUESTIONS: QuestionDefinition[] = [
  // ==========================================
  // PARTICIPANT INFO (NAME & EMAIL FIRST)
  // ==========================================
  {
    id: "Q00_NAME",
    code: "respondent_name",
    tag: "Full Name",
    section: "participant_info",
    sectionTitle: "1. Participant Profile",
    title: "What is your full name?",
    subtitle: "Your information is treated with strict confidentiality.",
    type: "text",
    route: "all",
    placeholder: "e.g. Rahul Sharma",
  },
  {
    id: "Q00_EMAIL",
    code: "respondent_email",
    tag: "Work Email",
    section: "participant_info",
    sectionTitle: "1. Participant Profile",
    title: "What is your official work email address?",
    subtitle: "We will use this to share the published NHRD × xMonks 2026 executive research report with you.",
    type: "email",
    route: "all",
    placeholder: "e.g. rahul.sharma@company.com",
  },

  // ==========================================
  // CORE DEMOGRAPHICS (Q01 - Q06)
  // ==========================================
  {
    id: "Q01",
    code: "industry",
    tag: "Industry",
    section: "demographics",
    sectionTitle: "2. Organization Profile",
    title: "Which industry best describes your organization’s primary business?",
    type: "single_select",
    route: "all",
    options: [
      { label: "IT / Technology", value: "IT/Technology" },
      { label: "BFSI", value: "BFSI" },
      { label: "Manufacturing / Industrial", value: "Manufacturing/Industrial" },
      { label: "Pharma / Healthcare", value: "Pharma/Healthcare" },
      { label: "FMCG / Consumer", value: "FMCG/Consumer" },
      { label: "Consulting / Professional Services", value: "Consulting/Professional Services" },
      { label: "Retail / E-commerce", value: "Retail/E-commerce" },
      { label: "Hospitality / Travel / Aviation", value: "Hospitality/Travel/Aviation" },
      { label: "Energy / Utilities / Infrastructure", value: "Energy/Utilities/Infrastructure" },
      { label: "Telecom / Media", value: "Telecom/Media" },
      { label: "Automotive", value: "Automotive" },
      { label: "PSU / Government enterprise", value: "PSU/Government enterprise" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q02",
    code: "org_size",
    tag: "Org size",
    section: "demographics",
    sectionTitle: "2. Organization Profile",
    title: "Approximately how many employees does your organization have in India?",
    type: "single_select",
    route: "all",
    options: [
      { label: "Fewer than 500", value: "Fewer than 500" },
      { label: "500–1,999", value: "500–1,999" },
      { label: "2,000–9,999", value: "2,000–9,999" },
      { label: "10,000–49,999", value: "10,000–49,999" },
      { label: "50,000 or more", value: "50,000 or more" },
      { label: "Not sure", value: "Not sure" },
    ],
  },
  {
    id: "Q03",
    code: "ownership",
    tag: "Ownership",
    section: "demographics",
    sectionTitle: "2. Organization Profile",
    title: "Which ownership structure best describes your organization?",
    type: "single_select",
    route: "all",
    options: [
      { label: "Indian private", value: "Indian private" },
      { label: "Indian listed / public", value: "Indian listed/public" },
      { label: "MNC subsidiary", value: "MNC subsidiary" },
      { label: "Family-owned / promoter-led", value: "Family-owned/promoter-led" },
      { label: "PSU / Government", value: "PSU/Government" },
      { label: "Not-for-profit / social enterprise", value: "Not-for-profit/social enterprise" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q04",
    code: "region_hq",
    tag: "Region HQ",
    section: "demographics",
    sectionTitle: "2. Organization Profile",
    title: "Where is your organization’s India head office or primary operating HQ located?",
    type: "single_select",
    route: "all",
    options: [
      { label: "North", value: "North" },
      { label: "South", value: "South" },
      { label: "West", value: "West" },
      { label: "East", value: "East" },
      { label: "Central", value: "Central" },
      { label: "Multiple India hubs / no single HQ", value: "Multiple India hubs/no single HQ" },
      { label: "Outside India", value: "Outside India" },
      { label: "Not sure", value: "Not sure" },
    ],
  },
  {
    id: "Q05",
    code: "resp_role",
    tag: "Designation & Role",
    section: "demographics",
    sectionTitle: "3. Designation & Perspective",
    title: "Which role best describes you?",
    subtitle: "This tailors the subsequent questions specifically to your strategic vantage point.",
    type: "single_select",
    route: "all",
    options: ROLE_OPTIONS,
  },
  {
    id: "Q06",
    code: "coach_exposure",
    tag: "Coaching exposure",
    section: "demographics",
    sectionTitle: "3. Designation & Perspective",
    title: "Which statement best describes your organization’s current use of coaching?",
    subtitle: "This determines whether you see questions for active coaching users or prospective evaluators.",
    type: "single_select",
    route: "all",
    options: [
      { label: "Structured coaching user", value: "Structured coaching user" },
      { label: "Selective / past / informal user", value: "Selective/past/informal user" },
      { label: "Prospective user considering coaching", value: "Prospective user considering coaching" },
      { label: "Non-user with no active plans", value: "Non-user with no active plans" },
      { label: "Unsure", value: "Unsure" },
    ],
  },

  // ==========================================
  // CORE STRATEGY, STAGE & BARRIERS (Q10 - Q13)
  // ==========================================
  {
    id: "Q10",
    code: "coach_stage",
    tag: "Coaching stage",
    section: "core_strategy",
    sectionTitle: "4. Organizational Coaching Context",
    title: "Which statement best describes your organization’s current coaching stage?",
    type: "single_select",
    route: "all",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    options: [
      { label: "No formal coaching exposure", value: "No formal coaching exposure" },
      { label: "Isolated or ad hoc use", value: "Isolated or ad hoc use" },
      { label: "Emerging but not standardized", value: "Emerging but not standardized" },
      { label: "Formal program in some parts of the organization", value: "Formal program in some parts of the organization" },
      { label: "Scaled across leadership segments", value: "Scaled across leadership segments" },
      { label: "Embedded into talent, culture, and business processes", value: "Embedded into talent, culture, and business processes" },
      { label: "Not sure", value: "Not sure" },
    ],
  },
  {
    id: "Q11",
    code: "adoption_barriers",
    tag: "Barriers",
    section: "core_strategy",
    sectionTitle: "4. Organizational Coaching Context",
    title: "What are the main barriers to wider adoption or deeper embedding of coaching in your organization?",
    subtitle: "Please select up to five.",
    type: "multi_select",
    maxSelections: 5,
    route: "all",
    roleMatrix: {
      chro: "required",
      clo: "optional",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    options: [
      { label: "Budget constraints", value: "Budget constraints" },
      { label: "Limited senior sponsorship", value: "Limited senior sponsorship" },
      { label: "Hard to measure impact/ROI", value: "Hard to measure impact/ROI" },
      { label: "Lack of internal capability", value: "Lack of internal capability" },
      { label: "Limited manager time", value: "Limited manager time" },
      { label: "Confidentiality concerns", value: "Confidentiality concerns" },
      { label: "Coaching seen as remedial or elite-only", value: "Coaching seen as remedial or elite-only" },
      { label: "Unclear provider quality", value: "Unclear provider quality" },
      { label: "Competing interventions already in place", value: "Competing interventions already in place" },
      { label: "Unclear business case", value: "Unclear business case" },
      { label: "Cultural resistance", value: "Cultural resistance" },
      { label: "Not applicable", value: "Not applicable" },
      { label: "Other (specify)", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q12",
    code: "coach_integration",
    tag: "Integration",
    section: "core_strategy",
    sectionTitle: "4. Organizational Coaching Context",
    title: "To what extent is coaching integrated into leadership, talent, or people processes in your organization?",
    type: "likert_5",
    route: "all",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    likertOptions: [
      { value: 1, label: "1 Not at all integrated" },
      { value: 2, label: "2 Limited pilot-level integration" },
      { value: 3, label: "3 Integrated into some processes" },
      { value: 4, label: "4 Integrated into several processes" },
      { value: 5, label: "5 Well integrated into talent and business processes" },
      { value: 99, label: "Not sure" },
    ],
  },
  {
    id: "Q13",
    code: "impact_measurement",
    tag: "Measurement",
    section: "core_strategy",
    sectionTitle: "4. Organizational Coaching Context",
    title: "To what extent does your organization measure coaching using defined indicators, review mechanisms, or outcome data?",
    type: "likert_5",
    route: "all",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    likertOptions: [
      { value: 1, label: "1 Not measured" },
      { value: 2, label: "2 Measured informally" },
      { value: 3, label: "3 Some indicators used" },
      { value: 4, label: "4 Structured review and metrics in place" },
      { value: 5, label: "5 Well-defined metrics and periodic review" },
      { value: 99, label: "Not sure" },
    ],
  },

  // ==========================================
  // USER ROUTE: MODALITIES & COVERAGE (Q07U - Q09U)
  // ==========================================
  {
    id: "Q07U",
    code: "coach_modalities",
    tag: "Modalities",
    section: "user_program",
    sectionTitle: "5. Coaching Modalities & Reach",
    title: "Which coaching modalities are currently used in your organization?",
    subtitle: "Please select all that apply.",
    type: "multi_select",
    route: "user_only",
    roleMatrix: {
      chro: "optional",
      clo: "required",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    options: [
      { label: "External executive/leadership coaching", value: "External executive/leadership coaching" },
      { label: "Internal coach pool", value: "Internal coach pool" },
      { label: "Team coaching", value: "Team coaching" },
      { label: "Group coaching", value: "Group coaching" },
      { label: "Manager-as-coach", value: "Manager-as-coach" },
      { label: "Transition/onboarding coaching", value: "Transition/onboarding coaching" },
      { label: "Coaching linked to succession/high potentials", value: "Coaching linked to succession/high potentials" },
      { label: "Informal or case-by-case coaching only", value: "Informal or case-by-case coaching only" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q08U",
    code: "coach_coverage",
    tag: "Coverage",
    section: "user_program",
    sectionTitle: "5. Coaching Modalities & Reach",
    title: "Which employee groups are currently covered by coaching?",
    subtitle: "Please select all that apply.",
    type: "multi_select",
    route: "user_only",
    roleMatrix: {
      chro: "optional",
      clo: "required",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    options: [
      { label: "CXO/Board", value: "CXO/Board" },
      { label: "Enterprise leaders", value: "Enterprise leaders" },
      { label: "Senior managers", value: "Senior managers" },
      { label: "People managers", value: "People managers" },
      { label: "High potentials", value: "High potentials" },
      { label: "First-time managers", value: "First-time managers" },
      { label: "Critical talent", value: "Critical talent" },
      { label: "Project teams", value: "Project teams" },
      { label: "Frontline/plant/customer-facing leaders", value: "Frontline/plant/customer-facing leaders" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q09U",
    code: "coach_years",
    tag: "Coaching duration",
    section: "user_program",
    sectionTitle: "5. Coaching Modalities & Reach",
    title: "For approximately how long has coaching been used in your organization?",
    type: "single_select",
    route: "user_only",
    roleMatrix: {
      chro: "optional",
      clo: "required",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    options: [
      { label: "Less than 1 year", value: "Less than 1 year" },
      { label: "1–2 years", value: "1–2 years" },
      { label: "3–5 years", value: "3–5 years" },
      { label: "More than 5 years", value: "More than 5 years" },
      { label: "Not sure", value: "Not sure" },
    ],
  },

  // ==========================================
  // USER ROUTE: MULTIDIMENSIONAL IMPACT (Q14U - Q21U)
  // ==========================================
  {
    id: "Q14U",
    code: "out_individual",
    tag: "Leadership impact",
    section: "user_impact",
    sectionTitle: "6. The Coaching Ripple Effect & Impact",
    title: "Based on what you have observed, to what extent has coaching contributed to leadership-maturity outcomes such as self-awareness, emotional regulation, judgment, accountability, and clarity?",
    type: "likert_5",
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "required",
      cxo: "required",
      other: "required",
    },
    likertOptions: STANDARD_LIKERT_1_5_ASSESS,
  },
  {
    id: "Q15U",
    code: "out_team",
    tag: "Team impact",
    section: "user_impact",
    sectionTitle: "6. The Coaching Ripple Effect & Impact",
    title: "To what extent has coaching contributed to team outcomes such as trust, psychological safety, collaboration, inclusion, learning, or resilience?",
    type: "likert_5",
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "required",
      cxo: "required",
      other: "required",
    },
    likertOptions: STANDARD_LIKERT_1_5_ASSESS,
  },
  {
    id: "Q16U",
    code: "out_org",
    tag: "Organization impact",
    section: "user_impact",
    sectionTitle: "6. The Coaching Ripple Effect & Impact",
    title: "To what extent has coaching contributed to organizational outcomes such as succession readiness, leadership pipeline strength, engagement, retention, performance culture, or organizational health?",
    type: "likert_5",
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "required",
      cxo: "required",
      other: "required",
    },
    likertOptions: STANDARD_LIKERT_1_5_ASSESS,
  },
  {
    id: "Q17U",
    code: "out_business",
    tag: "Business impact",
    section: "user_impact",
    sectionTitle: "6. The Coaching Ripple Effect & Impact",
    title: "To what extent has coaching contributed to business outcomes such as strategic execution, agility, innovation, decision quality, or productivity?",
    type: "likert_5",
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "skip",
      ld: "skip",
      cxo: "required",
      other: "required",
    },
    likertOptions: STANDARD_LIKERT_1_5_ASSESS,
  },
  {
    id: "Q18U",
    code: "out_stakeholder",
    tag: "Stakeholder impact",
    section: "user_impact",
    sectionTitle: "6. The Coaching Ripple Effect & Impact",
    title: "To what extent has coaching contributed to stakeholder outcomes such as customer experience, supplier/partner relationships, cross-boundary collaboration, negotiation quality, or stakeholder trust?",
    type: "likert_5",
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "skip",
      ld: "skip",
      cxo: "required",
      other: "required",
    },
    likertOptions: STANDARD_LIKERT_1_5_ASSESS,
  },
  {
    id: "Q19U",
    code: "out_ecosystem",
    tag: "Ecosystem impact",
    section: "user_impact",
    sectionTitle: "6. The Coaching Ripple Effect & Impact",
    title: "To what extent has coaching contributed to wider ecosystem or community outcomes such as responsible leadership, mentoring, volunteering, social responsibility, industry capability, or community participation?",
    type: "likert_5",
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "skip",
      ld: "skip",
      cxo: "required",
      other: "required",
    },
    likertOptions: STANDARD_LIKERT_1_5_ASSESS,
  },
  {
    id: "Q20U",
    code: "roi_value",
    tag: "Value / Investment",
    section: "user_impact",
    sectionTitle: "7. Value & ROI of Coaching",
    title: "Overall, how would you describe the value created by coaching relative to the time, effort, and money invested?",
    type: "likert_5",
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "skip",
      cxo: "required",
      other: "required",
    },
    likertOptions: [
      { value: 1, label: "1 Much lower than investment" },
      { value: 2, label: "2 Slightly lower" },
      { value: 3, label: "3 Broadly commensurate" },
      { value: 4, label: "4 Higher than investment" },
      { value: 5, label: "5 Significantly higher" },
      { value: 99, label: "Too early / not able to assess" },
    ],
  },
  {
    id: "Q21U",
    code: "roi_metrics",
    tag: "Metrics",
    section: "user_impact",
    sectionTitle: "7. Value & ROI of Coaching",
    title: "Which indicators does your organization use, or most trust, when judging coaching value? Please select up to five.",
    type: "multi_select",
    maxSelections: 5,
    route: "user_only",
    roleMatrix: {
      chro: "required",
      clo: "required",
      ld: "required",
      cxo: "skip",
      other: "required",
    },
    options: [
      { label: "360/behaviour change feedback", value: "360/behaviour change feedback" },
      { label: "Promotion or transition success", value: "Promotion or transition success" },
      { label: "Leadership pipeline/succession readiness", value: "Leadership pipeline/succession readiness" },
      { label: "Retention of key talent", value: "Retention of key talent" },
      { label: "Engagement scores", value: "Engagement scores" },
      { label: "Team climate / psychological safety", value: "Team climate / psychological safety" },
      { label: "Performance/productivity indicators", value: "Performance/productivity indicators" },
      { label: "Innovation/change adoption", value: "Innovation/change adoption" },
      { label: "Customer/stakeholder feedback", value: "Customer/stakeholder feedback" },
      { label: "Ethical decision quality / risk outcomes", value: "Ethical decision quality / risk outcomes" },
      { label: "No formal indicators", value: "No formal indicators" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },

  // ==========================================
  // NON-USER ROUTE (Q07N - Q17N)
  // ==========================================
  {
    id: "Q07N",
    code: "alt_interventions",
    tag: "Alternative interventions",
    section: "non_user_route",
    sectionTitle: "5. Alternative Interventions & Potential",
    title: "Which approaches does your organization currently use instead of, or in place of, formal coaching? Please select all that apply.",
    type: "multi_select",
    route: "non_user_only",
    options: [
      { label: "Leadership training", value: "Leadership training" },
      { label: "Mentoring", value: "Mentoring" },
      { label: "Manager capability programmes", value: "Manager capability programmes" },
      { label: "Assessment/development centres", value: "Assessment/development centres" },
      { label: "Action learning / projects / job rotations", value: "Action learning / projects / job rotations" },
      { label: "OD / facilitation / consulting", value: "OD / facilitation / consulting" },
      { label: "None in particular", value: "None in particular" },
      { label: "Not sure", value: "Not sure" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q08N",
    code: "potential_coverage",
    tag: "Potential coverage",
    section: "non_user_route",
    sectionTitle: "5. Alternative Interventions & Potential",
    title: "If coaching were to be used in your organization, which groups would be the most likely starting point? Please select up to three.",
    type: "multi_select",
    maxSelections: 3,
    route: "non_user_only",
    options: [
      { label: "CXO/Board", value: "CXO/Board" },
      { label: "Senior leaders", value: "Senior leaders" },
      { label: "People managers", value: "People managers" },
      { label: "High potentials", value: "High potentials" },
      { label: "First-time managers", value: "First-time managers" },
      { label: "Critical talent", value: "Critical talent" },
      { label: "Project teams", value: "Project teams" },
      { label: "Frontline/customer-facing leaders", value: "Frontline/customer-facing leaders" },
      { label: "Unsure", value: "Unsure" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q09N",
    code: "adoption_horizon",
    tag: "Adoption horizon",
    section: "non_user_route",
    sectionTitle: "5. Alternative Interventions & Potential",
    title: "Which statement best describes your organization’s likely coaching horizon?",
    type: "single_select",
    route: "non_user_only",
    options: [
      { label: "Likely within 12 months", value: "Likely within 12 months" },
      { label: "Possibly within 12–24 months", value: "Possibly within 12–24 months" },
      { label: "No active plans", value: "No active plans" },
      { label: "Unsure", value: "Unsure" },
    ],
  },
  {
    id: "Q14N",
    code: "evidence_needed",
    tag: "Evidence needed",
    section: "non_user_route",
    sectionTitle: "6. Evaluation & Conditions for Adoption",
    title: "What evidence would matter most if your organization were evaluating coaching? Please select up to three.",
    type: "multi_select",
    maxSelections: 3,
    route: "non_user_only",
    options: [
      { label: "Leadership behaviour change", value: "Leadership behaviour change" },
      { label: "Team climate / trust / collaboration", value: "Team climate / trust / collaboration" },
      { label: "Succession readiness", value: "Succession readiness" },
      { label: "Retention / engagement", value: "Retention / engagement" },
      { label: "Business execution / productivity", value: "Business execution / productivity" },
      { label: "Customer or stakeholder outcomes", value: "Customer or stakeholder outcomes" },
      { label: "Ethical conduct / decision quality", value: "Ethical conduct / decision quality" },
      { label: "External benchmarks / case studies", value: "External benchmarks / case studies" },
      { label: "ROI methodology", value: "ROI methodology" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q15N",
    code: "adoption_conditions",
    tag: "Adoption conditions",
    section: "non_user_route",
    sectionTitle: "6. Evaluation & Conditions for Adoption",
    title: "What conditions would most increase the likelihood of coaching adoption in your organization? Please select up to three.",
    type: "multi_select",
    maxSelections: 3,
    route: "non_user_only",
    options: [
      { label: "Stronger business case", value: "Stronger business case" },
      { label: "Senior sponsorship", value: "Senior sponsorship" },
      { label: "Budget availability", value: "Budget availability" },
      { label: "Better measurement framework", value: "Better measurement framework" },
      { label: "Trusted coaching providers", value: "Trusted coaching providers" },
      { label: "Internal capability", value: "Internal capability" },
      { label: "Clear target population", value: "Clear target population" },
      { label: "Cultural readiness", value: "Cultural readiness" },
      { label: "Strong peer benchmarks", value: "Strong peer benchmarks" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },
  {
    id: "Q16N",
    code: "adoption_likelihood",
    tag: "Adoption likelihood",
    section: "non_user_route",
    sectionTitle: "6. Evaluation & Conditions for Adoption",
    title: "How likely is your organization to consider a more formal coaching approach over the next 24 months?",
    type: "likert_5",
    route: "non_user_only",
    likertOptions: [
      { value: 1, label: "1 Very unlikely" },
      { value: 2, label: "2 Unlikely" },
      { value: 3, label: "3 Unsure" },
      { value: 4, label: "4 Likely" },
      { value: 5, label: "5 Very likely" },
    ],
  },
  {
    id: "Q17N",
    code: "perceived_value",
    tag: "Perceived value",
    section: "non_user_route",
    sectionTitle: "6. Evaluation & Conditions for Adoption",
    title: "If your organization were to adopt coaching, where do you believe it would be most likely to add value first?",
    type: "single_select",
    route: "non_user_only",
    options: [
      { label: "Individual leadership maturity", value: "Individual leadership maturity" },
      { label: "Team effectiveness", value: "Team effectiveness" },
      { label: "Organizational culture/talent pipeline", value: "Organizational culture/talent pipeline" },
      { label: "Business execution", value: "Business execution" },
      { label: "Stakeholder relationships", value: "Stakeholder relationships" },
      { label: "Too early to say", value: "Too early to say" },
      { label: "Other", value: "Other", hasTextInput: true },
    ],
  },

  // ==========================================
  // COMMON OPEN-TEXT QUESTIONS (Q22 - Q24)
  // ==========================================
  {
    id: "Q22",
    code: "open_key_outcome",
    tag: "Open: Key outcome",
    section: "open_text",
    sectionTitle: "8. Qualitative Insights & Reflections",
    title: "In your view, what is the single most significant outcome that coaching has created or could create in your organization?",
    type: "open_text",
    route: "all",
    wordLimit: { min: 30, max: 150, suggestion: "Suggested 50–120 words" },
    placeholder: "Share your perspective on the most transformative outcome...",
  },
  {
    id: "Q23",
    code: "open_ripple_example",
    tag: "Open: Ripple example",
    section: "open_text",
    sectionTitle: "8. Qualitative Insights & Reflections",
    title: "Please describe one example where coaching impact travelled beyond the individual leader or where it stopped before travelling further.",
    type: "open_text",
    route: "all",
    wordLimit: { min: 30, max: 180, suggestion: "Suggested 60–150 words" },
    placeholder: "Describe a specific example showing ripple effects or where it stopped...",
  },
  {
    id: "Q24",
    code: "open_conditions_risks",
    tag: "Open: Conditions & risks",
    section: "open_text",
    sectionTitle: "8. Qualitative Insights & Reflections",
    title: "What conditions, enablers, or risks most influence whether coaching impact becomes sustainable in your organization?",
    type: "open_text",
    route: "all",
    wordLimit: { min: 30, max: 180, suggestion: "Suggested 60–150 words" },
    placeholder: "Outline conditions, enablers, or systemic risks...",
  },

  // ==========================================
  // OPTIONAL FOLLOW-UP & CASE STUDY PERMISSIONS (C1 - C3)
  // ==========================================
  {
    id: "C1",
    code: "contact_interview",
    tag: "Follow-up interview",
    section: "follow_up",
    sectionTitle: "9. Follow-up & Case Study (Optional)",
    title: "May the Research Team contact you for a 45–60 minute follow-up executive interview?",
    subtitle: "Interviews delve deeper into organizational context, ripple mechanisms, and qualitative insights.",
    type: "single_select",
    route: "all",
    roleMatrix: {
      chro: "optional",
      clo: "optional",
      ld: "optional",
      cxo: "optional",
      other: "optional",
    },
    options: [
      { label: "Yes, I would be pleased to participate", value: "Yes" },
      { label: "No, survey only", value: "No" },
    ],
  },
  {
    id: "C2",
    code: "contact_case_study",
    tag: "Case study shortlist",
    section: "follow_up",
    sectionTitle: "9. Follow-up & Case Study (Optional)",
    title: "May the Research Team contact you if your organization is shortlisted for a confidential case study?",
    type: "single_select",
    route: "all",
    roleMatrix: {
      chro: "optional",
      clo: "optional",
      ld: "optional",
      cxo: "optional",
      other: "optional",
    },
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "C3",
    code: "case_study_approval",
    tag: "Attribution approval",
    section: "follow_up",
    sectionTitle: "9. Follow-up & Case Study (Optional)",
    title: "If case-study inclusion is considered later, would you require separate organizational approval before any attribution?",
    type: "single_select",
    route: "all",
    roleMatrix: {
      chro: "optional",
      clo: "optional",
      ld: "optional",
      cxo: "optional",
      other: "optional",
    },
    options: [
      { label: "Yes, formal internal approval required", value: "Yes" },
      { label: "No attribution needed (keep anonymous)", value: "No" },
      { label: "Not sure", value: "Not sure" },
    ],
  },
];

export type SurveyAnswers = Record<string, string | string[] | number | undefined>;

export function getExposureType(answers: SurveyAnswers): ExposureKey | null {
  const coachExposure = answers["Q06"] as string | undefined;
  if (!coachExposure) return null;
  if (
    coachExposure === "Structured coaching user" ||
    coachExposure === "Selective/past/informal user"
  ) {
    return "user";
  }
  return "non_user";
}

export function getSelectedRoleKey(answers: SurveyAnswers): RoleKey {
  const roleVal = answers["Q05"] as string | undefined;
  if (roleVal === "chro" || roleVal === "clo" || roleVal === "ld" || roleVal === "cxo") {
    return roleVal;
  }
  return "other";
}

export function getEligibleQuestions(answers: SurveyAnswers): QuestionDefinition[] {
  const exposure = getExposureType(answers);
  const roleKey = getSelectedRoleKey(answers);

  return QUESTIONS.filter((q) => {
    if (q.route === "user_only" && exposure !== "user") {
      return false;
    }
    if (q.route === "non_user_only" && exposure !== "non_user") {
      return false;
    }

    if (q.roleMatrix) {
      const requirement = q.roleMatrix[roleKey] || q.roleMatrix.other || "required";
      if (requirement === "skip") {
        return false;
      }
    }

    return true;
  });
}

export function isQuestionRequired(q: QuestionDefinition, answers: SurveyAnswers): boolean {
  const roleKey = getSelectedRoleKey(answers);
  if (q.roleMatrix) {
    const req = q.roleMatrix[roleKey] || q.roleMatrix.other || "required";
    return req === "required";
  }
  return true;
}
