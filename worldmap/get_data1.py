import json
import pycountry

year = 2014
mapping = {country.alpha_3: country.alpha_2 for country in pycountry.countries}

# print mapping.get("ESP")
data = [["ESP",21],["SUI",3],["USA",28],["FRA",29],["ARG",13],["SRB",6],["CHI",3],["GBR",3],["CRO",7],["CYP",1],["CZE",11],["AUT",3],["RUS",10],["ISR",2],["GER",15],["BIH",2],["TPE",2],["LUX",1],["ROU",2],["LAT",1],["UZB",1],["ITA",8],["AUS",15],["POL",3],["COL",2],["KAZ",3],["UKR",4],["BRA",3],["TUR",1],["FIN",1],["IRL",1],["SVK",5],["CAN",4],["SWE",5],["LTU",1],["JPN",4],["NED",4],["BEL",5],["SLO",2],["BUL",1],["POR",2],["RSA",3],["IND",1],["MAR",1],["THA",2],["MON",1],["ARM",1],["PER",1],["BLR",1],["ECU",1],["KOR",1]]
out = {}

for d in data:
  out[mapping.get(d[0])] = str(d[1])

with open('countriesPlayers'+str(year)+'.js', 'w') as outfile:
  json.dump(out, outfile, indent=2, separators=(',', ':'))

"""
Ref:
https://stackoverflow.com/questions/49728033/python-remove-spaces-between-key-and-values-from-dictionary-object
https://stackoverflow.com/questions/12943819/how-to-prettyprint-a-json-file
https://stackoverflow.com/questions/16253060/how-to-convert-country-names-to-iso-3166-1-alpha-2-values-using-python
https://stackoverflow.com/questions/40628490/get-country-code-using-pycountry-from-a-user-input
"""