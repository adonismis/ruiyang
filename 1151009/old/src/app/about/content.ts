import type { PublicationStatus } from "@/content/site";

/** Only add company-approved documents and files with permission to publish. */
export type CompanyCertificate = {
  id: string;
  title: string;
  type: string;
  validUntil: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  status: PublicationStatus;
};

export const certificates: CompanyCertificate[] = [];

export const aboutSections = [
  { id: "profile", title: "公司簡介" },
  { id: "organization", title: "企業組織" },
  { id: "team", title: "經營團隊" },
  { id: "locations", title: "服務據點" },
  { id: "certificates", title: "公司證件 / 資質" },
  { id: "milestones", title: "大事記" },
];
