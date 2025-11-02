import express from "express";
import axios from "axios";

const router = express.Router();

// Symptom Checker with 15 symptoms
router.post("/symptom", async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) return res.status(400).json({ error: "Symptoms required" });

  const symptomMap = [
    { regex: /fever/i, reply: "Possible fever - monitor temperature and stay hydrated." },
    { regex: /cough/i, reply: "Cough may indicate respiratory infection; consider consulting a doctor." },
    { regex: /fatigue/i, reply: "Fatigue can be caused by many issues; get rest and evaluate further if persists." },
    { regex: /cold/i, reply: "Likely common cold, keep warm and drink fluids." },
    { regex: /headache/i, reply: "Possible headache or migraine - rest and avoid stress." },
    { regex: /migraine/i, reply: "Consider medication and minimal light exposure for migraine." },
    { regex: /stomachache|stomach/i, reply: "Stomach issues may need dietary care and hydration." },
    { regex: /vomit/i, reply: "Vomiting can cause dehydration; seek fluids and medical care." },
    { regex: /diarrhea/i, reply: "Diarrhea requires hydration and possible medical evaluation." },
    { regex: /rash/i, reply: "Possible skin allergy or irritation; avoid irritants and consider allergy meds." },
    { regex: /itch/i, reply: "Skin itching may indicate allergy or infection; keep skin clean." },
    { regex: /allergy/i, reply: "Follow allergy management practices and avoid triggers." },
    { regex: /chest pain/i, reply: "Urgent: Chest pain may indicate cardiac issues; seek immediate care." },
    { regex: /breathless/i, reply: "Shortness of breath is serious; get urgent medical help." },
    { regex: /tightness/i, reply: "Chest tightness needs immediate medical attention." }
  ];

  let responseMsg = "Unable to determine condition; please consult a healthcare professional.";
  for (const item of symptomMap) {
    if (item.regex.test(symptoms)) {
      responseMsg = item.reply;
      break;
    }
  }

  res.json({ reply: responseMsg });
});

// Preventive Tips for 15 diseases
router.post("/tips", async (req, res) => {
  const { disease } = req.body;
  if (!disease) return res.status(400).json({ error: "Disease name required" });

  const tipsMap = {
    flu: "Get vaccinated annually, wash hands regularly, avoid close contact with sick people.",
    malaria: "Sleep under mosquito nets, use insect repellent, clear stagnant water around.",
    covid: "Wear masks, maintain social distance, get vaccinated and boosted.",
    diabetes: "Maintain balanced diet, exercise, monitor glucose levels regularly.",
    dengue: "Prevent mosquito breeding, wear long sleeves, use repellents.",
    tuberculosis: "Get tested if symptomatic, complete full course of antibiotics.",
    anemia: "Eat iron-rich foods, take supplements advised by doctor.",
    hypertension: "Control salt intake, exercise, monitor blood pressure regularly.",
    arthritis: "Maintain healthy weight, do regular physical therapy.",
    asthma: "Avoid allergens and triggers, use inhalers as prescribed.",
    hepatitis: "Get vaccinated, avoid sharing needles or unprotected sex.",
    cholera: "Drink safe water, practice hygiene, consume cooked food only.",
    covid19: "Follow government guidelines, maintain hygiene and masks.",
    typhoid: "Ensure safe drinking water, proper hand washing.",
    pneumonia: "Keep immunizations updated, avoid smoking and pollutants."
  };

  const tips = tipsMap[disease.toLowerCase()] || `No specific tips for ${disease}. Maintain general hygiene and health.`;

  res.json({ reply: tips });
});

