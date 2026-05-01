import { useRef, useState, useEffect, useMemo } from "react";
import {
  Zap,
  CheckCircle2,
  Download,
  EyeOff,
  AlertTriangle,
  Settings2,
  UserCheck,
  UserMinus,
  X,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

//--- HELPER WARNA MATKUL---
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
  if (!name) return "bg-uajy-bg";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

const KartuJadwal = ({
  kombinasi,
  index,
  waktuSesi,
  daftarHari,
  daftarSesi,
}) => {
  const komponenPDF = useRef(null);
  const handleCetakPDF = useReactToPrint({
    contentRef: komponenPDF,
    documentTitle: `KRSync_Opsi_${index}`,
    pageStyle: `@page { size: landscape; margin: 7mm !important; } @media print { body { -webkit-print-color-adjust: exact; } }`,
  });

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-uajy-bg-dark mb-6 shadow-2xl transition-none">
      <div className="bg-black/20 px-4 py-4 sm:px-6 border-b border-white/10 flex justify-between items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[8px] sm:text-[10px] font-black text-uajy-yellow uppercase tracking-[0.2em] leading-none mb-1">
            Generated Solution
          </span>
          <span className="font-black text-white text-sm sm:text-lg leading-none uppercase italic">
            Opsi #{index}
          </span>
        </div>
        <button
          onClick={handleCetakPDF}
          className="bg-uajy-button hover:bg-uajy-button-hover text-white text-[9px] sm:text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 uppercase tracking-widest transition-none shrink-0 shadow-lg border border-white/10"
        >
          <Download size={14} /> <span>Simpan PDF</span>
        </button>
      </div>

      <div
        ref={komponenPDF}
        className="p-2 sm:p-4 bg-uajy-bg-dark print:bg-white"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-175 sm:min-w-225 border border-white/5 print:border-slate-300">
            <thead>
              <tr className="bg-uajy-bg/50 print:bg-slate-100">
                <th className="p-3 border-r border-white/5 text-center w-16 sm:w-24 text-white/30 font-black uppercase text-[8px] sm:text-[10px] print:border-slate-300 print:text-slate-700">
                  Sesi
                </th>
                {daftarHari.map((hari) => (
                  <th
                    key={hari}
                    className="p-3 border-r border-white/5 text-center text-uajy-yellow font-black uppercase tracking-widest text-[9px] sm:text-[11px] print:border-slate-300 print:text-black"
                  >
                    {hari}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daftarSesi.map((sesi) => (
                <tr
                  key={sesi}
                  className="border-t border-white/5 print:border-slate-300"
                >
                  <td className="p-2 border-r border-white/5 bg-black/10 text-center print:border-slate-300 print:bg-slate-50">
                    <div className="font-black text-white text-xs sm:text-sm print:text-black leading-none">
                      {sesi}
                    </div>
                    <div className="text-[7px] text-white/30 uppercase mt-1 font-bold leading-none">
                      {waktuSesi[sesi]}
                    </div>
                  </td>
                  {daftarHari.map((hari) => {
                    const matkul = kombinasi.find((k) => {
                      const sesiArray = Array.isArray(k.sesi)
                        ? k.sesi
                        : [k.sesi];
                      return (
                        k.hari === hari &&
                        sesiArray.some((s) => String(s) === String(sesi))
                      );
                    });

                    return (
                      <td
                        key={`${hari}-${sesi}`}
                        className="p-1 border-r border-white/5 h-20 sm:h-24 relative align-top print:border-slate-200"
                      >
                        {matkul && (
                          <div
                            className={`${getCourseColor(matkul.namaMatkul)} text-white rounded-lg p-2 h-full flex flex-col justify-between border border-white/10 shadow-lg print:border-black print:bg-white!`}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-black text-[8px] sm:text-[10px] leading-tight uppercase line-clamp-2 print:text-black">
                                {matkul.namaMatkul}
                              </span>
                              {/* Tambahan: Tampilkan nama dosen kecil di bawah nama matkul */}
                              <span className="text-[6px] sm:text-[7px] font-bold text-white/70 uppercase truncate print:text-slate-600">
                                {matkul.dosen !== "-" ? matkul.dosen : ""}
                              </span>
                            </div>
                            <div className="mt-auto">
                              <span className="bg-black/20 text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded border border-white/10 uppercase print:text-black print:border-black">
                                KLS {matkul.kelas}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const HasilJadwal = ({
  isGenerated,
  hasilKombinasi,
  waktuSesi,
  filters,
  setFilters,
}) => {
  const daftarHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const daftarSesi = [1, 2, 3, 4, 5];
  const topContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Nilai default filter yang aman
  const activeFilters = useMemo(
    () => ({
      hanya3Hari: false,
      hanya4Hari: false,
      tanpaSesi1: false,
      tanpaSesi2: false,
      tanpaSesi3: false,
      tanpaSesi4: false,
      tanpaSesi5: false,
      dosenDisukai: [],
      dosenDihindari: [],
      ...filters,
    }),
    [filters],
  );

  // Ekstrak semua nama dosen unik dari input (mengabaikan "-" atau dosen kosong)
  const daftarDosenUnik = useMemo(() => {
    if (!hasilKombinasi || hasilKombinasi.length === 0) return [];
    const allDosen = new Set();
    hasilKombinasi.forEach((jadwal) => {
      jadwal.forEach((kelas) => {
        if (kelas.dosen && kelas.dosen !== "-" && kelas.dosen.trim() !== "") {
          allDosen.add(kelas.dosen);
        }
      });
    });
    return Array.from(allDosen).sort();
  }, [hasilKombinasi]);

  const hasilTerfilter = useMemo(() => {
    return hasilKombinasi.filter((kombinasi) => {
      const hariKuliahUnik = new Set(kombinasi.map((k) => k.hari)).size;
      const daftarDosenJadwalIni = kombinasi.map((k) => k.dosen);

      // Filter Sesi
      for (let i = 1; i <= 5; i++) {
        if (
          activeFilters[`tanpaSesi${i}`] &&
          kombinasi.some((k) => {
            const sesiArray = Array.isArray(k.sesi) ? k.sesi : [k.sesi];
            return sesiArray.some((s) => String(s) === String(i));
          })
        )
          return false;
      }

      // Filter Hari
      if (activeFilters.hanya3Hari && hariKuliahUnik !== 3) return false;
      if (activeFilters.hanya4Hari && hariKuliahUnik !== 4) return false;

      // Filter Dosen Dihindari (Jika ada dosen ini, langsung buang jadwalnya)
      if (activeFilters.dosenDihindari.length > 0) {
        const adaDosenDihindari = activeFilters.dosenDihindari.some(
          (dosenJelek) => daftarDosenJadwalIni.includes(dosenJelek),
        );
        if (adaDosenDihindari) return false;
      }

      // Filter Dosen Favorit (Semua dosen favorit di array WAJIB ada di jadwal ini)
      if (activeFilters.dosenDisukai.length > 0) {
        const semuaDosenFavoritAda = activeFilters.dosenDisukai.every(
          (dosenBagus) => daftarDosenJadwalIni.includes(dosenBagus),
        );
        if (!semuaDosenFavoritAda) return false;
      }

      return true;
    });
  }, [hasilKombinasi, activeFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, hasilKombinasi]);

  const totalPages = Math.ceil(hasilTerfilter.length / ITEMS_PER_PAGE);
  const paginatedData = hasilTerfilter.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const scrollToTop = () => {
    if (topContainerRef.current) {
      topContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    scrollToTop();
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    scrollToTop();
  };

  // Fungsi helper untuk menambah/menghapus dosen dari filter array
  const toggleDosenFilter = (tipe, namaDosen) => {
    const currentList = activeFilters[tipe] || [];
    const newList = currentList.includes(namaDosen)
      ? currentList.filter((d) => d !== namaDosen)
      : [...currentList, namaDosen];

    setFilters({ ...activeFilters, [tipe]: newList });
  };

  return (
    <div
      ref={topContainerRef}
      className="bg-uajy-bg-dark p-4 sm:p-8 rounded-3xl border border-white/10 shadow-2xl min-h-125 scroll-mt-6"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-uajy-yellow text-uajy-bg rounded-xl shrink-0 shadow-lg">
            <Settings2 size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
            Simulation Control
          </h2>
        </div>

        {isGenerated && hasilKombinasi.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-uajy-bg p-4 sm:p-6 rounded-2xl border border-white/5">
            {/* Bagian Hari & Sesi (Tetap Sama) */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                Day Density
              </p>
              <div className="flex gap-2">
                {[3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() =>
                      setFilters({
                        ...activeFilters,
                        [`hanya${n}Hari`]: !activeFilters[`hanya${n}Hari`],
                        [`hanya${n === 3 ? 4 : 3}Hari`]: false,
                      })
                    }
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-none border ${activeFilters[`hanya${n}Hari`] ? "bg-uajy-yellow text-uajy-bg border-uajy-yellow shadow-lg shadow-uajy-yellow/20" : "bg-uajy-bg-dark text-white/30 border-white/5 hover:text-white"}`}
                  >
                    {n} HARI
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                Block Sessions
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setFilters({
                        ...activeFilters,
                        [`tanpaSesi${s}`]: !activeFilters[`tanpaSesi${s}`],
                      })
                    }
                    className={`flex-1 aspect-square rounded-xl text-xs font-black transition-none border ${activeFilters[`tanpaSesi${s}`] ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20" : "bg-uajy-bg-dark text-white/30 border-white/5 hover:text-white"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* BARU: Filter Dosen */}
            {daftarDosenUnik.length > 0 && (
              <div className="col-span-1 lg:col-span-2 mt-2 pt-4 border-t border-white/10 space-y-4">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                  Dosen Preference
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Kolom Dosen Favorit */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase">
                      <UserCheck size={12} /> Wajib Ada
                    </div>
                    <select
                      className="w-full bg-uajy-bg-dark border border-white/10 rounded-xl p-2 text-xs text-white outline-none focus:border-emerald-500"
                      onChange={(e) => {
                        if (e.target.value)
                          toggleDosenFilter("dosenDisukai", e.target.value);
                        e.target.value = ""; // Reset select
                      }}
                    >
                      <option value="">+ Tambah Dosen Favorit</option>
                      {daftarDosenUnik.map((dosen) => (
                        <option
                          key={`fav-${dosen}`}
                          value={dosen}
                          disabled={
                            activeFilters.dosenDisukai.includes(dosen) ||
                            activeFilters.dosenDihindari.includes(dosen)
                          }
                        >
                          {dosen}
                        </option>
                      ))}
                    </select>

                    {/* Badges Dosen Favorit */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeFilters.dosenDisukai.map((dosen) => (
                        <span
                          key={dosen}
                          className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[9px] px-2 py-1 rounded-md font-bold uppercase"
                        >
                          {dosen}{" "}
                          <X
                            size={10}
                            className="cursor-pointer hover:text-white"
                            onClick={() =>
                              toggleDosenFilter("dosenDisukai", dosen)
                            }
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Kolom Dosen Blacklist */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 uppercase">
                      <UserMinus size={12} /> Hindari
                    </div>
                    <select
                      className="w-full bg-uajy-bg-dark border border-white/10 rounded-xl p-2 text-xs text-white outline-none focus:border-rose-500"
                      onChange={(e) => {
                        if (e.target.value)
                          toggleDosenFilter("dosenDihindari", e.target.value);
                        e.target.value = ""; // Reset select
                      }}
                    >
                      <option value="">+ Tambah Dosen Dihindari</option>
                      {daftarDosenUnik.map((dosen) => (
                        <option
                          key={`bad-${dosen}`}
                          value={dosen}
                          disabled={
                            activeFilters.dosenDihindari.includes(dosen) ||
                            activeFilters.dosenDisukai.includes(dosen)
                          }
                        >
                          {dosen}
                        </option>
                      ))}
                    </select>

                    {/* Badges Dosen Dihindari */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeFilters.dosenDihindari.map((dosen) => (
                        <span
                          key={dosen}
                          className="inline-flex items-center gap-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[9px] px-2 py-1 rounded-md font-bold uppercase"
                        >
                          {dosen}{" "}
                          <X
                            size={10}
                            className="cursor-pointer hover:text-white"
                            onClick={() =>
                              toggleDosenFilter("dosenDihindari", dosen)
                            }
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!isGenerated ? (
        <div className="h-80 flex flex-col items-center justify-center text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">
          <Zap size={60} className="mb-6 opacity-5" strokeWidth={3} />
          Waiting for instruction...
        </div>
      ) : hasilKombinasi.length === 0 ? (
        <div className="bg-red-900/20 border border-red-500/20 p-12 rounded-3xl text-center">
          <AlertTriangle
            size={48}
            className="mx-auto text-red-500 mb-4 opacity-50"
          />
          <h3 className="font-black text-white text-lg uppercase tracking-widest">
            Logic Conflict
          </h3>
          <p className="text-red-400/60 text-[10px] font-bold uppercase mt-2 tracking-widest">
            No valid combinations found
          </p>
        </div>
      ) : hasilTerfilter.length === 0 ? (
        <div className="text-center py-24 bg-black/10 rounded-3xl border border-dashed border-white/10 p-6">
          <EyeOff size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Filters are too restrictive
          </p>
          <button
            onClick={() =>
              setFilters({
                hanya3Hari: false,
                hanya4Hari: false,
                tanpaSesi1: false,
                tanpaSesi2: false,
                tanpaSesi3: false,
                tanpaSesi4: false,
                tanpaSesi5: false,
                dosenDisukai: [],
                dosenDihindari: [], // Reset filter dosen juga
              })
            }
            className="w-full sm:w-auto px-8 py-3 bg-uajy-bg text-uajy-yellow text-[10px] font-black uppercase tracking-widest rounded-xl border border-uajy-yellow/20 shadow-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-uajy-yellow/10 border border-uajy-yellow/20 px-6 py-4 rounded-2xl">
            <CheckCircle2 size={20} className="text-uajy-yellow" />
            <p className="text-[10px] font-black text-uajy-yellow uppercase tracking-[0.2em]">
              Found{" "}
              <span className="text-white text-base px-1">
                {hasilTerfilter.length}
              </span>{" "}
              Optimal Schedule Configurations
            </p>
          </div>

          <div className="space-y-10">
            {paginatedData.map((kombinasi, idx) => {
              const absoluteIndex =
                (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
              return (
                <KartuJadwal
                  key={absoluteIndex}
                  kombinasi={kombinasi}
                  index={absoluteIndex}
                  waktuSesi={waktuSesi}
                  daftarHari={daftarHari}
                  daftarSesi={daftarSesi}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-10 border-t border-white/10 pt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-none disabled:opacity-30 disabled:cursor-not-allowed bg-uajy-bg border border-white/10 text-white hover:border-uajy-yellow hover:text-uajy-yellow"
              >
                Previous
              </button>
              <div className="text-white/50 text-[10px] font-black uppercase tracking-widest hidden sm:block">
                Page{" "}
                <span className="text-uajy-yellow text-sm">{currentPage}</span>{" "}
                of {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-none disabled:opacity-30 disabled:cursor-not-allowed bg-uajy-bg border border-white/10 text-white hover:border-uajy-yellow hover:text-uajy-yellow"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HasilJadwal;
