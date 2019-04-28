my_data <- read.csv(file="/home/yz/Documents/Data-Visualization-master/2014.csv", header=TRUE, sep=",")

install.packages("data.table")
library(data.table)
nn <- setDT(my_data)[, .(count = uniqueN(player1)), by = country1]

library(jsonlite)
print(toJSON(nn, dataframe="values"))

