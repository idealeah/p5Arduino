int buttonPin = 7;
int sensorPin = A0;
int ledPin = 6;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  for (int inByte = 0; inByte < 256; inByte++) {
    Serial.write(inByte);
    analogWrite(ledPin, inByte);
  }
}
