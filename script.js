const base_url = 'https://api.github.com/search/issues?q=created%3A%3E%3D2019-10-01+created%3A%3E%3D2019-10-31+author%3A';

const ENTER_KEY = 13;
const pull_request_list = document.getElementById('pull-requests');
const user_info = document.getElementById('user-info');

document.getElementById("search").addEventListener("click", function(){
	let userName = document.getElementById('userName').value;
	document.getElementById('userName').value = "";
	let request = new XMLHttpRequest();
	let url = base_url + userName +"+type%3Apr";
	request.open('GET', url, true);

	request.onload = function() {
		var responseText = request.responseText;
		let json = JSON.parse(responseText);

		if (!responseText || json.total_count === 0) {
			return;
		}
		
		let pullRequests = json.items;

		setupUserDetails(userName, pullRequests[0]);

		for (let index = 0; index < pullRequests.length; index++) {
			let pullRequest = pullRequests[index];
			let prUrl = pullRequest.url;
			let prRepo = pullRequest.repository_url;
			let prTitle = pullRequest.title;
			let prBody = pullRequest.body;
			
			let liElem = document.createElement('li');
			let anchroElem = document.createElement('a');
			anchroElem.setAttribute('href', prUrl);
			anchroElem.innerHTML = prTitle;
			liElem.appendChild(anchroElem);
			
			//liElem.innerHTML = "Url " + prUrl + " | repo " + prRepo + " | title " + prTitle + " | body " + prBody;
			pull_request_list.appendChild(liElem);
		}

	}

	request.onerror = function() {
		console.log("Error");
	};

	request.send();

});

document.getElementById("userName").addEventListener("keyup", function(event) {
  if (event.keyCode === ENTER_KEY) {
    event.preventDefault();
    document.getElementById("search").click();
  }
});


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
