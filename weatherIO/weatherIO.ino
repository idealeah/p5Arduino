int buttonPin = 7;
int ledPin = 6;
int sensorPin = A0;
int inByte = 0;         // incoming serial byte    

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  establishContact();  // send a byte to establish contact until receiver responds
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop() {

  if (Serial.available() > 0) {
    // get incoming byte:
    inByte = Serial.read();
  }

  digitalWrite(ledPin, inByte);
  
   // read the input on analog pin 0:
   int buttonValue = digitalRead(buttonPin);
   int sensorValue = analogRead(sensorPin);
   // print out the value you read:
   Serial.println(buttonValue);
   Serial.println(sensorValue);
   Serial.println(inByte); //we'll echo this in p5 for debugging
   delay(10);        // delay in between reads for stability
}

void establishContact() {
  while (Serial.available() <= 0) {
    Serial.println('A');   // send a capital A
    delay(300);
  }
}
