#include <ArduinoWebsockets.h>

const char* ssid = "Apto_502"; // Nome da rede
const char* password = "nossa123senha."; // Senha da rede
const char* websockets_server_host = "192.168.0.10"; // IP do servidor websocket
const int websockets_server_port = 3000; // Porta de conexão do servidor

// Utilizamos o namespace de websocket para podermos utilizar a classe WebsocketsClient
using namespace websockets;

// Objeto websocket client
WebsocketsClient client;

// Led
const int FORWARD = 4;
const int BACK = 18;
const int RIGHT = 19;
const int LEFT = 21;


void setup() 
{
    // Iniciamos a serial com velocidade de 115200
    Serial.begin(115200);

    // Definimos o pino como saída
    pinMode(FORWARD, OUTPUT);
    pinMode(BACK, OUTPUT);
    pinMode(RIGHT, OUTPUT);
    pinMode(LEFT, OUTPUT);

    // Conectamos o wifi
    WiFi.begin(ssid, password);

    // Enquanto não conectar printamos um "."
    while(WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(1000);
    }

    // Exibimos "WiFi Conectado"
    Serial.println("Connected to Wifi, Connecting to server.");

    // Tentamos conectar com o websockets server
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/");

    // Se foi possível conectar
    if(connected) 
    {
        // Exibimos mensagem de sucesso
        Serial.println("Connected!");
        // Enviamos uma msg "Hello Server" para o servidor
        client.send("Hello Server");
    }   // Se não foi possível conectar
    else 
    {
        // Exibimos mensagem de falha
        Serial.println("Not Connected!");
        return;
    }
    
    // Iniciamos o callback onde as mesagens serão recebidas
    client.onMessage([&](WebsocketsMessage message)
    {        
        // Exibimos a mensagem recebida na serial
        Serial.print("Got Message: ");
        Serial.println(message.data());

        // Ligamos/Desligamos o led de acordo com o comando
        if(message.data().indexOf("ArrowUp") != -1){
            digitalWrite(FORWARD, HIGH);
            digitalWrite(BACK, LOW);
        }
           
        if(message.data().indexOf("ArrowDown") != -1){
            digitalWrite(FORWARD, LOW);
            digitalWrite(BACK, HIGH);
        }
            
        if(message.data().indexOf("ArrowLeft") != -1 and message.data().indexOf("ArrowRight") == -1){
            digitalWrite(LEFT, HIGH);
            digitalWrite(RIGHT, LOW);
        }
           
        if(message.data().indexOf("ArrowRight") != -1 and message.data().indexOf("ArrowLeft") == -1){
            digitalWrite(LEFT, LOW);
            digitalWrite(RIGHT, HIGH);
        }
        else{
            digitalWrite(FORWARD, LOW);
            digitalWrite(BACK, LOW);
            digitalWrite(LEFT, LOW);
            digitalWrite(RIGHT, LOW);
        }
    });
}

void loop() 
{
    //  De tempo em tempo, o websockets client checa por novas mensagens recebidas
    if(client.available()) 
        client.poll();
    delay(1);
}
