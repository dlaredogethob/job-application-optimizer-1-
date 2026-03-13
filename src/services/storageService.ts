import { Project, Message, UploadedFile } from '../types';

const STORAGE_KEY = 'job_optimizer_projects';

export const getProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load projects", e);
    return [];
  }
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === project.id);

  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const deleteProject = (projectId: string): void => {
  const projects = getProjects().filter(p => p.id !== projectId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const createNewProject = (): Project => {
  return {
    id: crypto.randomUUID(),
    name: 'New Application',
    lastModified: Date.now(),
    files: [],
    chatHistory: [
      {
        id: crypto.randomUUID(),
        role: 'model',
        content: "Hello! I'm your Job Application Optimizer. Upload your resume and a job description to get started, or just tell me what you need help with.",
        timestamp: Date.now()
      }
    ]
  };
};

// Mock function to simulate file parsing logic with realistic content
export const mockParseFile = (file: File): string => {
  const lowerName = file.name.toLowerCase();

  if (lowerName.includes("resume") || lowerName.includes("cv")) {
    return `
[CONTENT OF UPLOADED RESUME: ${file.name}]
Name: Corbin
Email: dummy@gmail.com
Role: Senior Frontend Engineer
Summary:
Experienced Frontend Engineer with 8+ years of expertise in building scalable web applications using React, TypeScript, and modern CSS frameworks. Proven track record of improving site performance by 40% and leading teams of 5+ developers.

Skills: React, TypeScript, Tailwind CSS, Node.js, GraphQL, AWS, CI/CD, Jest, Cypress.

Experience:
Senior Frontend Engineer | TechFlow Inc. | 2020 - Present
- Architected and built the core design system used across 4 products, reducing development time by 30%.
- Led the migration of a legacy jQuery codebase to Next.js, improving SEO scores from 65 to 98.
- Mentored 4 junior developers and conducted code reviews to ensure high code quality.

Frontend Developer | WebSolutions LLC | 2017 - 2020
- Developed responsive e-commerce interfaces handling 50k+ daily users.
- Integrated Stripe API for payments and optimized checkout flow, increasing conversion by 15%.

Education:
B.S. Computer Science | State University | 2013 - 2017
`;
  }

  if (lowerName.includes("job") || lowerName.includes("jd") || lowerName.includes("description")) {
    return `
[CONTENT OF UPLOADED JOB DESCRIPTION: ${file.name}]
Role: Senior React Developer
Company: TechCorp
Location: Remote / Arizona
Salary: $120,000 - $150,000

About Us:
TechCorp is a fast-growing SaaS platform transforming the logistics industry. We are looking for a Senior React Developer to lead our dashboard team.

Responsibilities:
- Build high-performance, reusable UI components using React and TypeScript.
- Collaborate with Product Managers and Designers to translate requirements into technical specifications.
- Optimize application for maximum speed and scalability.
- Troubleshoot and debug complex issues.

Requirements:
- 5+ years of experience with modern JavaScript (ES6+) and React.
- Strong proficiency in TypeScript and CSS-in-JS libraries.
- Experience with state management (Redux, Zustand, or Context API).
- Familiarity with RESTful APIs and GraphQL.
- Excellent problem-solving skills and ability to work in a fast-paced environment.

Nice to Have:
- Experience with Next.js and Server-Side Rendering.
- Knowledge of AWS infrastructure.
`;
  }

  return `[CONTENT OF FILE: ${file.name}]\n(Content analysis requires a real backend parser. This is a placeholder text for demo purposes.)`;
};
