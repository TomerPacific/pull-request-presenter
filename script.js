const base_url = 'https://api.github.com/search/issues?q=created%3A%3E%3D2021-10-01+created%3A%3E%3D2021-10-31+author%3A';

const ENTER_KEY = "Enter";
const REQUIRED_AMOUNT_OF_PULL_REQUESTS = 4;
const pull_request_list = document.getElementById('pull-requests');
const user_info = document.getElementById('user-info');
const progressDiv = document.getElementById('progress');
const loader = document.getElementsByClassName('loader');

loader[0].style.display = "none";

function setupSearchButtonListener() {
	document.getElementById("search").addEventListener("click", function(){
		document.getElementById('title').style.display = "none";
		let userName = document.getElementById('userName').value;
	
		if (userName.length === 0) return;
	
		//show loader
		loader[0].style.display = "block";
	
		document.getElementById('userName').value = "";
		fetchUserDetails(userName);
	});	

	document.getElementById("userName").addEventListener("keyup", function(event) {
		let keyCode;

		if (event.key !== undefined) {
			keyCode = event.key;
		  } else if (event.keyIdentifier !== undefined) {
			keyCode = event.keyIdentifier;
		  } else if (event.keyCode !== undefined) {
			keyCode = event.keyCode;
		  }

		if (keyCode === ENTER_KEY) {
		  event.preventDefault();
		  document.getElementById("search").click();
		}
	  });
}

function fetchUserDetails(userName) {
	let request = new XMLHttpRequest();
	let url = base_url + userName +"+type%3Apr";
	
	request.open('GET', url, true);

	request.onload = function() {
		user_info.innerHTML = "";
		pull_request_list.innerHTML = "";
		progressDiv.innerHTML = "";
		var responseText = request.responseText;
		let json = JSON.parse(responseText);
		
		loader[0].style.display = "none";

		if (!responseText || json.total_count === 0) {
			user_info.innerHTML = "There is no information for " + userName;
			return;
		}

		if (json.hasOwnProperty('errors')) {
			presentErrorMessage(json.errors[0]);
			return;
		}
		
		document.getElementById('title').style.display = "block";
		let pullRequests = json.items;
		var amountOfPRForNonOwnerRepositories = 0;
		setupUserDetails(userName, pullRequests[0]);

		for (let index = 0; index < pullRequests.length; index++) {

			let pullRequest = pullRequests[index];

			if (pullRequest["author_association"] == "OWNER") {
				continue;
			}
			
			amountOfPRForNonOwnerRepositories++;

			let prUrl = pullRequest.html_url;
			let prTitle = pullRequest.title;
			
			let liElem = document.createElement('li');
			let anchroElem = document.createElement('a');
			anchroElem.setAttribute('href', prUrl);
			anchroElem.innerHTML = prTitle;
			liElem.appendChild(anchroElem);
			
			pull_request_list.appendChild(liElem);
		}

		setupPullRequestProgressData(amountOfPRForNonOwnerRepositories);
	}

	request.onerror = function() {
		console.log("Error");
	};

	request.send();
}

function setupPullRequestProgressData(amountOfPRForNonOwnerRepositories) {
	let progressHeader = document.createElement('h3');
	progressHeader.innerHTML = "You have made " + amountOfPRForNonOwnerRepositories + " PRs!";
	if (amountOfPRForNonOwnerRepositories >= REQUIRED_AMOUNT_OF_PULL_REQUESTS) {
		progressHeader.innerHTML += " Way To Go!";
		let parrotBadgeImg = document.createElement('IMG');
		parrotBadgeImg.setAttribute('src', './assets/parrot-badge.png');
		parrotBadgeImg.setAttribute('id', 'parrot_badge');
		progressDiv.appendChild(parrotBadgeImg);
	}

	progressDiv.appendChild(progressHeader);
}


function setupUserDetails(userName, details) {
	let userAvatar = details.user.avatar_url;
	let imageElem = document.createElement('IMG');
	let figCaptionElem = document.createElement("FIGCAPTION");
	let figureElem = document.createElement("FIG");
	let anchorElem = document.createElement('a');

	anchorElem.setAttribute('href', details.user.html_url);
	anchorElem.setAttribute('target', "_blank");
	anchorElem.innerHTML =  "@" + userName;
	figCaptionElem.appendChild(anchorElem);

	imageElem.setAttribute('src', userAvatar);
	imageElem.setAttribute('class', 'avatar');
	imageElem.setAttribute('alt', 'user-avatar');
	imageElem.setAttribute('title', userName + "'s avatar");


	figureElem.appendChild(imageElem);
	figureElem.appendChild(figCaptionElem);

	user_info.appendChild(figureElem);
}

function presentErrorMessage(error) {
	user_info.innerHTML = "An error has occurred " + error.message;
}

setupSearchButtonListener();
