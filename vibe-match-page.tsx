"use client";

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Target, Zap, Clock, Briefcase, Award, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

// --- Types ---
type Profile = {
  id: string;
  name: string;
  role: string;
  hardSkills: string[];
  paceScale: number; // -5 (Methodical) to +5 (Fast-paced)
  focusScale: number; // -5 (Big Picture) to +5 (Detail-oriented)
  roleScale: number; // -5 (Executor) to +5 (Planner)
  earnedBadges: string[];
  avatarUrl: string;
};

// --- Mock Data ---
const CURRENT_USER: Profile = {
  id: 'u1',
  name: 'Tanawat',
  role: 'AI Engineer / Backend',
  hardSkills: ['Python', 'OpenCV', 'AI', 'TensorFlow'],
  paceScale: 3, // Fast-paced
  focusScale: 2, // Slightly Detail-oriented
  roleScale: 1, // Slightly Planner
  earnedBadges: ['AI Visionary', 'Night Owl', 'Hackathon Vet'],
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanawat&backgroundColor=0f172a',
};

const SEEKING_SKILLS = ['Next.js', 'Figma', 'Pitching', 'React'];

const CANDIDATES: Profile[] = [
  {
    id: 'c1',
    name: 'Somchai',
    role: 'Frontend Developer',
    hardSkills: ['Next.js', 'React', 'Tailwind', 'TypeScript'],
    paceScale: 4, // Fast
    focusScale: 1, // Detail
    roleScale: -4, // Strong Executor (Good match for planner)
    earnedBadges: ['UI Wizard', 'Pixel Perfect'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai&backgroundColor=0f172a',
  },
  {
    id: 'c2',
    name: 'Napat',
    role: 'UX/UI Designer',
    hardSkills: ['Figma', 'Prototyping', 'User Research'],
    paceScale: -2, // Methodical
    focusScale: -4, // Big Picture (Differs from Tanawat)
    roleScale: -2, // Executor
    earnedBadges: ['Design Thinker', 'Empathy Pro'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Napat&backgroundColor=0f172a',
  },
  {
    id: 'c3',
    name: 'Ploy',
    role: 'Product Manager / Hacker',
    hardSkills: ['Pitching', 'Next.js', 'Project Management', 'Figma'],
    paceScale: 3, // Fast (Matches Tanawat)
    focusScale: 2, // Detail (Matches Tanawat)
    roleScale: -3, // Executor (Complements Tanawat)
    earnedBadges: ['The Pitcher', 'Scrum Master'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ploy&backgroundColor=0f172a',
  },
  {
    id: 'c4',
    name: 'Krit',
    role: 'Backend Dev',
    hardSkills: ['Node.js', 'PostgreSQL', 'Docker'],
    paceScale: 0,
    focusScale: 0,
    roleScale: 4, // Planner (Clashes with Tanawat being a Planner)
    earnedBadges: ['Bug Hunter', 'Database Guru'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Krit&backgroundColor=0f172a',
  },
  {
    id: 'c5',
    name: 'Jane',
    role: 'Fullstack Dev',
    hardSkills: ['React', 'Figma', 'Python', 'AWS'],
    paceScale: 2,
    focusScale: 3,
    roleScale: -1,
    earnedBadges: ['Jack of All Trades', 'Cloud Native'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane&backgroundColor=0f172a',
  }
];

// --- Algorithm ---
const calculateMatchScore = (teamProfile: Profile, teamSeekingSkills: string[], candidate: Profile) => {
  // 1. Skill Gap Score (40%)
  // How many of the seeking skills does the candidate have?
  const matchedSkillsCount = teamSeekingSkills.filter(skill => 
    candidate.hardSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  ).length;
  const skillRatio = teamSeekingSkills.length > 0 ? (matchedSkillsCount / teamSeekingSkills.length) : 0;
  const skillScore = skillRatio * 40;

  // 2. Vibe Similarity Score (40%)
  // Max difference for each scale is 10 (-5 to 5). Total max diff is 20.
  // We want smaller difference = higher score.
  const paceDiff = Math.abs(teamProfile.paceScale - candidate.paceScale);
  const focusDiff = Math.abs(teamProfile.focusScale - candidate.focusScale);
  const totalVibeDiff = paceDiff + focusDiff;
  // Convert diff to score: if diff is 0, score is 40. If diff is 20, score is 0.
  const vibeRatio = Math.max(0, (20 - totalVibeDiff) / 20);
  const vibeScore = vibeRatio * 40;

  // 3. Role Complementary Score (20%)
  // We want larger difference = higher score. (Planner +5 needs Executor -5)
  // Max difference is 10.
  const roleDiff = Math.abs(teamProfile.roleScale - candidate.roleScale);
  const roleRatio = roleDiff / 10; 
  const roleScore = roleRatio * 20;

  const totalScore = Math.round(skillScore + vibeScore + roleScore);
  
  return {
    totalScore,
    breakdown: {
      skillScore: Math.round(skillScore),
      vibeScore: Math.round(vibeScore),
      roleScore: Math.round(roleScore)
    }
  };
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400 bg-green-400/10 border-green-400/20';
  if (score >= 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  return 'text-red-400 bg-red-400/10 border-red-400/20';
};

const getProgressBarColor = (score: number) => {
  if (score >= 80) return 'bg-green-400';
  if (score >= 50) return 'bg-yellow-400';
  return 'bg-red-400';
};

// --- Components ---
export default function VibeMatchDashboard() {
  const [activeTab, setActiveTab] = useState<'matches' | 'saved'>('matches');

  // Calculate scores and sort candidates
  const scoredCandidates = useMemo(() => {
    return CANDIDATES.map(candidate => {
      const match = calculateMatchScore(CURRENT_USER, SEEKING_SKILLS, candidate);
      return { ...candidate, match };
    }).sort((a, b) => b.match.totalScore - a.match.totalScore);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-slate-950 fill-current" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
              Vibe Match
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800">
              <img src={CURRENT_USER.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Header / Filter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current User Summary */}
          <div className="lg:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -mr-10 -mt-10 rounded-full"></div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                <img src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{CURRENT_USER.name}</h1>
                <p className="text-cyan-400 font-medium text-sm mt-1">{CURRENT_USER.role}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {CURRENT_USER.hardSkills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Looking For Details */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Target Teammate Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {SEEKING_SKILLS.map(skill => (
                    <span key={skill} className="px-3 py-1 text-sm rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden md:block w-px h-16 bg-slate-800"></div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Team Chemistry Metrics
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Pace: <span className="text-slate-200">Fast</span></span>
                    <span className="text-slate-400">Focus: <span className="text-slate-200">Detail</span></span>
                    <span className="text-slate-400">Role: <span className="text-slate-200">Planner</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500/50 w-1/3"></div>
                    <div className="h-full bg-purple-500/50 w-1/3"></div>
                    <div className="h-full bg-cyan-500/50 w-1/3"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('matches')}
              className={`text-lg font-semibold transition-colors pb-4 -mb-[17px] border-b-2 ${activeTab === 'matches' ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              Top Matches
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`text-lg font-semibold transition-colors pb-4 -mb-[17px] border-b-2 ${activeTab === 'saved' ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              Saved Profiles
            </button>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Match Results Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {scoredCandidates.map((candidate, idx) => {
            const score = candidate.match.totalScore;
            const scoreTheme = getScoreColor(score);
            const progressColor = getProgressBarColor(score);
            
            return (
              <div 
                key={candidate.id} 
                className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/10 hover:-translate-y-1 flex flex-col"
              >
                {/* Ranking Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 z-10 shadow-lg">
                  #{idx + 1}
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-2 border-slate-800 bg-slate-800 overflow-hidden relative">
                      <img src={candidate.avatarUrl} alt={candidate.name} className="w-full h-full object-cover" />
                      {score >= 80 && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-slate-400 font-medium">{candidate.role}</p>
                    </div>
                  </div>
                  
                  {/* Score Circular Display or Badge */}
                  <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border font-bold ${scoreTheme}`}>
                    <span className="text-xl leading-none">{score}%</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-80 mt-0.5">Match</span>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-3 mb-6 flex-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Skill Gap</span>
                      <span className="text-slate-300 font-medium">{candidate.match.breakdown.skillScore}/40</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${progressColor}`} style={{ width: `${(candidate.match.breakdown.skillScore / 40) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Vibe Similarity</span>
                      <span className="text-slate-300 font-medium">{candidate.match.breakdown.vibeScore}/40</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${progressColor} opacity-80`} style={{ width: `${(candidate.match.breakdown.vibeScore / 40) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Role Complement</span>
                      <span className="text-slate-300 font-medium">{candidate.match.breakdown.roleScore}/20</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${progressColor} opacity-60`} style={{ width: `${(candidate.match.breakdown.roleScore / 20) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Skills & Badges */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.hardSkills.slice(0, 4).map(skill => (
                      <span 
                        key={skill} 
                        className={`px-2 py-1 text-xs rounded-md border ${
                          SEEKING_SKILLS.some(s => s.toLowerCase() === skill.toLowerCase())
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.hardSkills.length > 4 && (
                      <span className="px-2 py-1 text-xs rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                        +{candidate.hardSkills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {candidate.earnedBadges.map(badge => (
                      <div key={badge} className="flex items-center gap-1.5 text-xs font-medium text-amber-400/90 bg-amber-400/5 px-2 py-1 rounded-md border border-amber-400/10">
                        <Award className="w-3 h-3" />
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button className="mt-6 w-full py-2.5 rounded-xl font-medium text-sm bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center gap-2 group-hover:bg-cyan-600 group-hover:text-white">
                  View Full Profile
                  <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            );
          })}
        </section>

      </main>
    </div>
  );
}
