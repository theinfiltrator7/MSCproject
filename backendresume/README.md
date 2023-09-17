## installation instructions

In the backendresume folder Run the following commands:
1.	`pip install resume-parser`
2.	`pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-2.3.1/en_core_web_sm-2.3.1.tar.gz`
3.	`pip install importlib-metadata==3.2.0`
4.	`python -m spacy download en_core_web_sm`
5.	`python -m nltk.downloader stopwords `
6.	`python -m nltk.downloader punkt `
7.	`python -m nltk.downloader averaged_perceptron_tagger`
8.	`python -m nltk.downloader universal_tagset`
9.	`python -m nltk.downloader wordnet`
10.	`python -m nltk.downloader brown`
11.	`python -m nltk.downloader maxent_ne_chunker`

Once all the packages are installed run `python app.py`