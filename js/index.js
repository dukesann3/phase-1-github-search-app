
const gitHubForm = document.querySelector('form#github-form');
const userSearchInput = document.querySelector('input#search');
const userListContainer = document.querySelector('ul#user-list');
const userRepoContainer = document.querySelector('ul#repos-list');

const gitHubEndpointURL = 'https://api.github.com/search/users';
const gitRepoEndpointURL = 'https://api.github.com/users';

document.addEventListener('DOMContentLoaded', function () {

    console.log(gitHubForm);
    gitHubForm.addEventListener('submit', function (e) {
        e.preventDefault();
        fetchUser(userSearchInput.value);
    })

});

function fetchUser(userSearch) {
    //try fetch first, then use oktokit 
    const newSearchParams = {
        'q': userSearch
    }

    const searchParams = new URLSearchParams(newSearchParams);
    const newURL = gitHubEndpointURL + '?' + searchParams;

    console.log(newURL);

    const fetchedUsers = fetch(newURL)
        .then(response => response.json())
        .then((data) => {
            const { items } = data;
            console.log(items);
            for (let item of items) {
                profileCreator(item);
            }


        })
        .catch((error) => {
            console.log(error);
        });

    return fetchedUsers;
}

function getRepoOfUser(user){
    //https://api.github.com/users/octocat/repos

    const gitRepoURL = gitRepoEndpointURL + '/' + user + '/repos';
    console.log(gitRepoURL);

    fetch(gitRepoURL)
    .then(response => response.json())
    .then((data) => {
        
        for(let repo of data){
            userRepoCreator(repo);
        }

    })
    .catch((error) => {
        console.log(error);
    })

}

//takes in returned user information (single person at a time)
function profileCreator(item) {

    const listContainer = document.createElement('li');
    const avatarImg = document.createElement('img');
    const nameOfUser = document.createElement('p');
    const searchRepoBtn = document.createElement('button');

    nameOfUser.textContent = item.login;
    listContainer.appendChild(nameOfUser);

    avatarImg.setAttribute('src', item['avatar_url']);
    listContainer.appendChild(avatarImg);

    searchRepoBtn.textContent = 'Search Repo';
    listContainer.appendChild(searchRepoBtn);
    
    searchRepoBtn.addEventListener('click', function(e){
        e.preventDefault();

        if(userRepoContainer){
            userRepoContainer.textContent = '';
        }

        getRepoOfUser(item.login);
    })

    userListContainer.appendChild(listContainer);

}

function userRepoCreator(repo){
    //[{},{},...]
    //make with default_branch and description

    const individualRepoContainer = document.createElement('li');
    const branchName = document.createElement('h4');
    const repoDescription = document.createElement('p');

    branchName.textContent = repo['default_branch'];
    individualRepoContainer.appendChild(branchName);

    repoDescription.textContent = repo.description;
    individualRepoContainer.appendChild(repoDescription);

    userRepoContainer.appendChild(individualRepoContainer);

}
