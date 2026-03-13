import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './ui/icons';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Project, UploadedFile } from '../types';
import geminiService from '../services/geminiService';
import DocumentPreview from './DocumentPreview';
import EmailComposer from './EmailComposer';
import { jsPDF } from 'jspdf';
import * as pdfjs from 'pdfjs-dist';
import MatchAnalysisCard from './MatchAnalysisCard';
import SkillsGapAnalysisCard from './SkillsGapAnalysisCard';
import { toast } from 'react-hot-toast';

// Vite-compatible worker setup
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface ChatInterfaceProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onFileUpload: (file: UploadedFile) => void;
}





const MOCK_GENERATED_CONTENT = `JOHN DOE
Senior Frontend Engineer
Phoenix, AZ | (555) 123-4567 | john.doe@email.com | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Results-oriented Senior Frontend Engineer with 8+ years of experience building scalable web applications. Proven track record of improving site performance by 40% and leading high-performing teams. Expert in React, TypeScript, and modern state management.

SKILLS
• Languages: TypeScript, JavaScript (ES6+), HTML5, CSS3
• Frameworks: React, Next.js, Node.js, Express
• Tools: Webpack, Vite, Jest, Cypress, AWS, Docker
• Soft Skills: Technical Leadership, Mentoring, Agile Methodologies

EXPERIENCE
Senior Frontend Engineer | TechFlow Inc. | Remote | 2020 - Present
• Architected and implemented a new design system used across 4 major products, reducing UI development time by 30%.
• Spearheaded the migration from a legacy jQuery codebase to Next.js, resulting in a 98/100 Lighthouse SEO score.
• Mentored 4 junior developers, conducting daily code reviews and weekly technical workshops.

Frontend Developer | WebSolutions LLC | Peoria, AZ | 2017 - 2020
• Developed responsive e-commerce interfaces handling 50k+ daily active users.
• Integrated Stripe API for payments, optimizing the checkout flow to increase conversion rates by 15%.
• Collaborated closely with UX designers to implement pixel-perfect interfaces.

EDUCATION
B.S. Computer Science | Arizona State University | 2013 - 2017
`;

