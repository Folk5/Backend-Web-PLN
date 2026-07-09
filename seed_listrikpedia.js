require('dotenv').config();
const prisma = require('./config/db');
const allData = [
    { abbr: 'APP', name: 'Alat Pengukur dan Pembatas', desc: 'Perangkat yang digunakan oleh PLN untuk mengukur pemakaian energi listrik (kWH meter) sekaligus membatasi daya yang digunakan oleh pelanggan.' },
    { abbr: 'SUTM', name: 'Saluran Udara Tegangan Menengah', desc: 'Jaringan distribusi tenaga listrik 20 kV yang menyalurkan listrik dari Gardu Induk ke Gardu Distribusi menggunakan kabel telanjang atau berisolasi setengah di udara.' },
    { abbr: 'SKTM', name: 'Saluran Kabel Tegangan Menengah', desc: 'Sama seperti SUTM, namun menggunakan kabel berisolasi penuh (kabel tanah) yang ditanam di bawah tanah untuk estetika dan keamanan ruang terbuka.' },
    { abbr: 'SUTR', name: 'Saluran Udara Tegangan Rendah', desc: 'Jaringan distribusi akhir (220V/380V) yang mengalirkan listrik dari Gardu Distribusi langsung ke rumah-rumah pelanggan melalui tiang udara.' },
    { abbr: 'SKTR', name: 'Saluran Kabel Tegangan Rendah', desc: 'Jaringan distribusi tegangan rendah yang kabel utamanya ditanam di bawah tanah, biasanya digunakan pada perumahan elit atau area perkotaan padat.' },
    { abbr: 'Gardu Distribusi', name: 'Gardu Trafo / Gardu Induk', desc: 'Bangunan atau tiang (Gardu Portal/Cantol) yang berisi Transformator (Trafo) untuk menurunkan tegangan dari 20 kV (TM) menjadi 220V (TR) siap pakai.' },
    { abbr: 'Trafo', name: 'Transformator', desc: 'Komponen utama kelistrikan yang berfungsi untuk menaikkan (Step-Up) atau menurunkan (Step-Down) tegangan listrik AC tanpa mengubah frekuensinya.' },
    { abbr: 'FCO', name: 'Fused Cut Out', desc: 'Alat pengaman lebur (sekring) pada jaringan tegangan menengah yang berfungsi memutus arus apabila terjadi gangguan hubung singkat (short circuit).' },
    { abbr: 'LBS', name: 'Load Break Switch', desc: 'Saklar pemutus beban pada jaringan 20 kV yang dapat dioperasikan (dibuka/ditutup) saat jaringan dalam keadaan berbeban.' },
    { abbr: 'Recloser', name: 'Penutup Balik Otomatis', desc: 'Peralatan proteksi jaringan yang mendeteksi arus lebih dan dapat memutus arus sementara, lalu menyambungnya kembali secara otomatis (jika gangguan bersifat sementara).' },
    { abbr: 'KWH Meter', name: 'Kilo Watt Hour Meter', desc: 'Alat ukur milik PLN yang dipasang di bangunan pelanggan untuk mencatat besaran pemakaian energi listrik dalam satuan kWh.' },
    { abbr: 'NH Fuse', name: 'Pengaman Lebur TR', desc: 'Sekring tegangan rendah dengan kapasitas hantar arus tinggi yang dipasang di PHB-TR (Panel Hubung Bagi - Tegangan Rendah) pada Gardu Distribusi.' },
    { abbr: 'Arrester', name: 'Lightning Arrester', desc: 'Alat proteksi yang dipasang di tiang jaringan atau gardu untuk mengamankan peralatan dari lonjakan tegangan ekstrem akibat sambaran petir.' },
    { abbr: 'Tiang Beton', name: 'Tiang Listrik Beton', desc: 'Infrastruktur tiang penopang kabel distribusi yang terbuat dari konstruksi beton bertulang pratekan. Ukuran standarnya adalah 7 meter, 9 meter, 11 meter, hingga 14 meter.' },
    { abbr: 'Isolator', name: 'Penyekat Arus', desc: 'Komponen (biasanya berbahan keramik, polimer, atau kaca) yang menahan konduktor bertegangan agar arusnya tidak bocor mengalir ke tiang penyangga.' },
    { abbr: 'AMR', name: 'Automatic Meter Reader', desc: '' },
    { abbr: 'AVR', name: 'Automatic Voltage Regulator', desc: '' },
    { abbr: 'AIS', name: 'AIR Insulated Substation', desc: '' },
    { abbr: 'BCU', name: 'Bay Control Unit', desc: 'Perangkat elektronik yang befungsi untuk memberikan perintah/kendali pada peralatan yang ada di process level.' },
    { abbr: 'BDC', name: 'Binary Decoding Code', desc: '' },
    { abbr: 'BPU', name: 'Back Up Protection Unit', desc: 'Perangkat elektronik yang befungsi sebagai pusat kendali proteksi cadangan perangkat pada process level.' },
    { abbr: 'CB', name: 'Circuit Breaker', desc: 'Sakelar yang menghubungkan dan memutuskan sirkit tenaga listrik yang bertegangan dalam kondisi operasi normal dan mampu memutuskan arus beban dan arus hubung singkat. (SPLN S3.001-3:2012)' },
    { abbr: 'CBF', name: 'Circuit Breaker Failure', desc: 'Alarm yang menunjukkan peralatan Circuit Breaker tidak dapat bekerja sebagaimana mestinya.' },
    { abbr: 'CBM', name: 'Condition Base Maintenance', desc: '' },
    { abbr: 'CCP', name: 'Circulation Current Protection', desc: '' },
    { abbr: 'CT', name: 'Current Transformer', desc: 'Transformer instrumen yang keluarannya berupa besaran arus listrik.' },
    { abbr: 'DEF', name: 'Directional Earth Fault', desc: '' },
    { abbr: 'DFR', name: 'Disturbance Fault Recorder', desc: '' },
    { abbr: 'DS', name: 'Disconnecting Switch', desc: '' },
    { abbr: 'Energi', name: 'Energi', desc: 'Kemampuan untuk melakukan kerja yang dapat berupa panas, cahaya, mekanika, kimia, dan elektromagnetika. [UU No. 30 Th 2007]' }
];

async function main() {
    console.log("Seeding ListrikPedia...");
    for (const item of allData) {
        await prisma.listrikpedia.create({
            data: {
                abbr: item.abbr,
                name: item.name,
                description: item.desc || null,
                type: item.abbr === item.name ? "istilah" : "singkatan"
            }
        });
    }
    console.log("Seeding completed!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
