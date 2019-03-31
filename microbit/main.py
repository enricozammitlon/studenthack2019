"""
This code is written to be compiled by the online microbit code editor.
As a result, the package is entirely in one .py file. The code is not
intended to be run in any other scenario and will therefore likely throw
NameErrors if run on most machines.

Command structure:
First character: C (command), A (assign), or R (response)
Second character: Button press requested or received (A or B)
Remaining characters: Player code for intended/active player for each
command.
"""

import microbit
import radio
import random

radio.config(group=112)
radio.on()

class DummyButton():
    def was_pressed(self):
        return False

A_B = ["A","B"]

BUTTON_DICT = {"A": microbit.button_a,
               "B": microbit.button_b,
               None: DummyButton()}

button_to_press = None
_id = None

while True:            
    incoming = radio.receive()  # Check radio for data
    if incoming:  # If message is received
        if incoming[0] == "A" and microbit.button_a.is_pressed()\
            and microbit.button_b.is_pressed():
            _id = incoming[1:]
        if incoming[0] == "C" and incoming[2:] == _id:
            button_to_press = incoming[1]


    if BUTTON_DICT[button_to_press].was_pressed():
        microbit.display.show(microbit.Image.HAPPY)
        microbit.sleep(100)
        radio.send("R" + button_to_press)
