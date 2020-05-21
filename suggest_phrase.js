(function () {
  'use strict';

  const elasticsearch = require('elasticsearch');
  const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

  const suggest = function search(index, body) {
    return esClient.suggest({index: index, body: body});
  };

  // only for testing purposes
  // all calls should be initiated through the module
  const test = function test() {
    let body = {
      text: "What's the difference between the government",
      bodySuggester: {
        phrase: {
          field: 'body'
        }
      }
    };

    console.log(`retrieving phrase suggestions for "${body.text}"...`);
    suggest('joke-index', body)
    .then(results => {
      console.log(`suggestions for the phrase are:`);
      results.bodySuggester.forEach(phrase => {
        console.log(`phrase: ${phrase.text}`);
        phrase.options.forEach((option, index) => console.log(`\t suggestion ${++index}: ${option.text}`));
      });
    })
    .catch(console.error);
  };

  test();

  module.exports = {
    suggest
  };
} ());
