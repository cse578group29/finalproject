# from cStringIO import StringIO
# from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
# from pdfminer.converter import TextConverter
# from pdfminer.layout import LAParams
# from pdfminer.pdfpage import PDFPage
# import os
import nltk
import numpy as np
# from sklearn.feature_extraction.text import CountVectorizer
from collections import Counter
import pandas as pd
import datetime
#nltk.download('stopwords')

def key_words():
    tokenizer = nltk.tokenize.RegexpTokenizer(r'\w+')
    other_stop_words = ['1', '2', '0', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 'a', 'b', 'c',
                        'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                        'w', 'x', 'y', 'z', 'cid', '107','x', '1', 'al', 'et', 'rst', 'de',  'es','href',
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    stopwords = set([e.lower() for e in set(nltk.corpus.stopwords.words('english'))] + other_stop_words)
    tok_func = lambda x: [el.lower() for el in tokenizer.tokenize(x) if el.lower() not in stopwords]
    path = 'D:/stackoverflow/stackoverflow/corpus/'
    for year in ['2016', '2017', '2018']:
        df = pd.read_csv(path + '{}.csv'.format(year))
        words = []
        for i in range(len(df['Title'])):
            words.append(tok_func(df['Title'][i]) + tok_func(df['Body'][i]) + tok_func(df['Tags'][i]))
        words = [y for x in words for y in x]
        counts = Counter(words).most_common(500)
        with open("{}/words/{}_stack_overflow.txt".format(path, year), "w") as f:
            for (word, freq) in counts:
                f.write(word + '\n')
            f.close()
        with open("{}/frequency/{}_stack_overflow_freq.txt".format(path, year), "w") as f:
            for (word, freq) in counts:
                f.write(word + ' {}'.format(freq) + '\n')
            f.close()


def small_topics():
    topics = [['networks', 'network', 'deep', 'neural', 'layer', 'convolutional', 'image'],
              ['optimization', 'algorithm'],
              ['nlp', 'language', 'natural', 'processing', 'process'],
              ['reinforcement'],
              ['driving', 'robotics', 'bots', 'cars', 'self'],
              ['history'],
              ['gaming']]
    area = np.array(['deep learning', 'optimization', 'nlp', 'reinforcement learning', 'self-drving or robotics', 'history', 'gaming', 'others'])
    tokenizer = nltk.tokenize.RegexpTokenizer(r'\w+')
    other_stop_words = ['1', '2', '0', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 'a', 'b', 'c',
                        'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                        'w', 'x', 'y', 'z', 'cid', '107', 'x', '1', 'al', 'et', 'rst', 'de', 'es', 'href',
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    stopwords = set([e.lower() for e in set(nltk.corpus.stopwords.words('english'))] + other_stop_words)
    tok_func = lambda x: [el.lower() for el in tokenizer.tokenize(x) if el.lower() not in stopwords]
    # path = 'D:/stackoverflow/stackoverflow/corpus'
    # path = '/Users/Lecheng/Dropbox/CSE/CSE578/project'
    path = 'D:/stackoverflow/Data/posts.csv'
    # for year in ['2016', '2017', '2018']:
    df = pd.read_csv(path)
    # for year in ['2016', '2017', '2018']:
    dates = pd.to_datetime(df['CreationDate'] )
    for i in range(len(dates)):
        y = dates[i].year
        m = dates[i].month

        dates[i] = datetime.date(y, m, 1)
    monthrange = dates.unique()



    print(dates.max())
   # daterange = pd.date_range(start=dates.min(),end=dates.max())
    #monthrange=[]


    npdata = np.zeros((len(monthrange),8,5))


    for i in range(len(df['Title'])):
        tags = tok_func(df['Tags'][i])
#        current_month = datetime.datetime.strftime(i, '%Y-%m')
        timeindex = int(np.floor((dates[i] - dates.min()).days/30))
        #print(tags)
        for word in tags:
            flags = False
            for j in range(len(topics)):
                topic = topics[j]
                if word in topic:


                    npdata[timeindex,j,0] +=1
                    npdata[timeindex,j, 1] += df['ViewCount'][i]
                    npdata[timeindex,j, 2] += df['AnswerCount'][i]
                    npdata[timeindex,j, 3] += df['FavoriteCount'][i]
                    npdata[timeindex,j, 4] += df['Score'][i]

                    flags = True
            # if the question is not classified in any small topics, then put it to 'others' category
            if not flags:
                npdata[timeindex, 7, 0] += 1
                npdata[timeindex, 7, 1] += df['ViewCount'][i]
                npdata[timeindex, 7, 2] += df['AnswerCount'][i]
                npdata[timeindex, 7, 3] += df['FavoriteCount'][i]
                npdata[timeindex, 7, 4] += df['Score'][i]

    # save data in a csv file
    data = np.zeros((8, 5), dtype=np.int32)


    npdata = npdata.reshape((len(monthrange)*8,5))
    daterange = pd.to_datetime(monthrange,format="%m/%d/%Y")
    #daterange = pd.to_datetime(daterange).apply(lambda x: x.strftime('%m/%d/%Y'))

    print(daterange.repeat(8).shape,np.tile(area, len(daterange)).shape,npdata.shape)
    #data = np.concatenate([np.array(daterange.repeat(8)).reshape(-1,1),np.tile(area, len(daterange)).reshape(-1,1), npdata], axis=1)
    data = {"date": daterange.repeat(8),'topics':np.tile(area, len(daterange)),
            'topic_count':npdata[:,0], 'view_count':npdata[:,1],  'answer_count':npdata[:,2], 'favorite_count':npdata[:,3], 'score':npdata[:,4]}
    df = pd.DataFrame(data)
    df.to_csv("D:/stackoverflow/JS/statistics.csv")


if __name__ == '__main__':
    small_topics()