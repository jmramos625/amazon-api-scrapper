document.addEventListener('DOMContentLoaded', () => {
  const keywordInput = document.getElementById('keywordInput');
  const searchButton = document.getElementById('searchButton');
  const resultsContainer = document.getElementById('resultsContainer');
  const loadingElement = document.getElementById('loading');
  const errorContainer = document.getElementById('errorContainer');

  searchButton.addEventListener('click', async () => {
    const keyword = keywordInput.value.trim();
    
    if (!keyword) {
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
      const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      
      const products = await response.json();
      
      if (products.length === 0) {
        showError('No products found. Try a different search term.');
        return;
      }
      
      displayResults(products);
    } catch (error) {
      showError(error.message);
    } finally {
      loadingElement.style.display = 'none';
    }
  });

  function displayResults(products) {
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
    `).join('');
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