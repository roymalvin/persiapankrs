import { useState, useEffect } from "react";
import Header from "./components/Header";
import FormKelas from "./components/FormKelas";
import DaftarKelas from "./components/DaftarKelas";
import HasilJadwal from "./components/HasilJadwal";

const WAKTU_SESI = {
  1: "07.00 - 09.30",
  2: "10.00 - 12.30",
  3: "13.00 - 15.30",
  4: "16.00 - 18.30",
  5: "19.00 - 21.30",
};

function App() {
  // PENGAMAN 1: Try-catch saat load data awal
  const [jadwal, setJadwal] = useState(() => {
    try {
      const savedJadwal = localStorage.getItem("krsync_data");
      const parsed = savedJadwal ? JSON.parse(savedJadwal) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Data localStorage korup, memulai dari awal.");
      return [];
    }
  });

  const [itemSedangDiedit, setItemSedangDiedit] = useState(null);
  const [tipeKampus, setTipeKampus] = useState(
    () => localStorage.getItem("krsync_tipe") || "UAJY",
  );
  const [hasilKombinasi, setHasilKombinasi] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const [filters, setFilters] = useState({
    hanya3Hari: false,
    hanya4Hari: false,
    tanpaSesi1: false,
    tanpaSesi2: false,
    tanpaSesi3: false,
    tanpaSesi4: false,
    tanpaSesi5: false,
  });

  useEffect(() => {
    localStorage.setItem("krsync_tipe", tipeKampus);
  }, [tipeKampus]);

  useEffect(() => {
    localStorage.setItem("krsync_data", JSON.stringify(jadwal));
  }, [jadwal]);

  const tambahJadwal = (jadwalBaru) => {
    setJadwal([...jadwal, jadwalBaru]);
    setIsGenerated(false);
  };

  const updateJadwal = (dataUpdate) => {
    setJadwal(
      jadwal.map((item) => (item.id === dataUpdate.id ? dataUpdate : item)),
    );
    setItemSedangDiedit(null);
    setIsGenerated(false);
  };

  const tambahJadwalBulk = (arrayJadwalBaru) => {
    setJadwal((prev) => [...prev, ...arrayJadwalBaru]);
    setIsGenerated(false);
  };

  const hapusJadwal = (id) => {
    setJadwal(jadwal.filter((item) => item.id !== id));
    setIsGenerated(false);
  };

  const generateJadwal = () => {
    if (jadwal.length === 0) return alert("Tambahkan jadwal dulu!");

    // PENGAMAN 2: Pastikan data matkul valid sebelum digrouping
    const grouped = jadwal.reduce((acc, curr) => {
      if (!curr.nama) return acc;
      if (!acc[curr.nama]) acc[curr.nama] = [];
      acc[curr.nama].push(curr);
      return acc;
    }, {});

    const groups = Object.values(grouped);

    const combineAndFilter = (groupsArray) => {
      if (groupsArray.length === 0) return [[]];
      const [firstGroup, ...restGroups] = groupsArray;
      const combinationsWithoutFirst = combineAndFilter(restGroups);
      const result = [];

      firstGroup.forEach((kelas) => {
        combinationsWithoutFirst.forEach((combo) => {
          let isClash = false;
          for (let existingKelas of combo) {
            if (existingKelas.hari === kelas.hari) {
              const hasIntersection = kelas.sesi.some((s) =>
                existingKelas.sesi.includes(s),
              );
              if (hasIntersection) {
                isClash = true;
                break;
              }
            }
          }
          if (!isClash) result.push([kelas, ...combo]);
        });
      });
      return result;
    };

    setHasilKombinasi(combineAndFilter(groups));
    setIsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-uajy-bg text-slate-100 font-sans selection:bg-uajy-yellow selection:text-uajy-bg pb-24 lg:pb-8 transition-none">
      <div className="max-w-360 mx-auto p-4 md:p-8">
        <Header
          onGenerate={generateJadwal}
          tipeKampus={tipeKampus}
          setTipeKampus={setTipeKampus}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <section>
              <h2 className="text-[10px] font-black tracking-[0.3em] text-white/30 mb-4 uppercase">
                Configuration
              </h2>
              <FormKelas
                onTambah={tambahJadwal}
                onTambahBulk={tambahJadwalBulk}
                tipeKampus={tipeKampus}
                itemSedangDiedit={itemSedangDiedit}
                onUpdate={updateJadwal}
                onCancelEdit={() => setItemSedangDiedit(null)}
                jadwal={jadwal}
              />
            </section>

            <section>
              <h2 className="text-[10px] font-black tracking-[0.3em] text-white/30 mb-4 uppercase">
                Input Queue ({jadwal.length})
              </h2>
              <DaftarKelas
                jadwal={jadwal}
                onHapus={hapusJadwal}
                onEdit={setItemSedangDiedit}
                waktuSesi={WAKTU_SESI}
              />
            </section>
          </div>

          {/* Output Area */}
          <div className="lg:col-span-9">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-white/30 mb-4 uppercase">
              Simulation Results
            </h2>
            <HasilJadwal
              isGenerated={isGenerated}
              hasilKombinasi={hasilKombinasi}
              waktuSesi={WAKTU_SESI}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Bar Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-uajy-bg-dark/95 backdrop-blur-md border-t border-white/10 z-50">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex flex-col min-w-max">
            <span className="text-[9px] font-black text-uajy-yellow uppercase leading-none mb-1">
              Queue Size
            </span>
            <span className="font-black text-white text-lg leading-none">
              {jadwal.length}
            </span>
          </div>
          <button
            onClick={generateJadwal}
            className="flex-1 bg-uajy-yellow text-uajy-bg font-black py-4 rounded-2xl flex items-center justify-center gap-3 tracking-widest uppercase shadow-xl active:scale-95 transition-none"
          >
            Generate Schedule
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;
