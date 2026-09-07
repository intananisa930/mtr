export const DOMAINS = [
  {
    id: "agri", name: "Smart Agriculture", icon: "🌾",
    color: "#84CC16",
    colorBg: "rgba(132,204,22,0.12)",
    colorBorder: "rgba(132,204,22,0.4)",
    techs: [
      { id: "agri-1", name: "INSPECTRA", use: "Palm Oil Quality Monitoring" },
      { id: "agri-2", name: "UGV", use: "Autonomous Plantation Operations" },
      { id: "agri-6", name: "Mi-ATNAV Cognitive", use: "Intelligent Perception for Autonomous Robots" },
      { id: "agri-3", name: "Mi-SWIS", use: "Smart Weighbridge Monitoring" },
      { id: "agri-4", name: "Mi-FFB Grader", use: "AI FFB Grading" },
      { id: "agri-5", name: "Mi-VGuard", use: "Smart Plantation Surveillance" },
    ],
  },
  {
    id: "city", name: "Smart City", icon: "🏙️",
    color: "#3B82F6",
    colorBg: "rgba(59,130,246,0.12)",
    colorBorder: "rgba(59,130,246,0.4)",
    techs: [
      { id: "city-1", name: "Mi-NEXA", use: "Smart City IoT Connectivity" },
      { id: "city-2", name: "Mi-PlateIQ", use: "Intelligent Vehicle Recognition" },
      { id: "city-3", name: "Mi-Percept", use: "AI Environment Perception" },
      { id: "city-4", name: "Mi-FaceIQ", use: "AI Identity Verification" },
      { id: "city-5", name: "Mi-Safety", use: "AI Public Safety Monitoring" },
      { id: "city-6", name: "IDFOS", use: "Intelligent Infrastructure Monitoring" },
      { id: "city-7", name: "Mi-ACE", use: "Intelligent Chiller Optimisation" },
      { id: "city-8", name: "AIREM", use: "Smart Energy Monitoring" },
      { id: "city-9", name: "Smart Inverter", use: "Smart Solar Energy" },
      { id: "city-10", name: "Mi-KidzAlert", use: "Smart Attendance & Child Safety" },
    ],
  },
  {
    id: "ind", name: "Industry Support & Services", icon: "⚙️",
    color: "#EC4899",
    colorBg: "rgba(236,72,153,0.12)",
    colorBorder: "rgba(236,72,153,0.4)",
    techs: [
      { id: "ind-1", name: "FAB", use: "Semiconductor Fabrication Services" },
      { id: "ind-2", name: "REL Lab", use: "Reliability Testing Services" },
      { id: "ind-3", name: "MBISeal", use: "Blockchain" },
      { id: "ind-4", name: "Quantum IDE", use: "Accelerated Quantum Research Validation" },
      { id: "ind-5", name: "Digital QKD", use: "Future-proof Encryption Key Distribution" },
    ],
  },
  {
    id: "health", name: "Healthcare", icon: "❤️",
    color: "#F43F5E",
    colorBg: "rgba(244,63,94,0.12)",
    colorBorder: "rgba(244,63,94,0.4)",
    techs: [
      { id: "health-1", name: "REVA", use: "Non-Invasive Health Screening" },
      { id: "health-2", name: "AINS", use: "AI Spectroscopy Analytics" },
      { id: "health-3", name: "Bioscan", use: "AI Saliva Diagnostics" },
    ],
  },
  {
    id: "mfg", name: "Smart Manufacturing", icon: "🏭",
    color: "#F59E0B",
    colorBg: "rgba(245,158,11,0.12)",
    colorBorder: "rgba(245,158,11,0.4)",
    techs: [
      { id: "mfg-1", name: "Mi-TEMS", use: "Predictive Equipment Monitoring" },
      { id: "mfg-2", name: "Mi-VisionAOI", use: "AI Quality Inspection" },
      { id: "mfg-3", name: "Mi-IndusData++", use: "Synthetic Data Generation" },
      { id: "mfg-4", name: "Mi-GraphInk", use: "Smart Sensor Design" },
      { id: "city-11", name: "Mi-ITS", use: "Real-Time Indoor Tracking" },
    ],
  },
  {
    id: "rmk13", name: "RMK-13", icon: "💡",
    color: "#F59E0B",
    colorBg: "rgba(245,158,11,0.12)",
    colorBorder: "rgba(245,158,11,0.4)",
    techs: [
      { id: "rmk13-1", name: "Mi-Muallim", use: "Quran Detection" },
      { id: "rmk13-2", name: "AI-Driven Cybersecurity", use: "" },
      { id: "rmk13-3", name: "Mi-PALSU", use: "Deepfake Detection" },
      { id: "rmk13-4", name: "Mi-CIPTA", use: "Deepfake Creation" },
      { id: "rmk13-6", name: "Blockchain Forensic Vault", use: "Digital Forensic Evidence Preservation" },
    ],
  },
];

export const DOMAIN_IDS = DOMAINS.map(d => d.id);

export function isEligible(stamps) {
  const visitedAllDomains = DOMAINS.every(d => d.techs.some(t => stamps.includes(t.id)));
  const hasEnoughStamps = stamps.length >= 10;
  return visitedAllDomains && hasEnoughStamps;
}

