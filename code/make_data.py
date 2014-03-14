import json
import sys

with open(sys.argv[1], "r") as datafile, \
		 open(sys.argv[2] + "centroids.json", "r") as centroidfile, \
		 open(sys.argv[2] + "single_centroid.json", "r") as singleCentroidfile, \
		 open(sys.argv[3], "w") as outfile:
	data = json.load(datafile)
	centroid = json.load(centroidfile)
	single_centroid = json.load(singleCentroidfile)
	data_string = "var data = " + json.dumps(data) + ";\n"
	double_centroid_string = "var centroid = " + json.dumps(centroid)  + ";\n"
	single_centroid_string = "var single_centroid = " + json.dumps(single_centroid) + ";"
	outfile.write(data_string)
	outfile.write(double_centroid_string)
	outfile.write(single_centroid_string)	
