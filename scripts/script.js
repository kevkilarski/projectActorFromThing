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
filmApp.dropdownDecadeEl = document.querySelector('#decade');
filmApp.dropdownRatingEl = document.querySelector('#rating');
filmApp.createPara = document.createElement('p');
filmApp.createParaTwo = document.createElement('p');
filmApp.createImg = document.createElement('img');
filmApp.actorCount = 0;

filmApp.decade = {
    'none': ['', ''],
    '1970': ['1970-01-01', '1979-12-31'],
    '1980': ['1980-01-01', '1989-12-31'],
    '1990': ['1990-01-01', '1999-12-31'],
    '2000': ['2000-01-01', '2009-12-31'],
    '2010': ['2010-01-01', '2019-12-31'],
    '2020': ['2020-01-01', '2029-12-31'],
}

filmApp.ratings = {
    'none': ['', ''],
    'kid': ['PG-13', ''],
    'risky': ['', 'R']
}

// Set API properties to namespace
filmApp.apiKey = "35d6e1fc2fa9c724779e6903ab30320b";

// Define method to call API targeting user-selected genre
filmApp.getFilmID = (queryGenre, queryDecade, queryRating) => {
    // Declaring url property for first API call to find movie IDs
    filmApp.apiUrlDiscover = "https://api.themoviedb.org/3/discover/movie";

    const url = new URL(filmApp.apiUrlDiscover);



    url.search = new URLSearchParams({
        api_key: filmApp.apiKey,
        with_genres: queryGenre,
        'primary_release_date.gte': filmApp.decade[queryDecade][0],
        'primary_release_date.lte': filmApp.decade[queryDecade][1],
        'certification_country': 'US',

        'certification.lte': filmApp.ratings[queryRating][0],

        'certification.gte': filmApp.ratings[queryRating][1],

        // 'certification.gte': queryRating,
        'sort_by': 'vote_count.desc'
        
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

        console.log("CONSOLE LOG FROM JSON", jsonResponse);

        console.log("---------THIS IS A ", filmApp.ratings[queryRating], " MOVIE--------------");

        console.log(queryDecade);

        console.log(filmApp.decade[queryDecade]);

        console.log("RATING", queryRating);

        let randomizeMovie = Math.floor(Math.random() * jsonResponse.results.length);
        
        console.log("rando number", randomizeMovie);

        console.log("actor ID", jsonResponse.results[randomizeMovie]);
        
        filmApp.getActor(jsonResponse.results[randomizeMovie].id, jsonResponse.results[randomizeMovie].title);
    })

};

// Method to call API for list of actors in movie ID list
filmApp.getActor = (filmId, filmTitle) => {
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

        console.log(jsonResponse);

        console.log(filmTitle);

        let randomizeActor = Math.floor(Math.random() * jsonResponse.cast.length);

        console.log('random actor', randomizeActor);

        console.log(jsonResponse.cast.length);
        filmApp.resultDivEl.innerText = '';
        filmApp.displayActor(jsonResponse.cast[randomizeActor].name, jsonResponse.cast[randomizeActor].profile_path, jsonResponse.cast[randomizeActor].character, filmTitle, jsonResponse.cast.length);
    })
}



// Display name on the page

filmApp.displayActor = (actorList, imgList, characterName, filmTitle, castLength) => {
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


        if (characterName == '') {
            filmApp.createParaTwo.innerText = `You may know them as some person from ${filmTitle}.`;
        } else {
            filmApp.createParaTwo.innerText = `You may know them as ${characterName} from ${filmTitle}.`;
        }
        
        filmApp.resultDivEl.appendChild(filmApp.createParaTwo);

        filmApp.actorCount++;

}

// Event Listener for the button

filmApp.findActor = () => {
    filmApp.findButtonEl.addEventListener ('click', () => {
        if (filmApp.dropdownGenreEl.value == 'selectOne' || filmApp.dropdownDecadeEl.value == 'selectOne' || filmApp.dropdownRatingEl.value == 'selectOne') {
            filmApp.createPara.innerText = "";
            filmApp.createPara.innerText = "We need some information!!!";
            filmApp.resultDivEl.append(filmApp.createPara);

        } else if (filmApp.actorCount > 9) { 
            filmApp.createPara.innerText = "Someone we've never heard of!";
            filmApp.createImg.src = `../assets/safiCantFind.jpg`;
            filmApp.createImg.alt = `Angry man with beard and glasses`;
            filmApp.resultDivEl.appendChild(filmApp.createImg);
            filmApp.createParaTwo.innerText = '';
        } else {
            console.log("you have selected the shuffle!");
            console.log(filmApp.dropdownGenreEl.value);
            filmApp.getFilmID(filmApp.dropdownGenreEl.value, filmApp.dropdownDecadeEl.value, filmApp.dropdownRatingEl.value);
            filmApp.findButtonEl.textContent = "No...It's not them...";
            filmApp.dropdownGenreEl.disabled = true;
            filmApp.dropdownDecadeEl.disabled = true;
            filmApp.dropdownRatingEl.disabled = true;
        }
    })
}

filmApp.reset = () => {
    document.querySelector('#reset').addEventListener ('click', () => {
        console.log("hey");
        filmApp.actorCount = 0;
        filmApp.findButtonEl.textContent = "Find Actor";
        filmApp.dropdownGenreEl.value = "selectOne";
        filmApp.dropdownDecadeEl.value = "selectOne";
        filmApp.dropdownRatingEl.value = "selectOne";
        const pElement = document.querySelector("#suggestedActor p");
        pElement.innerText = "";
        filmApp.createImg.src = ``;
        filmApp.createImg.alt = ``;
        filmApp.createParaTwo.innerText = '';
        filmApp.dropdownGenreEl.disabled = false;
        filmApp.dropdownDecadeEl.disabled = false;
        filmApp.dropdownRatingEl.disabled = false;
    })
}

// Declare filmApp init method
filmApp.init = () => {
    filmApp.findActor();
    filmApp.reset();
}

// Call the init method

filmApp.init();