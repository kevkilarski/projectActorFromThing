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

// Create namespace variables
filmApp.findButtonEl = document.querySelector('#shuffle');
filmApp.resultDivEl = document.querySelector('#suggestedActor');
filmApp.dropdownGenreEl = document.querySelector('#genre');
filmApp.createPara = document.createElement('p');
filmApp.createImg = document.createElement('img');
filmApp.actorCount = 0;

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
        let randomizeMovie = Math.floor(Math.random() * 19) + 1;
        
        console.log("rando number", randomizeMovie);

        console.log("actor ID", jsonResponse.results[randomizeMovie]);
        
        filmApp.getActor(jsonResponse.results[randomizeMovie].id);
    })

};

// Method to call API for list of actors in movie ID list
filmApp.getActor = (filmId) => {
    // Declaring url property for second API call to find actor
    filmApp.apiUrlCredits = `https://api.themoviedb.org/3/movie/${filmId}/credits`;
    filmApp.apiUrlImg = `https://image.tmdb.org/t/p/w300/`;

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
        console.log(jsonResponse);
        // console.log(`This is the first actor (top billing) from the movie ID - ${jsonResponse.cast[0].name}`);
        // for (let i = 0; i <= 9; i++) {
        //     console.log(i);
        // }
        // const actorArray = [];
        // const imgArray = [];

        // for (let i = 0; i <=9; i++) {
        //     actorArray.push(jsonResponse.cast[i].name);
        //     imgArray.push(jsonResponse.cast[i].profile_path);
        // }
        // console.log(imgArray);

        // // filmApp.resultDivEl.innerText = '';
        // // filmApp.displayActor(actorArray, imgArray);

        // for (let i = 0; i <=9; i++) {
        //     actorArray.push(jsonResponse.cast[i].name);
        //     imgArray.push(jsonResponse.cast[i].profile_path);
        // }
        // console.log(imgArray);

         let randomizeActor = Math.floor(Math.random() * jsonResponse.cast.length);

        console.log('random actor', randomizeActor);

        console.log(jsonResponse.cast.length);
        filmApp.resultDivEl.innerText = '';
        filmApp.displayActor(jsonResponse.cast[randomizeActor].name, jsonResponse.cast[randomizeActor].profile_path);
    })
}



// Display name on the page

filmApp.displayActor = (actorList, imgList) => {
        // filmApp.createPara.innerText = actorList[filmApp.actorCount];
        // filmApp.resultDivEl.appendChild(filmApp.createPara);

        // filmApp.createImg.src = `https://image.tmdb.org/t/p/w300/` + imgList[filmApp.actorCount];
        // filmApp.createImg.alt = `Headshot of the actor ${actorList[filmApp.actorCount]}`;
        // filmApp.resultDivEl.appendChild(filmApp.createImg);


        filmApp.createPara.innerText = actorList;
        filmApp.resultDivEl.appendChild(filmApp.createPara);

        if (imgList == null) {
            filmApp.createImg.src = `../assets/noProfilePic.jpg`;
            filmApp.createImg.alt = `Blank headshot`;
            filmApp.resultDivEl.append(filmApp.createImg);
        } else {
            filmApp.createImg.src = `https://image.tmdb.org/t/p/w300/` + imgList;
            filmApp.createImg.alt = `Headshot of the actor ${actorList}`;
            filmApp.resultDivEl.appendChild(filmApp.createImg);
        }




        filmApp.actorCount++;

}

// Event Listener for the button

filmApp.findActor = () => {
    filmApp.findButtonEl.addEventListener ('click', (event) => {
        if (filmApp.dropdownGenreEl.value == 'selectOne') {
            filmApp.createPara.innerText = "";
            filmApp.createPara.innerText = "You need to select a genre!!!";
            filmApp.resultDivEl.append(filmApp.createPara);

        } else if (filmApp.actorCount > 9) { 
            filmApp.createPara.innerText = "Someone we've never heard of!";
            filmApp.createImg.src = `../assets/safiCantFind.jpg`;
            filmApp.createImg.alt = `Angry man with beard and glasses`;
            filmApp.resultDivEl.appendChild(filmApp.createImg);
        } else {
            console.log("you have selected the shuffle!");
            console.log(filmApp.dropdownGenreEl.value);
            filmApp.getFilmID(filmApp.dropdownGenreEl.value);
            filmApp.findButtonEl.textContent = "No...It's not them...";
            document.querySelector("#genre").disabled = true;
        }
    })
}

filmApp.reset = () => {
    document.querySelector('#reset').addEventListener ('click', () => {
        console.log("hey");
        filmApp.actorCount = 0;
        filmApp.findButtonEl.textContent = "Find Actor";
        filmApp.dropdownGenreEl.value = "selectOne";
        const pElement = document.querySelector("#suggestedActor p");
        pElement.innerText = "";
        filmApp.createImg.src = ``;
        filmApp.createImg.alt = ``;
        document.querySelector("#genre").disabled = false;
    })
}

// Declare filmApp init method
filmApp.init = () => {
    filmApp.findActor();
    filmApp.reset();
}

// Call the init method

filmApp.init();