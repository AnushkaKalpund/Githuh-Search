// PART - 1 initializing constant varaible 
const APIURL = "https://api.github.com/users/";

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// PART - 2 adding submit event listener
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;
    if(user) {
        getUser(user);
        search.value = '';
    }
});

// PART - 3 async await and fetching API

async function getUser(username)  {
    try {
        const res = await fetch(APIURL + username);
        if(!res.ok) {
            throw new Error();
        }
        const data = await res.json();
        console.log(data.name);
        createUserCard(data);
        getRepos(username);
    }
    catch(err) {
        createErrorCard('No profile with this username')
    }
}

// PART - 4 embedding user's profile, followers, following, repositories in html card main
function createUserCard(user) {
    const cardHtml = `
    <div class="card">
    
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar"/>
        </div>

        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>

            <ul>
                <li>
                    ${user.followers}<strong>Followers</strong>
                </li>
                <li>
                    ${user.following}<strong>Following</strong>
                </li>
                <li>
                    ${user.public_repos}<strong>Repos</strong>
                </li>
            </ul>
            <div id="repos"></div>
        </div>
    </div>
    `
    main.innerHTML = cardHtml;
}

// PART - 6 calling the repository function 
async function getRepos(username) {
    try {
        const res = await fetch(APIURL + username + '/repos?sort=created');
        const data = await res.json();

        addReposToCard(data);
    }
    catch(err) {
        createErrorCard('Problem fetching repos');
    }
}

//  PART - 5 accessing repositories 
function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");
    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");
            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}
// PART - 7 error message
function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

    main.innerHTML = cardHTML;
}