export const DOMAINS = [
  {
    id: "edu", name: "Education", icon: "🎓",
    color: "#6366F1",
    colorBg: "rgba(99,102,241,0.12)",
    colorBorder: "rgba(99,102,241,0.4)",
    techs: [
      { id: "edu-1", name: "Mi-KidzAlert", use: "Smart Attendance & Child Safety" },
      { id: "edu-2", name: "Mi-Safety", use: "AI Behaviour Monitoring" },
      { id: "edu-3", name: "Mi-ITS", use: "Real-Time Indoor Tracking" },
      { id: "edu-4", name: "Mi-GraphInk", use: "Conductive STEM Learning Tools" },
      { id: "edu-5", name: "Mi-NEXA", use: "Smart Campus Connectivity" },
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
      { id: "mfg-3", name: "Mi-ITS", use: "Industrial IoT Integration" },
      { id: "mfg-4", name: "Mi-IndusData++", use: "Synthetic Data Generation" },
      { id: "mfg-5", name: "Mi-GraphInk", use: "Smart Sensor Design" },
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
      { id: "city-9", name: "Mi-ITS", use: "Smart Building Automation" },
      { id: "city-10", name: "Smart Inverter", use: " " },
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
      { id: "ind-4", name: "Quantum IDE", use: " " },
      { id: "ind-5", name: "Digital QKD", use: "" },
    ],
  },
  {
    id: "agri", name: "Smart Agriculture", icon: "🌾",
    color: "#84CC16",
    colorBg: "rgba(132,204,22,0.12)",
    colorBorder: "rgba(132,204,22,0.4)",
    techs: [
      { id: "agri-1", name: "INSPECTRA", use: "Palm Oil Quality Monitoring" },
      { id: "agri-2", name: "UGV", use: "Autonomous Plantation Operations" },
      { id: "agri-3", name: "Mi-Percept", use: "Precision Plantation Mapping" },
      { id: "agri-4", name: "Mi-SWIS", use: "Smart Weighbridge Monitoring" },
      { id: "agri-5", name: "Mi-FFB Grader", use: "AI FFB Grading" },
      { id: "agri-6", name: "Mi-VGuard", use: "Smart Plantation Surveillance" },
    ],
  },
  {
    id: "health", name: "Healthcare", icon: "❤️",
    color: "#F43F5E",
    colorBg: "rgba(244,63,94,0.12)",
    colorBorder: "rgba(244,63,94,0.4)",
    techs: [
      { id: "health-1", name: "REVA", use: "Non-Invasive Health Screening" },
      { id: "health-2", name: "Bioscan", use: "AI Saliva Diagnostics" },
      { id: "health-3", name: "AINS", use: "AI Spectroscopy Analytics" },
    ],
  },
  {
    id: "rmk13", name: "RMK-13", icon: "💡",
    color: "#F43F5E",
    colorBg: "rgba(244,63,94,0.12)",
    colorBorder: "rgba(244,63,94,0.4)",
    techs: [
      { id: "rmk13-1", name: "Mi-Muallim", use: "Quran Detection" },
      { id: "rmk13-2", name: "AI-Driven Cybersecurity", use: " " },
      { id: "rmk13-3", name: "Mi-PALSU", use: "Deepfake Detection" },
      { id: "rmk13-4", name: "Mi-CIPTA", use: "Deepfake Creation" },
      { id: "rmk13-5", name: "Robotics", use: " " },
      { id: "rmk13-6", name: "Blockchain Forensic Vault", use: " " },
    ],
  },
];

export const DOMAIN_IDS = DOMAINS.map(d => d.id);

export function isEligible(stamps) {
  return DOMAINS.every(d => d.techs.some(t => stamps.includes(t.id)));
}
