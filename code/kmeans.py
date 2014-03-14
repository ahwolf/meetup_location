from pylab import plot,show
from numpy import vstack,array
from numpy.random import rand
from scipy.cluster.vq import kmeans,vq
import sys
import json

# data generation the outfile is called list_of_clusters.json for the
# kmeans clustering algorithm giving two clusters, for the dual
# centroids.


with open(sys.argv[1], "r") as infile, open(sys.argv[2], "w") as outfile:
	geo_data = json.load(infile)

	data = []
	for datum in geo_data:
		for x in range(datum["count"]):
			data.append([datum["lat"], datum["lon"]])

	np_array = array(data)

	# computing K-Means with K = 2 (2 clusters)
	centroids,_ = kmeans(np_array,2)
	# get the actual clusters.  vq is a numpy array of 0's and 1's
	# with the classification for each point.
	list_of_clusters, _distances = vq(np_array, centroids)
	json.dump(list_of_clusters.tolist(), outfile)
