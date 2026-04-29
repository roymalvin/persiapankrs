import { useState, useEffect } from "react";
import { Plus, ClipboardPaste, Save, X, AlertCircle } from "lucide-react";

const FormKelas = ({
  onTambah,
  onTambahBulk,
  tipeKampus,
  itemSedangDiedit,
  onUpdate,
  onCancelEdit,
  jadwal,
}) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [input, setInput] = useState({
    nama: "",
    dosen: "",
    kelas: "",
    hari: "Senin",
    sesi: 1,
    jamMulai: "07:00",
    jamSelesai: "09:30",
  });
  const [pasteText, setPasteText] = useState("");

  const daftarHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => {
    if (itemSedangDiedit) {
      setActiveTab("manual");
      const dataSesi = itemSedangDiedit.sesi[0];
      if (typeof dataSesi === "string" && dataSesi.includes(" - ")) {
        const [mulai, selesai] = dataSesi.split(" - ");
        setInput({
          ...itemSedangDiedit,
          jamMulai: mulai,
          jamSelesai: selesai,
          sesi: 1,
        });
      } else {
        setInput({ ...itemSedangDiedit, sesi: dataSesi });
      }
    } else {
      setInput({
        nama: "",
        dosen: "",
        kelas: "",
        hari: "Senin",
        sesi: 1,
        jamMulai: "07:00",
        jamSelesai: "09:30",
      });
    }
  }, [itemSedangDiedit]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!input.nama || !input.kelas)
      return alert("Matkul dan Kelas wajib diisi!");

    const payload = {
      id: itemSedangDiedit
        ? itemSedangDiedit.id
        : Date.now().toString() + Math.random().toString(16).slice(2),
      nama: input.nama,
      dosen: input.dosen || "-",
      kelas: input.kelas.toUpperCase(),
      hari: input.hari,
      sesi:
        tipeKampus === "UAJY"
          ? [Number(input.sesi)]
          : [input.jamMulai + " - " + input.jamSelesai],
    };

    itemSedangDiedit ? onUpdate(payload) : onTambah(payload);
    setInput({
      nama: "",
      dosen: "",
      kelas: "",
      hari: "Senin",
      sesi: 1,
      jamMulai: "07:00",
      jamSelesai: "09:30",
    });
  };

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return alert("Teks tidak boleh kosong!");
    const barisTeks = pasteText
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b !== "");
    const jadwalBaruList = [];

    for (let i = 0; i < barisTeks.length; i += 5) {
      if (
        barisTeks[i] &&
        barisTeks[i + 2] &&
        barisTeks[i + 3] &&
        barisTeks[i + 4]
      ) {
        const sesiMatch = barisTeks[i + 4].match(/\d+/);
        jadwalBaruList.push({
          id: Date.now().toString() + Math.random().toString(16).slice(2),
          nama: barisTeks[i],
          dosen: barisTeks[i + 1] || "-",
          kelas: barisTeks[i + 2].toUpperCase(),
          hari:
            daftarHari.find((h) =>
              barisTeks[i + 3].toLowerCase().includes(h.toLowerCase()),
            ) || "Senin",
          sesi: [sesiMatch ? Number(sesiMatch[0]) : 1],
        });
      }
    }

    if (jadwalBaruList.length > 0) {
      onTambahBulk(jadwalBaruList);
      setPasteText("");
    } else {
      alert("Format teks tidak dikenali.");
    }
  };

  return (
    <div
      className={`bg-uajy-bg-dark rounded-2xl border-t-2 ${itemSedangDiedit ? "border-uajy-yellow" : "border-white/10"} p-5 shadow-2xl`}
    >
      {/* Tab Switcher - UAJY Style */}
      {!itemSedangDiedit && (
        <div className="flex bg-uajy-bg/40 rounded-xl p-1 mb-6 border border-white/5">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-none ${activeTab === "manual" ? "bg-uajy-bg text-uajy-yellow" : "text-white/40"}`}
          >
            Manual
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-none ${activeTab === "paste" ? "bg-uajy-bg text-uajy-yellow" : "text-white/40"}`}
          >
            Paste
          </button>
        </div>
      )}

      {activeTab === "manual" ? (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-1 block">
              Mata Kuliah
            </label>
            <input
              type="text"
              className="w-full bg-uajy-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-uajy-yellow outline-none transition-none placeholder:text-white/20"
              value={input.nama}
              onChange={(e) => setInput({ ...input, nama: e.target.value })}
              placeholder="Contoh: Pemrograman Web"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-1 block">
                Kelas
              </label>
              <input
                type="text"
                className="w-full bg-uajy-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white uppercase outline-none focus:border-uajy-yellow transition-none placeholder:text-white/20"
                value={input.kelas}
                onChange={(e) => setInput({ ...input, kelas: e.target.value })}
                placeholder="A"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-1 block">
                Hari
              </label>
              <select
                className="w-full bg-uajy-bg border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-uajy-yellow appearance-none cursor-pointer transition-none"
                value={input.hari}
                onChange={(e) => setInput({ ...input, hari: e.target.value })}
              >
                {daftarHari.map((h) => (
                  <option key={h} value={h} className="bg-uajy-bg-dark">
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {tipeKampus === "UAJY" ? (
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-2 block">
                Sesi
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput({ ...input, sesi: s })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black border transition-none ${input.sesi === s ? "bg-uajy-yellow border-uajy-yellow text-uajy-bg" : "bg-uajy-bg border-white/10 text-white/40"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-1 block">
                Waktu Kuliah
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  className="bg-uajy-bg border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-uajy-yellow transition-none"
                  value={input.jamMulai}
                  onChange={(e) =>
                    setInput({ ...input, jamMulai: e.target.value })
                  }
                />
                <input
                  type="time"
                  className="bg-uajy-bg border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-uajy-yellow transition-none"
                  value={input.jamSelesai}
                  onChange={(e) =>
                    setInput({ ...input, jamSelesai: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-uajy-button hover:bg-uajy-button-hover text-white font-black text-xs py-4 rounded-xl uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-none"
            >
              {itemSedangDiedit ? <Save size={16} /> : <Plus size={16} />}
              {itemSedangDiedit ? "Simpan" : "Tambah"}
            </button>
            {itemSedangDiedit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="bg-uajy-bg text-white px-5 rounded-xl border border-white/10 transition-none"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-2 block">
              Paste Teks SIATMA
            </label>
            <textarea
              className="w-full bg-uajy-bg border border-white/10 rounded-xl px-4 py-4 text-xs text-white outline-none focus:border-uajy-yellow min-h-40 font-mono leading-relaxed transition-none placeholder:text-white/20"
              placeholder="Mata Kuliah&#10;Dosen&#10;Kelas&#10;Hari&#10;Sesi"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
          </div>
          <button
            onClick={handlePasteSubmit}
            className="w-full bg-uajy-button hover:bg-uajy-button-hover text-white font-black text-xs py-4 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 transition-none"
          >
            <ClipboardPaste size={16} /> Konfirmasi
          </button>
        </div>
      )}
    </div>
  );
};

export default FormKelas;