// Nearby health resources for 15 locations
router.get("/resources", async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: "Location required" });

  const healthResources = {
    Hyderabad: [
      { name: "Apollo Hospital", address: "Jubilee Hills, Hyderabad" },
      { name: "Care Hospital", address: "Banjara Hills, Hyderabad" },
      { name: "Yashoda Hospital", address: "Secunderabad, Hyderabad" },
      { name: "KIMS Hospital", address: "Begumpet, Hyderabad" },
      { name: "MaxCure Hospitals", address: "Ameerpet, Hyderabad" }
    ],
    Delhi: [
      { name: "AIIMS", address: "Ansari Nagar, Delhi" },
      { name: "Fortis Hospital", address: "Vasant Kunj, Delhi" },
      { name: "Max Super Specialty", address: "Saket, Delhi" },
      { name: "Apollo Hospital", address: "Sarita Vihar, Delhi" },
      { name: "BLK Super Specialty", address: "Pusa Road, Delhi" }
    ],
    Bangalore: [
      { name: "Manipal Hospital", address: "Old Airport Road, Bangalore" },
      { name: "Narayana Health", address: "Bommasandra, Bangalore" },
      { name: "St. John's Medical College", address: "Koramangala, Bangalore" },
      { name: "Fortis Hospital", address: "Bannerghatta Road, Bangalore" },
      { name: "Columbia Asia Hospital", address: "Hebbal, Bangalore" }
    ],
    Mumbai: [
      { name: "Lilavati Hospital", address: "Bandra, Mumbai" },
      { name: "Kokilaben Hospital", address: "Andheri, Mumbai" },
      { name: "Breach Candy Hospital", address: "Breach Candy, Mumbai" },
      { name: "Hiranandani Hospital", address: "Powai, Mumbai" },
      { name: "Bombay Hospital", address: "Marine Lines, Mumbai" }
    ],
    Chennai: [
      { name: "Apollo Hospitals", address: "Greams Road, Chennai" },
      { name: "MIOT Hospitals", address: "Manapakkam, Chennai" },
      { name: "Fortis Malar Hospital", address: "Alwarpet, Chennai" },
      { name: "Global Hospitals", address: "Kodambakkam, Chennai" },
      { name: "SRM Hospitals", address: "Kattankulathur, Chennai" }
    ],
    Kolkata: [
      { name: "AMRI Hospitals", address: "Salt Lake, Kolkata" },
      { name: "Fortis Hospital", address: "Shyam Bazar, Kolkata" },
      { name: "Bellevue Hospital", address: "Alipore, Kolkata" },
      { name: "Peerless Hospital", address: "Kasba, Kolkata" },
      { name: "Woodlands Hospital", address: "Park Circus, Kolkata" }
    ],
    Pune: [
      { name: "Aditya Birla Hospital", address: "Viman Nagar, Pune" },
      { name: "Ruby Hall Clinic", address: "Koregaon Park, Pune" },
      { name: "Jehangir Hospital", address: "Sassoon Road, Pune" },
      { name: "Sahyadri Hospital", address: "Nagar Road, Pune" },
      { name: "Deenanath Mangeshkar Hospital", address: "Erandwane, Pune" }
    ],
    Ahmedabad: [
      { name: "Apollo Hospital", address: "Satellite, Ahmedabad" },
      { name: "CIMS Hospital", address: "Ghatlodia, Ahmedabad" },
      { name: "Sterling Hospital", address: "Ellisbridge, Ahmedabad" },
      { name: "Sal Hospital", address: "Paldi, Ahmedabad" },
      { name: "Shalby Hospital", address: "Navrangpura, Ahmedabad" }
    ],
    Jaipur: [
      { name: "Fortis Escorts", address: "Malviya Nagar, Jaipur" },
      { name: "SMS Hospital", address: "Jawahar Lal Nehru Marg, Jaipur" },
      { name: "Santokba Durlabhji Memorial Hospital", address: "Jaipur" },
      { name: "Mayo Hospital", address: "Jaipur" },
      { name: "Apex Hospital", address: "Jaipur" }
    ],
    Lucknow: [
      { name: "King George's Medical University", address: "Lucknow" },
      { name: "Max Hospital", address: "Hazratganj, Lucknow" },
      { name: "Narayana Hospital", address: "Lucknow" },
      { name: "Hallett Hospital", address: "Lucknow" },
      { name: "Sumedha Hospital", address: "Lucknow" }
    ],
    Chandigarh: [
      { name: "PGIMER", address: "Chandigarh" },
      { name: "Fortis Hospital", address: "Sector 62, Chandigarh" },
      { name: "Max Hospital", address: "Sector 38, Chandigarh" },
      { name: "Government Medical College", address: "Chandigarh" },
      { name: "Alchemist Hospital", address: "Chandigarh" }
    ],
    Surat: [
      { name: "Apollo Hospitals", address: "Surat" },
      { name: "Civil Hospital", address: "Surat" },
      { name: "Dhiraj Hospital", address: "Surat" },
      { name: "Vector Care Hospital", address: "Surat" },
      { name: "Orchid Hospital", address: "Surat" }
    ],
    Vadodara: [
      { name: "Sakra World Hospital", address: "Vadodara" },
      { name: "Apollo Hospital", address: "Vadodara" },
      { name: "Sterling Hospital", address: "Vadodara" },
      { name: "Sparsh Hospital", address: "Vadodara" },
      { name: "Baroda Heart Institute", address: "Vadodara" }
    ],
    Indore: [
      { name: "CHL Hospital", address: "Indore" },
      { name: "Apollo Hospital", address: "Indore" },
      { name: "Bombay Hospital", address: "Indore" },
      { name: "Choithram Hospital", address: "Indore" },
      { name: "Classic Hospital", address: "Indore" }
    ],
    default: [
      { name: "General Hospital", address: "Main Road, " + location },
      { name: "Community Clinic", address: "Health Street, " + location },
      { name: "Primary Health Center", address: "Central Area, " + location },
      { name: "Family Care", address: "Park Road, " + location },
      { name: "City Medical Center", address: "Broadway, " + location }
    ]
  };

  const resources = healthResources[location] || healthResources["default"];
  res.json({ data: resources });
});

export default router;
