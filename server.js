const WebSocket = require('ws');
const http = require('http');
const express = require("express");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const APP_PORT = process.env.PORT || 3000;
const APP_URL = process.env.URL || `http://localhost:${APP_PORT}`;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(APP_PORT, () =>
  console.log(`Servidor ouvindo a porta ${APP_PORT}!`)
);

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });

  ws.on("message", handleIncomingMessage.bind(null, ws));
});

function handleIncomingMessage(ws, msg) {
  const data = msg;
  let participants = Array.from(wss.clients).filter(
    (client) => client !== ws
  );
  const winner = participants[0];
    participants.forEach((client) =>{ 
        if (client === winner) {
            result = data;
        }
        client.send(result);
    });
};