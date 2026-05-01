// src/utils/scheduler.js

export const cekBentrok = (jadwalSementara, kelasBaru) => {
  return jadwalSementara.some((kelasYangSudahAda) => {
    // 1. Kalau harinya beda, otomatis aman (return false)
    if (kelasYangSudahAda.hari !== kelasBaru.hari) return false;

    // 2. Kalau harinya sama, kita cek sesinya.
    // Kita ubah jadi array dulu untuk jaga-jaga kalau format datanya bukan array
    const sesiSudahAda = Array.isArray(kelasYangSudahAda.sesi)
      ? kelasYangSudahAda.sesi
      : [kelasYangSudahAda.sesi];

    const sesiBaru = Array.isArray(kelasBaru.sesi)
      ? kelasBaru.sesi
      : [kelasBaru.sesi];

    // 3. Cek apakah ada irisan (intersection) sesi yang tabrakan
    return sesiBaru.some((s) => sesiSudahAda.includes(s));
  });
};

export const generateJadwalAman = (semuaMatkul) => {
  const hasilKombinasi = [];
  const MAKSIMAL_HASIL = Infinity;

  // Jika input kosong, kembalikan array kosong
  if (!semuaMatkul || semuaMatkul.length === 0) return [];

  const backtrack = (indexMatkul, jadwalSementara) => {
    if (hasilKombinasi.length >= MAKSIMAL_HASIL) return;

    if (indexMatkul === semuaMatkul.length) {
      hasilKombinasi.push([...jadwalSementara]);
      return;
    }

    const matkulSekarang = semuaMatkul[indexMatkul];

    // Pastikan daftarKelas ada untuk di-loop
    if (matkulSekarang.daftarKelas && matkulSekarang.daftarKelas.length > 0) {
      for (const kelas of matkulSekarang.daftarKelas) {
        if (!cekBentrok(jadwalSementara, kelas)) {
          // Tambahkan informasi nama matkul ke dalam objek kelas agar tidak hilang saat dirender
          const kelasDenganInfoMatkul = {
            ...kelas,
            namaMatkul: matkulSekarang.nama,
          };

          jadwalSementara.push(kelasDenganInfoMatkul);
          backtrack(indexMatkul + 1, jadwalSementara);
          jadwalSementara.pop();
        }
      }
    } else {
      // Jika matkul ini tidak punya kelas, skip ke matkul berikutnya
      backtrack(indexMatkul + 1, jadwalSementara);
    }
  };

  backtrack(0, []);
  return hasilKombinasi;
};
