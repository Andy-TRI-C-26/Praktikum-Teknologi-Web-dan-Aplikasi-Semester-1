/**
 * script.js - Interaktivitas halaman profil
 *
 * Daftar fitur:
 *  1. Jam digital di header
 *  2. Menu hamburger (ponsel)
 *  3. Filter proyek berdasarkan kategori
 *  4. Kuis mini 3 soal
 *  5. Kalkulator IPK
 *  6. Penghitung pengunjung (sesi)
 */


/* ==========================================================
 * 1. JAM DIGITAL
 * ========================================================== */

const elemenJam = document.getElementById("jam");

/**
 * Menampilkan waktu saat ini dengan format JJ:MM:DD.
 * padStart memastikan angka selalu dua digit (mis. 07 bukan 7).
 */
function perbaruiJam() {
  const sekarang = new Date();
  const jam = String(sekarang.getHours()).padStart(2, "0");
  const menit = String(sekarang.getMinutes()).padStart(2, "0");
  const detik = String(sekarang.getSeconds()).padStart(2, "0");
  elemenJam.textContent = `${jam}:${menit}:${detik}`;
}

perbaruiJam();                  // tampil langsung tanpa menunggu 1 detik
setInterval(perbaruiJam, 1000); // lalu perbarui setiap 1000 ms


/* ==========================================================
 * 2. MENU HAMBURGER
 * ========================================================== */

const tombolMenu = document.getElementById("menu-toggle");
const menuUtama = document.getElementById("menu-utama");

/**
 * Menambah/menghapus class "open" pada menu dan tombol.
 * Tampilan menu diatur CSS (media query max-width: 768px).
 * @param {boolean} [buka] - paksa buka (true) atau tutup (false);
 *                           jika dikosongkan, status dibalik (toggle).
 */
function aturMenu(buka) {
  const terbuka = menuUtama.classList.toggle("open", buka);
  tombolMenu.classList.toggle("open", terbuka);
  tombolMenu.setAttribute("aria-expanded", terbuka);
  tombolMenu.setAttribute("aria-label", terbuka ? "Tutup menu" : "Buka menu");
}

tombolMenu.addEventListener("click", () => aturMenu());

// Menu otomatis menutup setelah salah satu tautan diklik
menuUtama.querySelectorAll("a").forEach((tautan) => {
  tautan.addEventListener("click", () => aturMenu(false));
});


/* ==========================================================
 * 3. FILTER PROYEK
 * ========================================================== */

const tombolFilter = document.querySelectorAll(".filter-btn");
const kartuProyek = document.querySelectorAll(".proyek-card");

/**
 * Setiap tombol membawa kategori di atribut data-filter,
 * setiap kartu di atribut data-kategori (dibaca lewat dataset).
 * Kartu yang kategorinya tidak cocok disembunyikan (atribut hidden).
 */
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", () => {
    const kategori = tombol.dataset.filter;

    tombolFilter.forEach((t) => {
      const aktif = t === tombol;
      t.classList.toggle("aktif", aktif);
      t.setAttribute("aria-pressed", aktif);
    });

    kartuProyek.forEach((kartu) => {
      kartu.hidden = kategori !== "semua" && kartu.dataset.kategori !== kategori;
    });
  });
});


/* ==========================================================
 * 4. KUIS MINI
 * ========================================================== */

/** Bank soal. `benar` adalah indeks (mulai 0) dari jawaban yang tepat. */
const daftarSoal = [
  {
    tanya: "Tag HTML yang digunakan untuk membuat tautan adalah...",
    opsi: ["<link>", "<a>", "<href>"],
    benar: 1,
  },
  {
    tanya: "Properti CSS untuk mengubah warna teks adalah...",
    opsi: ["font-color", "text-style", "color"],
    benar: 2,
  },
  {
    tanya: "Fungsi JavaScript untuk mengambil elemen berdasarkan id adalah...",
    opsi: [
      "document.getElementById()",
      "document.createElement()",
      "document.write()",
    ],
    benar: 0,
  },
];

const elProgres = document.getElementById("kuis-progres");
const elSoal = document.getElementById("kuis-soal");
const elOpsi = document.getElementById("kuis-opsi");
const elUmpanBalik = document.getElementById("kuis-umpanbalik");
const tombolLanjut = document.getElementById("kuis-lanjut");

let nomorSoal = 0;        // indeks soal yang sedang tampil
let skor = 0;             // jumlah jawaban benar
let sudahMenjawab = false; // mencegah menjawab dua kali pada satu soal
let kuisSelesai = false;   // true saat layar hasil tampil

/** Menampilkan soal ke-`nomorSoal` beserta tombol pilihannya. */
function tampilkanSoal() {
  const soal = daftarSoal[nomorSoal];
  sudahMenjawab = false;

  elProgres.textContent = `Soal ${nomorSoal + 1} dari ${daftarSoal.length}`;
  elSoal.textContent = soal.tanya;
  elUmpanBalik.textContent = "";
  elOpsi.replaceChildren();
  tombolLanjut.hidden = true;

  soal.opsi.forEach((teks, indeks) => {
    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "opsi-btn";
    tombol.textContent = teks;
    tombol.addEventListener("click", () => periksaJawaban(indeks));
    elOpsi.appendChild(tombol);
  });
}

/**
 * Memeriksa jawaban: menambah skor bila benar, menandai pilihan
 * (hijau/merah), lalu mengunci semua tombol pilihan.
 * @param {number} pilihan - indeks opsi yang diklik pengguna
 */
