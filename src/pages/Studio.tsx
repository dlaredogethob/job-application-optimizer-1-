import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import { Project, UploadedFile } from '../types';
import { getProjects, saveProject, deleteProject, createNewProject } from '../services/storageService';
import { Icons } from '../components/ui/icons';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import geminiService from '../services/geminiService';

const Studio: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize
    useEffect(() => {
        const loadedProjects = getProjects();
        if (loadedProjects.length > 0) {
            setProjects(loadedProjects);
            // Default to most recent
            const mostRecent = loadedProjects.sort((a, b) => b.lastModified - a.lastModified)[0];
            setCurrentProject(mostRecent);
        } else {
            handleNewProject();
        }
    }, []);

    const handleNewProject = () => {
        const newProj = createNewProject();
        setProjects(prev => [...prev, newProj]);
        setCurrentProject(newProj);
        saveProject(newProj);
        // On mobile, close sidebar when new project created
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleSelectProject = (id: string) => {
        const proj = projects.find(p => p.id === id);
        if (proj) {
            setCurrentProject(proj);
            if (window.innerWidth < 768) setSidebarOpen(false);
        }
    };

    const handleDeleteProject = (id: string) => {
        deleteProject(id);
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);

        if (currentProject?.id === id) {
            if (updated.length > 0) {
                setCurrentProject(updated[0]);
            } else {
                handleNewProject();
            }
        }
    };

    const handleUpdateProject = (updatedProject: Project) => {
        setCurrentProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        saveProject(updatedProject);
    };

    const handleFileUpload = async (file: UploadedFile) => {
        if (!currentProject) return;

        let processedFile = { ...file };
        let systemMsgContent = file.contentSnippet
            ? `System: User uploaded ${file.name}. \n\n${file.contentSnippet}`
            : `System: Analyzed ${file.name}. Identified as ${file.type.replace('_', ' ')}.`;

        // Parse resume if applicable
        if (file.type === 'resume' && file.contentSnippet) {
            const toastId = toast.loading('Parsing resume structure...');
            try {
                const parsed = await geminiService.parseResume(file.contentSnippet);
                processedFile.parsedData = parsed;

                systemMsgContent += `\n\n[System Note]: Successfully extracted structured data:
        - ${parsed.education.length} Education entries
        - ${parsed.workHistory.length} Work History entries
        - ${parsed.skills.length} Skills identified.`;

                toast.success('Resume parsed successfully!', { id: toastId });
            } catch (e) {
                console.error("Resume parsing failed", e);
                toast.error('Failed to parse resume structure.', { id: toastId });
            }
        }

        // Match Analysis Logic: Trigger if uploading JD and Resume exists OR uploading Resume and JD exists
        const uploadedType = file.type;
        const existingResume = currentProject.files.find(f => f.type === 'resume');
        const existingJD = currentProject.files.find(f => f.type === 'job_description');

        let resumeText = '';
        let jdText = '';

        if (uploadedType === 'resume' && file.contentSnippet && existingJD && existingJD.contentSnippet) {
            resumeText = file.contentSnippet;
            jdText = existingJD.contentSnippet;
        } else if ((uploadedType === 'job_description' || uploadedType.includes('job')) && file.contentSnippet && existingResume && existingResume.contentSnippet) {
            resumeText = existingResume.contentSnippet;
            jdText = file.contentSnippet;
        }

        let matchAnalysisData;

        if (resumeText && jdText) {
            const matchToastId = toast.loading('Analyzing Job Match...');
            try {
                const analysis = await geminiService.matchResumeToJob(resumeText, jdText);
                matchAnalysisData = analysis;

                systemMsgContent += `\n\n[Match Analysis]:
        **Match Score**: ${analysis.matchPercentage}%
        
        **Profile Analysis**:
        ${analysis.profileAnalysis}
        
        **Missing Keywords**:
        ${analysis.missingKeywords.join(', ')}
        
        **Matched Keywords**:
        ${analysis.matchedKeywords.join(', ')}`;

                toast.success('Match analysis complete!', { id: matchToastId });
            } catch (e) {
                console.error("Match analysis failed", e);
                toast.error('Failed to analyze match.', { id: matchToastId });
            }
        }

        // Add file to project and add a system note to chat with the actual content
        const updatedFiles = [...currentProject.files, processedFile];

        const systemMsg = {
            id: crypto.randomUUID(),
            role: 'system' as const,
            content: systemMsgContent,
            timestamp: Date.now(),
            matchAnalysis: matchAnalysisData
        };

        const updatedProject = {
            ...currentProject,
            files: updatedFiles,
            chatHistory: [...currentProject.chatHistory, systemMsg],
            lastModified: Date.now()
        };

        handleUpdateProject(updatedProject);
    };

    if (!currentProject) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div></div>;

    return (
        <div className="flex h-full overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <Sidebar
                currentProject={currentProject}
                projects={projects}
                onSelectProject={handleSelectProject}
                onDeleteProject={handleDeleteProject}
                onNewProject={handleNewProject}
                onFileUpload={handleFileUpload}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
                {/* Mobile Header Trigger */}
                <div className="md:hidden absolute top-4 left-4 z-10 flex gap-2">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 bg-white rounded-md shadow-sm border border-slate-200 text-slate-600"
                    >
                        <Icons.Nav.Menu className="w-5 h-5" />
                    </button>
                </div>

                <ChatInterface
                    project={currentProject}
                    onUpdateProject={handleUpdateProject}
                    onFileUpload={handleFileUpload}
                />
            </main>
        </div>
    );
};

export default Studio;
