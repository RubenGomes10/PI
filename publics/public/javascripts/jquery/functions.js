function getComments(advertisementId, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', '/adds/' + advertisementId + '/comments');

	request.setRequestHeader('accept', 'text/plain');
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200)
		{
			var comments = [];

			var split = request.responseText.split('#');
			if(split.length == 0) {
				callback(null);
				return;
			}

			for(var i = 1; i < split.length; i++) {
				var fields = split[i].split(',');

				if(fields.length == 2) 
				{
					comments.push( {
						usernameuser: fields[0],
						description: fields[1]
					});
				}
			}

			if(comments.length == 0)
				callback(null);
			else
				callback(createHTML(comments));
		}
	};
	request.send();
}

function createHTML(comments) {
	var commentsDiv = document.createElement("div");
	commentsDiv.setAttribute('id', 'comments');
	commentsDiv.setAttribute('class', 'collapse');

	comments.forEach(function(comment) {
		var div1 = document.createElement("div");
		div1.setAttribute('class', 'panel panel-default');

			var div2 = document.createElement("div");
			div2.setAttribute('class', 'panel-heading');

				var div3 = document.createElement("div");
				div3.setAttribute('class', 'post btn-group');
				div3.setAttribute('role', 'group');

					var button1 = document.createElement("button");
					button1.setAttribute('class', 'btn btn-default');

						var span1 = document.createElement("span");
						span1.setAttribute('class', 'glyphicon glyphicon-user');
						span1.setAttribute('aria-hidden', 'true');
						button1.appendChild(span1);

					div3.appendChild(button1);

					var button2 = document.createElement("button");
					button2.setAttribute('class', 'btn btn-default');

						var span2 = document.createElement("span");
						span2.setAttribute('class', 'usercomment');
						span2.innerHTML = comment.usernameuser;
						button2.appendChild(span2);

					div3.appendChild(button2);

				div2.appendChild(div3);

			div1.appendChild(div2);

			var div4 = document.createElement("div");
			div4.setAttribute('class', 'panel-body');

				var text = document.createElement('text');
				text.innerHTML = comment.description;
				div4.appendChild(text);

			div1.appendChild(div4);

		commentsDiv.appendChild(div1);
	});

	return commentsDiv;
}

// This function hides and shows an element, use it as an event listener
function hideAndShowElement(currentElement, target) {
	if($(currentElement).attr('collapsed') === 'false') {
		$(currentElement).attr('collapsed', true);
		$(target).collapse('show');
	} else {
		$(currentElement).attr('collapsed', false);
		$(target).collapse('hide');
	}
}