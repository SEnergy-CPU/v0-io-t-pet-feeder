#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

// WiFi credentials
const char* ssid = "Aswang si Lois";
const char* password = "hoydimagconnect";

// Servo configuration
const int SERVO_PIN = 13;
Servo servoMotor;
const int SERVO_OPEN = 90;
const int SERVO_CLOSED = 0;

// Web server on port 80
WebServer server(80);

// Feeding history
struct FeedingEvent {
  unsigned long timestamp;
  String type;
};

FeedingEvent feedingHistory[100];
int feedingCount = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("Starting Pet Feeder ESP32 - FRESH BUILD");
  Serial.println("========================================");
  
  // Initialize servo with explicit timer allocation
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  
  servoMotor.setPeriodHertz(50);
  servoMotor.attach(SERVO_PIN, 1000, 2000);
  
  Serial.println("Servo initialized on GPIO pin: 13");
  Serial.println("Testing servo with startup sequence...");
  
  // Test servo movement
  servoMotor.write(SERVO_CLOSED);
  delay(500);
  Serial.println("[TEST] Servo at 0 degrees (CLOSED)");
  
  delay(1000);
  
  servoMotor.write(SERVO_OPEN);
  delay(500);
  Serial.println("[TEST] Servo at 90 degrees (OPEN)");
  
  delay(1000);
  
  servoMotor.write(SERVO_CLOSED);
  delay(500);
  Serial.println("[TEST] Servo back to 0 degrees (CLOSED)");
  Serial.println("Servo test complete!\n");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Setup web server routes BEFORE server.begin()
  setupWebRoutes();
  
  // Start server
  server.begin();
  Serial.println("HTTP server started on port 80");
  
  Serial.println("\n========================================");
  Serial.println("Pet Feeder ready!");
  Serial.println("========================================\n");
}

void loop() {
  server.handleClient();
  delay(10);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi");
    delay(5000);
    ESP.restart();
  }
}

void setupWebRoutes() {
  Serial.println("Setting up web routes...");
  
  server.on("/feed", HTTP_GET, []() {
    Serial.println("\n=== FEED ENDPOINT HIT (GET) ===");
    handleFeed();
  });
  
  server.on("/feed", HTTP_POST, []() {
    Serial.println("\n=== FEED ENDPOINT HIT (POST) ===");
    handleFeed();
  });
  
  server.on("/status", HTTP_GET, []() {
    Serial.println("\n=== STATUS ENDPOINT HIT ===");
    handleStatus();
  });
  
  server.on("/history", HTTP_GET, []() {
    Serial.println("\n=== HISTORY ENDPOINT HIT ===");
    handleHistory();
  });
  
  // Fallback for all other requests
  server.onNotFound([]() {
    String method = server.method() == HTTP_GET ? "GET" : 
                    server.method() == HTTP_POST ? "POST" : "UNKNOWN";
    
    Serial.println("\n>>> 404 - REQUEST NOT MATCHED <<<");
    Serial.println("Method: " + method);
    Serial.println("URI: " + server.uri());
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(404, "application/json", "{\"error\":\"Endpoint not found\"}");
  });
  
  Serial.println("Routes configured successfully");
}

void handleFeed() {
  Serial.println(">>> EXECUTING FEED COMMAND <<<");
  
  Serial.println("[Servo] Opening container...");
  servoMotor.write(SERVO_OPEN);
  Serial.println("[Servo] Position: 90 degrees");
  
  delay(2000);
  
  Serial.println("[Servo] Closing container...");
  servoMotor.write(SERVO_CLOSED);
  Serial.println("[Servo] Position: 0 degrees");
  
  // Log event
  if (feedingCount < 100) {
    feedingHistory[feedingCount].timestamp = millis();
    feedingHistory[feedingCount].type = "manual";
    feedingCount++;
  }
  
  String response = "{\"status\":\"success\",\"message\":\"Food dispensed successfully\",\"timestamp\":" + String(millis()) + "}";
  Serial.println("Sending response: " + response);
  Serial.println("=== FEED COMMAND COMPLETE ===\n");
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Content-Type", "application/json");
  server.send(200, "application/json", response);
}

void handleStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Content-Type", "application/json");
  
  String json = "{";
  json += "\"connected\":true,";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"uptime\":" + String(millis() / 1000) + ",";
  json += "\"feedings\":" + String(feedingCount);
  json += "}";
  
  server.send(200, "application/json", json);
}

void handleHistory() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Content-Type", "application/json");
  
  String json = "{\"history\":[";
  
  for (int i = 0; i < feedingCount && i < 50; i++) {
    if (i > 0) json += ",";
    json += "{\"timestamp\":" + String(feedingHistory[i].timestamp) + ",\"type\":\"" + feedingHistory[i].type + "\"}";
  }
  
  json += "]}";
  server.send(200, "application/json", json);
}
