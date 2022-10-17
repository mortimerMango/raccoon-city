//Function to change the background-image according to the day of the week (home)
function theDay() {

	const week = ['sunday.gif', 'monday.gif', 'tuesday.gif', 'wednesday.gif', 'thursday.gif', 'friday.gif', 'saturday.gif'];
	const day = new Date();													//Get current date
	let dayOf = day.getDay();												//Get index of current day

	let getDay = "url(\"../img/" + week[dayOf] + "\")";						//Use index dayOf to deterime which day gif to use

	document.getElementById(['op-day']).style.backgroundImage = getDay;		//Set the day of the week on index page
}

window.addEventListener('DOMContentLoaded', theDay, false);