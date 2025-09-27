const guitarra = document.getElementById("guitarra");
const som = document.getElementById("som");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

const block1 = document.getElementById("block1"); // som quando toca
const block2 = document.getElementById("block2"); // som quando pausa

// função auxiliar para mostrar ícone e sumir depois
function showIcon(icon) {
  icon.style.opacity = "1";
  icon.style.transform = "translate(-50%, -50%) scale(1.06)";

  setTimeout(() => {
    icon.style.opacity = "0";
    icon.style.transform = "translate(-50%, -50%) scale(1)";
  }, 600);
}

// função para tocar som de efeito
function playEffect(audioElement) {
  audioElement.currentTime = 0; // sempre começa do início
  audioElement.play().catch(err => console.log("Falha ao tocar efeito:", err));
}

guitarra.addEventListener("click", () => {
  if (som.paused) {
    som.play().catch(err => console.log("Falha ao tocar música:", err));
    showIcon(playIcon);
    playEffect(block1); // toca efeito ao retomar
  } else {
    som.pause();
    showIcon(pauseIcon);
    playEffect(block2); // toca efeito ao pausar
  }
});