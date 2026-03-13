import { ParsedResume, MatchAnalysis, SkillGapAnalysis } from '../types';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private static instance: GeminiService;

  private constructor() {
    // Note: Using import.meta.env for Vite compatibility
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async analyzeSkillsGap(resumeText: string, jobDescription: string): Promise<SkillGapAnalysis> {
    const systemPrompt = `You are an expert Career Coach. Your goal is to perform a detailed skills gap analysis between a candidate's resume and a job description. Return the result strictly as a JSON object.`;

    const userPrompt = `
      Compare the provided Resume Text against the Job Description.

      Identify:
      1. Skills the candidate has that match the requirements.
      2. Skills the candidate is missing or should emphasize more.
      3. Potential skills the candidate might have based on their experience but hasn't explicitly listed.

      Return a JSON object with the following structure:
      {
        "matchingSkills": ["Skill 1", "Skill 2"],
        "missingSkills": ["Skill 3", "Skill 4"],
        "potentialSkills": ["Skill 5", "Skill 6"], // Skills inferred from experience but not listed
        "analysis": "A brief, encouraging summary (2-3 sentences) explaining the gap and how to bridge it."
      }

      Resume Text:
      ${resumeText}

      Job Description:
      ${jobDescription}
    `;

    try {
      const response = await this._generateContent(userPrompt, systemPrompt);
      const jsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString) as SkillGapAnalysis;
    } catch (error) {
      console.error('Failed to analyze skills gap:', error);
      throw new Error('Failed to generate skills gap analysis');
    }
  }

  private async _generateContent(prompt: string, systemInstruction: string): Promise<string> {
    const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL;
    const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

    // Safety check
    if (!this.apiKey && !PROXY_URL) {
      throw new Error('AI Service not configured. Please add VITE_GEMINI_API_KEY or VITE_AI_PROXY_URL to your .env file.');
    }

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{ parts: [{ text: prompt }] }]
    };

    let response: Response;

    if (PROXY_URL) {
      // Logic for backend proxy
      response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Legacy direct client-side call (Security Risk: API key exposed)
      response = await fetch(
        `${GEMINI_API_BASE}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const errMsg = (errBody as any)?.error?.message || `HTTP ${response.status}`;
      throw new Error(errMsg);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async sendMessage(message: string): Promise<string> {
    const systemInstruction = `You are an expert Career Coach and Resume Optimizer. 
                            Your goal is to help users land jobs by:
                            1. Improving resume bullet points using the STAR method.
                            2. Tailoring cover letters to specific job descriptions.
                            3. Identifying missing keywords for ATS optimization.
                            4. Keeping a professional, encouraging tone.
                            Optionally, personalize advice for job markets in Arizona, if relevant.
                            
                            When provided with 'Context from uploaded files', use that data for optimizations, such as comparing resumes to job descriptions. If a Job Description and Resume are both present, prioritize mapping the user's skills to the job requirements.`;

    try {
      return await this._generateContent(message, systemInstruction);
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return `Error: ${error.message || 'An unknown error occurred.'}`;
    }
  }

  async parseResume(resumeText: string): Promise<ParsedResume> {
    const systemPrompt = `You are a precise resume parser. Your job is to extract key information from resume text and return it strictly as a JSON object. Do not include any markdown formatting or explanatory text outside the JSON.`;

    const userPrompt = `
      Extract the following information from the resume text provided below and return it as a valid JSON object matching this structure:
      {
        "personalInfo": {
          "name": "Full Name",
          "email": "Email Address",
          "phone": "Phone Number",
          "summary": "Professional Summary"
        },
        "education": [
          {
            "institution": "School Name",
            "degree": "Degree Name",
            "startDate": "Start Date",
            "endDate": "End Date",
            "description": "Optional details"
          }
        ],
        "workHistory": [
          {
            "company": "Company Name",
            "position": "Job Title",
            "startDate": "Start Date",
            "endDate": "End Date",
            "description": "Description of role and achievements"
          }
        ],
        "skills": [
          {
            "name": "Skill Name",
            "category": "Optional Category"
          }
        ]
      }

      If exact dates are not found, use approximations or leave empty strings. Ensure arrays are always returned, even if empty.

      Resume Text:
      ${resumeText}
    `;

    try {
      const response = await this._generateContent(userPrompt, systemPrompt);
      const jsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString) as ParsedResume;
    } catch (error) {
      console.error('Failed to parse resume:', error);
      throw new Error('Failed to parse resume content');
    }
  }

  async matchResumeToJob(resumeText: string, jobDescription: string): Promise<MatchAnalysis> {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) optimizer. Your goal is to compare a resume against a job description and provide a detailed match analysis. Return the result strictly as a JSON object.`;

    const userPrompt = `
      Compare the provided Resume Text against the Job Description. Analyze the match based on skills, experience, and keywords.

      Return a JSON object with the following structure:
      {
        "matchPercentage": 85, // A number between 0 and 100 representing the match score
        "missingKeywords": ["List", "of", "important", "keywords", "missing", "from", "resume"],
        "matchedKeywords": ["List", "of", "keywords", "found", "in", "both"],
        "profileAnalysis": "A brief, professional summary (2-3 sentences) explaining the score and key strengths/weaknesses."
      }

      Resume Text:
      ${resumeText}

      Job Description:
      ${jobDescription}
    `;

    try {
      const response = await this._generateContent(userPrompt, systemPrompt);
      const jsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString) as MatchAnalysis;
    } catch (error) {
      console.error('Failed to analyze match:', error);
      throw new Error('Failed to generate match analysis');
    }
  }
}

export default GeminiService.getInstance();
