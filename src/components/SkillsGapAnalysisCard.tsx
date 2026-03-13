import React from 'react';
import { SkillGapAnalysis } from '../types';
import { Icons } from './ui/icons';

interface SkillsGapAnalysisCardProps {
    analysis: SkillGapAnalysis;
}

const SkillsGapAnalysisCard: React.FC<SkillsGapAnalysisCardProps> = ({ analysis }) => {
    const { matchingSkills, missingSkills, potentialSkills, analysis: summary } = analysis;

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden max-w-2xl mt-3">
            {/* Header */}
            <div className="bg-slate-50 p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Icons.Analysis.AlertOctagon className="w-5 h-5 text-indigo-600" />
                    Skills Gap Analysis
                </h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {summary}
                </p>
            </div>

            <div className="p-4 grid gap-6">

                {/* 1. Matches */}
                <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-2 uppercase tracking-wider text-[11px]">
                        <Icons.Check className="w-4 h-4" /> Strong Matches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {matchingSkills.length > 0 ? matchingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-100">
                                {skill}
                            </span>
                        )) : <span className="text-sm text-slate-400 italic">No direct matches found.</span>}
                    </div>
                </div>

                {/* 2. Missing */}
                <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-2 uppercase tracking-wider text-[11px]">
                        <Icons.Actions.X className="w-4 h-4" /> Critical Gaps
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.length > 0 ? missingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-100">
                                {skill}
                            </span>
                        )) : <span className="text-sm text-slate-400 italic">No critical gaps identified!</span>}
                    </div>
                </div>

                {/* 3. Potential (Inferred) */}
                {potentialSkills.length > 0 && (
                    <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/50">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-indigo-700 mb-2">
                            <Icons.Analysis.Lightbulb className="w-4 h-4" /> Recommended Additions
                        </h4>
                        <p className="text-xs text-slate-600 mb-2">
                            You likely have these skills based on your experience. Consider listing them explicitly:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {potentialSkills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-white text-indigo-600 text-xs font-medium rounded-lg border border-indigo-100 shadow-sm border-dashed">
                                    + {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SkillsGapAnalysisCard;
