// Array to store quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
      quoteDisplay.innerHTML = '<p>No quotes available.</p>';
      return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = `
      <p>${quotes[randomIndex].text}</p>
      <p><em>Category: ${quotes[randomIndex].category}</em></p>
  `;
}

// Function to add a new quote
async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      alert('Quote added successfully!');
      populateCategories();
      showRandomQuote();

      // Sync new quote with server
      try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(newQuote)
          });
          const data = await response.json();
          console.log('Quote synced with server:', data);
          alert('Quote synced with server!');
      } catch (error) {
          console.error('Error syncing quote with server:', error);
      }
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  uniqueCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('div');
      quoteElement.innerHTML = `
          <p>${quote.text}</p>
          <p><em>Category: ${quote.category}</em></p>
      `;
      quoteDisplay.appendChild(quoteElement);
  });
}

// Function to export quotes as JSON
function exportQuotesAsJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      populateCategories();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const data = await response.json();
      // Assuming the server returns an array of quote objects
      const serverQuotes = data.map(item => ({ text: item.title, category: 'Server' }));
      resolveConflicts(serverQuotes);
      alert('Quotes fetched from server successfully!');
      console.log('Quotes synced with server!');
      populateCategories();
  } catch (error) {
      console.error('Error fetching quotes from server:', error);
  }
}

// Function to resolve conflicts between local and server data
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const combinedQuotes = [...serverQuotes, ...localQuotes];
  const uniqueQuotes = Array.from(new Set(combinedQuotes.map(q => q.text)))
      .map(text => combinedQuotes.find(q => q.text === text));
  quotes = uniqueQuotes;
  saveQuotes();
}

// Function to create the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteButton">Add Quote</button>
  `;
  document.querySelector('.container').appendChild(formContainer);

  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
}

// Function to sync quotes with the server periodically
function syncQuotes() {
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 60000); // Sync every 60 seconds
}

// Initialize and load quotes
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportJsonButton').addEventListener('click', exportQuotesAsJson);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
document.getElementById('fetchQuotesButton').addEventListener('click', fetchQuotesFromServer);

// Initial population of categories and quotes display
populateCategories();
filterQuotes();
syncQuotes();
createAddQuoteForm();
