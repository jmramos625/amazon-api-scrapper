// Run: node server.js
// Open: http://localhost:3000/api/scrape?keyword=iphone
// CORS: https://www.npmjs.com/package/cors
// Axios: https://www.npmjs.com/package/axios
// JSDOM: https://www.npmjs.com/package/jsdom
// IMPORTS to be added in package.json
import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import cors from 'cors';

// consts to be added in package.json
const app = express();
const PORT = 3000;

// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors()); // enable cors because we are making a request from the frontend to the backend

// Scrape endpoint
app.get('/api/scrape', async (req, res) => { // creating a get request to scrape the data
  const keyword = req.query.keyword; // getting the keyword from the query parameter

  if (!keyword){ // keyword is required
    return res.status(400).json({ error: 'Keyword query parameter is required' }); // to force the user to enter a keyword
  }

  try { // try block to handle the error
    const products = await scrapeAmazon(keyword); // calling the scrapeAmazon function to scrape the data
    res.json(products);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape Amazon', 
      details: error.message,
      suggestion: 'Amazon might be blocking our requests. Try again later.' // if Amazon is blocking the request, try again later
    });
  }
});

// Function to scrape Amazon
// This function will extract product data from the Amazon search results page
// It uses Axios to fetch the page and JSDOM to parse it
// The function takes a keyword as input and returns an array of product objects
// we are using async function to make the function asynchronous
async function scrapeAmazon(keyword) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
  
  // Configure headers to mimic a browser
  // This is necessary to avoid getting blocked by Amazon
  // we are setting the headers to mimic a browser to avoid getting blocked by Amazon
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  };

  // Fetch the page
  const response = await axios.get(url, { headers }); // sending the request to Amazon
  const html = response.data;  // getting the response data

  // Parse with JSDOM
  const dom = new JSDOM(html); // parsing the html using JSDOM
  const document = dom.window.document; // getting the document object

  // Extract product data
  const products = []; // creating an empty array to store the product data
  const items = document.querySelectorAll('.s-result-item[data-asin]'); // selecting all the product items

  items.forEach(item => {
    const asin = item.getAttribute('data-asin'); // getting the asin of the product (ASIN, or Amazon Standard Identification Number, is a unique identifier for products on Amazon)
    if (!asin) return; // if no asin found, return

    // Extract data
    const title = item.querySelector('a h2 span')?.textContent.trim() || 'No title'; // if dont find title, set it to 'No title'
    const ratingText = item.querySelector('.a-icon-star-small .a-icon-alt')?.textContent.trim();  // get the rating text
    const rating = ratingText ? parseFloat(ratingText.split(' ')[0]) : null; // set rating to null if no rating found
    const reviewsText = item.querySelector('.a-size-small .a-link-normal .a-size-base')?.textContent.trim(); // get the reviews text
    const reviews = reviewsText ? parseInt(reviewsText.replace(/,/g, '')) : null; // set reviews to null if no reviews found
    const imageUrl = item.querySelector('.s-image')?.getAttribute('src') || ''; // get the image url

    // Add to products array to return later
    if (title && imageUrl) { // if title and image url found, add to products array
      products.push({
        asin,
        title,
        rating,
        reviews,
        imageUrl,
      });
    }
  });

  return products;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // server running message
});