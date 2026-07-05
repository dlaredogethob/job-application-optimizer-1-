import { ParsedResume, MatchAnalysis, SkillGapAnalysis } from '../types';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

interface ApiErrorResponse {
  detail?: string;
  error?: {
    message?: string;
  };
}

const BACKEND_URL =
  'https://job-optimizer-api-363810603253.us-west1.run.app/generate';

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }

    return GeminiService.instance;
  }

  private async _generateContent(
    prompt: string,
    systemInstruction: string
  ): Promise<string> {
    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody: ApiErrorResponse = await response
        .json()
        .catch(() => ({}));

      const errorMessage =
        errorBody.detail ||
        errorBody.error?.message ||
        `HTTP ${response.status}`;

      throw new Error(errorMessage);
    }

    const data: GeminiResponse = await response.json();

    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!generatedText) {
      throw new Error('The AI service returned an empty response.');
    }

    return generatedText;
  }

  async analyzeSkillsGap(
    resumeText: string,
    jobDescription: string
  ): Promise<SkillGapAnalysis> {
    const systemPrompt =
      'You are an expert Career Coach. Your goal is to perform a detailed skills gap analysis between a candidate’s resume and a job description. Return the result strictly as a JSON object.';

    const userPrompt = `
Compare the provided Resume Text against the Job Description.

Identify:
1. Skills the candidate has that match the requirements.
2. Skills the candidate is missing or should emphasize more.
3. Potential skills the candidate might have based on their experience but has not explicitly listed.

Return a JSON object with the following structure:
{
  "matchingSkills": ["Skill 1", "Skill 2"],
  "missingSkills": ["Skill 3", "Skill 4"],
  "potentialSkills": ["Skill 5", "Skill 6"],
  "analysis": "A brief, encouraging summary explaining the gap and how to bridge it."
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}
`;

    try {
      const response = await this._generateContent(
        userPrompt,
        systemPrompt
      );

      const jsonString = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(jsonString) as SkillGapAnalysis;
    } catch (error) {
      console.error('Failed to analyze skills gap:', error);
      throw new Error('Failed to generate skills gap analysis');
    }
  }

  async sendMessage(message: string): Promise<string> {
    const systemInstruction = `
You are an expert Career Coach and Resume Optimizer.

Your goal is to help users land jobs by:
1. Improving resume bullet points using the STAR method.
2. Tailoring cover letters to specific job descriptions.
3. Identifying missing keywords for ATS optimization.
4. Keeping a professional, encouraging tone.
5. Optionally personalizing advice for job markets in Arizona when relevant.

When provided with "Context from uploaded files", use that information for optimizations. If both a Job Description and Resume are present, prioritize mapping the user’s skills to the job requirements.
`;

    try {
      return await this._generateContent(message, systemInstruction);
    } catch (error) {
      const messageText =
        error instanceof Error
          ? error.message
          : 'An unknown error occurred.';

      console.error('AI backend error:', error);

      return `Error: ${messageText}`;
    }
  }

  async parseResume(resumeText: string): Promise<ParsedResume> {
    const systemPrompt = `
You are a precise resume parser.

Extract key information from resume text and return it strictly as a JSON object.
Do not include markdown formatting or explanatory text outside the JSON.
`;

    const userPrompt = `
Extract the following information from the resume text below and return valid JSON matching this structure:

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

If exact dates are not found, use approximations or empty strings.
Always return arrays, even when they are empty.

Resume Text:
${resumeText}
`;

    try {
      const response = await this._generateContent(
        userPrompt,
        systemPrompt
      );

      const jsonString = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(jsonString) as ParsedResume;
    } catch (error) {
      console.error('Failed to parse resume:', error);
      throw new Error('Failed to parse resume content');
    }
  }

  async matchResumeToJob(
    resumeText: string,
    jobDescription: string
  ): Promise<MatchAnalysis> {
    const systemPrompt = `
You are an expert ATS optimizer.

Compare a resume against a job description and provide a detailed match analysis.
Return the result strictly as a JSON object.
`;

    const userPrompt = `
Compare the provided Resume Text against the Job Description.

Analyze the match based on skills, experience, and keywords.

Return a JSON object with the following structure:
{
  "matchPercentage": 85,
  "missingKeywords": ["keyword 1", "keyword 2"],
  "matchedKeywords": ["keyword 3", "keyword 4"],
  "profileAnalysis": "A brief, professional summary explaining the score and key strengths or weaknesses."
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}
`;

    try {
      const response = await this._generateContent(
        userPrompt,
        systemPrompt
      );

      const jsonString = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(jsonString) as MatchAnalysis;
    } catch (error) {
      console.error('Failed to analyze match:', error);
      throw new Error('Failed to generate match analysis');
    }
  }
}

export default GeminiService.getInstance();
