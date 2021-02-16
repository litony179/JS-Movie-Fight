async function fetchData(searchTerm) {
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
};

const root = document.querySelector('.autocomplete');



root.innerHTML = `
    <label><b>Search for a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsContainer = document.querySelector('.results');

//This functionality is to limit the amount of requests that we are making to the API

async function onInput(event) {
    const movies = await fetchData(event.target.value);
    if (movies.length === 0) {
        dropdown.classList.remove('is-active');
        return;
    }
    resultsContainer.innerHTML = '';
    //Open drop down menu after data fetch
    dropdown.classList.add('is-active');
    for (let i = 0; i < movies.length; i++) {
        const option = document.createElement('a');
        let imgSRC;
        if (movies[i].Poster === 'N/A') {
            imgSRC = '';
        } else {
            imgSRC = movies[i].Poster;
        }
        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src="${imgSRC}">
            ${movies[i].Title}
       `;

        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movies[i].Title;
        });

        resultsContainer.appendChild(option);
    }
}

input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {
    if (root.contains(event.target) === false) {
        dropdown.classList.remove('is-active');
    }
});