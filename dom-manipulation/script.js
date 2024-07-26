// Initialize quotes array from local storage or with default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - ${randomQuote.category}</p>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert('New quote added successfully!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Function to export quotes to a JSON file
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const exportFileDefaultName = 'quotes.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', url);
  linkElement.setAttribute('download', exportFileDefaultName);
  document.body.appendChild(linkElement); // Append the link to the body
  linkElement.click();
  document.body.removeChild(linkElement); // Remove the link after downloading
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = new Set(quotes.map(quote => quote.category));
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter and display quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);
  });

  // Save the selected category to local storage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to initialize the application
function init() {
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  document.getElementById('categoryFilter').value = selectedCategory;
  populateCategories();
  filterQuotes();
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the "Add Quote" button
document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Event listener for the "Export Quotes as JSON" button
document.getElementById('exportJsonButton').addEventListener('click', exportQuotesToJson);

// Call init to display a random quote and set up the category filter on page load
init();
