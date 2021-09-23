var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    //make a request to the url
    fetch(apiUrl).then(function(response){
        //function to pass response data to the displayRepos() function
        response.json().then(function(data) {
            displayRepos(data, user);
          });
    });
};
//variables to store a reference to the <form> element using each id
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
//variables to reference DOM elements
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();
    //check if a username was entered
    if (username) {
        //if yes, pass username into getUserRepos()
        getUserRepos(username);
        //clear value from the <input> element
        nameInputEl.value = "";
}   else {
        alert("Please enter a GitHub username");
}
    console.log(event);
};

//function to display repos - passing array of repo data and term we searhced for into
var displayRepos = function(repos, searchTerm) {
    console.log(repos);
    console.log(searchTerm);
    
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
  
    // create a container for each repo
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
  
    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
  
    // append to container
    repoEl.appendChild(titleEl);
  
    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML =
         "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
}    else {
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
}

// append to container
repoEl.appendChild(statusEl);
    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};
// submit event listener - when user clicks submit formSubmitHandler is activated
userFormEl.addEventListener("submit", formSubmitHandler);