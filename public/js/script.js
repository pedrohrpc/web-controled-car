const socket = new WebSocket('ws://localhost:3000');
const keysPressed = new Set();

// Adiciona ouvintes de evento para responder às teclas direcionais
document.addEventListener('keydown', (event) => {
if (!keysPressed.has(event.key)) {
  keysPressed.add(event.key);
  handleKeyPress(event.key);
}
});

document.addEventListener('keyup', (event) => {
const key = event.key;
keysPressed.delete(key);
handleKeyRelease(key);
});

// Adiciona ouvintes de evento para responder aos cliques nos botões
document.querySelectorAll('.button').forEach(button => {
button.addEventListener('mousedown', (event) => {
  const key = button.getAttribute('data-key');
  if (!keysPressed.has(key)) {
    keysPressed.add(key);
    handleButtonClick(event, button);
  }
});
button.addEventListener('mouseup', (event) => {
  const key = button.getAttribute('data-key');
  keysPressed.delete(key);
  handleButtonRelease(event, button);
});
});

function handleKeyPress(key) {
addPressedClass(key);
sendKeyToServer(key);
handleKeyCombination();
}

function handleKeyRelease(key) {
removePressedClass(key);
handleKeyCombination();
if (keysPressed.size === 0) {
  // Envia "pare" quando nenhum botão está pressionado
  sendKeyToServer("pare");
}
}

function addPressedClass(key) {
const button = document.querySelector(`[data-key="${key}"]`);
if (button && !button.classList.contains('pressed')) {
  button.classList.add('pressed');
}
}

function removePressedClass(key) {
const button = document.querySelector(`[data-key="${key}"]`);
if (button) {
  button.classList.remove('pressed');
}
}

function sendKeyToServer(key) {
socket.send(key);
}

function handleButtonClick(event, button) {
const key = button.getAttribute('data-key');
addPressedClass(key);
sendKeyToServer(key);
handleKeyCombination();
}

function handleButtonRelease(event, button) {
const key = button.getAttribute('data-key');
removePressedClass(key);
handleKeyCombination();
if (keysPressed.size === 0) {
  // Envia "pare" quando nenhum botão está pressionado
  sendKeyToServer("pare");
}
}

function handleKeyCombination() {
const keyArray = Array.from(keysPressed);
if (keyArray.length === 2) {
  const [key1, key2] = keyArray;
  const combination = `${key1},${key2}`;
  sendKeyToServer(combination);
}
}

//Script da webcam
// Obter a referência para o elemento de vídeo
var video = document.getElementById('webcam');

// Verificar se a câmera está acessível no navegador
navigator.mediaDevices.getUserMedia({ video: true })
.then(function(stream) {
  // Definir o objeto de mídia do elemento de vídeo para o stream da webcam
  video.srcObject = stream;
})
.catch(function(err) {
  console.log("Ocorreu um erro ao acessar a câmera: " + err);
});