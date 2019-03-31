"""
This code is written to be compiled by the online microbit code editor.
As a result, the package is entirely in one .py file. The code is not
intended to be run in any other scenario and will therefore likely throw
NameErrors if run on most machines.

Command structure:
First character: C (command) or R (response)
Second character: Button press requested or received (A or B)
Remaining characters: Player code for intended/active player for each
command.
"""

import microbit
import radio

radio.config(group=112)
radio.on()


