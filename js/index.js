var buttonsArray;

showProfiles();

document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        text = target.textContent || target.innerText;

    changeSelection(target);
}, false);

function changeSelection(elem) {
	var parentDiv = elem.parentElement.parentElement;
	var children = parentDiv.getElementsByTagName("input");
	
	/* Changing visual */
	for (var i = 0; i < children.length; i++) {
		if(elem.type == 'button' && children[i].type == 'button')
			children[i].style.backgroundColor = "red";
	}	
	
	if(elem.type == 'button') {
		elem.style.backgroundColor = "green";
		document.getElementById('schedule').style.display = 'none';
	}

	if(elem.tagName )
	if(parentDiv.id == "group") {
		document.getElementById("submitButton").disabled = false;
	}
	else if(parentDiv.id == "profile" || parentDiv.id == "language" ||parentDiv.id == "year") {
		document.getElementById("submitButton").disabled = true;
	}
}

function showProfiles() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var rez = this.responseText;
			rez = rez.split(',');
			var divToAdd = '<div class="btn-group button-row">\n';
			for (var i = 0; i < rez.length; i++) {
				rez[i] = rez[i].trim();
				divToAdd += '	<input type="button" class="btn btn-primary btn-md col-4 active" value="'+ rez[i] + '" onclick="getAvailableLanguages(\''+rez[i]+'\')">\n'
			}
			divToAdd += '</div>\n';
			document.getElementById("profile").innerHTML += divToAdd;
		}
	};
	xmlhttp.open("GET", "request.php?profile=all", true);
	xmlhttp.send();
}

/* On profile change this function returns the available languages for the selected profile */
function getAvailableLanguages(profile) {
	var input_props = ' type="button" class="btn btn-primary btn-md col-6"';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var rez = this.responseText;
			rez = rez.split(',');		
			var divToAdd = "<span>Limba</span>\n<hr />";
			for (var i = 0; i < rez.length; i++) {
				if (i % 2 == 0)
					divToAdd += '<div class="btn-group button-row row">\n';
				rez[i] = rez[i].trim();
				divToAdd += '	<input' + input_props +' value="'+ rez[i] + '" onclick="getAvailableYear(\''+ profile.trim() +'\', \''+rez[i]+'\')">\n';
				if (i % 2 == 1)
					divToAdd += '</div>\n';
			}
			document.getElementById("language").innerHTML = divToAdd;
		}
	};
	xmlhttp.open("GET", "request.php?language=" + profile, true);
	xmlhttp.send();
}


function getAvailableYear(profile, language) {
	var input_props = ' type="button" class="btn btn-primary btn-md col-4"';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var rez = this.responseText;
			rez = rez.split(',');
			var divToAdd = '<span>Anul</span>\n<hr />\n<div class="btn-group button-row row">';
			for (var i = 0; i < rez.length; i++) {
				rez[i] = rez[i].trim();
				props = ["'" + profile.trim() +"'", "'" + language +"'", "'" + rez[i] +"'"];
				divToAdd += '	<input' + input_props +' value="' + rez[i] + '" onclick="getGroups('+ props +')">\n';
			}
			divToAdd += "</div>\n";
		}
		document.getElementById("year").innerHTML = divToAdd;
	};
	var specializare = profile + "," + language;
	xmlhttp.open("GET", "request.php?specializare=" + specializare, true);
	xmlhttp.send();
}

function getGroups(profile, language, year) {
	var input_props = ' type="button" class="btn btn-primary btn-md col-6"';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var rez = this.responseText;
			rez = rez.split(',');
			var divToAdd = '<span>Grupa</span>\n<hr />\n';
			for (var i = 0; i < rez.length; i++) {
				rez[i] = rez[i].trim();
				var data = ["'" + profile.trim() +"'", "'" + language +"'","'" + year + "'"];
				divToAdd += '<div class="btn-group button-row row">\n';
				divToAdd += '	<input' + input_props + ' value="' +rez[i] +'/1" onclick="getTimeTable([' + data + ',\'' + rez[i] + '/1\'])">\n';
				divToAdd += '	<input' + input_props + ' value="' +rez[i] +'/2" onclick="getTimeTable([' + data + ',\'' + rez[i] + '/2\'])">\n';
				divToAdd += '</div>\n';
			}
			document.getElementById('group').innerHTML = divToAdd;
		}
	};
	var specAndYear = profile + "," + language + "," + year;
	xmlhttp.open("GET", "request.php?specAndYear=" + specAndYear, true);
	xmlhttp.send();
}			

function getTimeTable(data) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var rez = this.responseText;
			var par = document.getElementById('schedule');
			rez = rez.split(';');
			var divToAdd = '<table id="scheduleTable">';

			for (var i = 0; i < rez.length; i++) {
				var course = rez[i].split(',');
				var day = course[3]; var hour = course[4];
				var frequency = course[5]; var room = course[6];
				var type = course[8]; var name = course[9];

				divToAdd += '<tr class="' + day + '">';
				divToAdd += '	<td>' + day + ',' + frequency + '</td>';
				divToAdd += '	<td>' + hour + '</td>';
				divToAdd += '	<td>' + room + '</td>';
				divToAdd += '</tr>';
				divToAdd += '<tr class="after_' + day + '">';
				divToAdd += '	<td colspan="3">' + type + ' ' + name + '</td>';
				divToAdd += '</tr>';
			}
			divToAdd += '</table>';
			par.innerHTML = divToAdd;
		}
	}
	formatted_data = data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3];
	xmlhttp.open("GET", "request.php?data=" + formatted_data, true);
	xmlhttp.send();
}

function showTimeTable() {
	document.getElementById('schedule').style.display = 'block';
}