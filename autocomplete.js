function createAutoComplete({ root, renderOption, onOptionSelect, inputValue, fetchData }) {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsContainer = root.querySelector('.results');

    //This functionality is to limit the amount of requests that we are making to the API

    async function onInput(event) {
        const items = await fetchData(event.target.value);
        if (items.length === 0) {
            dropdown.classList.remove('is-active');
            return;
        }
        resultsContainer.innerHTML = '';
        //Open drop down menu after data fetch
        dropdown.classList.add('is-active');
        for (let i = 0; i < items.length; i++) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(items[i]);

            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(items[i]);
                onOptionSelect(items[i]);
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

}