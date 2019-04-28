src_path = "./split_data/"
main_file = "/home/yz/Dropbox/CSE578-DV/HW2/10yearAUSOpenMatches.csv"

import pandas as pd


df = pd.read_csv(main_file)
groups = df.groupby('year')

for name, group in groups:
    group.to_csv(str(name)+'.csv')


