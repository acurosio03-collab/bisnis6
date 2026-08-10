function showReceipt(id){
  var el = document.getElementById(id);
  if(el){ el.classList.add('show'); el.scrollIntoView({behavior:'smooth', block:'nearest'}); }
}

/* ---- BMI ---- */
function hitungBMI(){
  var berat = parseFloat(document.getElementById('bmi-berat').value);
  var tinggiCm = parseFloat(document.getElementById('bmi-tinggi').value);
  if(!berat || !tinggiCm || berat <= 0 || tinggiCm <= 0){
    alert('Isi berat badan (kg) dan tinggi badan (cm) dengan angka yang valid.');
    return;
  }
  var tinggiM = tinggiCm / 100;
  var bmi = berat / (tinggiM * tinggiM);
  var kategori = '';
  if(bmi < 18.5) kategori = 'Berat badan kurang';
  else if(bmi < 25) kategori = 'Berat badan normal';
  else if(bmi < 30) kategori = 'Berat badan berlebih';
  else kategori = 'Obesitas';

  document.getElementById('bmi-hasil-nilai').textContent = bmi.toFixed(1);
  document.getElementById('bmi-hasil-kategori').textContent = kategori;
  showReceipt('bmi-receipt');
}

/* ---- Konversi Satuan ---- */
var konversiData = {
  panjang: { satuan: ['mm','cm','m','km','inci','kaki','mil'], ke_meter: {mm:0.001, cm:0.01, m:1, km:1000, inci:0.0254, kaki:0.3048, mil:1609.34} },
  berat: { satuan: ['mg','g','kg','ton','ons','lb'], ke_gram: {mg:0.001, g:1, kg:1000, ton:1000000, ons:100, lb:453.592} },
  suhu: { satuan: ['celsius','fahrenheit','kelvin'] }
};

function isiSatuanKonversi(){
  var jenis = document.getElementById('konv-jenis').value;
  var dariEl = document.getElementById('konv-dari');
  var keEl = document.getElementById('konv-ke');
  dariEl.innerHTML = ''; keEl.innerHTML = '';
  var daftar = konversiData[jenis].satuan;
  daftar.forEach(function(s){
    var o1 = document.createElement('option'); o1.value = s; o1.textContent = s;
    var o2 = document.createElement('option'); o2.value = s; o2.textContent = s;
    dariEl.appendChild(o1); keEl.appendChild(o2);
  });
  if(daftar.length > 1){ keEl.selectedIndex = 1; }
}

function suhuKe(c, target){
  if(target === 'celsius') return c;
  if(target === 'fahrenheit') return c * 9/5 + 32;
  if(target === 'kelvin') return c + 273.15;
}
function suhuKeCelsius(nilai, dari){
  if(dari === 'celsius') return nilai;
  if(dari === 'fahrenheit') return (nilai - 32) * 5/9;
  if(dari === 'kelvin') return nilai - 273.15;
}

function hitungKonversi(){
  var jenis = document.getElementById('konv-jenis').value;
  var nilai = parseFloat(document.getElementById('konv-nilai').value);
  var dari = document.getElementById('konv-dari').value;
  var ke = document.getElementById('konv-ke').value;
  if(isNaN(nilai)){ alert('Isi nilai yang mau dikonversi.'); return; }

  var hasil;
  if(jenis === 'suhu'){
    var c = suhuKeCelsius(nilai, dari);
    hasil = suhuKe(c, ke);
  } else {
    var tabel = jenis === 'panjang' ? konversiData.panjang.ke_meter : konversiData.berat.ke_gram;
    var dasar = nilai * tabel[dari];
    hasil = dasar / tabel[ke];
  }

  document.getElementById('konv-hasil-nilai').textContent = hasil.toLocaleString('id-ID', {maximumFractionDigits:4}) + ' ' + ke;
  document.getElementById('konv-hasil-asal').textContent = nilai.toLocaleString('id-ID') + ' ' + dari;
  showReceipt('konv-receipt');
}

/* ---- Bunga & Cicilan ---- */
function hitungCicilan(){
  var pokok = parseFloat(document.getElementById('bunga-pokok').value);
  var bungaTahun = parseFloat(document.getElementById('bunga-persen').value);
  var lama = parseFloat(document.getElementById('bunga-lama').value);

  if(!pokok || pokok <= 0 || isNaN(bungaTahun) || !lama || lama <= 0){
    alert('Isi jumlah pinjaman, suku bunga per tahun (%), dan lama cicilan (bulan) dengan benar.');
    return;
  }

  var bungaBulan = bungaTahun / 100 / 12;
  var cicilanBulanan;
  if(bungaBulan === 0){
    cicilanBulanan = pokok / lama;
  } else {
    cicilanBulanan = pokok * bungaBulan / (1 - Math.pow(1 + bungaBulan, -lama));
  }
  var totalBayar = cicilanBulanan * lama;
  var totalBunga = totalBayar - pokok;

  document.getElementById('bunga-hasil-cicilan').textContent = 'Rp ' + Math.round(cicilanBulanan).toLocaleString('id-ID');
  document.getElementById('bunga-hasil-total').textContent = 'Rp ' + Math.round(totalBayar).toLocaleString('id-ID');
  document.getElementById('bunga-hasil-bunga').textContent = 'Rp ' + Math.round(totalBunga).toLocaleString('id-ID');
  showReceipt('bunga-receipt');
}

