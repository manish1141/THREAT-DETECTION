import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Heart, 
  Code, 
  Layout, 
  Briefcase, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export function TeamCreditsCard() {
  const teamMembers = [
    {
      role: 'Made by',
      name: 'Manish Rathod',
      responsibility: 'Full-Stack Security Architecture, Threat Scoring Engine & Heuristics',
      icon: Code,
      badge: 'Lead Developer'
    },
    {
      role: 'Designed by',
      name: 'Vasu Sakhiya',
      responsibility: 'Cyber Dashboard UI/UX, Glassmorphism Aesthetics & Dark Mode',
      icon: Layout,
      badge: 'UI/UX Designer'
    },
    {
      role: 'Managed by',
      name: 'Kartik Sonagra',
      responsibility: 'Project Management, Security Specifications & Module Coordination',
      icon: Briefcase,
      badge: 'Project Manager'
    },
    {
      role: 'Work supported by',
      name: 'Paras Sonagara',
      responsibility: 'Quality Assurance, Android Verification & Threat Data Modeling',
      icon: Heart,
      badge: 'Security Advisor'
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border-cyan-500/20 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
              ACADEMIC CREDITS & PROJECT ATTRIBUTION
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            ON-DEVICE THREAT GUARD Core Team
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            BCA Final Year Cybersecurity Capstone Framework • Google Antigravity & Production Spec
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Production Build</span>
        </div>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member, idx) => {
          const Icon = member.icon;
          return (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition group space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
                  {member.role}:
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {member.badge}
                </span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h4>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {member.responsibility}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>© 2026 ON-DEVICE THREAT GUARD. All rights reserved.</span>
        <span>Dedicated to privacy-preserving on-device endpoint protection.</span>
      </div>
    </div>
  );
}
