// Number of people required for the website
const people = 12;

async function randomPerson(url){
    const random = await fetch(url)
    const randomJSON = await random.json()
    const result = randomJSON.results[0]
    return GenerateHTML(result);
}

function GenerateHTML(data){
    const gallery = document.getElementById("gallery")
    let html = ""
    html +=
    `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${data.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="card-text">${data.email}</p>
            <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
        </div>
    </div>`

    return gallery.insertAdjacentHTML('beforeend', html)
}


function generatePeople(amount){
    for (let i = 0; i < amount; i++){
        randomPerson("https://randomuser.me/api/")
    }
}

generatePeople(people);
