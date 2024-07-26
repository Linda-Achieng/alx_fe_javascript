let quotes = [];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = 'No quotes available.';
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `${randomQuote.text} - ${randomQuote.category}`;
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
            console.log('Quotes synced with server!');
        } catch (error) {
            console.error('Error syncing quote with server:', error);
        }
    }
}

// Function to populate categories dynamically
function populateCategories() {
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
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
        quoteElement.innerText = `${quote.text} - ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });
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
    quotes = [...new Set([...quotes, ...serverQuotes])];
    saveQuotes();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories();
        showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Load existing quotes from local storage when the page loads
window.onload = function() {
    loadQuotes();
    populateCategories();
    showRandomQuote();
    fetchQuotesFromServer();
    setInterval(fetchQuotesFromServer, 60000); // Fetch new quotes from server every minute
};
