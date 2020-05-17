(function () {
  'use strict';

  const elasticsearch = require('elasticsearch');
  const sw = require('stopword');
  const natural = require('natural');


  const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

  const search = function search(index, body) {
    return esClient.search({index: index, body: body});
  };

  const removeSW = function(oldString){
    return sw.removeStopwords(oldString)
  };

  const arrToSen = function(arr){
    var s = arr.slice(0, arr.length).join(' ');
    console.log(s);
    return s
  }

  const stem = function(oldString){
    natural.PorterStemmer.attach();
    var s = oldString.tokenizeAndStem();
    return arrToSen(s);
  }

  // only for testing purposes
  // all calls should be initiated through the module
  const testRemoveSW = function test() {
    let body = {
      size: 20,
      from: 0,
      query: {
        match: {
          joke_text: {
            query: arrToSen(removeSW("How many feminists does it take to screw in a light bulb? That's not funny.".split(' ')))
          }
        }
      }
    };

    console.log(`retrieving documents whose title matches phrase '${body.query.match.joke_text.query}' (displaying ${body.size} items at a time)...`);
    search('jokes-index', body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      if (results.hits.total > 0) console.log(`returned article titles:`);
      results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.joke_text} (score: ${hit._score})`));
    })
    .catch(console.error);
  };

  const testStem = function test() {
    let body = {
      size: 20,
      from: 0,
      query: {
        match: {
          joke_text: {
            query: stem("How many feminists does it take to screw in a light bulb? That's not funny.")
          }
        }
      }
    };

    console.log(`retrieving documents whose title matches phrase '${body.query.match.joke_text.query}' (displaying ${body.size} items at a time)...`);
    search('jokes-index', body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      if (results.hits.total > 0) console.log(`returned article titles:`);
      results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.joke_text} (score: ${hit._score})`));
    })
    .catch(console.error);
  };

  // testRemoveSW();
  testStem();

  module.exports = {
    search
  };
} ());
