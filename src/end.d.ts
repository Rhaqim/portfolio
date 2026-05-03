/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type GridLayout = {
        content: string | SvelteComponent;
        rowSpan: number;
        colSpan: number;
        rowStart?: number;
        colStart?: number;
        rowEnd?: number;
        colEnd?: number;
        skewX?: number;
        skewY?: number;
        clipPath?: string;
        backgroundColor?: string;
        effect?: "hover-zoom" | "appear" | "none";
        effectDuration?: number;
        effectDelay?: number;
};

type WorkData = {
        company: string;
        companyUrl: string;
        role: string;
        period: string;
        impact: string;
        technologies: string[];
        description?: string;
        highlights?: string[];
};

type Project = {
        title: string;
        tagline: string;
        description: string;
        technologies: string[];
        status: string;
        featured: boolean;
        year: string;
        url?: string;
};

type Interest = {
        title: string;
        subtitle: string;
        icon: string;
        type: "current" | "next";
};

type NavigationLink = {
        id: string;
        name: string;
        href: string;
        icon: string;
        current: boolean;
};
