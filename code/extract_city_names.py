import csv
from collections import defaultdict
from geopy.geocoders import GoogleV3
# from geopy import geocoders
from pygeocoder import Geocoder, GeocoderError
import json
import time
import sys

city_names = defaultdict(int)
# geolocator = GoogleV3(api_key="AIzaSyClLu_5RkJwJYCLFiAA6BQzRUEy_pu9hns")

# us = geocoders.GeocoderDotUS() 
# yahoo = geocoders.Yahoo("hu3TPMPV34HebqCq0d_yLvFKJeTXmlRYgjD02c83skA6Ya50Czy9O7khq0E6dT1xnguw")

with open("data/meetup.csv", "r") as datafile:
  reader = csv.reader(datafile)
  header = reader.next()
  aaron = reader.next()
  for row in reader:
		city_names[row[4]] +=1


geolocations = []
for city, count in city_names.iteritems():  
  try:
	  result = Geocoder.geocode(city)
  except GeocoderError:
  	time.sleep(1)
  print city, result[0].coordinates
  address_dict = {
      "city": city,
      "lat": result[0].coordinates[0],
      "lon": result[0].coordinates[1],
      "count": count
  }
  geolocations.append(address_dict)

# now we wantto dump to file
with open(sys.argv[1], "w") as jsonFile:
	json.dump(geolocations, jsonFile)


          
