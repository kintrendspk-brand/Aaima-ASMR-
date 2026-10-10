import React from 'react';
import { ArrowLeft, Smartphone, CheckCircle, Terminal, Download, ShieldCheck } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const ApkGuideModal: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-y-auto bg-gradient-to-b from-emerald-50 via-teal-50 to-pink-50">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-emerald-700 text-xs font-bold rounded-full shadow-xs border border-emerald-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900">
            Android APK Build Guide
          </h2>
          <span className="text-[10px] text-emerald-600 font-bold">
            100% Free Tools • Offline Ready
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Guide Content */}
      <div className="flex-1 w-full max-w-md mx-auto space-y-3.5 pb-6">
        {/* Intro Banner */}
        <div className="bg-white/90 rounded-3xl p-4 shadow-sm border border-emerald-200 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-1">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <span>Ready for Android APK Packaging</span>
          </div>
          <p className="text-xs text-purple-800/80 leading-relaxed font-medium">
            <strong>Aaima ASMR Eating Store</strong> is engineered with zero external dependencies, client-side Web Audio synthesis, and responsive mobile viewport controls, making it effortless to build as a native Android APK or install directly as a PWA!
          </p>
        </div>

        {/* Method 1: Capacitor (Recommended Native APK) */}
        <div className="bg-white/90 rounded-3xl p-4 shadow-sm border border-purple-200 space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-xs">1</span>
            <span>Method 1: Native APK via Capacitor (Free)</span>
          </div>
          <p className="text-[11px] text-purple-700/80 leading-relaxed">
            Run these free commands in your terminal to package into a native Android Studio project and generate an APK:
          </p>
          <div className="bg-slate-900 text-emerald-400 p-3 rounded-2xl text-[11px] font-mono leading-relaxed overflow-x-auto space-y-1">
            <div>npm run build</div>
            <div>npm i @capacitor/core @capacitor/cli @capacitor/android</div>
            <div>npx cap init "Aaima ASMR" com.aaima.asmreating --web-dir dist</div>
            <div>npx cap add android</div>
            <div>npx cap copy</div>
            <div>npx cap open android</div>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            ➔ In Android Studio, click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>. Your installable <code>.apk</code> is ready!
          </p>
        </div>

        {/* Method 2: PWABuilder (Zero-Install Online APK Generator) */}
        <div className="bg-white/90 rounded-3xl p-4 shadow-sm border border-blue-200 space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xs">2</span>
            <span>Method 2: PWABuilder by Microsoft (Instant APK)</span>
          </div>
          <p className="text-[11px] text-purple-700/80 leading-relaxed">
            1. Deploy the app to your hosting (or use your Cloud Run dev URL).<br />
            2. Visit <strong>PWABuilder.com</strong> and paste the URL.<br />
            3. Click <strong>Package For Stores &gt; Android &gt; Generate APK</strong>.<br />
            4. Download the signed APK directly to your Android device and tap Install!
          </p>
        </div>

        {/* Verification checklist */}
        <div className="bg-white/90 rounded-3xl p-4 shadow-sm border border-pink-200 space-y-2">
          <div className="flex items-center gap-2 text-pink-700 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Built-in Mobile Quality Features</span>
          </div>
          <ul className="text-[11px] text-purple-800 space-y-1.5 font-medium">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Full offline caching support with local assets</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Zero external audio loading latency (Web Audio synthesis)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Prevented accidental zoom & text selection gestures</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Auto-saving game progress and unlocked items</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
