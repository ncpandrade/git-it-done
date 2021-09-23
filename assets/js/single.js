//DOM references to the respective containers
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

//assign query string to variable
var queryString = document.location.search;

//FUNCTION to dynamically link repos and issues
var getRepoName = function() {
    //get repo name from url query string
    var queryString = document.location.search;
    //isolate repo name (user name and repo name from GitHub) using split() method
    //isolate at the "=" and select [1] from new array
    var repoName = queryString.split("=")[1];
    
    //check if entered repo name is valid - if not, redirect to index.html
    if(repoName) {
        //display repo name on display
        repoNameEl.textContent = repoName;
        //pass repoName into getRepoIssues() function
        getRepoIssues(repoName);
      }
    else {
        //if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
      }
    };

//FUNCTION to request repos from API
var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    //make a get request to url
    //use .then because fetch() is asynchronous and returns Promise-based syntax
    fetch(apiUrl).then(function(response) {
        // request was successful - use .ok to check
        if (response.ok) {
          response.json().then(function(data) {
            // pass response data to dom function
            displayIssues(data);

            // check if api has paginated issues
             if (response.headers.get("Link")) {
                 //CALL displayWarning() function if more than 30 issues
                displayWarning(repo);
             }
          });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
      });

    console.log(repo);
  };
  
  //FUNCTION to display a warning when repo has more than 30 issues
  var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append to warning container
    limitWarningEl.appendChild(linkEl);
  };

  //FUNCTION that turns GitHub issues into DOM elements - function accepts a parameter called issues
  var displayIssues = function(issues) {

    //if there are no issues in a repo display to user  
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
      }

      //loop over the response data and create an <a> element for each issue
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        //add target blank attribute to open link in a new tab instead of new website
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
          typeEl.textContent = "(Pull request)";
        } else {
         typeEl.textContent = "(Issue)";
        }

        //add issue to the <a> element
        issueContainerEl.appendChild(issueEl);
// append to container
issueEl.appendChild(typeEl);
      }
};
    //CALL FUNCTION
    getRepoName();
