// Define the url for the fetch function
const url = "https://randomuser.me/api/?results=12&inc=email,name,picture,location,cell,dob&nat=US";

// Get the DOM element with the id of "gallery"
const gallery = document.getElementById("gallery");

// A collection of all of the "card" class elements
const profiles = document.getElementsByClassName('card');

// The body tag DOM Element
const body = document.querySelector("body");

// Set up a variable that displays the current position of the profile that is being clicked on in the array
let currentCount;

// Set up a variable that stores the results from the API call
let profileResults;

randomPerson(url)
generateSearchBar()

/** Adding in the search box */
function generateSearchBar(){
    const searchContainer = document.querySelector('.search-container')
    const searchBar = ` <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form> `
    searchContainer.insertAdjacentHTML('beforeend', searchBar)

    const input = document.getElementById("search-input")
    const submit = document.getElementById("search-submit")

    // Allows filtering when user uses their keyboard 
    input.addEventListener("keyup",(e)=>{
        for(let i = 0; i < profiles.length;i++){
            if (profiles[i].querySelector("#name").textContent.toLowerCase().includes(e.target.value.toLowerCase())){
                profiles[i].style.display = ""
            }else {
                profiles[i].style.display = "none";
            }
        }
    })

    // Allows filtering when user clicks on the search button
    submit.addEventListener("click",(e)=>{
        e.preventDefault();
        for(let i = 0; i < profiles.length;i++){
            if (profiles[i].querySelector("#name").textContent.toLowerCase().includes(input.value.toLowerCase())){
                profiles[i].style.display = ""
            }else {
                profiles[i].style.display = "none";
            }
        }
    })
}

/**
* Fetches data from the Random User API
* @url {String} url used by the fetch function
* @return {none}
*/

async function randomPerson(url){
    const random = await fetch(url);
    const randomJSON = await random.json();
    const result = await randomJSON.results;
    profileResults = result;
    GenerateHTML(profileResults);
    generateModal(profileResults);
}

/**
* Generates the innerHTML for the gallery element DOM
* @data {Array} an array containing of 12 profiles extracted from the Random User API
* @return {HTMLListElement} Appends to the innerHTML of the body DOM element
*/

function GenerateHTML(data){

    // Set up blank string for the initial html variable 
    let html = ""

    data.forEach(element => {
        html +=
        `<div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${element.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${element.name.first} ${element.name.last}</h3>
                <p class="card-text">${element.email}</p>
                <p class="card-text cap">${element.location.city}, ${element.location.state}</p>
            </div>
        </div>`
    });

    // Add to the innerHTML
    gallery.insertAdjacentHTML('beforeend', html)
}

/**
* Sets up the formatting for the modal element DOM
* @data {Array} an array containing of 12 profiles extracted from the Random User API
* @return {HTMLListElement} The innerHTML for the galley DOM element
*/

function modalSetup(data){

    // Set up blank string for the initial html variable 
    let html = ""

        html +=
        `<div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${data.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
                <p class="modal-text">${data.email}</p>
                <p class="modal-text cap">${data.location.city}</p>
                <hr>
                <p class="modal-text">${formatPhoneNumber(data.cell)}
           </p>
                <p class="modal-text">${data.location.street.number} ${data.location.street.name}, ${data.location.city}, ${data.location.state}, ${data.location.postcode}</p>
                <p class="modal-text">Birthday: ${data.dob.date.slice(5,7)}/${data.dob.date.slice(8,10)}/${data.dob.date.slice(0,4)}</p>
            </div>
        </div>

        // IMPORTANT: Below is only for exceeds tasks 
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`

    // Add to the innerHTML
    body.insertAdjacentHTML('beforeend', html)

    // Get the "X" button
    const closeButton = document.getElementById("modal-close-btn")

    // Define the modal container to remove when the button X is clicked
    let modalContainer = document.querySelector(".modal-container")

    // Add Eventlistener to remove the modal when the "X" button is clicked
    closeButton.addEventListener("click",()=>{
        modalContainer.remove();
    })

    // Set up the previous and next buttons
    const previous = document.getElementById("modal-prev")
    const next = document.getElementById("modal-next")

    previous.addEventListener("click",()=>{

        // Only change the count if there is a previous profile available 
        if (currentCount - 1 >= 0){
            currentCount --;
        }else {
            currentCount = profiles.length - 1;
        }

        modalContainer.remove();
        modalSetup(profileResults[currentCount]);
    })

    next.addEventListener("click",()=>{
        
        // Only change the count if there is a next profile available 
        if (currentCount + 1 < profiles.length){
            currentCount ++;
        } else {
            currentCount = 0;
        }

        modalContainer.remove();
        modalSetup(profileResults[currentCount]);
    })
}

// Formats the phone number string of the modal to the format of (XXX) XXX-XXXX
function formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

/**
* Generates modal when user clicks
* @data {Array} an array containing of 12 profiles extracted from the Random User API
* @return {none}
*/

function generateModal (data) {
    for (let i = 0; i < data.length; i++) {
        profiles[i].addEventListener('click', e => {
            currentCount = data.indexOf(data[i])
            modalSetup(data[currentCount]);
        })}}
