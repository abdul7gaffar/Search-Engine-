import nltk
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
import string
import re
nltk.download('stopwords')
nltk.download('wordnet')
import json

"""
    SEARCH ENGINE IMPLEMENTATION LOGIC:
        Step 1 - Pre-processing:
             Preprocessing to remove:
                - Remove special characters
                - Empty strings
                - Stopwords
            Words should be moved to lowercase when preprocessing

        Step 2 - Retrieval:

        Step 3 - Evaluation:

"""
vocab =[] #define vocab
good_or_bad =[] # array for good or bad joke
def remove_punctuation_and_numbers(text):
  # text = [re.sub("\d+", "", word) for word in text] # Digits are required
  text = " ".join(map(str, text))
  no_punctuation = "".join([word for word in text if word not in string.punctuation])
  return no_punctuation

def remove_stopwords(text):
  text = [word for word in text if word not in stopwords.words('english')] # accounting for all stopwords, taken from nltk
  return text

def tokenise_text(text, tokeniser):
  text = tokeniser.tokenize(text.lower()) # tokenise each text and lower the case of each word
  return text

def lemmatise_text(text,l):
  text = [l.lemmatize(word) for word in text] # resolve each word in the text to its respective lemma word
  return text

def stem_text(text, s):
  text = [s.stem(word) for word in text] # resolve each word in the text to its respective root word
  return text

#Pass in JokeText.csv to make this method build a vocabulary
def build_vocab(corpus):
    word_freq = {} #define word_freq
    #Loop through lines in corpus
    for line in corpus:
        line = line.split(',')
        text = line[1].split()
        for word in text:
            word.lower()
            word_freq[word]= word_freq.get(word, 0) + 1
    for k, v in word_freq.items():
        if v <2:
            del word_freq[k]
        else:
            vocab.append(k)
    return vocab

#use this after text tokenised and stop words removed
def is_in_vocab(text):
    toReturn = []
    for i in range(0,len(text)):
        if text[i] in vocab:
            toReturn.append(text[i])
        else:
            toReturn.append('<unk/>')

    return toReturn



def preprocess_text(text):
    tokenizer = RegexpTokenizer(r'\w+')
    stemmer = PorterStemmer()
    lemmatiser = WordNetLemmatizer()
    preprocess_text = text.lower() # make all text lower case
    preprocessed_text = remove_punctuation_and_numbers(preprocessed_text) # Remove punctuation from texts
    preprocessed_text = tokenize_text(preprocessed_text, tokenizer)
    preprocessed_text = remove_stopwords(preprocessed_text)
    preprocessed_text = is_in_vocab(preprocessed_text) # replace all words not in vocab with unk token
    preprocessed_text = lemmatise_text(preprocessed_text, lemmatiser)
    preprocessed_text = stem_text(preprocessed_text, stemmer)
    return preprocessed_text

# Feed jokes.json in here
def rank_jokes():
    jokes = urllib2.urlopen('jokes')
    wjson = joke.read()
    data = json.loads(wjson)
    good_or_bad = [] # stores 0 or 1, 0 is bad 1 is good
    for d in data:
        if d['avg_rating'] < 0:
            good_or_bad.append(0)
        else:
            good_or_bad.append(1)


def main():
    print("Enter Query: ")
    query = str(Input())
    preprocessed_query = preprocess_text(query)

if __name__ == '__main__':
    main()
