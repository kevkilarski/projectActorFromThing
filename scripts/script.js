/* ======================
PSEUDO CODE
=========================*/

// Create actorApp namespace Object
// Create init method to kick off the application
// Setup OMDB API:
    // apiURL; apiKey

// Get user input
    // Store 'select' element (class="genre")
    // Add event listener for 'select' element

// Have API return an actor based on user input
    // Search APIs for user-selected genre using filter method
    // Parse actors in identified objects using forEach method
    // Add parsed actors to new array (possibleActors = [])

// Print actor name to page
    // Store 'p' element (class="suggestedActor")
    // Append to page the value of first index in possibleActors array
    
// Change actor if shuffle is selected
    // Store 'button' element (class="shuffle")
    // Add event listener for 'button' element
    // If selected
        // Select the next array index from possibleActors array
        // Replace printed actor name with value of array index


    // *** Place list of release dates & certification into an object that user's selection will choose from

/* ======================
APPLICATION CODE
=========================*/

// create namespace object
const filmApp = {};

// set api properties to namespace
filmApp.apiUrl = "https://api.themoviedb.org/3/discover/movie";
filmApp.apiKey = "35d6e1fc2fa9c724779e6903ab30320b";





filmApp.getActor = () => {
    const url = new URL(filmApp.apiUrl);

    url.search = new URLSearchParams({
        api_key: filmApp.apiKey,
        with_genres: 28,
            // https://www.themoviedb.org/talk/5daf6eb0ae36680011d7e6ee
                // Action          28
                // Adventure       12
                // Animation       16
                // Comedy          35
                // Crime           80
                // Documentary     99
                // Drama           18
                // Family          10751
                // Fantasy         14
                // History         36
                // Horror          27
                // Music           10402
                // Mystery         9648
                // Romance         10749
                // Science Fiction 878
                // TV Movie        10770
                // Thriller        53
                // War             10752
                // Western         37
        // with_cast: 287,
        // 'primary_release_date.gte': '1997-01-01',
        // 'primary_release_date.lte': '2003-01-01',
        // 'certification_country': 'US',
        // 'certification': 'G'
            // NR, G, PG, PG-13, R, NC-17
    })

    fetch(url).then((response) => {
        return response.json();
    })
    .then ((jsonResponse) => {
        console.log(jsonResponse);
    })

};





filmApp.init = () => {
    console.log("hey!");
    filmApp.getActor();
}

filmApp.init();