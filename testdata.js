//var mongojs = require('mongojs');
//var db = require("mongojs").connect("promo", "tags");
//var coll = db.collection("tags");

/*
db.tags.find(function(err, doc){
	console.log(doc);
} );*/

//db.coll.find({}, function(err, docs){});


var databaseUrl = "promo"; // "username:password@example.com/mydb"
var collections = ["tags", "analytics", "filters"];
var db = require("mongojs").connect(databaseUrl, collections);
var faker = require("faker");
var q = require("q");

//db.tags.find(function(error, docs){

//});

//create tags
// for (i=0; i<20;i++){db.tags.save({code: "tcode-" + faker.random.number(100).toString(), description:"tag-" + faker.Lorem.words(1)})};

//create filters
// for (i=0; i<20;i++){db.filters.save({code: "fcode-" + faker.random.number(100).toString(), description:"filter-" + faker.Lorem.words(1)})};

// create analytics


	// db.tags.find({}).limit(-1).skip(faker.random.number(3)).limit(4,
	// 	function(err, doc){ 

	// 		console.log(err);
	// 		for (i=0; i<20;i++){
	// 			db.analytics.save(
	// 				{
	// 					name: "analytic-" + faker.random.number(100).toString()
	// 					, description: faker.Lorem.sentence(1)
	// 					, status: faker.Helpers.randomize(["Completed","Pending", "Active"])
	// 					, tags: [doc]
	// 					, lastUpdated: faker.Date.recent(5)
	// 					, lastUserUpdated: faker.Name.findName()
	// 				}
	// 			);
	// 		};
	// 	}
	// );


	function GetRandomTag(){
		var d = q.defer();
		var ts = db.tags.find({}).limit(-1).skip(faker.random.number(3)).limit(4,
			function(err, doc){
				d.resolve(doc);
				
			}
		);
		return d.promise;
	}

	function GetRandomFilter(){
		var d = q.defer();
		var ts = db.filters.find({}).limit(-1).skip(faker.random.number(3)).limit(4,
					function(err, doc){
						d.resolve(doc);
					}
				);
		return d.promise;
	}

	function SaveAnalytic(tags, filters){

		return db.analytics.save(
			{
				name: "analytic-" + faker.random.number(100).toString(),
				description: faker.Lorem.sentence(1),
				status: faker.Helpers.randomize(["Completed","Pending", "Active"]),
				tags: tags,
				filters: filters,
				lastUpdated: faker.Date.recent(5),
				lastUserUpdated: faker.Name.findName()
			});
	}

	// return getUsername()
	 //    .then(function (username) {
	 //        return getUser(username);
	 //    })
	 //    // chained because we will not need the user name in the next event
	 //    .then(function (user) {
	 //        return getPassword()
	 //        // nested because we need both user and password next
	 //        .then(function (password) {
	 //            if (user.passwordHash !== hash(password)) {
	 //                throw new Error("Can't authenticate");
	 //            }
	 //        });
	 //    });

	// for (i=0; i<20;i++){
	// 	var r = GetRandomTag()
	//     .then(function (tags) {
	//         return GetRandomFilter()
	//         // nested because we need both user and password next
	//         .then(function (filters) {
	//         	return SaveAnalytic(tags, filters);
	//         });
	//     })
	//     .fail(function(err){
	//     	console.log(err);
	//     });
	// };

	GetRandomTag()
		.then(function(tags){

			console.log(tags);
			return GetRandomFilter()
			.then(function(filters){
				console.log(filters);
				return SaveAnalytic(tags,filters);
			});



		})
		.fail(function(err){console.log(err);});
		

	//db.tags.find({}).toArray(), function(err, doc){});

	//.next().description;

	// db.analytics.save(
	// 	{
	// 		name: "analytic-" + faker.random.number(100).toString()
	// 		,description: faker.Lorem.sentence(1)
	// 		, status: faker.Helpers.randomize(["Completed","Pending", "Active"])
	// 		, tags: d
	// 	}
	// )};



/*
db.tags.save({name:"tag1", description:"description1"},
function(err, doc)
{if( err  ) console.log("not saved");
  else console.log("saved");
  console.log(doc);}
);
*/



// db.analytics.find({}).forEach(function(err, doc) {
//     if (!doc) {
//         // we visited all docs in the collection
//         return;
//     }
//     // doc is a document in the collection
//     console.log(doc);
// });



//process.exit(1);