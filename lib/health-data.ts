export interface HealthArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "hygiene" | "nutrition" | "maternal" | "vaccination" | "chronic" | "child";
  readTime: number;
  iconName: string;
  iconSet: "Ionicons" | "MaterialCommunityIcons" | "Feather";
}

export interface SymptomArea {
  id: string;
  name: string;
  iconName: string;
  symptoms: Symptom[];
}

export interface Symptom {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
}

export interface SymptomResult {
  condition: string;
  description: string;
  severity: "low" | "medium" | "high";
  recommendations: string[];
  seekDoctor: boolean;
}

export const symptomAreas: SymptomArea[] = [
  {
    id: "head",
    name: "Head & Brain",
    iconName: "head-outline",
    symptoms: [
      { id: "headache", name: "Headache", severity: "mild" },
      { id: "dizziness", name: "Dizziness", severity: "moderate" },
      { id: "fever", name: "Fever", severity: "moderate" },
      { id: "blurred_vision", name: "Blurred Vision", severity: "severe" },
      { id: "confusion", name: "Confusion", severity: "severe" },
    ],
  },
  {
    id: "chest",
    name: "Chest & Lungs",
    iconName: "lungs",
    symptoms: [
      { id: "cough", name: "Cough", severity: "mild" },
      { id: "breathing_difficulty", name: "Breathing Difficulty", severity: "severe" },
      { id: "chest_pain", name: "Chest Pain", severity: "severe" },
      { id: "wheezing", name: "Wheezing", severity: "moderate" },
      { id: "phlegm", name: "Phlegm/Mucus", severity: "mild" },
    ],
  },
  {
    id: "stomach",
    name: "Stomach & Digestion",
    iconName: "stomach",
    symptoms: [
      { id: "nausea", name: "Nausea", severity: "mild" },
      { id: "vomiting", name: "Vomiting", severity: "moderate" },
      { id: "diarrhea", name: "Diarrhea", severity: "moderate" },
      { id: "stomach_pain", name: "Stomach Pain", severity: "moderate" },
      { id: "bloating", name: "Bloating", severity: "mild" },
      { id: "blood_stool", name: "Blood in Stool", severity: "severe" },
    ],
  },
  {
    id: "skin",
    name: "Skin & Body",
    iconName: "hand-back-left-outline",
    symptoms: [
      { id: "rash", name: "Skin Rash", severity: "mild" },
      { id: "itching", name: "Itching", severity: "mild" },
      { id: "swelling", name: "Swelling", severity: "moderate" },
      { id: "wound", name: "Open Wound", severity: "moderate" },
      { id: "bruising", name: "Bruising", severity: "mild" },
      { id: "yellowing", name: "Yellowing Skin", severity: "severe" },
    ],
  },
  {
    id: "general",
    name: "General",
    iconName: "human",
    symptoms: [
      { id: "fatigue", name: "Fatigue", severity: "mild" },
      { id: "weight_loss", name: "Weight Loss", severity: "moderate" },
      { id: "night_sweats", name: "Night Sweats", severity: "moderate" },
      { id: "joint_pain", name: "Joint Pain", severity: "moderate" },
      { id: "muscle_weakness", name: "Muscle Weakness", severity: "moderate" },
    ],
  },
];

export function analyzeSymptoms(selectedSymptoms: Symptom[]): SymptomResult {
  const severeCount = selectedSymptoms.filter((s) => s.severity === "severe").length;
  const moderateCount = selectedSymptoms.filter((s) => s.severity === "moderate").length;

  if (severeCount > 0) {
    return {
      condition: "Needs Immediate Medical Attention",
      description: "Your symptoms suggest a condition that needs urgent medical evaluation. Please visit your nearest health center or hospital.",
      severity: "high",
      recommendations: [
        "Visit the nearest hospital immediately",
        "If available, call an ambulance",
        "Do not self-medicate",
        "Keep the patient hydrated",
        "Inform a community health worker",
      ],
      seekDoctor: true,
    };
  }

  if (moderateCount >= 2 || selectedSymptoms.length >= 4) {
    return {
      condition: "Medical Consultation Recommended",
      description: "Multiple symptoms detected. It is advised to consult a doctor within 24-48 hours for proper diagnosis and treatment.",
      severity: "medium",
      recommendations: [
        "Schedule a doctor visit within 1-2 days",
        "Rest and stay hydrated",
        "Monitor symptoms closely",
        "Contact ASHA worker for guidance",
        "Avoid strenuous activities",
      ],
      seekDoctor: true,
    };
  }

  return {
    condition: "Home Care May Be Sufficient",
    description: "Your symptoms appear mild. You can try home remedies and rest. If symptoms persist for more than 3 days, consult a doctor.",
    severity: "low",
    recommendations: [
      "Get adequate rest",
      "Drink plenty of water and fluids",
      "Eat nutritious food",
      "Monitor symptoms for 2-3 days",
      "Contact health worker if symptoms worsen",
    ],
    seekDoctor: false,
  };
}

