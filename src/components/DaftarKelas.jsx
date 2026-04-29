import { Clock, Trash2, Pencil } from "lucide-react";

const COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-cyan-600",
  "bg-orange-600",
  "bg-indigo-600",
];

const getCourseColor = (name) => {
  if (!name) return "bg-slate-600";
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
      {/* Label Heading yang lebih low-key agar tidak berisik */}
      <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
        <Clock size={14} /> Registered Units ({jadwal.length})
      </h2>

      <div className="space-y-3 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
        {jadwal.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-white/20 text-[10px] font-black uppercase tracking-widest">
            No data in queue
          </div>
        ) : (
          jadwal.map((item) => {
            const isSesiAngka = typeof item.sesi[0] === "number";
            const colorClass = getCourseColor(item.nama);
            const borderColorClass = colorClass.replace("bg-", "border-");

            return (
              <div
                key={item.id}
                className={`bg-uajy-bg-dark p-4 rounded-xl border border-white/10 border-l-[6px] ${borderColorClass} flex justify-between items-center group transition-none`}
              >
                <div className="min-w-0">
                  <h4 className="text-white font-black text-sm tracking-tight truncate uppercase leading-tight">
                    {item.nama}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    {/* Badge Kelas dengan warna uajy-bg yang lebih kontras */}
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-uajy-bg text-uajy-yellow rounded border border-white/5">
                      KLAS {item.kelas}
                    </span>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">
                      {item.hari} •{" "}
                      {isSesiAngka ? `SESI ${item.sesi[0]}` : item.sesi[0]}
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