const ChatInterface: React.FC<ChatInterfaceProps> = ({ project, onUpdateProject, onFileUpload }) => {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    const toastId = toast.loading('Extracting text from file...');

    try {
      let extractedText = "";
      let pageCount: number | undefined;

      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({
          data: arrayBuffer,
          useSystemFonts: true
        });

        const pdf = await loadingTask.promise;
        pageCount = pdf.numPages;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
          if (pdf.numPages > 5) console.log(`Progress: ${i}/${pdf.numPages}`);
        }
        extractedText = fullText;
      } else if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        extractedText = await file.text();
      } else {
        throw new Error('Please upload a PDF, TXT, or MD file.');
      }

      const fileType = file.type.includes('pdf') ? 'resume' : 'job_description';
      const uploadedFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        type: fileType as any,
        size: file.size,
        uploadDate: Date.now(),
        // Truncate for AI token safety
        contentSnippet: extractedText.slice(0, 5000) + (extractedText.length > 5000 ? ' [truncated]' : ''),
        extractedPages: pageCount
      };

      onFileUpload(uploadedFile);
      toast.success('Ready for analysis!', { id: toastId });

      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error: any) {
      console.error("Extraction error:", error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [project.chatHistory, isThinking]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    if (!textOverride) {
      setIsFlying(true);
      setTimeout(() => setIsFlying(false), 500);
    }

    // 1. Add User Message to UI
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    const updatedHistory = [...project.chatHistory, userMsg];

    // Optimistic update
    onUpdateProject({
      ...project,
      chatHistory: updatedHistory,
      lastModified: Date.now()
    });
    setInput('');
    setIsThinking(true);

    // Mock export/preview logic (Keep this for the demo flow)
    if (textToSend.toLowerCase().includes('export') || textToSend.toLowerCase().includes('download') || textToSend.toLowerCase().includes('preview')) {
      setTimeout(() => {
        const modelMsg: Message = {
          id: crypto.randomUUID(),
          role: 'model',
          content: "I've generated the optimized document for you. You can preview it or download it using the buttons above.",
          timestamp: Date.now()
        };
        onUpdateProject({
          ...project,
          chatHistory: [...updatedHistory, modelMsg],
          lastModified: Date.now()
        });
        setIsThinking(false);
        if (textToSend.toLowerCase().includes('preview')) {
          setPreviewOpen(true);
        } else {
          handleDownload();
        }
      }, 1500);
      return;
    }

    // 2. Build Context from Files (Truncated to 2000 chars for token efficiency)
    const fileContext = project.files?.length
      ? project.files.map(f => `--- FILE: ${f.name} (Type: ${f.type}) ---\n${f.contentSnippet?.slice(0, 2000)}`).join('\n\n')
      : '';

    // 3. Conditional Prompt Construction
    const shouldIncludeContext = /analyze|tailor|match|resume|cover letter|job/i.test(textToSend);
    const fullPrompt = (shouldIncludeContext && fileContext)
      ? `Context from uploaded files:\n${fileContext}\n\nUser Question: ${textToSend}`
      : textToSend;

    console.log('Sending to AI:', fullPrompt);

    // 4. Call Service
    try {
      let responseText = '';
      let skillGapAnalysis;

      if (textToSend.toLowerCase().includes('skills gap')) {
        const resumeFile = project.files.find(f => f.type === 'resume');
        const jdFile = project.files.find(f => f.type === 'job_description');

        if (resumeFile && jdFile) {
          skillGapAnalysis = await geminiService.analyzeSkillsGap(resumeFile.contentSnippet || '', jdFile.contentSnippet || '');
          responseText = skillGapAnalysis.analysis;
        } else {
          responseText = "I need both a resume and a job description to perform a skills gap analysis. Please upload both files first.";
        }
      } else {
        responseText = await geminiService.sendMessage(fullPrompt);
      }

      const modelMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        content: responseText,
        timestamp: Date.now(),
        skillGapAnalysis
      };
      onUpdateProject({ ...project, chatHistory: [...updatedHistory, modelMsg], lastModified: Date.now() });
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const triggerDownload = (content?: string) => {
    const contentToExport = content || (project.chatHistory.length > 0 ? [...project.chatHistory].reverse().find(m => m.role === 'model')?.content : null);

    if (!contentToExport && project.chatHistory.length === 0) {
      toast.error('No content to export yet. Start a chat with the assistant first!');
      return;
    }

    try {
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const textWidth = pageWidth - (margin * 2);

      // 1. Get Content
      const rawContent = contentToExport || project.chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

      // 2. Clean Markdown: Remove ** and * for a cleaner PDF look
      const cleanContent = rawContent.replace(/\*\*/g, '').replace(/^\s*[\*\-]\s+/gm, '• ');

      // 3. Metadata & Headers
      const isResume = /resume|cv/i.test(cleanContent);
      const isCoverLetter = /cover letter/i.test(cleanContent);
      const docTitle = isResume ? 'Optimized Resume' : (isCoverLetter ? 'Tailored Cover Letter' : 'Job Analysis');
      const timestamp = new Date().toISOString().split('T')[0];
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const headerText = `${docTitle} - ${project.name} (${timestamp})`;

      doc.setProperties({ title: docTitle, author: 'Job Application Optimizer' });

      // 4. Draw Logic
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(headerText, margin, 15);
      doc.line(margin, 18, pageWidth - margin, 18); // Header line

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const splitText = doc.splitTextToSize(cleanContent, textWidth);
      let yPosition = 25;
      let pageNum = 1;

      splitText.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.setFontSize(8);
          doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
          doc.addPage();
          pageNum++;
          yPosition = 25;
          doc.setFontSize(11);
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });

      // Add last page number
      doc.setFontSize(8);
      doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      return doc;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF.');
      return null;
    }
  };

  const handleDownload = (content?: string) => {
    const doc = triggerDownload(content);
    if (doc) {
      const isResume = content ? /resume|cv/i.test(content) : true;
      const docTitle = isResume ? 'Optimized_Resume' : 'Document';
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      doc.save(`JohnDoe-${docTitle}-${randomNum}.pdf`);
      toast.success('PDF exported successfully!');
    }
  };

  const handlePrint = (content?: string) => {
    const doc = triggerDownload(content);
    if (doc) {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      label: "Draft Cover Letter",
      icon: <Icons.Actions.PenTool className="w-3 h-3" />,
      prompt: "Draft a tailored cover letter for the provided job description, referencing the user's resume."
    },
    {
      label: "Analyze Match",
      icon: <Icons.Actions.FileSearch className="w-3 h-3" />,
      prompt: "Analyze how well my resume matches the uploaded job description. List missing skills."
    },
    {
      label: "Optimize Resume",
      icon: <Icons.Actions.Sparkles className="w-3 h-3" />,
      prompt: "Rewrite my resume bullet points to be more impactful using the STAR method based on the job description."
    },
    {
      label: "Salary Check",
      icon: <Icons.Actions.DollarSign className="w-3 h-3" />,
      prompt: "Analyze the salary range in the job description against my experience level in the resume. Is this aligned with market standards?"
    },
    {
      label: "Skills Gap",
      icon: <Icons.Analysis.AlertOctagon className="w-3 h-3 text-red-500" />,
      prompt: "Perform a detailed skills gap analysis between my resume and the job description."
    }
  ];

  return (
    <>
      <DocumentPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Optimized_Resume_Final.pdf"
        content={MOCK_GENERATED_CONTENT}
        onDownload={() => handleDownload(MOCK_GENERATED_CONTENT)}
        onPrint={() => handlePrint(MOCK_GENERATED_CONTENT)}
      />

      <EmailComposer
        isOpen={emailOpen}
        onClose={() => setEmailOpen(false)}
        project={project}
      />

      <div className="flex flex-col h-full bg-slate-50 relative">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Icons.Actions.Bot className="w-5 h-5 text-emerald-600" />
              Job Optimizer Assistant
            </h2>
            <p className="text-xs text-slate-500">
              Current Context: {project.files.length} file(s) uploaded
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewOpen(true)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 shadow-sm"
            >
              <Icons.Auth.Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={() => setEmailOpen(true)}
              className="text-xs font-medium text-slate-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 shadow-sm"
            >
              <Icons.Auth.Mail className="w-3.5 h-3.5" /> Email
            </button>
            <button
              onClick={() => handleDownload()}
              disabled={project.chatHistory.length === 0}
              className={`text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 shadow-sm ${project.chatHistory.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icons.Actions.Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence initial={false}>
            {project.chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                  <div className={`
                  w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                  ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white'}
                `}>
                    {msg.role === 'user' ? <Icons.Settings.User className="w-4 h-4" /> : <Icons.Actions.Wand2 className="w-4 h-4" />}
                  </div>

                  <div className={`
                  flex flex-col
                  ${msg.role === 'user' ? 'items-end' : 'items-start'}
                `}>
                    <div className={`
                    px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user'
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-sm'
                        : 'bg-white border border-emerald-100 text-slate-800 rounded-tl-sm prose prose-sm max-w-none prose-emerald'}
                    ${msg.content.startsWith('System:') ? 'bg-slate-50 border-dashed text-slate-500 italic text-xs' : ''}
                  `}>
                      {msg.role === 'model' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      )}

                      {/* Render Match Analysis Card if present */}
                      {msg.matchAnalysis && (
                        <MatchAnalysisCard analysis={msg.matchAnalysis} />
                      )}

                      {/* Render Skills Gap Analysis Card if present */}
                      {msg.skillGapAnalysis && (
                        <SkillsGapAnalysisCard analysis={msg.skillGapAnalysis} />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <div className="flex justify-start w-full">
              <div className="flex max-w-[75%] gap-3 flex-row">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex-shrink-0 flex items-center justify-center">
                  <Icons.Actions.Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-emerald-100 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto">

            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(action.prompt)}
                  disabled={isThinking}
                  className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap border border-transparent hover:border-emerald-200"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-400 transition-all shadow-sm">

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.md,.json,.pdf" // Text based files mostly for this demo
              />
              <button
                onClick={handleFileClick}
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Attach file"
              >
                <Icons.Actions.Paperclip className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask to tailor your resume, write a cover letter, or analyze the job description..."
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[24px] py-2 text-sm text-slate-800 placeholder:text-slate-400"
                rows={1}
                style={{ height: 'auto', minHeight: '44px' }}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isThinking || isFlying}
                className={`
                  p-2 rounded-lg transition-all duration-200 overflow-hidden relative
                  ${input.trim() && !isThinking
                    ? 'bg-emerald-600 text-white shadow-md transform hover:scale-105'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <motion.div
                    initial={false}
                    animate={isFlying ? { x: 30, y: -30, opacity: 0, scale: 0.5 } : { x: 0, y: 0, opacity: 1, scale: 1 }}
                    transition={isFlying ? { duration: 0.4, ease: "easeIn" } : { duration: 0 }}
                    className="absolute"
                  >
                    <Icons.Actions.Send className="w-5 h-5" />
                  </motion.div>
                </div>
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              AI can make mistakes. Please review generated documents carefully.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
