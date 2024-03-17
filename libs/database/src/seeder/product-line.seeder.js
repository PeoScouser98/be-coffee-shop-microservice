// Select the database to use.
use('e-commerce')

// Insert a few documents into the sales collection.
db.getCollection('product-line').insertMany([])

// Run a find command to view items sold on April 4th, 2014.
const productLines = db.getCollection('product-line').find()

// Print a message to the output window.
console.table(productLines)

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
db.getCollection('sales').aggregate([
	// Find all of the sales that occurred in 2014.
	{ $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
	// Group the total sales for each product.
	{ $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: ['$price', '$quantity'] } } } }
])
