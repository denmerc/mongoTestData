var databaseUrl = "promo"; // "username:password@example.com/mydb"
// var databaseUrl = "";
var collections = ["tags", "analytics", "filters", "drivers"];
var db = require("mongojs").connect(databaseUrl, collections);
var faker = require("faker");
var q = require("q");

//lookup for value driver type
var drivers = ["Movement", "Markup", "DaysOnHand", "DaysLeadTime", "InStockRatio", "SalesTrendRatio"];
var mode = ["Auto", "Manual"];

var priceListTypes = ["Cost", "Retail", "Distributor 1", "Distributor 2"];
var priceListMode = ["Global", "GlobalPlus", "Cascade", "Single" ];
//create tags
// for (i=0; i<20;i++){db.tags.save({code: "tcode-" + faker.random.number(100).toString(), description:"tag-" + faker.Lorem.words(1)})};

//create filters
// for (i=0; i<20;i++){db.filters.save({code: "fcode-" + faker.random.number(100).toString(), description:"filter-" + faker.Lorem.words(1)});}

//option - master price list


function FakePriceListsForAnalytic(){
	var d = q.defer();
	var pricelists = [];  var schemes = [];
	for (var i = 0; faker.random.number(); i++) {
		pricelists.push(
				{
					SortId : i,
					Type: faker.Helpers.randomize(priceListTypes),
					Code: "pricelist-" + faker.random.number(100),
					Description: faker.Lorem.words(5),
					IsKey : false
				}
		);

	}

	for (var j = 0; j < getRandomInt(1,4); j++) {
		schemes.push(
				{ 
					PricingMode : priceListMode[j],
					PriceLists : pricelists
				}

		);
	}
	console.log(schemes);
	d.resolve(schemes);
	return d.promise;	
	
}


FakePriceListsForAnalytic();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

	// console.log(groupLineItems);
	d.resolve(groupLineItems);
	return d.promise;

}

function SaveDriver (lines) {
	db.drivers.save(
	{
		type: drivers[i],
		mode: mode[1],
		groups: lines
	}, function(err) 
		{
			db.drivers.save(
			{
				type: drivers[i],
				mode: mode[2],
				groups: lines
			});
		} 
	);
}



// function start(count) {

// 		return FakeGroupsItems(count)
// 		.then(function(lines){return SaveDriver(lines);})
// 		.fail(function(err){console.log(err);})
// 		;

// }

// var ps= [];
// 	for (i=0; i<11;i++){
// 		ps.push(start(faker.random.number(10)));
// 	}

// 	q.allSettled(ps); 


