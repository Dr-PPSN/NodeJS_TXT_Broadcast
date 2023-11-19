const net = require('net');

const serverPort = 1234;
const clients = {};

const server = net.createServer((client) => {
  console.log('Neuer Client verbunden');

  // Generiere eine zufällige Client-ID
  const clientId = Math.random().toString(36).substring(7);
  clients[clientId] = client;

  // Begrüße den Client mit seiner ID
  client.write(`Willkommen, deine Client-ID ist: ${clientId}\r\n`);

  client.on('data', (data) => {
    const request = data.toString().trim();
    console.log(`Nachricht von ${clientId}: ${request}`);

    // Hier könntest du die Logik für die Weiterleitung implementieren
    // In diesem Beispiel senden wir die Nachricht an alle anderen Clients
    Object.keys(clients).forEach((otherClientId) => {
      if (otherClientId !== clientId) {
        clients[otherClientId].write(`\nNachricht von ${clientId}: ${request}\n`);
      }
    });
  });

  client.on('end', () => {
    console.log(`Client ${clientId} getrennt`);
    // Entferne den Client aus der Liste der verbundenen Clients
    delete clients[clientId];
  });

  client.on('error', (err) => {
    console.log(`Client ${clientId} hat einen Fehler verursacht: ${err.message}`);
    // Entferne den Client aus der Liste der verbundenen Clients
    delete clients[clientId];
  });
});

server.listen(serverPort, () => {
  console.log(`Server gestartet auf Port ${serverPort}`);
});