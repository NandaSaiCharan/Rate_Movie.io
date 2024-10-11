const apiKey = 'ae386234'; // Your OMDb API key

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieList = document.getElementById('movie-list');

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

// Event listener for Enter key press
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    }
});

// Function to fetch movies based on search query
function searchMovies(query) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === "True") {
                displayMovieList(data.Search);
            } else {
                movieList.innerHTML = '<p>No movies found. Try a different search.</p>';
            }
        })
        .catch(error => console.error('Error fetching movie data:', error));
}

// Function to display a list of movies
function displayMovieList(movies) {
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Fetch additional movie details
        fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(details => {
                movieCard.innerHTML = `
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
                    <div>
                        <h3>${movie.Title}</h3>
                        <p><strong>Release Date:</strong> ${details.Released}</p>
                        <p><strong>IMDb Rating:</strong> ${details.imdbRating}</p>
                        <p><strong>Cast:</strong> ${details.Actors}</p>
                        <p><strong>Summary:</strong> ${details.Plot}</p>
                        <div class="star-rating">
                            <span class="star" data-value="1">★</span>
                            <span class="star" data-value="2">★</span>
                            <span class="star" data-value="3">★</span>
                            <span class="star" data-value="4">★</span>
                            <span class="star" data-value="5">★</span>
                        </div>
                    </div>
                `;
                movieList.appendChild(movieCard);

                // Event listener for star rating
                const stars = movieCard.querySelectorAll('.star');
                stars.forEach(star => {
                    star.addEventListener('click', () => {
                        const rating = star.getAttribute('data-value');
                        stars.forEach(s => {
                            s.classList.remove('rated'); // Remove 'rated' class from all stars
                        });
                        for (let i = 0; i < rating; i++) {
                            stars[i].classList.add('rated'); // Add 'rated' class to selected stars
                        }
                        alert(`You rated ${movie.Title} with ${rating} star(s)!`); // Alert with the rating
                    });
                });
            })
            .catch(error => console.error('Error fetching movie details:', error));
    });
}
