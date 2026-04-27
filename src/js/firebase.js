/* ================================================
   firebase.js — Konfigurasi & koneksi Firebase
   Ganti nilai firebaseConfig di bawah dengan
   konfigurasi project Firebase kamu sendiri.
   ================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ── 1. GANTI NILAI INI dengan konfigurasi dari Firebase Console ──
const firebaseConfig = {
  apiKey: "AIzaSyAXbd7FOdlPe-44Q6ZPv40OfHX_dl2cEHo",
  authDomain: "monitoring-pompa-8323c.firebaseapp.com",
  databaseURL: "https://monitoring-pompa-8323c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monitoring-pompa-8323c",
  storageBucket: "monitoring-pompa-8323c.firebasestorage.app",
  messagingSenderId: "1073774800980",
  appId: "1:1073774800980:web:7a87548689455dd8ec3dc1",
  measurementId: "G-YSQQRMBHCT"
};

// ── 2. Inisialisasi Firebase ──
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ── 3. Listener realtime — membaca data sensor dari ESP32 ──
//
// Struktur data di Firebase Realtime Database yang dikirim ESP32:
//
// sensor/
// ├── tegangan   : 220.5    (float, Volt)
// ├── arus       : 1.36     (float, Ampere)
// ├── daya       : 300.0    (float, Watt)
// ├── baterai    : 7.28     (float, kWh)
// ├── baterai_pct: 35       (int, persen 0–100)
// ├── valve1     : true     (boolean)
// ├── valve2     : false    (boolean)
// └── valve3     : false    (boolean)

export function startFirebaseListener(onDataReceived) {
  const sensorRef = ref(db, 'sensor');

  onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      console.warn("Firebase: data sensor kosong.");
      return;
    }

    // Kirim data ke callback (app.js akan menerima & menampilkan)
    onDataReceived({
      v:      data.tegangan    ?? 0,
      a:      data.arus        ?? 0,
      p:      data.daya        ?? 0,
      bat:    data.baterai     ?? 0,
      pct:    data.baterai_pct ?? 0,
      valve:  [
        data.valve1 ?? false,
        data.valve2 ?? false,
        data.valve3 ?? false
      ]
    });
  }, (error) => {
    console.error("Firebase error:", error);
  });
}