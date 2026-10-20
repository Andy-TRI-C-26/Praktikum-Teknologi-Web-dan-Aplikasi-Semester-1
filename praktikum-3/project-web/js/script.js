/*==================================================== =
FITUR 1: Dark Mode (toggle class pada < body >)
===================================================== */
const tombolTema = document.querySelector("#tombol-tema");
tombolTema.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    tombolTema.innerText = "Mode Terang";
  } else {
    tombolTema.innerText = "Mode Gelap";
  }
});
/*==================================================== =
FITUR 2: Salam otomatis berdasarkan jam
===================================================== */
function buatSalam(jam) {
  if (jam < 11) {
    return "Selamat pagi";
  } else if (jam < 15) {
    return "Selamat siang";
  } else if (jam < 18) {
    return "Selamat sore";
  } else {
    return "Selamat malam";
  }
}
const sekarang = new Date();
const jamSekarang = sekarang.getHours();
document.getElementById("salam").innerText =
  buatSalam(jamSekarang) + "! Senang Anda berkunjung.";
/*==================================================== =
FITUR 3: Validasi form kontak
===================================================== */
const formKontak = document.getElementById("form-kontak");
const inputNama = document.getElementById("nama");
const inputPesan = document.getElementById("pesan");
const penghitungPanjangPesan = document.getElementById("penghitung");
const errorNama = document.getElementById("error-nama");
const errorPesan = document.getElementById("error-pesan");
const statusForm = document.getElementById("status-form");

function tampilkanError(input, tempatPesan, teks) {
  input.classList.add("is-invalid");
  tempatPesan.innerText = teks;
}

function hapusError(input, tempatPesan) {
  input.classList.remove("is-invalid");
  tempatPesan.innerText = "";
}
formKontak.addEventListener("submit", function (event) {
  event.preventDefault();
  if (confirm("Kirim pesan sekarang?")) {
    let valid = true;
    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();
    // Cek nama
    if (nama === "") {
      tampilkanError(inputNama, errorNama, "Nama tidak boleh kosong.");
      valid = false;
    } else {
      hapusError(inputNama, errorNama);
    }
    // Cek pesan
    if (pesan === "") {
      tampilkanError(inputPesan, errorPesan, "Pesan tidak boleh kosong.");
      valid = false;
    } else if (pesan.length < 10) {
      tampilkanError(inputPesan, errorPesan, "Pesan minimal 10 karakter. Saat ini baru " + pesan.length + ".");
      valid = false;
    } else {
      hapusError(inputPesan, errorPesan);
    }
    // Hasil akhir
    if (valid === true) {
      statusForm.innerText = "Terima kasih, " + nama + "! Pesan Anda lolos pemeriksaan.";
      statusForm.className = "status-form sukses";
      formKontak.reset();
    } else {
      statusForm.innerText = "Mohon perbaiki isian yang bertanda merah.";
      statusForm.className = "status-form gagal";
    }
  }
});
// Pesan error hilang otomatis saat pengguna mulai mengetik
inputNama.addEventListener("input", function () {
  hapusError(inputNama, errorNama);
});
inputPesan.addEventListener("input", function () {
  penghitungPanjangPesan.innerText = "Jumlah Karakter: " + inputPesan.value.length;
  hapusError(inputPesan, errorPesan);
});
/*==================================================== =
FITUR 4: Tombol Back-to-Top (event scroll)
===================================================== */
const tombolAtas = document.getElementById("btn-top");
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    tombolAtas.classList.add("show-btn");
  } else {
    tombolAtas.classList.remove("show-btn");
  }
});
tombolAtas.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const semuaKartu = document.querySelectorAll(".kartu");
semuaKartu.forEach(function (kartu) {
  kartu.addEventListener("click", function () {
    kartu.classList.toggle("terbuka");
  });
});

/*==================================================== =
FITUR 5: Filter keahlian
===================================================== */

const filtBtn = document.querySelectorAll(".btn-filter");

filtBtn.forEach(el => {
  el.addEventListener("click", () => {
    const dataFilter = el.dataset.filter
    semuaKartu.forEach(kartu => {
      if (dataFilter === 'semua' || kartu.dataset.tingkat === dataFilter) {
        kartu.classList.remove('sembunyi');
      } else {
        kartu.classList.add('sembunyi');
      }
    });
  })
})
