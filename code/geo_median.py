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
 
def numersum(testMedian,dataPoint): 
 # Provides the denominator of the weiszfeld algorithm depending on whether you are adjusting the candidate x or y 
 return 1/math.sqrt((testMedian[0]-dataPoint[0])**2 + (testMedian[1]-dataPoint[1])**2) 
 
 
def denomsum(testMedian, dataPoints): 
 # Provides the denominator of the weiszfeld algorithm 
 temp = 0.0 
 for i in range(0,len(dataPoints)): 
	 temp += 1/math.sqrt((testMedian[0] - dataPoints[i][0])**2 + (testMedian[1] - dataPoints[i][1])**2) 
 return temp 
 
def objfunc(testMedian, dataPoints): 
 # This function calculates the sum of linear distances from the current candidate median to all points 
 # in the data set, as such it is the objective function we are minimising. 
 temp = 0.0 
 for i in range(0,len(dataPoints)): 
 	temp += math.sqrt((testMedian[0]-dataPoints[i][0])**2 + (testMedian[1]-dataPoints[i][1])**2) 
 return temp 
 
# Use the above functions to calculate the median 
# Test Data - later to be read from a file 
with open(sys.argv[1], "r") as infile:
	data_json = json.load(infile)
	dataPoints = []
	for datum in data_json:
		for x in range(datum["count"]):
			dataPoints.append([datum["lat"], datum["lon"]])


 # Data read from dbf file exported, and randomly offset, from ArcGIS 9.3
# dataPoints = [] 


# Create a starting 'median' 
testMedian = candMedian(dataPoints) 
print testMedian 
 
# numIter depends on how long it take to get a suitable convergence of objFunc 
numIter = 100
 
#minimise the objective function. 
for x in range(0,numIter): 
	 print objfunc(testMedian,dataPoints) 
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
 
with open(sys.argv[2], "w") as outfile:
	json.dump(json_median, outfile)
