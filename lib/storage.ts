import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  EMERGENCY_CONTACTS: "sehat_emergency_contacts",
  PATIENT_VISITS: "sehat_patient_visits",
  HEALTH_PROFILE: "sehat_health_profile",
  SAVED_ARTICLES: "sehat_saved_articles",
};

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface PatientVisit {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  village: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  followUpDate?: string;
  category: "general" | "maternal" | "chronic" | "child";
}

export interface HealthProfile {
  name: string;
  age: number;
  gender: string;
  village: string;
  bloodGroup: string;
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  const data = await AsyncStorage.getItem(KEYS.EMERGENCY_CONTACTS);
  return data ? JSON.parse(data) : [];
}

export async function saveEmergencyContact(contact: Omit<EmergencyContact, "id">): Promise<EmergencyContact> {
  const contacts = await getEmergencyContacts();
  const newContact = { ...contact, id: generateId() };
  contacts.push(newContact);
  await AsyncStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
  return newContact;
}

export async function deleteEmergencyContact(id: string): Promise<void> {
  const contacts = await getEmergencyContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  await AsyncStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(filtered));
}

export async function getPatientVisits(): Promise<PatientVisit[]> {
  const data = await AsyncStorage.getItem(KEYS.PATIENT_VISITS);
  return data ? JSON.parse(data) : [];
}

export async function savePatientVisit(visit: Omit<PatientVisit, "id">): Promise<PatientVisit> {
  const visits = await getPatientVisits();
  const newVisit = { ...visit, id: generateId() };
  visits.unshift(newVisit);
  await AsyncStorage.setItem(KEYS.PATIENT_VISITS, JSON.stringify(visits));
  return newVisit;
}

export async function deletePatientVisit(id: string): Promise<void> {
  const visits = await getPatientVisits();
  const filtered = visits.filter((v) => v.id !== id);
  await AsyncStorage.setItem(KEYS.PATIENT_VISITS, JSON.stringify(filtered));
}

export async function getHealthProfile(): Promise<HealthProfile | null> {
  const data = await AsyncStorage.getItem(KEYS.HEALTH_PROFILE);
  return data ? JSON.parse(data) : null;
}

export async function saveHealthProfile(profile: HealthProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.HEALTH_PROFILE, JSON.stringify(profile));
}

export async function getSavedArticles(): Promise<string[]> {
  const data = await AsyncStorage.getItem(KEYS.SAVED_ARTICLES);
  return data ? JSON.parse(data) : [];
}

export async function toggleSavedArticle(articleId: string): Promise<boolean> {
  const saved = await getSavedArticles();
  const index = saved.indexOf(articleId);
  if (index >= 0) {
    saved.splice(index, 1);
    await AsyncStorage.setItem(KEYS.SAVED_ARTICLES, JSON.stringify(saved));
    return false;
  } else {
    saved.push(articleId);
    await AsyncStorage.setItem(KEYS.SAVED_ARTICLES, JSON.stringify(saved));
    return true;
  }
}
