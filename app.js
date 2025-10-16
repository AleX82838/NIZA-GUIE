// =============================
// CONFIGURACIÓN INICIAL
// =============================
// Reemplaza con tus números reales de WhatsApp (sin + ni guiones)
const WHA_NUM_1 = "+52 56 5459 5169"; // Ejemplo: México (52) + número
const WHA_NUM_2 = "+52 971 127 5460";

// =============================
// DATOS DE PRUEBA (puedes conectar a una API real o Firebase)
// =============================
const EVENTS = [
  { title: "Festival Lluvia 2025", date: "2025-06-12", place: "Teatro del Lago", img: "assets/events/event1.jpg" },
  { title: "Boda - Villa Mar", date: "2024-11-20", place: "Villa Mar", img: "assets/events/event2.jpg" },
  { title: "Concierto Plaza Mayor", date: "2024-09-05", place: "Plaza Mayor", img: "assets/events/event3.jpg" }
];

const MEMBERS = [
  { name: "Ana Ruiz", role: "Voz", img: "assets/members/ana.jpg" },
  { name: "Carlos Mena", role: "Guitarra", img: "assets/members/carlos.jpg" },
  { name: "Luisa Peña", role: "Teclado", img: "assets/members/luisa.jpg" },
  { name: "Diego López", role: "Batería", img: "assets/members/diego.jpg" }
];

// =============================
// FUNCIONES AUXILIARES
// =============================
function el(selector) {
  return document.querySelector(selector);
}

function elAll(selector) {
  return document.querySelectorAll(selector);
}

function buildWaLink(number, message) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// =============================
// INICIALIZACIÓN DE INTERFAZ
// =============================

// Año dinámico
el("#year").textContent = new Date().getFullYear();

// Renderizar eventos
const eventsList = el("#eventsList");
let eventsShown = 0;

function renderEvents(batch = 3) {
  const slice = EVENTS.slice(eventsShown, eventsShown + batch);
  slice.forEach(ev => {
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = `
      <img src="${ev.img}" alt="${ev.title}">
      <h4>${ev.title}</h4>
      <small>${ev.date} • ${ev.place}</small>
    `;
    eventsList.appendChild(div);
  });
  eventsShown += slice.length;
}

renderEvents();

el("#loadMoreEvents").addEventListener("click", () => renderEvents());

// Renderizar integrantes
const membersGrid = el("#membersGrid");
MEMBERS.forEach(m => {
  const d = document.createElement("div");
  d.className = "member";
  d.innerHTML = `<img src="${m.img}" alt="${m.name}">
                 <h4>${m.name}</h4>
                 <small>${m.role}</small>`;
  membersGrid.appendChild(d);
});

// =============================
// CONTACTO Y WHATSAPP
// =============================
const waBtn1 = el("#waBtn1");
const waBtn2 = el("#waBtn2");

waBtn1.href = buildWaLink(WHA_NUM_1, "Hola Niza Guie — Estoy interesado en contratarles.");
waBtn2.href = buildWaLink(WHA_NUM_2, "Hola Niza Guie — Solicito información sobre disponibilidad y precio.");

el("#sendWa").addEventListener("click", () => {
  const name = el("#name").value || "---";
  const msg = el("#message").value || "";
  const selected = document.querySelector("input[name='wa']:checked").value;
  const number = selected === "1" ? WHA_NUM_1 : WHA_NUM_2;
  const text = `Contacto: ${name}\nMensaje: ${msg}`;
  window.open(buildWaLink(number, text), "_blank");
});

// =============================
// GUARDAR MENSAJES OFFLINE
// =============================
el("#saveOffline").addEventListener("click", () => {
  const name = el("#name").value || "Anónimo";
  const msg = el("#message").value || "";
  const notes = JSON.parse(localStorage.getItem("ng_notes") || "[]");
  notes.push({ name, msg, date: new Date().toISOString() });
  localStorage.setItem("ng_notes", JSON.stringify(notes));
  alert("Nota guardada offline. (Consulta en almacenamiento local)");
});

// =============================
// INSTALACIÓN PWA
// =============================
let deferredPrompt;
const installBtn = el("#installBtn");

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "inline-block";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === "accepted") {
    console.log("Instalación aceptada");
  }
  deferredPrompt = null;
  installBtn.style.display = "none";
});

// =============================
// SERVICE WORKER
// =============================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker registrado"))
      .catch(err => console.error("Error registrando SW", err));
  });
}

// =============================
// ANALÍTICA LOCAL SIMPLE
// =============================
document.addEventListener("click", e => {
  if (e.target.matches(".btn")) {
    const events = JSON.parse(localStorage.getItem("ng_analytics") || "[]");
    events.push({ type: "click", text: e.target.textContent.trim(), time: Date.now() });
    localStorage.setItem("ng_analytics", JSON.stringify(events));
  }
});


// ===========================
//  NIZA GUIE - Funciones JS
// ===========================

// Enviar mensaje por WhatsApp
function enviarWhatsApp(numero) {
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  let texto = `Hola, soy ${nombre || "un fan"} y quiero más información. ${mensaje ? "Mensaje: " + mensaje : ""}`;

  const num1 = "5219512345678"; // ← Reemplázalo con número real
  const num2 = "5219518765432"; // ← Reemplázalo con número real
  const numeroDestino = numero === 1 ? num1 : num2;
  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(texto)}`;

  window.open(url, "_blank");
}

// Registrar Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(() => console.log("✅ Service Worker registrado"))
      .catch(err => console.log("❌ Error SW:", err));
  });
}

