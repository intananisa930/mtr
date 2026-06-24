export const DOMAINS = [
  {
    id: "edu", name: "Education", icon: "🎓",
    color: "#6366F1",
    colorBg: "rgba(99,102,241,0.12)",
    colorBorder: "rgba(99,102,241,0.4)",
    techs: [
      { id: "edu-1", name: "Mi-KidzAlert", use: "Smart Attendance & Child Safety" },
      { id: "edu-2", name: "Mi-BehavIQ", use: "AI Behaviour Monitoring" },
      { id: "edu-3", name: "Mi-ITS", use: "Real-Time Indoor Tracking" },
      { id: "edu-4", name: "Mi-Graphink", use: "Conductive STEM Learning Tools" },
      { id: "edu-5", name: "Mi-Nexa", use: "Smart Campus Connectivity" },
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
    id: "bld", name: "Smart Building", icon: "🏢",
    color: "#10B981",
    colorBg: "rgba(16,185,129,0.12)",
    colorBorder: "rgba(16,185,129,0.4)",
    techs: [
      { id: "bld-1", name: "Mi-ACE", use: "Intelligent Chiller Optimisation" },
      { id: "bld-2", name: "AIREM", use: "Smart Energy Monitoring" },
      { id: "bld-3", name: "Mi-Suria", use: "Solar Asset Monitoring" },
      { id: "bld-4", name: "Mi-ITS", use: "Smart Building Automation" },
      { id: "bld-5", name: "Mi-FaceIQ", use: "Intelligent Access Control" },
      { id: "bld-6", name: "Mi-BehavIQ", use: "Occupancy Behaviour Analytics" },
      { id: "bld-7", name: "Mi-PlateIQ", use: "Smart Vehicle Access Control" },
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
      { id: "city-5", name: "Mi-Lumens", use: "Smart Streetlight Management" },
      { id: "city-6", name: "Mi-Safety", use: "AI Public Safety Monitoring" },
      { id: "city-7", name: "IDFOS", use: "Intelligent Infrastructure Monitoring" },
    ],
  },
  {
    id: "ind", name: "Industry Support & Services", icon: "⚙️",
    color: "#EC4899",
    colorBg: "rgba(236,72,153,0.12)",
    colorBorder: "rgba(236,72,153,0.4)",
    techs: [
      { id: "ind-1", name: "ITIC", use: "Technology Innovation Centre" },
      { id: "ind-2", name: "FAB", use: "Semiconductor Fabrication Services" },
      { id: "ind-3", name: "DDTM", use: "Digital Manufacturing Enablement" },
      { id: "ind-4", name: "I4DAP", use: "Industry 4.0 Transformation" },
      { id: "ind-5", name: "REL Lab", use: "Reliability Testing Services" },
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
];

export const DOMAIN_IDS = DOMAINS.map(d => d.id);

export function isEligible(stamps) {
  return DOMAINS.every(d => d.techs.some(t => stamps.includes(t.id)));
}