function periksaJawaban(pilihan) {
  if (sudahMenjawab) return;
  sudahMenjawab = true;

  const soal = daftarSoal[nomorSoal];
  const semuaTombol = elOpsi.querySelectorAll(".opsi-btn");

  if (pilihan === soal.benar) {
    skor++;
    elUmpanBalik.textContent = "Benar!";
  } else {
    semuaTombol[pilihan].classList.add("salah");
    elUmpanBalik.textContent = "Kurang tepat. Jawaban benar ditandai hijau.";
  }

  semuaTombol[soal.benar].classList.add("benar");
  semuaTombol.forEach((t) => (t.disabled = true));

  const terakhir = nomorSoal === daftarSoal.length - 1;
  tombolLanjut.textContent = terakhir ? "Lihat Hasil" : "Lanjut";
  tombolLanjut.hidden = false;
}

/** Menampilkan skor akhir dengan komentar sesuai perolehan skor. */
function tampilkanHasil() {
  kuisSelesai = true;

  let komentar;
  if (skor === daftarSoal.length) {
    komentar = "Sempurna!";
  } else if (skor >= 2) {
    komentar = "Bagus, sedikit lagi sempurna.";
  } else {
    komentar = "Ayo coba lagi!";
  }

  elProgres.textContent = "Kuis selesai";
  elSoal.textContent = `Skor kamu: ${skor} dari ${daftarSoal.length}`;
  elOpsi.replaceChildren();
  elUmpanBalik.textContent = komentar;
  tombolLanjut.textContent = "Ulangi Kuis";
}

/** Tombol bawah kuis: lanjut ke soal berikutnya, hasil, atau mengulang. */
tombolLanjut.addEventListener("click", () => {
  if (kuisSelesai) {
    // Reset semua variabel status untuk memulai ulang
    nomorSoal = 0;
    skor = 0;
    kuisSelesai = false;
    tampilkanSoal();
  } else if (nomorSoal < daftarSoal.length - 1) {
    nomorSoal++;
    tampilkanSoal();
  } else {
    tampilkanHasil();
  }
});

tampilkanSoal();


/* ==========================================================
 * 5. KALKULATOR IPK
 * ========================================================== */

const daftarBaris = document.getElementById("ipk-daftar");
const elHasilIPK = document.getElementById("ipk-hasil");

/** Menambah satu baris input (SKS + nilai mutu) beserta tombol hapus. */
function tambahBaris() {
  const baris = document.createElement("div");
  baris.className = "ipk-baris";

  baris.innerHTML = `
    <input type="number" class="ipk-sks" min="1" max="10" step="1"
           placeholder="mis. 3" aria-label="Jumlah SKS">
    <input type="number" class="ipk-nilai" min="0" max="4" step="0.01"
           placeholder="mis. 3.5" aria-label="Nilai mutu (0-4)">
    <button type="button" class="hapus-baris" aria-label="Hapus baris">&times;</button>
  `;

  baris.querySelector(".hapus-baris").addEventListener("click", () => baris.remove());
  daftarBaris.appendChild(baris);
}

/**
 * IPK = jumlah(SKS x nilai) / jumlah(SKS).
 * Baris yang kosong seluruhnya diabaikan; baris yang terisi sebagian
 * atau di luar rentang (SKS <= 0, nilai di luar 0-4) menghentikan
 * perhitungan dan menampilkan pesan kesalahan.
 */
function hitungIPK() {
  let totalBobot = 0;
  let totalSks = 0;
  let nomor = 0;

  for (const baris of daftarBaris.children) {
    nomor++;
    const teksSks = baris.querySelector(".ipk-sks").value.trim();
    const teksNilai = baris.querySelector(".ipk-nilai").value.trim();

    if (teksSks === "" && teksNilai === "") continue;

    // Number("") bernilai 0, sehingga kekosongan dicek lebih dulu
    const sks = Number(teksSks);
    const nilai = Number(teksNilai);

    if (teksSks === "" || teksNilai === "" || isNaN(sks) || isNaN(nilai) ||
        sks <= 0 || nilai < 0 || nilai > 4) {
      tampilkanHasilIPK(`Baris ${nomor} tidak valid (SKS > 0, nilai 0-4).`, true);
      return;
    }

    totalBobot += sks * nilai;
    totalSks += sks;
  }

  if (totalSks === 0) {
    tampilkanHasilIPK("Isi minimal satu mata kuliah.", true);
    return;
  }

  const ipk = totalBobot / totalSks;
  tampilkanHasilIPK(`IPK: ${ipk.toFixed(2)} (${totalSks} SKS)`, false);
}

/** Menulis hasil/pesan ke halaman; `galat` mengaktifkan warna merah. */
function tampilkanHasilIPK(pesan, galat) {
  elHasilIPK.textContent = pesan;
  elHasilIPK.classList.toggle("error", galat);
}

document.getElementById("ipk-tambah").addEventListener("click", tambahBaris);
document.getElementById("ipk-hitung").addEventListener("click", hitungIPK);

// Tiga baris awal
for (let i = 0; i < 3; i++) tambahBaris();


/* ==========================================================
 * 6. PENGHITUNG PENGUNJUNG (SESI)
 * ========================================================== */

/**
 * Menambah hitungan setiap halaman dimuat dan menampilkannya di footer.
 * Disimpan di sessionStorage: bertahan saat halaman di-refresh, tetapi
 * reset ketika tab/browser ditutup. Ini hitungan lokal per sesi browser,
 * bukan jumlah pengunjung sebenarnya (itu membutuhkan server).
 */
function hitungPengunjung() {
  let jumlah = 1;
  try {
    jumlah = Number(sessionStorage.getItem("jumlahKunjungan")) + 1;
    sessionStorage.setItem("jumlahKunjungan", jumlah);
  } catch (e) {
    // sessionStorage bisa diblokir (mode privat); tetap tampilkan 1
  }
  document.getElementById("jumlah-pengunjung").textContent = jumlah;
}

hitungPengunjung();
