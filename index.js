//This js functionality is abased on the Bulma CSS framework
const autoCompleteConfig = {
    renderOption(movie) {
        let imgSRC;
        if (movie.Poster === 'N/A') {
            imgSRC = '';
        } else {
            imgSRC = movie.Poster;
        }
        return `
            <img src="${imgSRC}">
            ${movie.Title} (${movie.Year})
        `;
    },

    inputValue(movie) {
        return movie.Title;
    },

    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '6f871ed9',
                s: searchTerm
            }
        });
        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }

};

createAutoComplete({
    //"...autoCompleteConfig" means make a copy of autoCompleteConfig function
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },

});

createAutoComplete({
    //"...autoCompleteConfig" means make a copy of autoCompleteConfig function
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },

});

let leftMovie;
let rightMovie;
async function onMovieSelect(movie, summaryElement, side) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '6f871ed9',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
}

function runComparison() {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStats, index) => {
        const rightStats = rightSideStats[index];
        console.log(leftStats, rightStats);

        const leftStatValues = parseInt(leftStats.dataset.value);
        const rightStatValues = parseInt(rightStats.dataset.value);

        if (leftStatValues > rightStatValues) {
            leftStats.classList.remove('is-primary');
            leftStats.classList.add('is-warning');
        } else {
            rightStats.classList.remove('is-primary');
            rightStats.classList.add('is-warning');
        }
    })
}

function movieTemplate(movieDetails) {
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));


    const metaScores = parseInt(movieDetails.Metascore);


    const imdbRatings = parseFloat(movieDetails.imdbRating);


    const imdbVote = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

    let counter = 0;
    const awards = movieDetails.Awards.split(' ').forEach((word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return;
        } else {
            counter = counter + value;
        }
    });
    console.log(counter);




    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">  
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${counter} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScores} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRatings} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVote} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB votes</p>
        </article>
    `;
}