export const healthArticles: HealthArticle[] = [
  {
    id: "1",
    title: "Hand Washing: Your First Defense",
    summary: "Learn the proper 7-step hand washing technique recommended by WHO to prevent infections.",
    content: "Proper hand washing is one of the most effective ways to prevent the spread of diseases. The WHO recommends washing hands for at least 20 seconds with soap and clean water.\n\nWhen to wash hands:\n- Before cooking or eating\n- After using the toilet\n- After coughing or sneezing\n- After touching animals\n- After handling garbage\n\n7 Steps of Hand Washing:\n1. Wet hands with clean water\n2. Apply soap to palms\n3. Rub palms together\n4. Rub the back of each hand\n5. Clean between fingers\n6. Rub fingertips on palms\n7. Clean thumbs and wrists\n\nDry hands with a clean cloth or air dry them. This simple practice can reduce diarrheal diseases by 30% and respiratory infections by 20%.",
    category: "hygiene",
    readTime: 3,
    iconName: "water-outline",
    iconSet: "Ionicons",
  },
  {
    id: "2",
    title: "Safe Drinking Water at Home",
    summary: "Simple methods to purify water at home using boiling, chlorination, and filtration.",
    content: "Clean drinking water is essential for preventing waterborne diseases like cholera, typhoid, and diarrhea.\n\nBoiling Method:\n- Bring water to a rolling boil for at least 1 minute\n- Let it cool naturally in a covered container\n- Store in clean, covered vessels\n\nChlorination:\n- Use government-supplied chlorine tablets\n- Follow dosage instructions on the packet\n- Wait 30 minutes before drinking\n\nFiltration:\n- Use clay pot filters or candle filters\n- Clean filters regularly\n- Replace as recommended\n\nStorage Tips:\n- Always use covered containers\n- Never dip hands in stored water\n- Use a ladle or tap to dispense\n- Clean storage vessels weekly",
    category: "hygiene",
    readTime: 4,
    iconName: "water",
    iconSet: "Ionicons",
  },
  {
    id: "3",
    title: "Balanced Diet on a Budget",
    summary: "How to create nutritious meals using locally available grains, vegetables, and pulses.",
    content: "A balanced diet is crucial for good health. You can eat well even on a modest budget using locally available foods.\n\nDaily Requirements:\n- Grains: 4-6 rotis or 3 cups rice\n- Pulses/Dal: 1-2 cups\n- Vegetables: 3-4 servings\n- Fruits: 1-2 servings\n- Milk/Curd: 1 glass\n\nBudget-Friendly Nutrition Tips:\n- Buy seasonal vegetables (they are cheaper and fresher)\n- Grow greens like spinach, methi in your garden\n- Sprout moong/chana for added nutrition\n- Include jaggery instead of sugar for iron\n- Use groundnuts and sesame seeds for protein\n\nFor Children:\n- Add ghee or oil to dal and rice\n- Include eggs if available\n- Give fruit between meals\n- Breastfeed infants exclusively for 6 months",
    category: "nutrition",
    readTime: 5,
    iconName: "nutrition-outline",
    iconSet: "Ionicons",
  },
  {
    id: "4",
    title: "Iron-Rich Foods for Anemia",
    summary: "Combat anemia with these readily available iron-rich foods and cooking tips.",
    content: "Anemia (low blood/khoon ki kami) is very common in rural India, especially among women and children.\n\nIron-Rich Foods:\n- Green leafy vegetables (palak, sarson, bathua)\n- Jaggery (gud)\n- Dates (khajoor)\n- Ragi/finger millet\n- Chana/chickpeas\n- Poha/beaten rice\n\nCooking Tips to Increase Iron Absorption:\n- Cook in iron kadhai/pots\n- Add lemon juice to dal and vegetables\n- Avoid tea/coffee with meals\n- Eat vitamin C-rich fruits after meals\n\nSigns of Anemia:\n- Pale nails and skin\n- Tiredness and weakness\n- Dizziness\n- Breathlessness on exertion\n\nIf you notice these signs, visit your health center for iron tablets.",
    category: "nutrition",
    readTime: 4,
    iconName: "leaf-outline",
    iconSet: "Ionicons",
  },
  {
    id: "5",
    title: "Prenatal Care Essentials",
    summary: "Important checkups, nutrition, and warning signs during pregnancy.",
    content: "Regular prenatal care ensures a healthy pregnancy for both mother and baby.\n\nCheckup Schedule:\n- First visit: As soon as pregnancy is confirmed\n- Monthly visits until 7 months\n- Every 2 weeks in 8th month\n- Weekly in the 9th month\n\nEssential Nutrients:\n- Iron and folic acid tablets (given free at govt centers)\n- Calcium supplements\n- Extra food: one more roti and dal per day\n- Plenty of water and milk\n\nDanger Signs (Seek Help Immediately):\n- Bleeding from vagina\n- Severe headache or blurred vision\n- High fever\n- Swelling on face and hands\n- Baby not moving\n- Water breaking before time\n\nImmunization:\n- Tetanus toxoid (TT) injection is mandatory\n- Usually given at 4th and 8th month",
    category: "maternal",
    readTime: 5,
    iconName: "baby-carriage",
    iconSet: "MaterialCommunityIcons",
  },
  {
    id: "6",
    title: "Safe Delivery Practices",
    summary: "Why institutional delivery is important and what to prepare for.",
    content: "Delivering at a hospital or health center is the safest option for both mother and baby.\n\nWhy Hospital Delivery:\n- Trained doctors and nurses available\n- Emergency equipment if needed\n- Clean and sterile environment\n- Free under government schemes (JSY/JSSK)\n\nWhat to Pack:\n- Mother's ID and health card\n- Clean clothes for mother and baby\n- Sanitary pads\n- Towels and bedsheet\n- Food and water\n\nGovernment Benefits:\n- Janani Suraksha Yojana: Cash incentive for institutional delivery\n- Free ambulance service (108/102)\n- Free treatment during delivery\n- Free medicines and blood if needed\n\nAfter Delivery:\n- Start breastfeeding within 1 hour\n- Keep baby warm (skin-to-skin contact)\n- Visit health center for postnatal checkup",
    category: "maternal",
    readTime: 4,
    iconName: "hospital-box-outline",
    iconSet: "MaterialCommunityIcons",
  },
  {
    id: "7",
    title: "Child Vaccination Schedule",
    summary: "Complete vaccination chart from birth to 5 years as per government program.",
    content: "Vaccination protects children from dangerous diseases. All vaccines are given FREE at government health centers.\n\nAt Birth:\n- BCG (Tuberculosis)\n- OPV-0 (Polio)\n- Hepatitis B - Birth dose\n\nAt 6 Weeks:\n- OPV-1, Pentavalent-1\n- Rotavirus-1, PCV-1\n\nAt 10 Weeks:\n- OPV-2, Pentavalent-2\n- Rotavirus-2\n\nAt 14 Weeks:\n- OPV-3, Pentavalent-3\n- Rotavirus-3, PCV-2, IPV-1\n\nAt 9 Months:\n- Measles/MR-1, PCV Booster\n- Vitamin A - 1st dose\n\nAt 16-24 Months:\n- DPT Booster-1, OPV Booster\n- Measles/MR-2, Vitamin A - 2nd dose\n\nAt 5-6 Years:\n- DPT Booster-2\n\nKeep the vaccination card safe. Visit your nearest Anganwadi or PHC on vaccination day.",
    category: "vaccination",
    readTime: 4,
    iconName: "shield-checkmark-outline",
    iconSet: "Ionicons",
  },
  {
    id: "8",
    title: "Managing Diabetes at Home",
    summary: "Diet, exercise, and medication tips for controlling blood sugar levels.",
    content: "Diabetes (sugar ki bimari) is increasingly common. It can be managed well with proper care.\n\nDiet Tips:\n- Eat at regular times, never skip meals\n- Choose whole grains over refined flour\n- Eat plenty of vegetables\n- Limit rice, prefer roti\n- Avoid sweets, cold drinks, packaged foods\n- Use small plates to control portions\n\nExercise:\n- Walk briskly for 30 minutes daily\n- Do light exercises or yoga\n- Avoid sitting for long periods\n\nMedication:\n- Take medicines on time as prescribed\n- Never skip doses\n- Get blood sugar checked monthly\n- Keep a record of readings\n\nDanger Signs:\n- Excessive thirst and urination\n- Wounds that don't heal\n- Blurred vision\n- Numbness in hands/feet\n- Sudden weight loss\n\nRegular checkups at PHC are important.",
    category: "chronic",
    readTime: 5,
    iconName: "heart-pulse",
    iconSet: "MaterialCommunityIcons",
  },
  {
    id: "9",
    title: "Preventing Malaria & Dengue",
    summary: "Protect your family from mosquito-borne diseases with these simple steps.",
    content: "Malaria and dengue are spread by mosquito bites. Prevention is the best cure.\n\nPrevention Methods:\n- Sleep under mosquito nets (LLIN provided free)\n- Use mosquito repellent creams\n- Wear full-sleeve clothes in evening\n- Don't let water stagnate around home\n- Cover water storage containers\n- Use window screens\n\nRemove Breeding Sites:\n- Empty coolers and flower pots weekly\n- Fill ditches and potholes\n- Clean drains regularly\n- Turn over unused buckets and containers\n\nSymptoms of Malaria:\n- High fever with chills\n- Headache and body pain\n- Sweating after fever reduces\n\nSymptoms of Dengue:\n- High fever for 2-7 days\n- Severe body and joint pain\n- Rash on skin\n- Bleeding from nose/gums\n\nSeek treatment immediately at PHC. Rapid diagnostic tests are free.",
    category: "hygiene",
    readTime: 4,
    iconName: "bug-outline",
    iconSet: "Ionicons",
  },
  {
    id: "10",
    title: "Newborn Care: First 28 Days",
    summary: "Essential care practices for newborns including feeding, warmth, and hygiene.",
    content: "The first 28 days of a baby's life are critical. Proper care during this period prevents many health problems.\n\nFeeding:\n- Start breastfeeding within 1 hour of birth\n- Give only breast milk for 6 months\n- Feed on demand (8-12 times daily)\n- No water, honey, or ghutti needed\n\nWarmth:\n- Keep baby in skin-to-skin contact\n- Dress baby in one more layer than adults\n- Keep room warm, avoid drafts\n- Bathe only after umbilical cord falls off\n\nCord Care:\n- Keep the cord stump clean and dry\n- Do not apply anything on it\n- It falls off naturally in 7-10 days\n\nDanger Signs (Rush to Hospital):\n- Not feeding well or refusing feeds\n- Fever or body feels cold\n- Fast breathing or chest indrawing\n- Yellow skin and eyes\n- Convulsions\n- Less than 6 wet nappies a day\n\nVisit health center on day 3, 7, 14, and 28.",
    category: "child",
    readTime: 5,
    iconName: "baby-face-outline",
    iconSet: "MaterialCommunityIcons",
  },
];

export const categoryLabels: Record<HealthArticle["category"], string> = {
  hygiene: "Hygiene",
  nutrition: "Nutrition",
  maternal: "Maternal Health",
  vaccination: "Vaccination",
  chronic: "Chronic Disease",
  child: "Child Health",
};

export const categoryColors: Record<HealthArticle["category"], string> = {
  hygiene: "#0EA5E9",
  nutrition: "#22C55E",
  maternal: "#EC4899",
  vaccination: "#8B5CF6",
  chronic: "#F97316",
  child: "#06B6D4",
};
