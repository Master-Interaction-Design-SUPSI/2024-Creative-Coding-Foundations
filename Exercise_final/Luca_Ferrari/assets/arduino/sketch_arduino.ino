//inclusion of the encoder library
#include <Encoder.h>

//variable declaration
int btn1 = 0;
int btn2 = 0;
int btn3 = 0;
int sw = -1;


Encoder myEnc(5,6); // Set encoder pins


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(13, INPUT_PULLUP); // Set button pin
  pinMode(12, INPUT_PULLUP); // Set button pin
  pinMode(11, INPUT_PULLUP); // Set button pin
  pinMode(8, INPUT); // Set switch pin
}

//Set encoder initial value
int oldPosition  = -999;

void loop() {
  // put your main code here, to run repeatedly:

  //digital read from the button/switch pins
  btn1 = digitalRead(13);
  btn2 = digitalRead(12);
  btn3 = digitalRead(11);
  sw = digitalRead(8);


  //Get the encoder value and check if the new value is different form the old one. Subsequently print diffeerent values if the new value is higher or lower than the old one
  int newPosition = myEnc.read()/4;
  if (newPosition != oldPosition) {
    if (oldPosition < newPosition){
      Serial.println("+");
    }
    else if (oldPosition > newPosition){
      Serial.println("-");
    }
    //assign to the old value the new value
    oldPosition = newPosition;
  }
  //check the value of the buttons and on click print specific value basedn on the btn pressed
  if (btn1 == 0) {
    delay(200);
    Serial.println("enter");

  }
  if (btn2 == 0) {
    delay(200);
    Serial.println("up");
  }
  if (btn3 == 0) {
    delay(200);
    Serial.println("lucky");
  }

  //Check the value of the switch. If it changes print a value
  int newSw = digitalRead(8);
  if (newSw != sw) {
    Serial.println("back");
    newSw = sw;
  }


}
