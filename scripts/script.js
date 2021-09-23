/* ======================
PSEUDO CODE
=========================*/

// Create actorApp namespace Object
// Create init method to kick off the application
// Setup TMDB API:
    // apiURL; apiKey

// Get user input
    // Store 'select' element (class="genre")
    // Add event listener for 'select' element

// Have API return an actor based on user input
    // Perform first API call for films based on user-selected genre
    // Perform second API call for actors based on previously generated films

// Print actor name to page
    // Store 'p' element (class="suggestedActor")
    // Append to page the value of first index in possibleActors array
    
// Change actor if shuffle is selected
    // Store 'button' element (class="shuffle")
    // Add event listener for 'button' element
    // If selected
        // Select the next array index from possibleActors array
        // Replace printed actor name with value of array index


/* ======================
APPLICATION CODE
=========================*/

// Create namespace object
const filmApp = {};

num = 0;


// Set API properties to namespace
filmApp.apiKey = "35d6e1fc2fa9c724779e6903ab30320b";

// Define method to call API targeting user-selected genre
filmApp.getFilmID = (query) => {
    // Declaring url property for first API call to find movie IDs
    filmApp.apiUrlDiscover = "https://api.themoviedb.org/3/discover/movie";

    const url = new URL(filmApp.apiUrlDiscover);

    url.search = new URLSearchParams({
        api_key: filmApp.apiKey,
        with_genres: query,
        'sort_by': 'vote_count.desc' // *** This must be user-selected!!
        
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

                        // Additional query strings
                            // with_cast: 287,
                            // 'primary_release_date.gte': '1997-01-01',
                            // 'primary_release_date.lte': '2003-01-01',
                            // 'sort_by': 'popularity.desc' 'vote_average.desc' (this is default)
                            // 'certification_country': 'US',
                            // 'certification': 'G'
                                // NR, G, PG, PG-13, R, NC-17

    })

    fetch(url).then((response) => {
        return response.json();
    })
    .then ((jsonResponse) => {
        // console.log(`--------API CALL 1--------`);
        // console.log(`Output of all films of this genre below`);
        // console.log(jsonResponse);
        // console.log(`This is the first movie ID (most popular film) from genre list - ${jsonResponse.results[0].id}`);

        // *** need to put the top 10(?) movie IDs in an array and pass this to next function.  For of loop to create this array?
        filmApp.getActor(jsonResponse.results[0].id);
    })

};

// Method to call API for list of actors in movie ID list
filmApp.getActor = (filmId) => {
    // Declaring url property for second API call to find actor
    filmApp.apiUrlCredits = `https://api.themoviedb.org/3/movie/${filmId}/credits`;

    const url = new URL(filmApp.apiUrlCredits);

    url.search = new URLSearchParams({
        api_key: filmApp.apiKey
    })

    fetch(url).then((response) => {
        return response.json();
    })
    .then ((jsonResponse) => {
        // console.log(`--------API CALL 2--------`);
        // console.log(`Output from all cast and crew from the movie ID passed in`);
        // console.log(jsonResponse);
        // console.log(`This is the first actor (top billing) from the movie ID - ${jsonResponse.cast[0].name}`);
        // for (let i = 0; i <= 9; i++) {
        //     console.log(i);
        // }
        const actorArray = [];

        for (let i = 0; i <=9; i++) {
            actorArray.push(jsonResponse.cast[i].name);
        }
        
        document.querySelector("#suggestedActor").innerText = '';
        filmApp.displayName(jsonResponse.cast[0].name, actorArray);
    })
}



// Display name on the page

filmApp.displayName = (actorName, actorList) => {
    
    const divElement = document.querySelector("#suggestedActor");
    const name = document.createElement('p');
    if (num <= 9) {
        name.innerText = actorList[num];
        divElement.appendChild(name);
        num = num + 1;
        console.log(actorList);
    } else {
        name.innerText = "Someone we've never heard of!";
        divElement.appendChild(name);
    }

}

// Event Listener for the button

const divElement = document.querySelector("#suggestedActor");
            const name = document.createElement("p");

filmApp.nextActor = () => {
    document.querySelector('#shuffle').addEventListener ('click', (event) => {
        const userInput = document.querySelector('#genre');
        if (userInput.value == 'selectOne') {
            
            name.innerText = "";
            name.innerText = "You need to select a genre!!!";
            divElement.append(name);

        } else {
            console.log("you have selected the shuffle!");
            console.log(userInput.value);
            filmApp.getFilmID(userInput.value);
            document.querySelector('#shuffle').textContent = "No...It's not them...";
        }
    })
}

filmApp.reset = () => {
    document.querySelector('#reset').addEventListener ('click', () => {
        console.log("hey");
        num = 0;
        const pElement = document.querySelector("#suggestedActor p");
        pElement.innerText = '';
        document.querySelector('#shuffle').textContent = "Find Actor";
        document.querySelector('#genre').value = 'selectOne';
    })
}

// Declare filmApp init method
filmApp.init = () => {
    filmApp.nextActor();
    filmApp.reset();

}

// Call the init method
filmApp.init();