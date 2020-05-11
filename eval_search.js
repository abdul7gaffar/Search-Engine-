(function () {
    'use strict';
  
    const elasticsearch = require('elasticsearch');
    const sw = require('stopword');
    const natural = require('natural');
    const lem = require('lemmatizer');
  
  
    const esClient = new elasticsearch.Client({
      host: '127.0.0.1:9200',
      log: 'error'
    });
  
    const search = function search(index, body) {
      return esClient.rankEval({index: index, body: body});
    };

  
    // only for testing purposes
    // all calls should be initiated through the module
  
    const testLem = function test() {
      let body = {
        requests: [
        {
            id: "query_1",
            request: { query: { match: { joke_text: "funny" }}},
            ratings: [{ _index: "my_index", _id: 'doc1', "rating": 1 }]
        }],
        metric: {
           dcg: {
                k : 20,
                normalize: false
           }
        }
    }
  
      console.log(`retrieving evaluation for '${body.request}' (displaying ${body.size} items at a time)...`);
      search('jokes-index', body)
      .then(results => {
        console.log("\n")
        console.log("Unrated Documents\n")
        results.details.query_1.unrated_docs.forEach((hit, index) => console.log(`\t${hit._index} - ${hit._id}`));
        console.log("Rated documents")
        results.details.query_1.hits.forEach((hit, index) => console.log(`\t${hit.hit._id} - ${hit.hit._type} - ${hit.hit._score}`));
      
      })
      .catch(console.error);
    };
  
    testLem();
  
    module.exports = {
      search
    };
  } ());
  