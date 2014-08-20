//var mongojs = require('mongojs');
//var db = require("mongojs").connect("promo", "tags");
//var coll = db.collection("tags");

/*
db.tags.find(function(err, doc){
	console.log(doc);
} );*/

//db.coll.find({}, function(err, docs){});


//var databaseUrl = "promo"; // "username:password@example.com/mydb"
var databaseUrl = "mongodb://promoUser:aplpromoter@ds027829.mongolab.com:27829/promo";

var collections = ["analytics", "filters"];
var db = require("mongojs").connect(databaseUrl, collections);
var faker = require("faker");
var q = require("q");
var driverTypes = ["Movement", "Markup", "DaysOnHand", "DaysLeadTime", "InStockRatio", "SalesTrendRatio"];
var mode = ["Auto", "Manual"];

var priceListTypes = ["Cost", "Retail", "Distributor 1", "Distributor 2"];
var priceListMode = ["Global", "GlobalPlus", "Cascade", "Single" ];

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


	function GetRandomTag(skipcount){
		var d = q.defer();
		var ts = db.tags.find({}).limit(-1).skip(faker.random.number(40)).limit(3,
			function(err, docs){
				// console.log(docs);
				d.resolve(docs);
				
			}
		);
		return d.promise;
	}

	function GetRandomFilter(){
		var d = q.defer();
		var ts = db.filters.find({}).limit(-1).skip(faker.random.number(20)).limit(4,
					function(err, docs){
						//add this to filter lookup master then project IsSelected
						var types = ["VendorCode","ProductCode", "SupplierCode"];
						var filterList = [];
						for (var i = 0; i < 3; i++) {
							filterList.push({"type": types[i],
							items:docs});

						}



						d.resolve(filterList);
					}
				);
		return d.promise;
	}

	function FakeGroupsItems(numberOfGroups) {
		var d = q.defer();

		var groupLineItems = [];
		for (var i = 0; i < numberOfGroups; i++) {
			groupLineItems.push(
				{
					LineItemId : i,
					Group : "Group" + i,
					SkuCount : faker.random.number(1000),
					Min : 1,
					Max : faker.random.number(100),
					SalesValue : faker.random.number(100000)
				}

			);
		}

		console.log(groupLineItems);
		d.resolve(groupLineItems);
		return d.promise;

	}

	function CreateDriverSet(lines){
		var d = q.defer();
		var drivers = [];

		for (var i = 0; i < 6; i++) {

			for (var j = 0; j < 2; j++) {
				drivers.push(
				{
					type: driverTypes[i],
					mode: mode[j],
					groups: lines
				});
			}
		}
		console.log(drivers);
		d.resolve(drivers);
		return d.promise;
	}

	function FakePriceListsForAnalytic(){
		var d = q.defer();
		var pricelists = [];  
		for (var i = 0; faker.random.number(4); i++) {
			pricelists.push(
					{
						SortId : i,
						Type: faker.Helpers.randomize(priceListTypes),
						Code: "pricelist-" + faker.random.number(100),
						Description: faker.Lorem.sentence(1),
						IsKey : false
					}
			);

		}

		console.log(pricelists);
		d.resolve(pricelists);
		return d.promise;	
		
	}

	function FakeSchemesWithPriceLists(lists){

		var d = q.defer();
		var schemes = [];

		for (var j = 0; j < getRandomInt(1,4); j++) {
			schemes.push(
					{ 
						PricingMode : priceListMode[j],
						PriceLists : lists
					}

			);
		}
		console.log(schemes);
		d.resolve(schemes);
		return d.promise;
	}

	function SaveAnalytic(filters, drivers, schemes){

		db.analytics.save(
			{
				name: "analytic-" + faker.random.number(100).toString(),
				description: faker.Lorem.sentence(1),
				status: faker.Helpers.randomize(["Completed","Pending", "Active"]),
				tags: [],
				drivers: drivers,
				filters: filters,
				pricelists : schemes,
				lastUpdated: faker.Date.recent(5),
				lastUserUpdated: faker.Name.findName()
			}, function(err, saved){

					// console.log(err);
					 db.analytics.update({},
	                    { $addToSet: { tags: { $each: [ 
	                    	"tag-" + faker.Lorem.words(1)
	                    	] 
	                    } } },{"multi":true, "upsert":true} ,

	                  function(err, updated){
	                  	if (err) console.log(err);


	                  });

				
			});


	}

	function UpdateTags(){
		// for (var i = 0; i < faker.random.number(20); i++) {
					 db.analytics.update({},
	                    { $addToSet: { tags: { $each: [ 
	                    	"tag-" + faker.Lorem.words(1), "tag-" + faker.Lorem.words(1), "tag-" + faker.Lorem.words(1), "tag-" + faker.Lorem.words(1)
	                    	] 
	                    } } }, {"multi":true, "upsert":true} ,

	                  function(err, updated){console.log(err);});
		// }
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start(count) {


	 // return GetRandomTag(count)
		// .then(function(tags){

			// console.log(tags);
		return FakePriceListsForAnalytic()
			.then (function(lists){
				return FakeSchemesWithPriceLists(lists)			
					.then (function(schemes){
						return GetRandomFilter()
							.then (function(filters){
								return FakeGroupsItems(faker.random.number(5))
									.then (function(lines){
										return CreateDriverSet(lines)
										.then(function(drivers){
											return SaveAnalytic(filters, drivers, schemes);
										
									});
							});
						});
					});

			})

		// })
		.fail(function(err){console.log(err);})
		// .fin(UpdateTags())
		;

}

var ps= [];
	for (i=0; i<10;i++){
		ps.push(start(i));


	}

	q.allSettled(ps); 

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