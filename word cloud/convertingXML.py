# -*- coding: utf-8 -*-
import os
import json
from datetime import datetime
from xml.dom import minidom
import nltk
from collections import Counter
# import enchant


other_stop_words = ['1', '2', '0', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 'a', 'b', 'c',
                        'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                        'w', 'x', 'y', 'z', 'cid', '107', 'x', '1', 'al', 'et', 'rst', 'de', 'es', 'href',
                        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'li', 'https', 'com', 'one', 'would', 'also',
                        'first', 'two', 'self', 'many', 'even', 'pdf', 'see', 'better', 'ol', 'able', 'png', 'still',
                        'right', 'say', 'take', 'br', 'six', 'may', 'en', 'www', "a", "about", "above", "after", "again",
                        "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before"
                        , "being", "below", "between", "both", "but", "by", "could", "did", "do", "does",
                        "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he",
                        "her", "here", "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its",
                        "itself", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our",
                        "ours", "ourselves", "out", "over", "own", "same", "she", "she's", "should", "so", "some", "such", "than", "that",
                        "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to",
                        "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom",
                        "why",  "with", "would", "you", "your", "yours", "yourself", "yourselves"]
stopwords = set([e.lower() for e in set(nltk.corpus.stopwords.words('english'))] + other_stop_words)

def text_processing(text):
    tokenizer = nltk.tokenize.RegexpTokenizer(r'\w+')
    tok_func = lambda x: [el.lower().decode('utf-8', 'ignore') for el in tokenizer.tokenize(x) if el.lower() not in stopwords or el.isalpha()]
    text = tok_func(text)
    text = ' '.join(text)
    return text


def filter_words(corpus, name):
    s = corpus[name].split()
    c = Counter(s)
    words = dict()
    for s in c.most_common(200):
        if s[0] not in stopwords:
            words[s[0].decode('utf-8', 'ignore')] = s[1]
    with open('post_corpus_{}'.format(name) + '.json', 'w') as outfile:
        json.dump(words, outfile, indent=4, separators=(',', ':'))

def main():
    path = './ai.stackexchange.com/'
    filename = 'Posts'
    mydoc = minidom.parse(os.path.join(path, filename + '.xml'))
    tree = mydoc.getElementsByTagName("row")
    corpus = {'six':'','seven':'','eight':'','nine':'','all':''}
    for atype in tree:
        CreationDate = datetime.strptime(atype.getAttribute('CreationDate').split("T")[0], '%Y-%m-%d')
        year = CreationDate.year
        Body = atype.getAttribute('Body').encode(encoding='UTF-8', errors='strict')
        Body = text_processing(Body)
        corpus['all'] = corpus['all'] + " " + Body
        if year ==2016:
            corpus['six'] =corpus['six']+ " " + Body
        elif year ==2017:
            corpus['seven'] =corpus['seven']+ " " + Body
        elif        year == 2018:
            corpus['eight'] = corpus['eight'] + " " + Body
        elif        year == 2019:
            corpus['nine'] = corpus['nine'] + " " + Body
    filter_words(corpus, 'all')
    filter_words(corpus, 'six')
    filter_words(corpus, 'seven')
    filter_words(corpus, 'eight')
    filter_words(corpus, 'nine')


if __name__ == '__main__':
    main()