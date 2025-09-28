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
const ampBar = document.getElementById("amp-bar");
const ampSlider = document.getElementById("amp-slider");

let ampToggle = true;

// Função para mostrar ícone e sumir depois
function showIcon(icon) {
  icon.style.opacity = "1";
  icon.style.transform = "translate(-50%, -50%) scale(1.06)";
  setTimeout(() => {
    icon.style.opacity = "0";
    icon.style.transform = "translate(-50%, -50%) scale(1)";
  }, 600);
}

// Função para tocar efeito de bloco
function playEffect(audioElement) {
  audioElement.currentTime = 0;
  audioElement.play().catch(err => console.log("Erro efeito:", err));
}

// Clique na guitarra
guitarra.addEventListener("click", () => {
  if (som.paused) {
    som.play().catch(err => console.log("Erro música:", err));
    showIcon(playIcon);
    playEffect(block1);

    // Fogo aparece gradualmente
    fire.style.transition = "opacity 0.6s ease-in";
    fire.style.opacity = "1";
  } else {
    som.pause();
    showIcon(pauseIcon);
    playEffect(block2);

    // Fogo desaparece instantaneamente
    fire.style.transition = "none";
    fire.style.opacity = "0";
    setTimeout(() => {
      fire.style.transition = "opacity 0.6s ease-in"; // restaura transição
    }, 10);
  }
});

// Clique no amplificador
amp.addEventListener("click", () => {
  if (ampToggle) {
    playEffect(block1);
    ampOn.style.opacity = "1";
    setTimeout(() => ampOn.style.opacity = "0", 300);
    ampBar.style.display = "block";
  } else {
    playEffect(block2);
    ampOff.style.opacity = "1";
    setTimeout(() => ampOff.style.opacity = "0", 300);
    ampBar.style.display = "none";
  }
  ampToggle = !ampToggle;
});

// Drag do slider para controlar volume
let dragging = false;

ampSlider.addEventListener("mousedown", () => dragging = true);
document.addEventListener("mouseup", () => dragging = false);
document.addEventListener("mousemove", e => {
  if (!dragging) return;

  const rect = ampBar.getBoundingClientRect();
  let pos = e.clientX - rect.left;
  if (pos < 0) pos = 0;
  if (pos > rect.width) pos = rect.width;

  ampSlider.style.left = `${pos}px`;
  som.volume = pos / rect.width;
});
