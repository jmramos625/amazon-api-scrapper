// This file contains the JavaScript code that runs in the browser.
// It fetches the search results from the backend and displays them on the page.
document.addEventListener('DOMContentLoaded', () => { // adding an event listener to the document
  // Get elements from the DOM
  const keywordInput = document.getElementById('keywordInput');
  const searchButton = document.getElementById('searchButton');
  const resultsContainer = document.getElementById('resultsContainer');
  const loadingElement = document.getElementById('loading');
  const errorContainer = document.getElementById('errorContainer');

  searchButton.addEventListener('click', async () => { // adding an event listener to the search button
    const keyword = keywordInput.value.trim();
    
    if (!keyword) { // keyword is required
      showError('Please enter a search keyword');
      return;
    }
    
    try {
      // Clear previous results and errors
      resultsContainer.innerHTML = '';
      errorContainer.textContent = '';
      
      // Show loading state
      loadingElement.style.display = 'flex';
      
      // Fetch data from backend
      const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`); // sending the request to the backend
      
      if (!response.ok) { // if the response is not ok
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      
      const products = await response.json(); // getting the response data
      
      if (products.length === 0) { // if no products are found
        showError('No products found. Try a different search term.');
        return;
      }
      
      displayResults(products); // displaying the results
    } catch (error) {
      showError(error.message);
    } finally { // finally block to hide the loading element
      loadingElement.style.display = 'none'; // hiding the loading element
    }
  });

  function displayResults(products) { // function to display the results
    resultsContainer.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.imageUrl}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <h3 class="product-title"> <a class="btn-link" href="https://www.amazon.com/s?k=${encodeURIComponent(product.title)}">${product.title}</a></h3>
          <div class="product-rating">
            ${product.rating ? `
              <div class="stars">${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}</div>
              <span class="rating-value">${product.rating.toFixed(1)}</span>
            ` : 'No rating'}
          </div>
          <p class="reviews">${product.reviews ? `${product.reviews.toLocaleString()} reviews` : 'No reviews'}</p>
        </div>
      </div>
    `).join('');// mapping through the products and displaying the product data
  }

  function showError(message) {
    errorContainer.textContent = message;
  }

  // Allow search on Enter key
  keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchButton.click();
    }
  });
});