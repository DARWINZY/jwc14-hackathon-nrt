"use client";

import React, { useState } from 'react';
import { Search, Plus, Image as ImageIcon, Users, User, X, Filter } from 'lucide-react';

// --- Types ---
type Team = {
  id: string;
  name: string;
  competition: string;
  category: string; // e.g., 'สายคอม', 'วิศวกรรม', 'แพทย์'
  missingRoles: string[];
  missingCount: number;
  currentMembers: number;
  coverColor: string;
};

// --- Mock Data ---
const CATEGORIES = ["ทั้งหมด", "สายคอม", "วิศวกรรม", "แพทย์", "สถาปัตย์", "บริหารธุรกิจ", "วิทยาศาสตร์"];

const MOCK_TEAMS: Team[] = [
  {
    id: "t1",
    name: "CodeBreakers",
    competition: "NSC 2026",
    category: "สายคอม",
    missingRoles: ["Frontend", "UX/UI"],
    missingCount: 2,
    currentMembers: 2,
    coverColor: "bg-blue-100",
  },
  {
    id: "t2",
    name: "RoboTitans",
    competition: "World Robot Olympiad",
    category: "วิศวกรรม",
    missingRoles: ["Hardware Engineer"],
    missingCount: 1,
    currentMembers: 3,
    coverColor: "bg-orange-100",
  },
  {
    id: "t3",
    name: "MedTech Innovators",
    competition: "HealthHack Thailand",
    category: "แพทย์",
    missingRoles: ["Data Scientist", "Biologist"],
    missingCount: 2,
    currentMembers: 2,
    coverColor: "bg-teal-100",
  },
  {
    id: "t4",
    name: "Pixel Perfect",
    competition: "Creative App Design",
    category: "สถาปัตย์",
    missingRoles: ["3D Animator"],
    missingCount: 1,
    currentMembers: 3,
    coverColor: "bg-pink-100",
  },
  {
    id: "t5",
    name: "Cyber Knights",
    competition: "CTF National",
    category: "สายคอม",
    missingRoles: ["Security Analyst", "Backend"],
    missingCount: 2,
    currentMembers: 1,
    coverColor: "bg-slate-200",
  },
  {
    id: "t6",
    name: "BizPioneers",
    competition: "Startup Thailand",
    category: "บริหารธุรกิจ",
    missingRoles: ["Marketing", "Pitching"],
    missingCount: 2,
    currentMembers: 2,
    coverColor: "bg-yellow-100",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'หาทีม' | 'อันดับ'>('หาทีม');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter Logic
  const filteredTeams = MOCK_TEAMS.filter((team) => {
    const matchesCategory = activeCategory === "ทั้งหมด" || team.category === activeCategory;
    const matchesSearch = 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      team.competition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      
      {/* Left Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">โรงเรียน...</h1>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('หาทีม')}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${
                    activeTab === 'หาทีม' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  หาทีม
                </button>
                <button 
                  onClick={() => setActiveTab('อันดับ')}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${
                    activeTab === 'อันดับ' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  อันดับ
                </button>
              </div>
            </div>
            
            {/* Search Bar inside Header for compactness, or below based on Figma */}
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาทีม หรือ รายการแข่งขัน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-none rounded-full pl-12 pr-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 font-medium"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-slate-700 text-white shadow-md border border-slate-700' 
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredTeams.map(team => (
                <div key={team.id} className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 cursor-pointer">
                  {/* Cover Image Placeholder */}
                  <div className={`w-full h-32 rounded-2xl ${team.coverColor} flex flex-col items-center justify-center text-slate-400 border border-black/5`}>
                     <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                     <span className="text-xs font-semibold opacity-70">ชื่อรายการ: {team.competition}</span>
                  </div>
                  
                  {/* Team Info */}
                  <div className="px-2 pt-2 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-500">ชื่อทีม : <span className="text-slate-800">{team.name}</span></p>
                        <p className="text-xs font-bold text-slate-500">รายการแข่ง : <span className="text-slate-800">{team.competition}</span></p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-300/50">
                      <p className="text-xs font-bold text-slate-500">
                        ขาด : <span className="text-vibe-red">{team.missingRoles.join(', ')}</span> ({team.missingCount} คน)
                      </p>
                    </div>

                    {/* Members Avatar Row */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        {Array.from({ length: team.currentMembers }).map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-slate-300 border-2 border-[#EAEAEA] flex items-center justify-center">
                             <User className="w-3 h-3 text-slate-500" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">อัปเดต 2 ชม. ที่แล้ว</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Floating Action Button */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="absolute bottom-8 right-8 w-14 h-14 bg-vibe-red hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-40"
          >
            <Plus className="w-8 h-8" />
          </button>
        </main>
      </div>


      {/* --- Add Team Modal --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold text-slate-400 mb-8 lowercase">เพิ่มการหาทีม</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Team Name */}
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-slate-800">ชื่อทีม</label>
                    <input 
                      type="text" 
                      placeholder="เช่น CodeBreakers"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-300 font-bold text-slate-700"
                    />
                  </div>

                  {/* Competition Name */}
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-slate-800">รายการแข่งเป้าหมาย</label>
                    <input 
                      type="text" 
                      placeholder="เช่น NSC 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-300 font-bold text-slate-700"
                    />
                  </div>

                  {/* Member Count */}
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-slate-800">สมาชิกในทีม</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1">
                        <button className="text-xl font-bold text-slate-500 hover:text-slate-800">{'<'}</button>
                        <span className="text-xl font-bold text-slate-800 w-6 text-center">2</span>
                        <button className="text-xl font-bold text-slate-500 hover:text-slate-800">{'>'}</button>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-400"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-400"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-white font-bold pb-0.5">+</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-slate-800">tag</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-300 text-slate-700 text-sm font-bold rounded-lg">#model</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-slate-800">สายการแข่ง (หมวดหมู่)</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-300 font-bold text-slate-700 appearance-none">
                      <option value="" disabled selected>เลือกสายการแข่ง</option>
                      {CATEGORIES.filter(c => c !== "ทั้งหมด").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Missing Roles */}
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-slate-800">ตำแหน่งที่กำลังตามหา (ขาดอะไร)</label>
                    <input 
                      type="text" 
                      placeholder="เช่น Frontend, UX/UI, พิธีกร"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-300 font-bold text-slate-700"
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-slate-800">รายละเอียดอื่นๆ (อยากได้คนแบบไหน)</label>
                    <textarea 
                      rows={3}
                      placeholder="เช่น ขอคนที่ขยัน สามารถประชุมดึกได้ ถนัดใช้ Figma..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-300 font-bold text-slate-700 resize-none"
                    ></textarea>
                  </div>
                </div>

              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 py-3 bg-vibe-red hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-md"
                >
                  โพสต์หาทีม
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple Award Icon Component
function AwardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}
