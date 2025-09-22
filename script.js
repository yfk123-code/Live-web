document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const countriesListEl = document.getElementById('countries-list');
    const categoriesListEl = document.getElementById('categories-list');
    const channelsGridEl = document.getElementById('channels-grid');
    const searchBarEl = document.getElementById('search-bar');
    const noResultsEl = document.getElementById('no-results');

    // State Variables
    let activeCountry = '';
    let activeCategory = 'All';
    let searchQuery = '';

    // --- INITIALIZATION ---
    
    // 1. Get all unique countries and categories from data
    const allChannels = Object.values(tvData).flat();
    const countries = [...new Set(allChannels.map(channel => channel.country).filter(Boolean))]; // Assuming you add country property in data.js
    // Let's stick with the original country keys for now.
    const countryKeys = Object.keys(tvData);
    const categories = ['All', ...new Set(allChannels.map(channel => channel.category))];

    // 2. Create Country buttons
    countryKeys.forEach((country, index) => {
        const button = createFilterButton(country, () => {
            activeCountry = country;
            updateActiveButton(countriesListEl, button);
            renderChannels();
        });
        countriesListEl.appendChild(button);
        if (index === 0) { // Set first country as default active
            activeCountry = country;
            button.classList.add('active');
        }
    });

    // 3. Create Category buttons
    categories.forEach((category, index) => {
        const button = createFilterButton(category, () => {
            activeCategory = category;
            updateActiveButton(categoriesListEl, button);
            renderChannels();
        });
        categoriesListEl.appendChild(button);
        if (index === 0) { // Set "All" as default active
            button.classList.add('active');
        }
    });
    
    // 4. Add event listener for search bar
    searchBarEl.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderChannels();
    });

    // --- HELPER FUNCTIONS ---

    function createFilterButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.innerText = text;
        button.addEventListener('click', onClick);
        return button;
    }

    function updateActiveButton(container, activeButton) {
        container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    // --- CORE RENDERING FUNCTION ---

    function renderChannels() {
        channelsGridEl.innerHTML = '';
        noResultsEl.style.display = 'none';

        // 1. Filter by Country
        let filteredChannels = tvData[activeCountry] || [];

        // 2. Filter by Category
        if (activeCategory !== 'All') {
            filteredChannels = filteredChannels.filter(channel => channel.category === activeCategory);
        }

        // 3. Filter by Search Query
        if (searchQuery) {
            filteredChannels = filteredChannels.filter(channel => channel.name.toLowerCase().includes(searchQuery));
        }

        // 4. Display channels or "no results" message
        if (filteredChannels.length === 0) {
            noResultsEl.style.display = 'block';
        } else {
            filteredChannels.forEach(channel => {
                const channelLink = document.createElement('a');
                channelLink.className = 'channel-card';
                channelLink.href = `channel.html?stream=${encodeURIComponent(channel.stream_url)}&name=${encodeURIComponent(channel.name)}`;
                channelLink.innerHTML = `
                    <div class="logo-container">
                        <img src="${channel.logo}" alt="${channel.name} Logo" loading="lazy">
                    </div>
                    <p>${channel.name}</p>
                `;
                channelsGridEl.appendChild(channelLink);
            });
        }
    }

    // --- INITIAL RENDER ---
    renderChannels();
});
