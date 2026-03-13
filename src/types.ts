export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  isThinking?: boolean;
  matchAnalysis?: MatchAnalysis;
  skillGapAnalysis?: SkillGapAnalysis;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'resume' | 'job_description' | 'company_info' | 'other';
  size: number;
  uploadDate: number;
  contentSnippet?: string; // Mock parsed content
  extractedPages?: number;
  parsedData?: ParsedResume;
}

export interface Project {
  id: string;
  name: string;
  lastModified: number;
  files: UploadedFile[];
  chatHistory: Message[];
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PROJECT = 'PROJECT'
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface WorkHistory {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string; // Changed to required as it's key info
}

export interface Skill {
  name: string;
  category?: string;
}

export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    summary: string;
  };
  education: Education[];
  workHistory: WorkHistory[];
  skills: Skill[];
}

export interface MatchAnalysis {
  matchPercentage: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  profileAnalysis: string;
}

export interface SkillGapAnalysis {
  matchingSkills: string[];
  missingSkills: string[];
  potentialSkills: string[];
  analysis: string;
}
