/**
 * @license
 * Copyright (c) 2026 Job Application Optimizer. All rights reserved.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ViewModel for the Landing Page.
 * Encapsulates UI logic according to MVVM pattern.
 */
export const useLandingPage = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen(prev => !prev);
    }, []);

    const toggleFaq = useCallback((index: number) => {
        setFaqOpenIndex(prev => (prev === index ? null : index));
    }, []);

    const handleGetStarted = useCallback(() => {
        navigate('/signup');
    }, [navigate]);

    return {
        mobileMenuOpen,
        toggleMobileMenu,
        faqOpenIndex,
        toggleFaq,
        handleGetStarted
    };
};
