//variable for listening to user input of movie
const input = document.querySelector('input');

async function fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '6f871ed9',
            s: searchTerm
        }
    });

    console.log(response.data);
};

//Debounce the movie
function debounce(func, delay = 1000) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

//This functionality is to limit the amount of requests that we are making to the API


const onInput = debounce((event) => {
    fetchData(event.target.value);
}, 500);
input.addEventListener('input', onInput);