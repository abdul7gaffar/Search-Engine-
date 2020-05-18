(function () {
  'use strict';

  const elasticsearch = require('elasticsearch');
  const sw = require('stopword')

  const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

  const search = function search(index, body) {
    return esClient.search({index: index, body: body});
  };

  // only for testing purposes
  // all calls should be initiated through the module
  const test = function test() {
    let body = {
      size: 20,
      from: 0,
      query: {
        multi_match: {
          query: 'Bradford',
          fields: ['title', 'authors.*name'],
          minimum_should_match: 3,
          fuzziness: 2
        }
      }
    };

    console.log(`retrieving documents whose jokes match '${body.query.multi_match.query}' (displaying ${body.size} items at a time)...`);
    search('jokes-index', body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      if (results.hits.total > 0) console.log(`returned joke text:`);
      results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.joke_text} (score: ${hit._score})`));
    })
    .catch(console.error);
  };

  test();

  module.exports = {
    search
  };
} ());
