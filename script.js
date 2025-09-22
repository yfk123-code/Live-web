document.addEventListener('DOMContentLoaded', () => {
    const countriesList = document.getElementById('countries-list');
    const channelsGrid = document.getElementById('channels-grid');
    const loader = document.getElementById('loader');
    
    const countries = Object.keys(tvData);

    countries.forEach(country => {
        const button = document.createElement('button');
        button.className = 'country-btn';
        button.innerText = country;
        button.addEventListener('click', () => {
            document.querySelectorAll('.country-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadChannels(country);
        });
        countriesList.appendChild(button);
    });

    function loadChannels(country) {
        // --- Animation Logic ---
        channelsGrid.classList.remove('loaded'); // Remove class to reset animation
        loader.style.display = 'block'; // Show loader
        channelsGrid.innerHTML = ''; // Clear channels immediately

        // Use a short timeout to allow the UI to update and show the loader
        setTimeout(() => {
            const channels = tvData[country];

            channels.forEach(channel => {
                const channelLink = document.createElement('a');
                channelLink.className = 'channel-card';
                channelLink.href = `channel.html?stream=${encodeURIComponent(channel.stream_url)}&name=${encodeURIComponent(channel.name)}`;
                
                channelLink.innerHTML = `
                    <div class="logo-container">
                        <img src="${channel.logo}" alt="${channel.name} Logo" loading="lazy">
                    </div>
                    <p>${channel.name}</p>
                `;
                channelsGrid.appendChild(channelLink);
            });
            
            loader.style.display = 'none'; // Hide loader
            channelsGrid.classList.add('loaded'); // Add class to trigger fade-in animation

        }, 300); // 300ms delay for a smoother feel
    }

    if (countries.length > 0) {
        countriesList.querySelector('.country-btn').click();
    }
});
