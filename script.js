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

// Atualiza fogo de acordo com volume
function updateFire(volume) {
  if (volume === 0) {
    fire.style.opacity = "0";
  } else if (volume <= 0.5) {
    fire.style.opacity = `${volume}`;
  } else if (volume > 0.5 && volume <= 0.6) {
    let mapped = (volume - 0.5) * 10;
    fire.style.opacity = `${0.5 + mapped * 0.5}`;
  } else {
    fire.style.opacity = "1";
  }
}

// Clique na guitarra
guitarra.addEventListener("click", () => {
  if (som.paused) {
    som.play().catch(err => console.log("Erro música:", err));
    showIcon(playIcon);
    playEffect(block1);

    fire.style.transition = "opacity 0.6s ease-in";
    updateFire(som.volume);
  } else {
    som.pause();
    showIcon(pauseIcon);
    playEffect(block2);

    fire.style.transition = "none";
    fire.style.opacity = "0";
    setTimeout(() => {
      fire.style.transition = "opacity 0.6s ease-in";
    }, 10);
  }
});

// Clique no amplificador
amp.addEventListener("click", () => {
  if (ampToggle) {
    playEffect(block1);
    ampOn.style.opacity = "1";
    setTimeout(() => ampOn.style.opacity = "0", 300);
    ampControl.style.display = "flex";
  } else {
    playEffect(block2);
    ampOff.style.opacity = "1";
    setTimeout(() => ampOff.style.opacity = "0", 300);
    ampControl.style.display = "none";
  }
  ampToggle = !ampToggle;
});

// Inicializa volume no carregamento da página
window.addEventListener("load", () => {
  ampSlider.style.left = `0px`;
  som.volume = 0;
  fire.style.opacity = "0";
});

// Clique na barra de volume para definir posição e volume
ampBar.addEventListener("click", e => {
  const rect = ampBar.getBoundingClientRect();
  const sliderWidth = ampSlider.offsetWidth;
  const halfSlider = sliderWidth / 2;

  // Posição do clique relativa à barra
  let pos = e.clientX - rect.left;

  // Calcula a posição left centralizada no clique
  let leftPos = pos - halfSlider;

  // Limita para que o slider possa sobressair metade no lado direito
  leftPos = Math.max(-halfSlider, Math.min(leftPos, rect.width - halfSlider));

  // Atualiza posição da bolinha
  ampSlider.style.left = `${leftPos}px`;

  // Calcula o percentual baseado na posição do centro da bolinha
  const centerPos = leftPos + halfSlider;
  const percent = Math.min(1, centerPos / rect.width);

  // Volume diretamente proporcional (vai de 0 a 1 completo)
  som.volume = percent;

  // Atualiza fogo conforme volume
  fire.style.transition = "opacity 0.3s ease-in-out";
  updateFire(som.volume);
});

// Impede que imagens sejam arrastadas
document.querySelectorAll('img').forEach(img => {
  img.ondragstart = () => false;
});
