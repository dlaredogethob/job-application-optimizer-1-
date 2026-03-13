/**
 * @license
 * Copyright (c) 2026 Job Application Optimizer. All rights reserved.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/ui/icons';
import { useLandingPage } from './useLandingPage';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const { mobileMenuOpen, toggleMobileMenu, handleGetStarted } = useLandingPage();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <span className="font-bold text-xl tracking-tight text-slate-900">JobOpti</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors">Features</a>
                        <a href="#how-it-works" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors">How it Works</a>
                        <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors">Login</Link>
                        <button
                            onClick={handleGetStarted}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                        >
                            Get Started
                            <Icons.Hero.ArrowRight className="w-4 h-4" width={16} height={16} />
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-slate-500 hover:text-emerald-600 p-2 focus:outline-none"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mobileMenuOpen ? "close" : "menu"}
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {mobileMenuOpen ? (
                                        <Icons.Nav.Close className="w-6 h-6" width={24} height={24} />
                                    ) : (
                                        <Icons.Nav.Menu className="w-6 h-6" width={24} height={24} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50">Features</a>
                        <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50">How it Works</a>
                        <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50">Login</Link>
                        <button
                            onClick={handleGetStarted}
                            className="block w-full text-center mt-4 bg-emerald-600 text-white px-5 py-3 rounded-lg font-semibold shadow-sm inline-flex items-center justify-center gap-2"
                        >
                            Get Started
                            <Icons.Hero.ArrowRight className="w-5 h-5" width={20} height={20} />
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Hero: React.FC = () => {
    const { handleGetStarted } = useLandingPage();

    return (
        <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-100/40 to-cyan-100/40 blur-3xl opacity-60"></div>
                <div className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-yellow-50/50 to-emerald-50/50 blur-3xl opacity-60"></div>
                <svg className="absolute bottom-0 left-0 w-full text-emerald-50/50" viewBox="0 0 1440 320" fill="currentColor">
                    <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-6">
                    <Icons.Hero.Analysis className="w-4 h-4 text-emerald-500 animate-pulse" />
                    Engineering-Powered Analysis
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
                    Optimize Your Job Hunt with <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">AI-Powered Precision</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Tailor resumes, analyze job postings, and boost your chances – all through simple chat commands.
                    <br className="hidden md:block" />
                    <span className="text-emerald-700 font-medium">Perfect for thriving markets like Arizona.</span>
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <button
                        onClick={handleGetStarted}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 gap-2"
                    >
                        Get Started Free
                        <Icons.Hero.ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="inline-flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-sm">
                        View Demo
                    </button>
                </div>

                {/* Hero Image / Placeholder */}
                <div className="relative mx-auto max-w-5xl rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-2">
                        <div className="flex gap-1.5 ml-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="mx-auto text-xs font-medium text-slate-400">JobOpti Studio - Resume.pdf</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 h-[400px] md:h-[500px]">
                        <div className="p-6 border-r border-slate-100 hidden md:block">
                            <div className="space-y-4">
                                <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-32 w-full bg-slate-100 rounded border-2 border-dashed border-slate-200 flex items-center justify-center relative group/preview transition-colors hover:border-emerald-200 hover:bg-emerald-50/30 overflow-hidden">
                                    <Icons.Hero.Upload className="w-20 h-20 text-emerald-600 opacity-20 group-hover/preview:opacity-30 transition-opacity" width={80} height={80} />
                                    <span className="absolute bottom-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Waiting for upload</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-slate-100 rounded"></div>
                                    <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                                    <div className="h-3 w-4/6 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 bg-slate-50 p-6 flex flex-col">
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-end">
                                    <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-xs shadow-md">
                                        Tailor my resume for the Senior Frontend role at TechCorp.
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-white border border-emerald-100 text-slate-700 p-4 rounded-2xl rounded-tl-sm text-sm max-w-md shadow-sm">
                                        <p className="font-semibold text-emerald-800 mb-2">Analysis Complete</p>
                                        <p>I've tailored your resume. I emphasized your React experience and added metrics to your leadership section to match the $140k salary band requirements.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2">
                                <Icons.User className="w-6 h-6 text-slate-300" />
                                <div className="h-2 w-32 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Features: React.FC = () => {
    const features = [
        {
            icon: <Icons.Hero.Chat className="w-6 h-6" />,
            title: "Conversational AI Editing",
            description: "Simply chat to refine your documents. Say 'Make it punchier' or 'Focus on leadership' and watch the magic happen."
        },
        {
            icon: <Icons.Hero.Upload className="w-6 h-6" />,
            title: "Smart Upload & Analyze",
            description: "Upload resumes, job descriptions, and company info. Our AI understands context and connects the dots."
        },
        {
            icon: <Icons.Hero.Analysis className="w-6 h-6" />,
            title: "Export Optimized Files",
            description: "Get perfectly formatted PDFs with custom naming. Ready to submit to ATS systems immediately."
        }
    ];

    return (
        <div id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Features for Your Career</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to land your dream job in today's competitive market.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                            <div className="relative w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 transition-transform duration-500 ease-out group-hover:scale-110 icon-mask-gradient">
                                {idx === 1 && <div className="orbital-beam"></div>}
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HowItWorks: React.FC = () => {
    const steps = [
        { id: 1, title: "Upload Documents", desc: "Drag & drop your current resume and the job description you're eyeing." },
        { id: 2, title: "Chat to Optimize", desc: "Ask the AI to tailor content, fix gaps, and align skills with the role." },
        { id: 3, title: "Export & Apply", desc: "Download your polished, ATS-friendly PDF and send it with confidence." }
    ];

    return (
        <div id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">How It Works</h2>
                        <p className="text-slate-600 mb-10 text-lg">A simple 3-step process to transform your application from generic to hired.</p>

                        <div className="space-y-8">
                            {steps.map((step) => (
                                <div key={step.id} className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                                        {step.id}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h4>
                                        <p className="text-slate-600">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 relative transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 rounded-2xl -z-10"></div>
                            <div className="h-full flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                        <Icons.User className="w-8 h-8 text-slate-300" />
                                        <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                                    <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                                    <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                                        <Icons.Check className="w-4 h-4" /> Optimization Complete
                                    </div>
                                    <div className="h-2 w-full bg-emerald-200/50 rounded mb-1"></div>
                                    <div className="h-2 w-2/3 bg-emerald-200/50 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    const { faqOpenIndex, toggleFaq } = useLandingPage();

    const faqs = [
        { q: "How does the AI tailor my resume?", a: "Our AI analyzes keywords and requirements from the job description and rewrites your experience bullet points to highlight relevant skills using the STAR method." },
        { q: "Is my data secure?", a: "Yes. Your data is processed locally in your browser session for this demo version. We prioritize privacy." },
        { q: "Can I generate a cover letter too?", a: "Absolutely. Just ask the chat assistant to draft a cover letter based on your resume and the job description." },
        { q: "Does it work for non-tech jobs?", a: "Yes! While our examples focus on tech, the underlying AI models are effective for marketing, sales, healthcare, and engineering roles." }
    ];

    return (
        <div className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                                onClick={() => toggleFaq(idx)}
                            >
                                <span className="font-semibold text-slate-900">{item.q}</span>
                                {faqOpenIndex === idx ? <Icons.ChevronUp className="w-5 h-5 text-emerald-600" /> : <Icons.ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>
                            {faqOpenIndex === idx && (
                                <div className="p-5 pt-0 text-slate-600 bg-white border-t border-slate-50">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <span className="font-bold text-xl tracking-tight text-white mb-4 block">JobOpti</span>
                        <p className="text-slate-400 text-sm">Empowering careers with intelligent tools.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-emerald-400">Features</a></li>
                            <li><a href="#" className="hover:text-emerald-400">Pricing</a></li>
                            <li><a href="#" className="hover:text-emerald-400">Demo</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#terms" className="hover:text-emerald-400">Terms of Service</a></li>
                            <li><a href="#privacy" className="hover:text-emerald-400">Privacy Policy</a></li>
                            <li><a href="#cookies" className="hover:text-emerald-400">Cookies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Connect</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-emerald-400">Twitter</a></li>
                            <li><a href="#" className="hover:text-emerald-400">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-emerald-400">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm">© 2026 JobOpti. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" aria-label="Follow us on Twitter" className="text-slate-400 hover:text-emerald-400 transition-colors">
                            <Icons.Social.Twitter className="w-5 h-5" width={20} height={20} />
                        </a>
                        <a href="#" aria-label="Follow us on LinkedIn" className="text-slate-400 hover:text-emerald-400 transition-colors">
                            <Icons.Social.LinkedIn className="w-5 h-5" width={20} height={20} />
                        </a>
                        <a href="#" aria-label="View our projects on GitHub" className="text-slate-400 hover:text-emerald-400 transition-colors">
                            <Icons.Social.GitHub className="w-5 h-5" width={20} height={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <FAQ />
            <Footer />
        </div>
    );
};

export default LandingPage;
