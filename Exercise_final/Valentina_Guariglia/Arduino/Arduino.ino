const int startListeningPin = 11;
const int changeColorsPin = 12;
const int changeShapePin = 13;
const int potentiometerPin = A0;

void setup() {
    pinMode(startListeningPin, INPUT_PULLUP);
    pinMode(changeColorsPin, INPUT_PULLUP);
    pinMode(changeShapePin, INPUT_PULLUP);
    Serial.begin(250000);
}

void loop() {
    if (digitalRead(startListeningPin) == LOW) {
        Serial.println("START_LISTENING");
        delay(200);
    }
    if (digitalRead(changeColorsPin) == LOW) {
        Serial.println("CHANGE_COLORS");
        delay(200);
    }
    if (digitalRead(changeShapePin) == LOW) {
        Serial.println("CHANGE_SHAPE");
        delay(200);
    }

    int potValue = analogRead(potentiometerPin);
    int numShapes = map(potValue, 400, 1023, 1, 60); 

    Serial.print("NUM_SHAPES:");
    Serial.println(numShapes);

    delay(100); 
}
