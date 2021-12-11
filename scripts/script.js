/* ======================
PSEUDO CODE
=========================*/

// Create actorApp namespace Object
// Create init method to kick off the application
// Setup TMDB API:
    // apiKey
    // apiUrlDiscover (1/2)
    // apiUrlCredits (2/2)

// Get user input
    // Store 'select' elements (class="genre", class='rating', class='decade')

// Add event listener to 'Find an Actor' button
    // Change text on button after 'click'
    // Change actor if shuffle is selected
    // Store 'button' element (class="shuffle")
    // Start counter for the number of actor suggestions

// Add event listener to 'Reset' button
    // reset drop-down menus on 'click'

// Have API return an actor based on user input
    // Perform first API call (apiUrlDiscover) for films based on user-selected genre, decade of film, and rating
    // Perform second API call (apiUrlCredits) for actors based on previously generated films

// Print actor name and image to page
    // Store 'p' element (class="suggestedActor")
    // Append actor's name to page 
    // Store 'img' element 
    // Append actor's image to page

// Print character name and movie they're from to page
    // Store a second 'p' element
    // Append to page
    
// Add error handling for when nothing has been selected for one or all of the drop-down menus
// Add error handling so the list of actor's isn't endless (counter utilized)
// Add error handling if there is no image in the API


/* ======================
APPLICATION CODE
=========================*/

// Create namespace object
const filmApp = {};

// Create namespace variables to store elements, create elements, and initialize counter
filmApp.findButtonEl = document.querySelector('#shuffle');
filmApp.resetButtonEl = document.querySelector('#reset');
filmApp.resultDivEl = document.querySelector('#suggestedActor');
filmApp.dropdownGenreEl = document.querySelector('#genre');
filmApp.dropdownDecadeEl = document.querySelector('#decade');
filmApp.dropdownRatingEl = document.querySelector('#rating');
filmApp.createPara = document.createElement('p');
filmApp.createParaTwo = document.createElement('p');
filmApp.createImg = document.createElement('img');
filmApp.thinkingText = document.querySelector('#youMustBeThinking');
filmApp.actorCount = 0;

// Create namespace objects to parse API search parameters based on dropdown selections
    // none or "" is used for 'I dunno' selections
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
filmApp.apiKey = '35d6e1fc2fa9c724779e6903ab30320b';

// Perform first API call (apiUrlDiscover) for films based on user-selected genre, decade of film, and rating
filmApp.getFilmID = (queryGenre, queryDecade, queryRating) => {

    // Declaring url property for first API call to find movie IDs
    filmApp.apiUrlDiscover = 'https://api.themoviedb.org/3/discover/movie';

    const url = new URL(filmApp.apiUrlDiscover);

    // Search parameters for apiUrlDiscover
    url.search = new URLSearchParams({
        api_key: filmApp.apiKey,
        with_genres: queryGenre,
        'primary_release_date.lte': filmApp.decade[queryDecade][1],
        'primary_release_date.gte': filmApp.decade[queryDecade][0],
        'certification_country': 'US',
        'certification.lte': filmApp.ratings[queryRating][0],
        'certification.gte': filmApp.ratings[queryRating][1],
        'sort_by': 'vote_count.desc'
    })

    fetch(url).then((response) => {
        return response.json();
    }).then ((jsonResponse) => {

        // Creates random index based on length of the movies list in API call.  Used to pass a random movie ID and movie title to the next API call
        let randomizeMovie = Math.floor(Math.random() * jsonResponse.results.length);
        
        filmApp.getActor(jsonResponse.results[randomizeMovie].id, jsonResponse.results[randomizeMovie].title);
    })

};

// Perform second API call (apiUrlCredits) for actors based on previously generated films
filmApp.getActor = (filmId, filmTitle) => {
    // Declaring url property for second API call to find actor and actor image
    filmApp.apiUrlCredits = `https://api.themoviedb.org/3/movie/${filmId}/credits`;

    const url = new URL(filmApp.apiUrlCredits);

    url.search = new URLSearchParams({
        api_key: filmApp.apiKey
    })

    fetch(url).then((response) => {
        return response.json();
    }).then ((jsonResponse) => {

        // Creates random index based on length of the cast list in API call.  Used to select a random actor from a random movie to be displayed
        let randomizeActor = Math.floor(Math.random() * jsonResponse.cast.length);

        // Clears out element that will be appended to on each click for next actor
        filmApp.resultDivEl.innerText = '';

        filmApp.displayActor(jsonResponse.cast[randomizeActor].name, jsonResponse.cast[randomizeActor].profile_path, jsonResponse.cast[randomizeActor].character, filmTitle);
    })
}

