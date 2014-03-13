import csv

with open("data/meetup.csv", "r") as datafile:
	reader = csv.reader(datafile)
	header = reader.next()
	for row in reader:
		print row[4]