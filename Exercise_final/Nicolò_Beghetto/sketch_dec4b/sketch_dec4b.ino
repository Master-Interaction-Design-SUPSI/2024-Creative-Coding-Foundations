void setup() {
  Serial.begin(9600); // Initialize serial communication
}

void loop() {
  int potValue = analogRead(A0); // Read potentiometer value
  int mappedValue = map(potValue, 0, 1023, 10, 100); // Map to line space range
  Serial.println(mappedValue); // Send the value over Serial
  delay(100); // Send data every 100 ms
}
