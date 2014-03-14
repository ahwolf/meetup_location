from pylab import plot,show
from numpy import vstack,array
from numpy.random import rand
from scipy.cluster.vq import kmeans,vq
import sys
import json

# data generation

with open(sys.argv[1], "r") as infile, open(sys.argv[2], "w") as outfile:
	geo_data = json.load(infile)
	data = [[datum["lat"],datum["lon"]] for datum in geo_data]
	np_array = array(data)

	# computing K-Means with K = 2 (2 clusters)
	centroids,_ = kmeans(np_array,2)
	centroid_json = [{"lat":x[0],"lon":x[1],"city":"Dual centroid", "count":""} for x in centroids.tolist()]
	json.dump(centroid_json, outfile)

