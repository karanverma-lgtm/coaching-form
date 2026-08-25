import { db } from "./config";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { SurveyAnswers, getExposureType, getSelectedRoleKey, ROLE_OPTIONS } from "@/lib/survey/schema";

export interface SurveySubmission {
  id?: string;
  respondentName?: string;
  respondentEmail?: string;
  roleKey: string;
  role: string;
  exposure: string;
  coachExposureRaw?: string;
  industry?: string;
  orgSize?: string;
  timeSpentSeconds?: number;
  answers: SurveyAnswers;
  createdAt?: Timestamp | Date | null;
  submittedAt?: string;
}

const COLLECTION_NAME = "survey_responses";

export async function submitSurveyResponse(data: {
  answers: SurveyAnswers;
  timeSpentSeconds: number;
}): Promise<string> {
  if (!db) {
    throw new Error("Firestore database is not initialized. Please verify your Firebase configuration.");
  }

  const { answers, timeSpentSeconds } = data;
  const roleKey = getSelectedRoleKey(answers);
  const exposure = getExposureType(answers) || "unknown";

  const roleObj = ROLE_OPTIONS.find((r) => r.value === roleKey);
  const otherRoleText = (answers["Q05_OTHER"] as string)?.trim();
  const roleLabel = roleKey === "other" && otherRoleText 
    ? `Other: ${otherRoleText}` 
    : roleObj ? roleObj.label : "Other Senior Leader";

  const respondentName = (answers["Q00_NAME"] as string)?.trim() || "";
  const respondentEmail = (answers["Q00_EMAIL"] as string)?.trim() || "";
  const industry = (answers["Q01"] as string) || "";
  const orgSize = (answers["Q02"] as string) || "";
  const coachExposureRaw = (answers["Q06"] as string) || "";

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    respondentName,
    respondentEmail,
    roleKey,
    role: roleLabel,
    exposure,
    coachExposureRaw,
    industry,
    orgSize,
    timeSpentSeconds,
    answers,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function fetchSurveyResponses(): Promise<SurveySubmission[]> {
  if (!db) {
    return [];
  }

  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    let submittedAt = "";
    if (data.createdAt?.toDate) {
      submittedAt = data.createdAt.toDate().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    }

    return {
      id: doc.id,
      respondentName: data.respondentName || (data.answers?.["Q00_NAME"] as string) || "",
      respondentEmail: data.respondentEmail || (data.answers?.["Q00_EMAIL"] as string) || "",
      roleKey: data.roleKey || "",
      role: data.role || "",
      exposure: data.exposure || "",
      coachExposureRaw: data.coachExposureRaw || "",
      industry: data.industry || "",
      orgSize: data.orgSize || "",
      timeSpentSeconds: data.timeSpentSeconds || 0,
      answers: data.answers || {},
      submittedAt,
    };
  });
}

export function exportResponsesToCSV(submissions: SurveySubmission[]): string {
  if (submissions.length === 0) return "";

  const baseHeaders = [
    "Submission ID",
    "Submitted At",
    "Respondent Name",
    "Work Email",
    "Role Key",
    "Role Description",
    "Exposure Route",
    "Exposure Raw",
    "Industry",
    "Org Size",
    "Time Spent (sec)",
  ];

  // Collect all unique question IDs
  const allQuestionIdsSet = new Set<string>();
  submissions.forEach((sub) => {
    if (sub.answers) {
      Object.keys(sub.answers).forEach((k) => allQuestionIdsSet.add(k));
    }
  });

  const questionHeaders = Array.from(allQuestionIdsSet).sort();
  const allHeaders = [...baseHeaders, ...questionHeaders];

  const escapeCSV = (val: unknown) => {
    if (val === undefined || val === null) return '""';
    let str = "";
    if (Array.isArray(val)) {
      str = val.join("; ");
    } else {
      str = String(val);
    }
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = submissions.map((sub) => {
    const baseCols = [
      escapeCSV(sub.id),
      escapeCSV(sub.submittedAt),
      escapeCSV(sub.respondentName),
      escapeCSV(sub.respondentEmail),
      escapeCSV(sub.roleKey),
      escapeCSV(sub.role),
      escapeCSV(sub.exposure),
      escapeCSV(sub.coachExposureRaw),
      escapeCSV(sub.industry),
      escapeCSV(sub.orgSize),
      escapeCSV(sub.timeSpentSeconds),
    ];

    const questionCols = questionHeaders.map((qId) => {
      const val = sub.answers?.[qId];
      return escapeCSV(val);
    });

    return [...baseCols, ...questionCols].join(",");
  });

  return [allHeaders.join(","), ...rows].join("\n");
}
