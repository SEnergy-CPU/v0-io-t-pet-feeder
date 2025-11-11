#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

// WiFi configuration
const char* ssid = "Aswang si Lois";
const char* password = "hoydimagconnect";

// Servo configuration
const int SERVO_PIN = 13;
Servo servoMotor;
const int SERVO_OPEN = 90;
const int SERVO_CLOSED = 0;

// Create web server on port 80
WebServer server(80);

void handleFeed() {
  Serial.println("\n>>> /feed ENDPOINT HIT <<<");
  Serial.println("Opening servo container...");
  
  // Open servo
  servoMotor.write(SERVO_OPEN);
  delay(2000);
  
  // Close servo
  servoMotor.write(SERVO_CLOSED);
  
  Serial.println("Servo movement complete!\n");
  
  // Send JSON response
  server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Food dispensed successfully\"}");
}

void handleNotFound() {
  server.send(404, "text/plain", "Endpoint not found");
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("Starting Pet Feeder ESP32 - WiFi MODE");
  Serial.println("========================================");
  
  // Initialize servo
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  
  servoMotor.setPeriodHertz(50);
  servoMotor.attach(SERVO_PIN, 1000, 2000);
  
  Serial.println("Servo initialized on GPIO pin 13");
  
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
  }
  
  // Setup HTTP server routes
  server.on("/feed", HTTP_GET, handleFeed);
  server.on("/feed", HTTP_POST, handleFeed);
  server.onNotFound(handleNotFound);
  
  server.begin();
  Serial.println("HTTP server started on port 80");
  
  Serial.println("========================================");
  Serial.println("Pet Feeder ready!");
  Serial.println("========================================\n");
}

void loop() {
  server.handleClient();
  delay(10);
}
