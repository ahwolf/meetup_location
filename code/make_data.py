import json
import sys

with open(sys.argv[1], "r") as datafile, open(sys.argv[2], "w") as outfile:
	data = json.load(datafile)
	data_string = "var data = " + json.dumps(data) + ";"
	outfile.write(data_string)