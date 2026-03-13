import React from 'react';
import { MatchAnalysis } from '../types';
import { Icons } from './ui/icons';

interface MatchAnalysisCardProps {
    analysis: MatchAnalysis;
}

const MatchAnalysisCard: React.FC<MatchAnalysisCardProps> = ({ analysis }) => {
    const { matchPercentage, matchedKeywords, missingKeywords, profileAnalysis } = analysis;

    // Color mapping based on score
    const scoreColor = matchPercentage >= 80 ? 'text-emerald-600' : matchPercentage >= 50 ? 'text-yellow-600' : 'text-red-600';
    const progressColor = matchPercentage >= 80 ? 'bg-emerald-500' : matchPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    const borderColor = matchPercentage >= 80 ? 'border-emerald-200' : matchPercentage >= 50 ? 'border-yellow-200' : 'border-red-200';
    const bgColor = matchPercentage >= 80 ? 'bg-emerald-50' : matchPercentage >= 50 ? 'bg-yellow-50' : 'bg-red-50';

    return (
        <div className={`rounded-xl border ${borderColor} ${bgColor} p-5 mt-3 space-y-4 max-w-2xl`}>
            {/* Header Section */}
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-white opacity-50"
                        />
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={175.93} // 2 * PI * 28
                            strokeDashoffset={175.93 - (175.93 * matchPercentage) / 100}
                            className={`${scoreColor} transition-all duration-1000 ease-out`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className={`absolute text-sm font-bold ${scoreColor}`}>{matchPercentage}%</span>
                </div>
                <div className="flex-1">
                    <h3 className={`font-bold text-lg ${scoreColor} flex items-center gap-2`}>
                        {matchPercentage >= 80 ? 'Great Match!' : matchPercentage >= 50 ? 'Good Potential' : 'Needs Improvement'}
                        <Icons.Analysis.TrendingUp className="w-5 h-5" />
                    </h3>
                    <p className="text-sm text-slate-600 leading-snug mt-1">{profileAnalysis}</p>
                </div>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">

                {/* Matched */}
                <div className="bg-white/60 rounded-lg p-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-2">
                        <Icons.Analysis.CheckCircle2 className="w-4 h-4" /> Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {matchedKeywords.length > 0 ? matchedKeywords.slice(0, 10).map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full border border-emerald-200">
                                {kw}
                            </span>
                        )) : <span className="text-xs text-slate-400 italic">No exact matches found.</span>}
                        {matchedKeywords.length > 10 && (
                            <span className="px-2 py-0.5 text-xs text-emerald-600">+ {matchedKeywords.length - 10} more</span>
                        )}
                    </div>
                </div>

                {/* Missing */}
                <div className="bg-white/60 rounded-lg p-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-2">
                        <Icons.Analysis.AlertCircle className="w-4 h-4" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {missingKeywords.length > 0 ? missingKeywords.slice(0, 10).map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full border border-red-200">
                                {kw}
                            </span>
                        )) : <span className="text-xs text-slate-400 italic">No extracted keywords missing!</span>}
                        {missingKeywords.length > 10 && (
                            <span className="px-2 py-0.5 text-xs text-red-600">+ {missingKeywords.length - 10} more</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchAnalysisCard;
