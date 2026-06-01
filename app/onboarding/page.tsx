"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MapPin, Search, Zap, Target, Briefcase, Info, CheckCircle2, User, BookOpen } from 'lucide-react';

// --- Mock Schools ---
const THAI_SCHOOLS = [
  "โรงเรียนเตรียมอุดมศึกษา",
  "โรงเรียนมหิดลวิทยานุสรณ์",
  "โรงเรียนกำเนิดวิทย์",
  "โรงเรียนสวนกุหลาบวิทยาลัย",
  "โรงเรียนสามเสนวิทยาลัย",
  "โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี)",
  "โรงเรียนสตรีวิทยา",
  "โรงเรียนกรุงเทพคริสเตียนวิทยาลัย",
  "โรงเรียนอัสสัมชัญ",
  "โรงเรียนเซนต์คาเบรียล",
  "จุฬาลงกรณ์มหาวิทยาลัย",
  "มหาวิทยาลัยมหิดล",
  "มหาวิทยาลัยเกษตรศาสตร์",
  "มหาวิทยาลัยธรรมศาสตร์",
  "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (บางมด)",
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (สจล.)"
];

// --- Types ---
type OnboardingData = {
  firstName: string;
  lastName: string;
  gender: string;
  grade: string;
  school: string;
  paceScale: number;
  focusScale: number;
  roleScale: number;
  selfReview: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    gender: '',
    grade: '',
    school: '',
    paceScale: 0,
    focusScale: 0,
    roleScale: 0,
    selfReview: '',
  });

  // Autocomplete state
  const [schoolSearch, setSchoolSearch] = useState('');
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

  const filteredSchools = THAI_SCHOOLS.filter(s => s.toLowerCase().includes(schoolSearch.toLowerCase()));

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  const handleChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-slate-950 fill-current" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
              Vibe Match
            </span>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Step {step} of 2
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-900">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

          {/* --- Step 1: Basic Information --- */}
          {step === 1 && (
            <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Create Your Profile</h1>
                <p className="text-slate-400">Join Vibe Match to find your perfect hackathon team.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First Name (ชื่อ)</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200"
                    placeholder="Somchai"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last Name (นามสกุล)</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200"
                    placeholder="Sookjai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Gender (เพศ)</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200 appearance-none"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male (ชาย)</option>
                    <option value="female">Female (หญิง)</option>
                    <option value="lgbtq">LGBTQ+ / ไม่ระบุ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Grade (ระดับชั้น)</label>
                  <select 
                    value={formData.grade}
                    onChange={(e) => handleChange('grade', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200 appearance-none"
                  >
                    <option value="" disabled>Select Grade</option>
                    <option value="m4">มัธยมศึกษาปีที่ 4</option>
                    <option value="m5">มัธยมศึกษาปีที่ 5</option>
                    <option value="m6">มัธยมศึกษาปีที่ 6</option>
                    <option value="y1">มหาวิทยาลัย ปี 1</option>
                    <option value="y2">มหาวิทยาลัย ปี 2</option>
                    <option value="y3">มหาวิทยาลัย ปี 3</option>
                    <option value="y4">มหาวิทยาลัย ปี 4</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-slate-300">School / University (สถานศึกษา)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    value={schoolSearch}
                    onChange={(e) => {
                      setSchoolSearch(e.target.value);
                      setIsSchoolDropdownOpen(true);
                      handleChange('school', e.target.value);
                    }}
                    onFocus={() => setIsSchoolDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsSchoolDropdownOpen(false), 200)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200"
                    placeholder="ค้นหาชื่อโรงเรียน หรือ มหาวิทยาลัย"
                  />
                </div>
                {/* Dropdown */}
                {isSchoolDropdownOpen && filteredSchools.length > 0 && (
                  <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-20 custom-scrollbar">
                    {filteredSchools.map((school, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSchoolSearch(school);
                          handleChange('school', school);
                          setIsSchoolDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50 last:border-0"
                      >
                        {school}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!formData.firstName || !formData.lastName || !formData.school}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group shadow-lg shadow-cyan-900/20"
                >
                  Next Step
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* --- Step 2: Vibe Check --- */}
          {step === 2 && (
            <div className="space-y-10 relative z-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Vibe Check</h1>
                <p className="text-slate-400">ช่วยเราวิเคราะห์สไตล์การทำงานของคุณ เพื่อหาทีมที่เข้าขากันที่สุด</p>
              </div>

              <div className="space-y-10">
                {/* Scale 1: Pace */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-cyan-400">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Pace (ความเร็ว)</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2 px-1">
                    <span>ค่อยๆ ทำอย่างรอบคอบ (-5)</span>
                    <span>ปั่นงานด่วน รวดเร็ว (+5)</span>
                  </div>
                  <input 
                    type="range" min="-5" max="5" step="1"
                    value={formData.paceScale}
                    onChange={(e) => handleChange('paceScale', parseInt(e.target.value))}
                    className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center text-lg font-bold text-white">{formData.paceScale > 0 ? `+${formData.paceScale}` : formData.paceScale}</div>
                </div>

                {/* Scale 2: Focus */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-emerald-400">
                    <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Focus (ความสนใจ)</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2 px-1">
                    <span>มองภาพรวม Big Picture (-5)</span>
                    <span>ลงรายละเอียด Detail-oriented (+5)</span>
                  </div>
                  <input 
                    type="range" min="-5" max="5" step="1"
                    value={formData.focusScale}
                    onChange={(e) => handleChange('focusScale', parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center text-lg font-bold text-white">{formData.focusScale > 0 ? `+${formData.focusScale}` : formData.focusScale}</div>
                </div>

                {/* Scale 3: Role */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-purple-400">
                    <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Role (บทบาท)</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2 px-1">
                    <span>สายลงมือทำ Executor (-5)</span>
                    <span>สายวางแผน Planner (+5)</span>
                  </div>
                  <input 
                    type="range" min="-5" max="5" step="1"
                    value={formData.roleScale}
                    onChange={(e) => handleChange('roleScale', parseInt(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center text-lg font-bold text-white">{formData.roleScale > 0 ? `+${formData.roleScale}` : formData.roleScale}</div>
                </div>
              </div>

              {/* Self-Review Section */}
              <div className="space-y-3 pt-6 border-t border-slate-800">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  คำแนะนำตัว / สไตล์การทำงาน (Self-Review)
                </label>
                <textarea 
                  rows={3}
                  value={formData.selfReview}
                  onChange={(e) => handleChange('selfReview', e.target.value)}
                  placeholder="เช่น ชอบทำงานดึก, ถนัดการทำสไลด์นำเสนอ, ชอบใช้ Notion..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200 resize-none"
                />
                
                {/* Alert Box for System Behavior */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-start mt-4">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200/80 leading-relaxed">
                    <span className="text-blue-400 font-semibold block mb-1">ระบบ Peer Review</span>
                    ข้อความรีวิวตัวเองนี้ จะเป็นเพียงข้อมูลชั่วคราวเท่านั้น หลังจากที่คุณผ่านการแข่งขันในนามทีมครั้งแรก 
                    ข้อความนี้จะถูกแทนที่ด้วย <strong>"คำคอมเมนต์จากเพื่อนร่วมทีม (Peer Endorsements)"</strong> เพื่อสร้างความน่าเชื่อถือที่แท้จริงให้กับโปรไฟล์ของคุณ
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <button 
                  onClick={handleBack}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button 
                  onClick={() => alert("Registration Complete! Redirecting to Dashboard...")}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl transition-all flex items-center gap-2 group shadow-lg shadow-emerald-900/20"
                >
                  Start Matching
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Global Style for Custom Scrollbar in Dropdown */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.3); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.5); 
        }
      `}} />
    </div>
  );
}
