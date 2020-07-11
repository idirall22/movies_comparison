createAutoComplete = ({ root, renderOption, onOptionSelect, searchKey, fetchData })=>{
    root.innerHTML = `
        <div class="">
            <label><b>Search For a Movie</b></label>
            <input class="input"/>
        </div>
            <div class="dropdown">
                <div class="dropdown-menu">
                    <div class="dropdown-content results">
                    </div>
                </div>
            </div>
    `       
    const dropdown = root.querySelector(".dropdown")
    const searchResults = root.querySelector(".results")
    const input = root.querySelector("input");

    const onInput = async event => {
        const searchTerm = event.target.value;
        searchResults.innerHTML = "";
    
        if(searchTerm.length < 3){
            console.log("Search term too short")
            return
        }
        
        const items = await fetchData(searchTerm)
        dropdown.classList.add("is-active")
    
        for(let item of items){
            const option = document.createElement("a")
            option.classList.add("dropdown-item")
            option.innerHTML = renderOption(item)
    
            option.addEventListener("click", (e)=>{
            dropdown.classList.remove("is-active")
            input.value = item[searchKey]
            onOptionSelect(item)
            return
            })
            searchResults.appendChild(option);
        }
    }        
    
    input.addEventListener("input", debounce(onInput));

    document.addEventListener("click", (e)=>{
        dropdown.classList.remove("is-active")
    })
}

