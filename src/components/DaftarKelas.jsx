import { Clock, Trash2, Pencil, User } from "lucide-react";

const COLORS = [
  "border-blue-600",
  "border-emerald-600",
  "border-violet-600",
  "border-rose-600",
  "border-amber-600",
  "border-cyan-600",
  "border-orange-600",
  "border-indigo-600",
];

const getCourseBorderColor = (name) => {
  if (!name) return "border-slate-600";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

const DaftarKelas = ({ jadwal, onHapus, onEdit, waktuSesi }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
        {jadwal.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-white/20 text-[10px] font-black uppercase tracking-widest">
            No data in queue
          </div>
        ) : (
          jadwal.map((item) => {
            const borderColorClass = getCourseBorderColor(item.nama);

            const sesiArray = Array.isArray(item.sesi)
              ? item.sesi
              : [item.sesi];
            const textSesi = sesiArray.join(", ");
            const isSesiAngka = !isNaN(parseInt(sesiArray[0]));

            return (
              <div
                key={item.id}
                className={`bg-uajy-bg-dark p-4 rounded-xl border border-white/10 border-l-[6px] ${borderColorClass} flex justify-between items-center group transition-none`}
              >
                <div className="min-w-0">
                  <h4 className="text-white font-black text-sm tracking-tight truncate leading-tight">
                    {item.nama}
                  </h4>

                  {item.dosen && item.dosen !== "-" && (
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/50 truncate mt-1">
                      <User size={10} />
                      {item.dosen}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-uajy-bg text-uajy-yellow rounded border border-white/5">
                      Kelas {item.kelas}
                    </span>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">
                      {item.hari} •{" "}
                      {isSesiAngka ? `SESI ${textSesi}` : textSesi}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 ml-4 shrink-0">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-white/20 hover:text-uajy-yellow transition-none"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onHapus(item.id)}
                    className="p-2 text-white/20 hover:text-red-500 transition-none"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DaftarKelas;
