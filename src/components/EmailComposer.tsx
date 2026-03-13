import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './ui/icons';
import { toast } from 'react-hot-toast';
import { Project } from '../types';
import geminiService from '../services/geminiService';

interface EmailComposerProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ isOpen, onClose, project }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    // Pre-populate subject from project name on open
    useEffect(() => {
        if (isOpen) {
            // Try to extract company/role from project name or last AI message
            const lastModelMsg = [...project.chatHistory].reverse().find(m => m.role === 'model');
            const projectLabel = project.name === 'New Application' ? 'the Role' : project.name;
            setSubject(`Application for ${projectLabel}`);

            // If body is empty, auto-generate on open
            if (!body) {
                handleGenerate();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Gather context: files + last cover letter / resume AI message
        const fileContext = project.files.length
            ? project.files.map(f => `--- ${f.type.toUpperCase().replace('_', ' ')}: ${f.name} ---\n${f.contentSnippet?.slice(0, 1500) ?? ''}`).join('\n\n')
            : '';

        const lastCoverLetter = [...project.chatHistory]
            .reverse()
            .find(m => m.role === 'model' && /cover letter|dear hiring/i.test(m.content));

        const coverLetterContext = lastCoverLetter
            ? `\n\n--- GENERATED COVER LETTER ---\n${lastCoverLetter.content.slice(0, 2000)}`
            : '';

        const prompt = `You are a professional career coach. Write a concise, professional job application email body (NOT a cover letter) that:
1. Opens with a brief, confident introduction (1-2 sentences)
2. States the position being applied for
3. Mentions that a tailored resume and cover letter are attached
4. Highlights 1-2 key strengths from the resume that match the role
5. Closes with a call to action for an interview
6. Keeps the total email under 200 words
7. Uses a warm but professional tone

Context:
${fileContext}${coverLetterContext}

Output ONLY the email body text — no subject line, no "Subject:", no extra explanation. Start with "Dear Hiring Manager," or the company's hiring team name if known.`;

        try {
            const result = await geminiService.sendMessage(prompt);
            setBody(result);
        } catch {
            toast.error('Failed to generate email. You can type it manually.');
            setBody('Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Position] role at [Company].\n\nPlease find my resume and cover letter attached for your consideration.\n\nI would welcome the opportunity to discuss how my background aligns with your team\'s needs.\n\nBest regards,\n[Your Name]');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        const fullEmail = `To: ${to}\nSubject: ${subject}\n\n${body}`;
        navigator.clipboard.writeText(fullEmail).then(() => {
            setCopied(true);
            toast.success('Email copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleOpenMailto = () => {
        if (!body.trim()) {
            toast.error('Generate or write the email body first.');
            return;
        }
        const params = new URLSearchParams();
        if (to) params.set('to', to);
        params.set('subject', subject);
        params.set('body', body);
        window.open(`mailto:?${params.toString()}`, '_blank');
    };

    const attachmentNames = project.files.map(f => f.name);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                        <Icons.Auth.Mail className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800">Compose Application Email</h2>
                                        <p className="text-xs text-slate-500">AI-drafted email ready to send</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Icons.Actions.X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">

                                {/* To field */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">To</label>
                                    <input
                                        type="email"
                                        value={to}
                                        onChange={e => setTo(e.target.value)}
                                        placeholder="recruiter@company.com"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                                    />
                                </div>

                                {/* Subject field */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="Application for Senior React Developer"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                                    />
                                </div>

                                {/* Attachments badge */}
                                {attachmentNames.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide self-center">Attachments</span>
                                        {attachmentNames.map((name, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md border border-slate-200">
                                                <Icons.Actions.Paperclip className="w-3 h-3" />
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Body */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Body</label>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isGenerating}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors disabled:opacity-60"
                                        >
                                            {isGenerating
                                                ? <Icons.Actions.Loader2 className="w-3 h-3 animate-spin" />
                                                : <Icons.Actions.Sparkles className="w-3 h-3" />}
                                            {isGenerating ? 'Generating…' : 'Regenerate with AI'}
                                        </button>
                                    </div>

                                    {isGenerating ? (
                                        <div className="w-full border border-slate-200 rounded-lg px-3 py-6 flex flex-col items-center justify-center gap-2 text-slate-400 bg-slate-50 min-h-[200px]">
                                            <Icons.Actions.Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                            <p className="text-sm">Drafting your email…</p>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={body}
                                            onChange={e => setBody(e.target.value)}
                                            rows={10}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none resize-none transition-all leading-relaxed"
                                            placeholder="Click 'Regenerate with AI' or type your email body here…"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                                <p className="text-[11px] text-slate-400 text-center sm:text-left">
                                    Note: Actual file attachments must be added manually in your email client.
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        disabled={!body || isGenerating}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                    >
                                        {copied ? <Icons.Check className="w-4 h-4 text-emerald-600" /> : <Icons.Actions.Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={handleOpenMailto}
                                        disabled={!body || isGenerating}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-md"
                                    >
                                        <Icons.Actions.ExternalLink className="w-4 h-4" />
                                        Open in Mail App
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EmailComposer;
