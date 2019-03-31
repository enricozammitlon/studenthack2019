import serial
import time

device = serial.Serial('/dev/sda', 115200)

device.write("A1")
device.write("CA1")

time.sleep(1)

print(device.read(100)

device.close()
