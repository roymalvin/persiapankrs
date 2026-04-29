import { Zap, Globe, GraduationCap } from "lucide-react";

const Header = ({ onGenerate, tipeKampus, setTipeKampus }) => {
  return (
    <header className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/10 pb-12 relative">
      {/* Kiri: Branding */}
      <div className="flex flex-col items-center xl:items-start text-center xl:text-left shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/Logo KRSync.png"
            alt="Logo KRSync"
            className="w-12 h-12 sm:w-15 sm:h-15 object-contain rounded-xl shadow-[0_0_20px_rgba(235,169,24,0.20)]"
          />
          <h1 className="text-4xl font-black text-white tracking-tighter italic leading-none">
            <span className="text-uajy-yellow text-5xl">KR</span>
            <span className="text-5xl">S</span>ync
          </h1>
        </div>
      </div>

      {/* Kanan: Interactive Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto shrink-0">
        <div className="bg-uajy-bg-dark border border-white/10 p-1 rounded-2xl flex w-full md:w-64">
          <button
            onClick={() => setTipeKampus("UAJY")}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase transition-none ${
              tipeKampus === "UAJY"
                ? "bg-uajy-bg text-uajy-yellow shadow-md"
                : "text-white/40 hover:text-white"
            }`}
          >
            <GraduationCap size={14} /> UAJY
          </button>
          <button
            onClick={() => setTipeKampus("Lain")}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase transition-none ${
              tipeKampus === "Lain"
                ? "bg-uajy-bg text-uajy-yellow shadow-md"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Globe size={14} /> UMUM
          </button>
        </div>

        <button
          onClick={onGenerate}
          className="hidden lg:flex bg-uajy-yellow hover:bg-uajy-yellow-hover text-uajy-bg font-black text-xs px-8 py-4 rounded-2xl items-center justify-center gap-3 tracking-[0.15em] uppercase shadow-lg transition-none"
        >
          <Zap size={18} fill="currentColor" /> Generate
        </button>
      </div>

      {/* TENGAH BAWAH: Signature Roy Malvin */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center gap-3 bg-uajy-bg px-4 py-1 pointer-events-none">
        <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.4em] whitespace-nowrap">
          Made by <span className="text-uajy-yellow">Roy Malvin</span>
        </p>
      </div>
    </header>
  );
};

export default Header;
