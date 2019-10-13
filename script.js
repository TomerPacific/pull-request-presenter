const base_url = 'https://api.github.com/search/issues?q=state%3Aopen+author%3A';
const pull_request_list = document.getElementById('pull-requests');

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
		for (let index = 0; index < pullRequests.length; index++) {
			let pullRequest = pullRequests[index];
			let prUrl = pullRequest.url;
			let prRepo = pullRequest.repository_url;
			let prTitle = pullRequest.title;
			let prBody = pullRequest.body;
			let userAvatar = pullRequest.user.avatar_url;
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