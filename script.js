const base_url = 'https://api.github.com/search/issues?q=state%3Aopen+author%3A';
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
		if (!responseText || responseText.total_count === 0) {
			return;
		}
		let json = JSON.parse(responseText);
		let pullRequests = json.items;

		let userAvatar = pullRequests[0].user.avatar_url;
		let imageElem = document.createElement('IMG');
		let spanElem = document.createElement('span');

		spanElem.innerHTML = userName;

		imageElem.setAttribute('src', userAvatar);
		imageElem.setAttribute('class', 'avatar');

		user_info.appendChild(imageElem);
		user_info.appendChild(spanElem);
		

		for (let index = 0; index < pullRequests.length; index++) {
			let pullRequest = pullRequests[index];
			let prUrl = pullRequest.url;
			let prRepo = pullRequest.repository_url;
			let prTitle = pullRequest.title;
			let prBody = pullRequest.body;
			
			let liElem = document.createElement('li');
			
			liElem.innerHTML = "Url " + prUrl + " | repo " + prRepo + " | title " + prTitle + " | body " + prBody;
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