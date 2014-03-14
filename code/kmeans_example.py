from pylab import plot,show
from numpy import vstack,array
from numpy.random import rand
from scipy.cluster.vq import kmeans,vq

# data generation

with open(sys.argv[1], "r") as infile, open(sys.argv[2], "w") as outfile:
	geo_data = json.load(infile)
	data = [[datum["lat"],datum["lon"]] for datum in geo_data]
	print data
	np_array = array(data)
	print np_array
# vstack((rand(150,2) + array([.5,.5]),rand(150,2)))
import pdb; pdb.set_trace()
# computing K-Means with K = 2 (2 clusters)
centroids,_ = kmeans(data,2)
# assign each sample to a cluster
idx,_ = vq(data,centroids)

# some plotting using numpy's logical indexing
plot(data[idx==0,0],data[idx==0,1],'ob',
     data[idx==1,0],data[idx==1,1],'or')
plot(centroids[:,0],centroids[:,1],'sg',markersize=8)
show()