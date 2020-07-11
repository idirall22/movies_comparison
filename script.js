const apiBaseURL = "http://www.omdbapi.com/";
const apiKey = "bff3f596";
let leftMovie;
let rightMovie;

const fetchMovie = async (searchTerm) => {
    try{
        const response = await axios.get(apiBaseURL, {
            params: {
                apikey: apiKey,
                S: searchTerm
            }
        });
        if(response.data.Error){
            return [];
        }
        return response.data.Search;
    }catch(e){
        console.log(e)
    }
}

onMovieSelect = async (movie, elm, side)=>{
    console.log(movie)

    const response = await axios.get(apiBaseURL, {
        params:{
            apikey: apiKey,
            I: movie.imdbID
        }
    })
    elm.innerHTML = movieTemplate(response.data)
    if(side === "left"){
        leftMovie = response.data
    }else{
        rightMovie = response.data
    }
    // console.log(response.data)
    
    if (leftMovie && rightMovie){
        compareMovies()
    }
}

const compareMovies = ()=>{
    const leftSummary = document.querySelectorAll("#left-summary .notification")
    const rightSummary = document.querySelectorAll("#right-summary .notification")

    leftSummary.forEach((leftSection, index)=>{
        const rightSection = rightSummary[index]

        const leftValue = leftSection.dataset.value
        const rightValue = rightSection.dataset.value

        console.log(leftValue , rightValue)
        console.log(leftValue > rightValue)
        if(leftValue < rightValue){
            leftSection.classList.remove("is-primary")
            leftSection.classList.add("is-warning")
        }else{
            rightSection.classList.remove("is-primary")
            rightSection.classList.add("is-warning")
        }

        console.log(leftValue, rightValue)
    })
}

movieTemplate = (movieDetails)=>{
    const boxOffice = parseInt(movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, ""))
    const metascore = parseInt(movieDetails.Metascore)
    const imdbRating = parseFloat(movieDetails.imdbRating)
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""))
    let awards =0;
    movieDetails.Awards.split(' ').forEach(word=>{
        const value = parseInt(word)
        if(!isNaN(value)){
            awards+=value
        }
    });
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetails.Poster}" />
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
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetails.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${boxOffice} class="notification is-primary">
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetails.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetails.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetails.imdbVotes}</p>
        <p class="subtitle">IMDBVotes</p>
    </article>
    `
}

createAutoComplete({
    root: document.querySelector("#left-autocomplete"),
    renderOption: (movie) => {
        const imgSrc = movie.Poster === "N/A" ? "": movie.Poster
        return `
            <img src="${imgSrc}" width="50"/>
            ${movie.Title}-${movie.Year}
        `
    },
    onOptionSelect: onMovieSelect,
    searchKey:"Title",
    fetchData: fetchMovie
})

const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === "N/A" ? "": movie.Poster
        return `
            <img src="${imgSrc}" width="50"/>
            ${movie.Title}-${movie.Year}
        `
    },
    
    searchKey:"Title",
    fetchData: fetchMovie
}

createAutoComplete({
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect: (movie) =>{
        document.querySelector(".tutorial").classList.add("is-hidden")
        onMovieSelect(movie, document.querySelector("#left-summary"), "left")
    },
    ...autoCompleteConfig    
})

createAutoComplete({
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect: (movie) =>{
        document.querySelector(".tutorial").classList.add("is-hidden")
        onMovieSelect(movie, document.querySelector("#right-summary"), "right")
    },
    ...autoCompleteConfig    
})


