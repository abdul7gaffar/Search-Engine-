(function () {
  'use strict';

  const fs = require('fs');
  const sw = require('stopword')
  const elasticsearch = require('elasticsearch');
  const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

  // =================================================
  //          FRONT END DEVELOPMENT CONNECTION
  // =================================================
  
  //require Express
  const express = require( 'express' );
  // instanciate an instance of express and hold the value in a constant called app
  const app     = express();
  //require the body-parser library. will be used for parsing body requests
  const bodyParser = require('body-parser')
  //require the path library
  const path    = require( 'path' );
  
  // use the bodyparser as a middleware  
  app.use(bodyParser.json())
  // set port for the app to listen on
  app.set( 'port', process.env.PORT || 3001 );
  // set path to serve static files
  app.use( express.static( path.join( __dirname, 'public' )));
  // enable CORS 
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // defined the base route and return with an HTML file called tempate.html
  app.get('/', function(req, res){
    res.sendFile('template.html', {
       root: path.join( __dirname, 'views' )
     });
  })

  const removeSW = function(oldString){
    return sw.removeStopwords(oldString)
  };

  const search = function search(index, body) {
    return esClient.search({index: index, body: body});
  };

  app.get('/search', function (req, res){
    // declare the query object to search elastic search and return only 200 results from the first result found. 
    // also match any data where the name is like the query string sent in
    let body = {
      size: 200,
      from: 0, 
      query: {
        match: {
          joke_text: {
            query: req.query['q']
          }
        }
      }
    }
    // esClient.search({index:'jokes-index',  body:body, type:'jokes_list'})
    // .then(results => {
    //   res.send(results.hits.hits);
    //   console.log("££££££££££££" + results.hits.hits);
    // })
    // .catch(err=>{
    //   console.log(err)
    //   res.send([]);
    // });
    
    console.log(`retrieving documents whose title matches phrase '${body.query.match.joke_text.query}' (displaying ${body.size} items at a time)...`);
    search('jokes-index', body)
    .then(results => {
      res.send(results.hits.hits);
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      if (results.hits.total > 0) console.log(`returned article titles:`);
      results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.joke_text} (score: ${hit._score})`));
    })
    .catch(console.error);
    // perform the actual search passing in the index, the search query and the type
    // client.search({index:'jokes-index',  body:body, type:'jokes_list'})
    // .then(results => {
    //   res.send(results.hits.hits);
    // })
    // .catch(err=>{
    //   console.log(err)
    //   res.send([]);
    // });

  })
  // listen on the specified port
  app .listen( app.get( 'port' ), function(){
    console.log( 'Express server listening on port ' + app.get( 'port' ));
  } );


  // =================================================
  //          INPUT DATA INTO ELASTICSEARCH
  // =================================================

  // const bulkIndex = function bulkIndex(index, type, data) {
  //   let bulkBody = [];

  //   data.forEach(item => {
  //     bulkBody.push({
  //       index: {
  //         _index: index,
  //         _type: type,
  //         _id: item.id
  //       }
  //     });

  //     bulkBody.push(item);
  //   });

  //   esClient.bulk({body: bulkBody})
  //   .then(response => {
  //     let errorCount = 0;
  //     response.items.forEach(item => {
  //       if (item.index && item.index.error) {
  //         console.log(++errorCount, item.index.error);
  //       }
  //     });
  //     console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
  //   })
  //   .catch(console.err);
  // };

  // only for testing purposes
  // all calls should be initiated through the module
  // const test = function test() {
  //   const articlesRaw = fs.readFileSync('data.json');
  //   const articles = JSON.parse(articlesRaw);
  //   console.log(`${articles.length} items parsed from data file`);
  //   bulkIndex('jokes-index', 'joke', articles);
  // };

  // test();

  // module.exports = {
  //   bulkIndex
  // };
} ());
