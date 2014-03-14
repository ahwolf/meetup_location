import math 
import json
import sys
 
def candMedian(dataPoints): 
 #Calculate the first candidate median as the geometric mean 
 tempX = 0.0 
 tempY = 0.0 
 
 for i in range(0,len(dataPoints)): 
	 tempX += dataPoints[i][0] 
	 tempY += dataPoints[i][1] 
 
 return [tempX/len(dataPoints),tempY/len(dataPoints)] 

# takes two points and uses the curvature of the earth to find the distance
def curv_distance(testMedian, dataPoint):
	return distance_on_unit_sphere(testMedian[0],
	                               testMedian[1],
	                               dataPoint[0],
	                               dataPoint[1])


# code swyped from http://www.johndcook.com/python_longitude_latitude.html
def distance_on_unit_sphere(lat1, long1, lat2, long2):
  # Convert latitude and longitude to 
  # spherical coordinates in radians.
  degrees_to_radians = math.pi/180.0
      
  # phi = 90 - latitude
  phi1 = (90.0 - lat1)*degrees_to_radians
  phi2 = (90.0 - lat2)*degrees_to_radians
      
  # theta = longitude
  theta1 = long1*degrees_to_radians
  theta2 = long2*degrees_to_radians
      
  # Compute spherical distance from spherical coordinates.
      
  # For two locations in spherical coordinates 
  # (1, theta, phi) and (1, theta, phi)
  # cosine( arc length ) = 
  #    sin phi sin phi' cos(theta-theta') + cos phi cos phi'
  # distance = rho * arc length
  
  cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + 
         math.cos(phi1)*math.cos(phi2))
  arc = math.acos( cos )

  # Remember to multiply arc by the radius of the earth 
  # in your favorite set of units to get length.
  r_earth = 3963.1676 # miles
  return arc*r_earth

def numersum(testMedian,dataPoint): 
 # Provides the denominator of the weiszfeld algorithm depending on whether you are adjusting the candidate x or y 
 try:
	 # return 1/math.sqrt((testMedian[0]-dataPoint[0])**2 + (testMedian[1]-dataPoint[1])**2) 
	 return 1 / curv_distance(testMedian, dataPoint)
 except ZeroDivisionError:
 	 eps = 0.000000001
 	 # return 1/(eps + math.sqrt((testMedian[0]-dataPoint[0])**2 + (testMedian[1]-dataPoint[1])**2) )
 	 return 1 / (eps + curv_distance(testMedian, dataPoint))

def denomsum(testMedian, dataPoints): 
 # Provides the denominator of the weiszfeld algorithm 
 temp = 0.0 

 for i in range(0,len(dataPoints)): 
  try:
   # temp += 1/math.sqrt((testMedian[0] - dataPoints[i][0])**2 + (testMedian[1] - dataPoints[i][1])**2) 
   temp += 1/curv_distance(testMedian, dataPoints[i])
  except ZeroDivisionError:
   eps = 0.000000001
   # temp += 1/(eps + math.sqrt((testMedian[0] - dataPoints[i][0])**2 + (testMedian[1] - dataPoints[i][1])**2) )
   temp += 1/(eps + curv_distance(testMedian, dataPoints[i]))
 return temp 
 
# def objfunc(testMedian, dataPoints): 
#  # This function calculates the sum of linear distances from the current candidate median to all points 
#  # in the data set, as such it is the objective function we are minimising. 
#  temp = 0.0 
#  for i in range(0,len(dataPoints)): 
#  	 temp += math.sqrt((testMedian[0]-dataPoints[i][0])**2 + (testMedian[1]-dataPoints[i][1])**2) 
#  return temp 
 
def get_geomedian(dataPoints):

	# Create a starting 'median' 
	testMedian = candMedian(dataPoints) 
	# print testMedian 
	 
	# numIter depends on how long it take to get a suitable convergence of objFunc 
	numIter = 100
	 
	#minimise the objective function. 
	for x in range(0,numIter): 
		 # print objfunc(testMedian,dataPoints) 
		 denom = denomsum(testMedian,dataPoints) 
		 nextx = 0.0 
		 nexty = 0.0 
		 
		 for y in range(0,len(dataPoints)): 
			 nextx += (dataPoints[y][0] * numersum(testMedian,dataPoints[y]))/denom 
			 nexty += (dataPoints[y][1] * numersum(testMedian,dataPoints[y]))/denom 
			 
		 testMedian = [nextx,nexty] 
	 
	json_median = [{"lat": testMedian[0], 
									"lon": testMedian[1],
									"city": "Geomedian approximation",
									"count":""}]
 	return json_median

# Use the above functions to calculate the median 
# Test Data - later to be read from a file 
with open(sys.argv[1], "r") as infile, open(sys.argv[2], "r") as clusterList:
	data_json = json.load(infile)
	cluster_list = json.load(clusterList)
	dataPoints = []
	first_cluster = []
	second_cluster = []
	point_counter = 0

	for datum in data_json:
		for x in range(datum["count"]):
			dataPoints.append([datum["lat"], datum["lon"]])

			if cluster_list[point_counter]:
				first_cluster.append([datum["lat"], datum["lon"]])
			else:
				second_cluster.append([datum["lat"], datum["lon"]])
			point_counter += 1

single_median = get_geomedian(dataPoints)
print "finished first median"
print cluster_list
print first_cluster
print second_cluster
double_median = get_geomedian(first_cluster) + get_geomedian(second_cluster) 

with open(sys.argv[3] +"single_centroid.json", "w") as outfile, open(sys.argv[3] + "centroids.json", "w") as outfile_dual:
	json.dump(single_median, outfile)
	json.dump(double_median, outfile_dual)

