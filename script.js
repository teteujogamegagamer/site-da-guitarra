// Seleção de elementos
const guitarra = document.getElementById("guitarra");
const som = document.getElementById("som");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const fire = document.getElementById("fire");

const block1 = document.getElementById("block1");
const block2 = document.getElementById("block2");

const amp = document.getElementById("amp");
const ampOn = document.getElementById("amp-on");
const ampOff = document.getElementById("amp-off");
const ampControl = document.querySelector(".amp-control");
const ampBar = document.getElementById("amp-bar");
const ampSlider = document.getElementById("amp-slider");

let ampToggle = true;
let dragging = false;
let progressInterval;

// ---------------- Funções gerais ----------------

// Mostrar ícone de play/pause rapidamente
function showIcon(icon) {
  icon.style.opacity = "1";
  icon.style.transform = "translate(-50%, -50%) scale(1.06)";
  setTimeout(() => {
    icon.style.opacity = "0";
    icon.style.transform = "translate(-50%, -50%) scale(1)";
  }, 600);
}

// Tocar efeito sonoro
function playEffect(audioElement) {
  audioElement.currentTime = 0;
  audioElement.play().catch(err => console.log("Erro efeito:", err));
}

// Atualiza fogo de acordo com volume
function updateFire(volume) {
  fire.style.opacity = volume;
}

// Formata tempo em mm:ss
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// ---------------- Volume do amplificador ----------------
function setVolumeByPosition(clientX) {
  const rect = ampBar.getBoundingClientRect();
  const sliderWidth = ampSlider.offsetWidth;
  
  let leftPos = clientX - rect.left - sliderWidth / 2;
  leftPos = Math.max(0, Math.min(leftPos, rect.width - sliderWidth));
  
  ampSlider.style.left = `${leftPos}px`;
  
  const percent = leftPos / (rect.width - sliderWidth);
  som.volume = percent;
  
  if (!som.paused) updateFire(som.volume);
}

// Clique na barra
ampBar.addEventListener("click", e => setVolumeByPosition(e.clientX));

// Arrastar slider
ampSlider.addEventListener("mousedown", () => dragging = true);
document.addEventListener("mouseup", () => dragging = false);
document.addEventListener("mousemove", e => {
  if (dragging) setVolumeByPosition(e.clientX);
});

// Clique no amplificador
amp.addEventListener("click", () => {
  if (ampToggle) {
    playEffect(block1);
    ampOn.style.opacity = "1";
    setTimeout(() => ampOn.style.opacity = "0", 300);
    ampControl.style.display = "flex";

    // Ajusta slider ao mostrar a barra (reflete volume atual)
    const barWidth = ampBar.offsetWidth;
    const sliderWidth = ampSlider.offsetWidth;
    ampSlider.style.left = `${som.volume * (barWidth - sliderWidth)}px`;
  } else {
    playEffect(block2);
    ampOff.style.opacity = "1";
    setTimeout(() => ampOff.style.opacity = "0", 300);
    ampControl.style.display = "none";
  }
  ampToggle = !ampToggle;
});

// Inicializa volume na página
window.addEventListener("load", () => {
  som.volume = 0.5; // meio
});

// ---------------- Barra de progresso ----------------
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const progressFill = document.getElementById("progress-fill");

function updateProgress() {
  const percent = (som.currentTime / som.duration) * 100;
  progressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(som.currentTime);
}

function startProgress() {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(updateProgress, 100);
}

function stopProgress() {
  clearInterval(progressInterval);
}

// Quando música carrega
som.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(som.duration);
});

// ---------------- Clique na guitarra ----------------
guitarra.addEventListener("click", () => {
  if (som.paused) {
    som.play().catch(err => console.log("Erro música:", err));
    showIcon(playIcon);
    playEffect(block1);
    updateFire(som.volume);
    startProgress();
  } else {
    som.pause();
    showIcon(pauseIcon);
    playEffect(block2);
    fire.style.opacity = "0";
    stopProgress();
  }
});

// Reinicia barra quando música termina
som.addEventListener("ended", () => {
  stopProgress();
  updateProgress(); // completa barra
});

// Atalhos de teclado
document.addEventListener("keydown", (e) => {
  // Reinicia música no 0:00 (tecla 0 ou Insert)
  if (e.code === "Digit0" || e.code === "Insert") {
    som.currentTime = 0;          // volta pro início
    updateProgress();             // atualiza barra
    if (som.paused) {
      fire.style.opacity = "0";   // se estiver pausado, fogo some
    } else {
      updateFire(som.volume);     // se estiver tocando, atualiza fogo
    }
  }

  // Alterna play/pause (tecla K)
  if (e.code === "KeyK") {
    if (som.paused) {
      som.play().catch(err => console.log("Erro música:", err));
      showIcon(playIcon);      // mostra ícone de play
      playEffect(block1);      // efeito de ligar
      updateFire(som.volume);
      startProgress();
    } else {
      som.pause();
      showIcon(pauseIcon);     // mostra ícone de pause
      playEffect(block2);      // efeito de desligar
      fire.style.opacity = "0";
      stopProgress();
    }
  }
});

// Alternar contraste (claro/escuro)
const contrastBtn = document.getElementById("contrast-toggle");

contrastBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});



const settingsToggle = document.getElementById("settings-toggle");
const settingsMenu = document.getElementById("settings-menu");
const settingsOverlay = document.getElementById("settings-overlay");

// Abre e fecha o menu ao clicar na engrenagem
settingsToggle.addEventListener("click", () => {
  settingsMenu.classList.toggle("active");
  settingsOverlay.classList.toggle("active");
});

// Fecha o menu ao clicar no fundo escurecido
settingsOverlay.addEventListener("click", () => {
  settingsMenu.classList.remove("active");
  settingsOverlay.classList.remove("active");
});

// Fecha com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    settingsMenu.classList.remove("active");
    settingsOverlay.classList.remove("active");
  }
});

// Impede que imagens sejam arrastadas
document.querySelectorAll('img').forEach(img => img.ondragstart = () => false);