// Display name, image, character name, movie title on the page
filmApp.displayActor = (actorName, imgPath, characterName, filmTitle) => {

        filmApp.createPara.innerText = actorName;
        filmApp.resultDivEl.appendChild(filmApp.createPara);

        filmApp.thinkingText.innerText = `Oh! You must be thinking of:`;

        // Condition based on whether an actor has a picture URL
        if (imgPath == null) {
            filmApp.createImg.src = `./assets/noProfilePic2.jpg`;
            filmApp.createImg.alt = `Blank headshot`;
            filmApp.resultDivEl.append(filmApp.createImg);
        } else {
            filmApp.createImg.src = `https://image.tmdb.org/t/p/w200/` + imgPath;
            filmApp.createImg.alt = `Headshot of the actor ${actorName}`;
            filmApp.resultDivEl.appendChild(filmApp.createImg);
        }

        // Condition based on whether an actor has a listed character name in their respective film
        if (characterName == '') {
            filmApp.createParaTwo.innerText = `You may know them as some person from "${filmTitle}."`;
        } else {
            filmApp.createParaTwo.innerText = `You may know them as ${characterName} from "${filmTitle}".`;
        }
        
        filmApp.resultDivEl.appendChild(filmApp.createParaTwo);

        // Add to the counter after each actor is rendered
        filmApp.actorCount++;

}

// Event Listeners for find actor button
filmApp.findActor = () => {
    filmApp.findButtonEl.addEventListener ('click', () => {

        // If all dropdowns are not selected
        if (filmApp.dropdownGenreEl.value == `selectOne` || filmApp.dropdownDecadeEl.value == `selectOne` || filmApp.dropdownRatingEl.value == `selectOne`) {
            filmApp.createPara.innerText = ``;
            filmApp.createPara.innerText = `We need more information before we can uncover your elusive actor!`;
            filmApp.resultDivEl.append(filmApp.createPara);
        // If you reach the end of the actor counter, the app will cease to call the API
        } else if (filmApp.actorCount > 9) { 
            filmApp.createPara.innerText = `Someone we've never heard of!`;
            filmApp.createImg.src = `./assets/cantFind2.jpg`;
            filmApp.createImg.alt = `Angry man with beard and glasses`;
            filmApp.resultDivEl.append(filmApp.createImg);
            filmApp.createParaTwo.innerText = `Try a new search and we'll see if that actor can be found (how many could there be?)`;
            filmApp.resultDivEl.appendChild(filmApp.createParaTwo);
            filmApp.findButtonEl.style.display = "none";
            filmApp.resetButtonEl.style.flexBasis = "100%";
            filmApp.resetButtonEl.style.borderLeft = "0.2rem solid #ba4e4e";
        } else {
            filmApp.getFilmID(filmApp.dropdownGenreEl.value, filmApp.dropdownDecadeEl.value, filmApp.dropdownRatingEl.value);
            filmApp.findButtonEl.textContent = `Try another...`;
            filmApp.dropdownGenreEl.disabled = true;
            filmApp.dropdownDecadeEl.disabled = true;
            filmApp.dropdownRatingEl.disabled = true;
        }
    })
}

// Event Listeners for reset button
filmApp.reset = () => {
    filmApp.resetButtonEl.addEventListener ('click', () => {
        filmApp.actorCount = 0;
        filmApp.findButtonEl.textContent = `Could it be...`;
        filmApp.thinkingText.innerText = ``;
        filmApp.dropdownGenreEl.value = `selectOne`;
        filmApp.dropdownDecadeEl.value = `selectOne`;
        filmApp.dropdownRatingEl.value = `selectOne`;
        filmApp.createPara.innerText = ``;
        filmApp.createParaTwo.innerText = ``;
        filmApp.createImg.src = ``;
        filmApp.createImg.alt = ``;
        filmApp.dropdownGenreEl.disabled = false;
        filmApp.dropdownDecadeEl.disabled = false;
        filmApp.dropdownRatingEl.disabled = false;
        filmApp.findButtonEl.style.display = "inline-block";
        filmApp.resetButtonEl.style.flexBasis = "28%";
        filmApp.resetButtonEl.style.borderLeft = "none";
    })
}

// Declare filmApp init method
filmApp.init = () => {
    filmApp.findActor();
    filmApp.reset();
}

// Call the init method
filmApp.init();
