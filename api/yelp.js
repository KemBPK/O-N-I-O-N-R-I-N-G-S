'use strict';

const yelp = require('yelp-fusion');
require('dotenv').config();

// Grab your Yelp Fusion's API Key from https://www.yelp.com/developers/v3/manage_app
const apiKey = process.env.YELP_KEY;

const client = yelp.client(apiKey);

// const searchRequest = {
//     term:'Onion Rings',
//     location: 'fullerton, ca',
//     limit: 3
//   };

// client.search(searchRequest).then(response => {
// //   console.log(response.jsonBody); //object: businesses[]
//   const firstResult = response.jsonBody.businesses[0];
//   const prettyJson = JSON.stringify(firstResult, null, 4);
//   console.log(prettyJson);
// }).catch(e => {
//   console.log(e);
// });

function SearchPlaces(input){

    // you have to return a promise object back to wherever. You can access the result by calling {promise}.then(response => {});
    // to display the results, pass the promise to the ejs file and access it there.
    
    //There are some embedded object inside the arrays (locations, coordinates, categories, etc.). Use JSON.stringify() and pass in an element of businesses to access them.

    return client.search(input);
}

function SearchRestaurant(id){
    return client.business(id);
}

module.exports.SearchPlaces = SearchPlaces;
module.exports.SearchRestaurant = SearchRestaurant;

// busisnesses[i]
// { id: 'px_IFazBLG4JendEU5BH8Q',
//        alias: 'burger-parlor-fullerton',
//        name: 'Burger Parlor',
//        image_url:
//         'https://s3-media2.fl.yelpcdn.com/bphoto/9XRTvYuplIn0KpY_Rdq3sg/o.jpg',
//        is_closed: false,
//        url:
//         'https://www.yelp.com/biz/burger-parlor-fullerton?adjust_creative=OSbrGDKzF6-p6zS1mpMUtg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=OSbrGDKzF6-p6zS1mpMUtg',
//        review_count: 1391,
//        categories: [Array],
//        rating: 4,
//        coordinates: [Object],
//        transactions: [Array],
//        price: '$$',
//        location: [Object],
//        phone: '+17144412003',
//        display_phone: '(714) 441-2003',
//        distance: 706.7509930720685 }

// businesses[i].location
// "location": {
//     "address1": "204 N Harbor Blvd",
//     "address2": "",
//     "address3": "",
//     "city": "Fullerton",
//     "zip_code": "92832",
//     "country": "US",
//     "state": "CA",
//     "display_address": [
//         "204 N Harbor Blvd",
//         "Fullerton, CA 92832"
//     ]
// }

//businesses[i].coordinates
// "coordinates": {
//     "latitude": 33.8715892432328,
//     "longitude": -117.924152988629
// },

// businesses[i].categories[y]
// "categories": [
//     {
//         "alias": "burgers",
//         "title": "Burgers"
//     }

// 
// 							_________________________________________________________________________________________________________
// 							| Pic	| Restaurant name 															Directions
// 							| 		| -----------------------------------------------------------------------------------------------
// 							|		| Yelp link (with  yelp logo), Yelp rating   | ORWW link to review page (with logo), ORWW rating
// 							|_______|________________________________________________________________________________________________								 |
						
// 							Restaurant schedule
// 							Open?
// 							phone
// 							yelp link to Onion rings menu item

// 							Direction button will show a pop up modal with a google map 
							
// 							Google API key = AIzaSyCH0_20Xs3jNC7t0Z8JoZ8GeSC01tRxY8k //DO NOT SHARE THIS 
// 						