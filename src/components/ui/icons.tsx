/**
 * @license
 * Copyright (c) 2026 Job Application Optimizer. All rights reserved.
 */

import React from 'react';
import { Icon, IconProps } from '@iconify/react';

/**
 * Central Solar Icon Registry
 * Strictly uses Iconify Solar library as per Master Architectural Standards.
 * Format: solar:[icon-name]-[variant]
 */
export const SolarIcon = ({ icon, className, ...props }: { icon: string } & Omit<IconProps, 'icon'>) => (
    <Icon icon={`solar:${icon}`} className={className} aria-hidden="true" {...props} />
);

/**
 * Sidebar Duotone Layer Override
 * Forces the secondary layer of Duotone icons to render at exactly 30% opacity.
 */
export const SidebarIcon = ({ icon, className, ...props }: { icon: string } & Omit<IconProps, 'icon'>) => (
    <SolarIcon
        icon={icon}
        className={`[&_path[opacity]]:!opacity-30 [&_circle[opacity]]:!opacity-30 [&_rect[opacity]]:!opacity-30 ${className || ''}`}
        {...props}
    />
);

export const Icons = {
    // Hero Section - Broken Variants
    Hero: {
        Chat: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="chat-round-dots-broken" {...props} />,
        Upload: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="upload-cloud-duotone" {...props} />,
        Analysis: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="graph-new-broken" {...props} />,
        ArrowRight: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="arrow-right-broken" {...props} />,
        UploadDuotone: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="upload-cloud-duotone" {...props} />,
    },

    // Navigation
    Nav: {
        Menu: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="hamburger-menu-broken" {...props} />,
        Close: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="close-circle-broken" {...props} />,
    },

    // Utility
    Check: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="check-circle-broken" {...props} />,
    ChevronDown: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="alt-arrow-down-broken" {...props} />,
    ChevronUp: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="alt-arrow-up-broken" {...props} />,
    User: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="user-circle-broken" {...props} />,
    AI: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="stars-minimalistic-broken" {...props} />,

    // Social - Using Solar Broken style
    Social: {
        Twitter: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="twitter-broken" {...props} />,
        LinkedIn: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="linkedin-broken" {...props} />,
        GitHub: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="github-broken" {...props} />,
    },

    // Sidebar - Using Solar Duotone style
    Sidebar: {
        Home: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="home-2-duotone" {...props} />,
        FileText: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="file-text-duotone" {...props} />,
        Briefcase: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="case-minimalistic-duotone" {...props} />,
        Building: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="buildings-duotone" {...props} />,
        ArrowLeft: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="alt-arrow-left-duotone" {...props} />,
        ArrowRight: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="alt-arrow-right-duotone" {...props} />,
        Menu: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="hamburger-menu-duotone" {...props} />,
        Folder: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="folder-2-duotone" {...props} />,
        Clock: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="clock-circle-duotone" {...props} />,
        Trash: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="trash-bin-trash-duotone" {...props} />,
        Edit: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="pen-2-duotone" {...props} />,
        Upload: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="upload-cloud-duotone" {...props} />,
        CheckCircle: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="check-circle-duotone" {...props} />,
        CloseCircle: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="close-circle-duotone" {...props} />,
        User: (props: Omit<IconProps, 'icon'>) => <SidebarIcon icon="user-circle-duotone" {...props} />,
    },

    // Library - Mix of Duotone (Primary) and Outline (Secondary)
    Library: {
        Plus: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="add-circle-bold-duotone" {...props} />,
        File: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="document-text-duotone" {...props} />,
        Menu: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="menu-dots-vertical-outline" {...props} />,
        History: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="history-outline" {...props} />,
        Trending: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="graph-up-outline" {...props} />,
        DocumentAdd: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="document-add-broken" {...props} />,
    },

    // Extracted from Lucide replacements - Broken
    Auth: {
        Mail: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="letter-broken" {...props} />,
        Lock: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="lock-password-broken" {...props} />,
        Eye: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="eye-broken" {...props} />,
        EyeOff: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="eye-closed-broken" {...props} />,
        Briefcase: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="case-broken" {...props} />,
    },

    Settings: {
        SettingsIcon: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="settings-broken" {...props} />,
        User: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="user-broken" {...props} />,
        Bell: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="bell-broken" {...props} />,
        Shield: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="shield-check-broken" {...props} />,
        CreditCard: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="card-broken" {...props} />,
    },

    People: {
        Users: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="users-group-two-rounded-broken" {...props} />,
        Phone: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="phone-broken" {...props} />,
        MapPin: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="map-point-broken" {...props} />,
    },

    Albums: {
        Target: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="target-broken" {...props} />,
        ChevronRight: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="alt-arrow-right-broken" {...props} />,
    },

    Analysis: {
        AlertOctagon: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="danger-triangle-broken" {...props} />,
        Lightbulb: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="lightbulb-minimalistic-broken" {...props} />,
        CheckCircle2: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="check-circle-broken" {...props} />,
        XCircle: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="close-circle-broken" {...props} />,
        AlertCircle: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="info-circle-broken" {...props} />,
        TrendingUp: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="graph-up-broken" {...props} />,
    },

    Actions: {
        Copy: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="copy-broken" {...props} />,
        ExternalLink: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="link-square-broken" {...props} />,
        Loader2: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="refresh-broken" {...props} />,
        Sparkles: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="stars-minimalistic-broken" {...props} />,
        Download: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="download-square-broken" {...props} />,
        Printer: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="printer-minimalistic-broken" {...props} />,
        FileText: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="document-text-broken" {...props} />,
        Paperclip: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="paperclip-2-broken" {...props} />,
        Send: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="plain-2-broken" {...props} />, // Changed per user request for fly animation
        Bot: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="ghost-broken" {...props} />,
        Wand2: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="magic-stick-3-broken" {...props} />,
        PenTool: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="pen-broken" {...props} />,
        FileSearch: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="document-medicine-broken" {...props} />, // Close enough to file search
        DollarSign: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="dollar-broken" {...props} />,
        LayoutDashboard: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="widget-5-broken" {...props} />,
        Library: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="folder-with-files-broken" {...props} />,
        LogOut: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="logout-2-broken" {...props} />,
        Search: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="magnifer-broken" {...props} />,
        X: (props: Omit<IconProps, 'icon'>) => <SolarIcon icon="close-square-broken" {...props} />,
    }
};
