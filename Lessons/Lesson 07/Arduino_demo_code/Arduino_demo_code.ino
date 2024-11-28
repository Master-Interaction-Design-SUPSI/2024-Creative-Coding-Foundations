int pot1 = 0;   // variable declaration to store the value of the first potentiometer
int pot2 = 0;   // variable declaration to store the value of the second potentiometer
int pot3 = 0;   // variable declaration to store the value of the third potentiometer

void setup() {

  Serial.begin(250000);   // start the serial communication with the computer

}

void loop() {

  pot1 = analogRead(A0);  // read the potentiometer on pin A0, values are from 0 to 1023
  pot2 = analogRead(A1);  // read the potentiometer on pin A1, values are from 0 to 1023
  pot3 = analogRead(A2);  // read the potentiometer on pin A2, values are from 0 to 1023

  button = digitalRead(7);


  // send the data in a CSV (Comma Separated Values) format to the computer
  Serial.println(String(pot1) + "," + String(pot2) + "," + String(pot3));

  delay(30);

}
