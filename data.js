//require the Elasticsearch librray
const elasticsearch = require('elasticsearch');
// instantiate an Elasticsearch client
const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});
// ping the client to be sure Elasticsearch is up
// client.ping({
//      requestTimeout: 30000,
//  }, function(error) {
//  // at this point, eastic search is down, please check your Elasticsearch service
//      if (error) {
//          console.error('Elasticsearch cluster is down!');
//      } else {
//          console.log('Everything is ok');
//      }
//  });

//  // create a new index called jokes-. If the index has already been created, this function fails safely
// client.indices.create({
//     index: 'jokes-index'
// }, function(error, response, status) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("created a new index", response);
//     }
// });

// require the array of cities that was downloaded
const jokes = require('./jokes.json');
// declare an empty array called bulk
var bulk = [];
//loop through each jokes and create and push two objects into the array in each loop
//first object sends the index and type you will be saving the data as
//second object is the data you want to index
jokes.forEach(jokes =>{
   bulk.push({index:{ 
                 _index:'jokes-index', 
                 _type:'jokes',
             }          
         })
  bulk.push(jokes)
})
//perform bulk indexing of the data passed
client.bulk({body:bulk}, function( err, response  ){ 
         if( err ){ 
             console.log("Failed Bulk operation".red, err) 
         } else { 
             console.log("Successfully imported %s".green, jokes.length); 
         } 
}); 