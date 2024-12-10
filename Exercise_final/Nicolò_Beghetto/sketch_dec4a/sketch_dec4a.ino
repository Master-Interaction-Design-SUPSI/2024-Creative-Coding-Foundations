const int potPin = A0;

void setup() {
  Serial.begin(9600); 
}

void loop() {
  int potValue = analogRead(potPin); // Legge il valore del potenziometro
  Serial.println(potValue);         // Invia il valore sulla porta seriale
  delay(100);                       // Aspetta 100 ms per evitare invii troppo frequenti
}