export const QUIZ_QUESTIONS = {
  mimos: [
    {
      text: "What is the primary role of MIMOS Berhad in Malaysia?",
      options: ["Mobile phone manufacturer", "National ICT R&D centre", "Social media platform", "Cloud hosting provider"],
      correct: 1,
      explain: "MIMOS Berhad is Malaysia's national ICT research and development centre, driving innovation for national development.",
    },
    {
      text: "Under which Malaysian ministry does MIMOS operate?",
      options: ["Ministry of Health", "Ministry of Digital", "Ministry of Finance", "Ministry of Education"],
      correct: 1,
      explain: "MIMOS operates under the Ministry of Digital, supporting Malaysia's digital economy agenda.",
    },
    {
      text: "What does MTR stand for?",
      options: ["Malaysian Tech Review", "MIMOS Technology Roadshow", "Modern Technology Research", "Malaysian Tech Rally"],
      correct: 1,
      explain: "MTR stands for MIMOS Technology Roadshow — an annual showcase of MIMOS innovations.",
    },
    {
      text: "Where is MIMOS headquartered?",
      options: ["Johor Bahru", "Penang", "Technology Park Malaysia, KL", "Cyberjaya"],
      correct: 2,
      explain: "MIMOS Berhad is headquartered in Technology Park Malaysia, Kuala Lumpur.",
    },
    {
      text: "What type of organisation is MIMOS?",
      options: ["Private company", "Government-linked company", "NGO", "University"],
      correct: 1,
      explain: "MIMOS is a government-linked company (GLC) under the Ministry of Digital Malaysia.",
    },
  ],
  tech: [
    {
      text: "Which MIMOS technology monitors palm oil Fresh Fruit Bunch quality?",
      options: ["Mi-NEXA", "Mi-TEMS", "INSPECTRA", "Bioscan"],
      correct: 2,
      explain: "INSPECTRA uses AI to assess the quality of Fresh Fruit Bunches (FFB) in palm oil production.",
    },
    {
      text: "Mi-FaceIQ is best described as:",
      options: ["Weather prediction system", "AI identity verification", "Soil analysis tool", "Water quality monitor"],
      correct: 1,
      explain: "Mi-FaceIQ is MIMOS's AI-powered face recognition technology for identity verification.",
    },
    {
      text: "Which technology performs predictive equipment monitoring in factories?",
      options: ["REVA", "Mi-TEMS", "Mi-KidzAlert", "Digital QKD"],
      correct: 1,
      explain: "Mi-TEMS uses AI for predictive maintenance and equipment monitoring in smart manufacturing.",
    },
    {
      text: "What does REVA primarily do?",
      options: ["Surgical assistance", "Non-invasive health screening", "Drug manufacturing", "Hospital management"],
      correct: 1,
      explain: "REVA uses advanced sensors for non-invasive health screening without needles or invasive procedures.",
    },
    {
      text: "Which MIMOS technology provides Smart City IoT connectivity?",
      options: ["INSPECTRA", "Mi-NEXA", "Mi-TEMS", "Bioscan"],
      correct: 1,
      explain: "Mi-NEXA is MIMOS's Smart City IoT connectivity platform.",
    },
    {
      text: "Mi-KidzAlert is designed for:",
      options: ["Factory monitoring", "Student attendance and child safety", "Agriculture", "Cybersecurity"],
      correct: 1,
      explain: "Mi-KidzAlert is a smart attendance and child safety monitoring system for schools.",
    },
    {
      text: "What does Bioscan use to detect diseases?",
      options: ["Blood samples", "X-rays", "Saliva samples", "Urine samples"],
      correct: 2,
      explain: "Bioscan uses AI to analyse saliva samples for non-invasive disease detection.",
    },
  ],
  industry: [
    {
      text: "Which industry benefits most from automated visual inspection like Mi-VisionAOI?",
      options: ["Tourism", "Manufacturing", "Education", "Hospitality"],
      correct: 1,
      explain: "Mi-VisionAOI detects defects on production lines — most valuable in manufacturing quality control.",
    },
    {
      text: "A plantation wants to automate FFB weighing. Which technology?",
      options: ["Mi-NEXA", "Mi-SWIS", "AIREM", "Mi-ACE"],
      correct: 1,
      explain: "Mi-SWIS (Smart Weighbridge Integrated System) automates FFB weighing at plantations.",
    },
    {
      text: "A hospital wants AI diagnostics using saliva. Which booth?",
      options: ["INSPECTRA", "Mi-PlateIQ", "Bioscan", "Mi-Safety"],
      correct: 2,
      explain: "Bioscan enables non-invasive disease detection through saliva sample analysis.",
    },
    {
      text: "A smart building wants to optimise chiller energy. Which technology?",
      options: ["Mi-NEXA", "Mi-PlateIQ", "Mi-ACE", "Digital QKD"],
      correct: 2,
      explain: "Mi-ACE intelligently manages chiller systems to reduce energy consumption in smart buildings.",
    },
    {
      text: "Which sector benefits most from Mi-Muallim?",
      options: ["Manufacturing", "Agriculture", "Education", "Healthcare"],
      correct: 2,
      explain: "Mi-Muallim is an AI-powered educational tool designed to support the education sector.",
    },
    {
      text: "Digital QKD is most relevant to which industry?",
      options: ["Food processing", "Cybersecurity and secure communications", "Agriculture", "Retail"],
      correct: 1,
      explain: "Digital QKD (Quantum Key Distribution) provides quantum-safe encryption for secure communications.",
    },
  ],
};