/* ---- Zakat ---- */
function hitungZakat(){
  var harta = parseFloat(document.getElementById('zakat-harta').value);
  var nisab = parseFloat(document.getElementById('zakat-nisab').value);
  if(!harta || harta < 0 || !nisab || nisab <= 0){
    alert('Isi jumlah harta dan nisab dengan angka yang valid.');
    return;
  }
  var wajib = harta >= nisab;
  var zakat = wajib ? harta * 0.025 : 0;

  document.getElementById('zakat-hasil-status').textContent = wajib ? 'Wajib zakat' : 'Belum mencapai nisab';
  document.getElementById('zakat-hasil-nominal').textContent = 'Rp ' + Math.round(zakat).toLocaleString('id-ID');
  showReceipt('zakat-receipt');
}

/* ---- Diskon ---- */
function hitungDiskon(){
  var harga = parseFloat(document.getElementById('diskon-harga').value);
  var persen = parseFloat(document.getElementById('diskon-persen').value);
  var pajak = parseFloat(document.getElementById('diskon-pajak').value) || 0;
  if(!harga || harga <= 0 || isNaN(persen) || persen < 0){
    alert('Isi harga awal dan persentase diskon dengan angka yang valid.');
    return;
  }
  var setelahDiskon = harga * (1 - persen / 100);
  var hemat = harga - setelahDiskon;
  var hargaAkhir = setelahDiskon * (1 + pajak / 100);

  document.getElementById('diskon-hasil-setelah').textContent = 'Rp ' + Math.round(setelahDiskon).toLocaleString('id-ID');
  document.getElementById('diskon-hasil-hemat').textContent = 'Rp ' + Math.round(hemat).toLocaleString('id-ID');
  document.getElementById('diskon-hasil-akhir').textContent = 'Rp ' + Math.round(hargaAkhir).toLocaleString('id-ID');
  showReceipt('diskon-receipt');
}

/* ---- Usia & Selisih Tanggal ---- */
function hitungUsia(){
  var lahirStr = document.getElementById('usia-lahir').value;
  var targetStr = document.getElementById('usia-target').value;
  if(!lahirStr || !targetStr){
    alert('Isi tanggal lahir dan tanggal pembanding.');
    return;
  }
  var lahir = new Date(lahirStr + 'T00:00:00');
  var target = new Date(targetStr + 'T00:00:00');
  if(target < lahir){
    alert('Tanggal pembanding harus setelah tanggal lahir.');
    return;
  }

  var tahun = target.getFullYear() - lahir.getFullYear();
  var bulan = target.getMonth() - lahir.getMonth();
  var hari = target.getDate() - lahir.getDate();
  if(hari < 0){
    bulan -= 1;
    var lastMonth = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    hari += lastMonth;
  }
  if(bulan < 0){
    tahun -= 1;
    bulan += 12;
  }
  var totalHari = Math.round((target - lahir) / (1000 * 60 * 60 * 24));

  document.getElementById('usia-hasil-ymd').textContent = tahun + ' tahun ' + bulan + ' bulan ' + hari + ' hari';
  document.getElementById('usia-hasil-total').textContent = totalHari.toLocaleString('id-ID') + ' hari';
  showReceipt('usia-receipt');
}

/* ---- Kalori Harian (BMR/TDEE) ---- */
function hitungKalori(){
  var gender = document.getElementById('kalori-gender').value;
  var usia = parseFloat(document.getElementById('kalori-usia').value);
  var berat = parseFloat(document.getElementById('kalori-berat').value);
  var tinggi = parseFloat(document.getElementById('kalori-tinggi').value);
  var aktivitas = parseFloat(document.getElementById('kalori-aktivitas').value);

  if(!usia || !berat || !tinggi || usia <= 0 || berat <= 0 || tinggi <= 0){
    alert('Isi usia, berat badan, dan tinggi badan dengan angka yang valid.');
    return;
  }

  var bmr = gender === 'L'
    ? (10 * berat + 6.25 * tinggi - 5 * usia + 5)
    : (10 * berat + 6.25 * tinggi - 5 * usia - 161);
  var tdee = bmr * aktivitas;

  document.getElementById('kalori-hasil-bmr').textContent = Math.round(bmr).toLocaleString('id-ID') + ' kkal';
  document.getElementById('kalori-hasil-tdee').textContent = Math.round(tdee).toLocaleString('id-ID') + ' kkal/hari';
  showReceipt('kalori-receipt');
  }
    
