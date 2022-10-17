let RES_SHIPPING = "";										//Variable to response data for items
let SHIPPING_INDEX = "";									//Variable to maintain index of shipping type
let json_order = "";										//JSON object for local storage

//FUNCTION retrieve items from Menu page
//Clean up items by totaling up each items 
//Use cleaned up items for POST ORDER
//Propagate Items and shipping for Display
function getItem() {
	try {

		let str = localStorage.getItem('alpha').split('0x001');
		let total_i = JSON.parse(localStorage.getItem('bravo'));
		document.getElementById('counter').innerHTML = '<p>' + total_i + '</p>'; //add total to header cart count

		const orders = new Map();							//Map to collect condensed temp array items
		const temp = [];									//Array to collect Items for post

		let elem;											//element to hold HTML DOM
		for (x in str) {									//Loop through local storage string
			elem = document.createElement('object');		//create html dom
			elem.innerHTML = JSON.parse(str[x]);			//convert string into html dom
			temp.push(elem.textContent);					//push title of string object into array
        }

		temp.sort();										//sort array for map
		
		var z = 1;											//Combine totals of each item for Map									
		for(var i = 0; i < temp.length; i++) {
			var y = i;										
			while (y < temp.length-1 && temp[y] == temp[y + 1]) {	
				z++;										
				y++;										
			}
			i = y;											
			orders.set(temp[i], z);							
			z = 1;											
		}

		while (temp.length > 0) {							//remove all elements from array, bc there might be duplicates
			temp.shift();
		}

		orders.forEach(function (value, key){				//Get exactly item names w/o duplicates for POST resquest
			temp.push(key);
		})

		const xhttp = new XMLHttpRequest();					//Start Post Request
		xhttp.open("POST", "/order", true);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(JSON.stringify(temp));					

		xhttp.onload = () => {
			if (xhttp.readyState === xhttp.DONE) {
				if (xhttp.status === 200) {
					let res = JSON.parse(xhttp.response);				//store response from query getItems + getShipping

					let res_items = res.data[0];						//Store items from response
					RES_SHIPPING = res.data[1];							//send response data for shipping to global variable
					SHIPPING_INDEX = RES_SHIPPING.length - 1;			//Store item length for RES_SHIPPING array

					//Set up default Shipping Item (Pick-up)
					document.getElementById('shipping_title').innerHTML = '<h4>' + RES_SHIPPING[SHIPPING_INDEX].agent_type + '</h4>';
					document.getElementById('shipping_cost').innerHTML = '<p>+ $' + parseFloat(RES_SHIPPING[SHIPPING_INDEX].agent_cost).toFixed(2) + '</p>';
					document.getElementById('shipping_img').style.backgroundImage = 'url(\"../img/' + RES_SHIPPING[SHIPPING_INDEX].agent_type + '.png\")'; //Select shipping icon

					document.getElementById('zip').style.opacity = '0.2';
					document.getElementById('zip').style.borderLeft = 'solid 5px #f4f0ec';
					document.getElementById('zip').disabled = true;			//disable zip input tag bc pick up is default

					//Create JSON obect of shipping details for Receipt POST
					json_order = '{"Shipping" : [{"shipping_id" : "' + RES_SHIPPING[SHIPPING_INDEX].agent_id + '", "shipping_type": "' + RES_SHIPPING[SHIPPING_INDEX].agent_type + '", "shipping_cost": "' + RES_SHIPPING[SHIPPING_INDEX].agent_cost + '" }]}';

					localStorage.setItem('delta', json_order);		//Add default shipping to the local storage for Receipt page

					fillCard(orders, res_items);					//Function to fill in item-card partials
					fillLabel(orders, res_items, total_i);			//Function to fill summary labels
				}
			}
		};
	}
	catch (err) {
		console.log('local storage empty:', err);
		alert('REDIRECTING (301) TO HOME PAGE \n Possible Reasons: \n -No Items in Cart');
		window.location = '/';
	}
}

//FUNCTION to display items in cards 
//PARAMETERS: orders_select contains items from MAP used for POST REQUEST
//PARAMENTES: response contains item details from POST RESPONSE
function fillCard(orders_select, response) {

	let cards = document.getElementById('item_container');			//Get card partial

	for (let i = 0; i < response.length; i++) {						//create extra cards based on items selected from menu

		let card_count = orders_select.get(response[i].meal_name.toUpperCase());	//Get total of individual item
		let card_name = response[i].meal_name;										//Get the name of the item (response)
		let card_desc = response[i].meal_desc;										//Get item description (response)
		let card_cost = parseFloat(response[i].meal_cost).toFixed(2);				//Get item cost in float format

		//WE MIGHT HAVE TO CREATE THE ITEM_CONTAINER rather than copying it

		cardColorFill(card_name.toUpperCase());										//Fill color of card baed on meal_name(DB)
		
		document.getElementById('item_count').innerHTML = '<p>' + card_count + '</p>';

		document.getElementById('item_title').innerHTML = '<h3>' + card_name + '</h3>';

		document.getElementById('item_desc').innerHTML = '<p>' + card_desc + '</p>';

		document.getElementById('item_cost').innerHTML = '<p>Cost:<p>' + '<p>' + card_cost + '</p>';
		
		//cardColorFill(card_name.toUpperCase());

		if (i < response.length - 1) {								//IF another Item remains, then duplicate it and append
			let elemClone = document.createElement('div');
			elemClone.setAttribute('id', cards.getAttribute('id'));
			elemClone.classList.add(card_name.toLowerCase());		//add new class name for css cardColorFill
			elemClone.innerHTML = cards.innerHTML;
			cards.after(elemClone);
			
		}
		else {
			cards.classList.add(card_name.toLowerCase());
        }

		//cardColorFill(card_name.toUpperCase());
	}
}

//#item_container gets overridden when new element is cloned @ fillCard(param, param)
function cardColorFill(mealName) {
	if (mealName == 'INSECTIVORE') {
		console.log('insect');
		document.getElementById('item_count').style.backgroundColor = '#DD215C';
		document.getElementById('item_img').style.backgroundImage = 'url(\"../img/insc.png\")';
		document.getElementById('item_title').style.backgroundColor = '#DD215C';
		document.getElementById('item_title').style.borderRightColor = '#be0202';
		document.getElementById('item_desc').style.borderTopColor = '#DD215C';
		document.getElementById('item_desc').style.borderRightColor = '#DD215C';
		document.getElementById('item_desc').style.borderBottomColor = '#DD215C';
		document.getElementById('item_cost').style.backgroundColor = '#DD215C';
		document.getElementById('item_cost').style.borderLeftColor = '#be0202';
		return;
	}
	if (mealName == 'CARNIVORE') {
		console.log('carnivore');
		document.getElementById('item_count').style.backgroundColor = '#38BEFF';
		document.getElementById('item_img').style.backgroundImage = 'url(\"../img/lizard_bbq.png\")';
		document.getElementById('item_title').style.backgroundColor = '#38BEFF';
		document.getElementById('item_title').style.borderRightColor = 'rgb(6, 146, 213)';
		document.getElementById('item_desc').style.borderTopColor = '#38BEFF';
		document.getElementById('item_desc').style.borderRightColor = '#38BEFF';
		document.getElementById('item_desc').style.borderBottomColor = '#38BEFF';
		document.getElementById('item_cost').style.backgroundColor = '#38BEFF';
		document.getElementById('item_cost').style.borderLeftColor = '#0692D5';
		return;
	}
	//else if (mealName == 'PESCIVORE') {
	if (mealName == 'PESCIVORE'){
		console.log('pesc');
		document.getElementById('item_count').style.backgroundColor = '#FC6E2E';
		document.getElementById('item_img').style.backgroundImage = 'url(\"../img/pesc.png\")';
		document.getElementById('item_title').style.backgroundColor = '#FC6E2E';
		document.getElementById('item_title').style.borderRightColor = '#FC3B00';
		document.getElementById('item_desc').style.borderTopColor = '#FC6E2E';
		document.getElementById('item_desc').style.borderRightColor = '#FC6E2E';
		document.getElementById('item_desc').style.borderBottomColor = '#FC6E2E';
		document.getElementById('item_cost').style.backgroundColor = '#FC6E2E';
		document.getElementById('item_cost').style.borderLeftColor = '#FC3B00';
		return;
	}
	//else {
		//console.log('default color');
		//return;
	//}
}


//FUNCTION to populate Summary Container
//PARAMETERS: orders_select contains items from MAP used for POST REQUEST
//PARAMENTES: response contains item details from POST RESPONSE
//PARAMETERS: total_items is total items sent to POST REQUEST
function fillLabel(orders_select, response, total_items) {

	document.getElementById('total_items').textContent += total_items;		//Append total items counted for summary
	let labels = document.getElementById('summary_items');					//Get summary partial
	let item_name;
	let item_count;
	let total;

	json_order = '{"Items" : [';											//JSON object for RECIEPT PPOST
	
	for (let i = 0; i < response.length; i++) {								//Loop through post response items to populate summary
		item_id = response[i].meal_id;										//Get response ID for Receipt post
		item_name = response[i].meal_name;									//Get response meal_name for Receipt post
		item_count = orders_select.get(response[i].meal_name.toUpperCase());	//Get item name for summary
		item_cost = parseFloat(response[i].meal_cost).toFixed(2);				//Get item cost for total
		total = parseFloat(orders_select.get(response[i].meal_name.toUpperCase())).toFixed(2);	//Set up total
		total *= parseFloat(response[i].meal_cost).toFixed(2);					//mulitply cost with total of item for total

		json_order += '{"meal_id" : "'+item_id+ '", "meal_name" : "' + item_name + '" , "quantity" : "' + item_count + '" , "Total" : "' + total + '", "meal_cost" : "' + item_cost + '"}';

		document.getElementById('summary_desc').innerHTML = '<p>'
			+ item_name + ': ' + item_count + ' x ' + item_cost + ' = $' + total.toFixed(2) + '</p>';

		if (i < response.length - 1) {									//Check to see if there was another item for summary
			json_order += ' , ';										// add to JSON object
			let elemClone = document.createElement('div');
			elemClone.setAttribute('id', labels.getAttribute('id'));
			elemClone.innerHTML = labels.innerHTML;
			labels.after(elemClone);
		}

		total = 0;														// reset total accumulated for each label
	}
	json_order += ']}';													//Close JSON object
	localStorage.setItem('charlie', json_order);						//update local storage with summary items for Reciept Post
}

//FUNCTION this controls the shipping choice in the Summary container
function shippingTurnstile(e) {
	let zipInput = document.getElementById('zip');

	(e.target.id == 'left_arrow') ? SHIPPING_INDEX-- : SHIPPING_INDEX++;	//increment index based on left or right arrow click

	if (SHIPPING_INDEX > RES_SHIPPING.length - 1) {
		SHIPPING_INDEX = 0;
	}
	if (SHIPPING_INDEX < 0) {
		SHIPPING_INDEX = RES_SHIPPING.length - 1;
	}

	document.getElementById('shipping_title').innerHTML = '<h4>' + RES_SHIPPING[SHIPPING_INDEX].agent_type + '</h4>';
	document.getElementById('shipping_cost').innerHTML = '<p>+ $' + parseFloat(RES_SHIPPING[SHIPPING_INDEX].agent_cost).toFixed(2) + '</p>';
	document.getElementById('shipping_img').style.backgroundImage = 'url(\"../img/' + RES_SHIPPING[SHIPPING_INDEX].agent_type + '.png\")'; //Select shipping icon

	if (RES_SHIPPING[SHIPPING_INDEX].agent_type == 'Pick-up') {				//Disable Input Zip box IF Pick-up selected
		zipInput.style.opacity = '0.2';
		zipInput.style.borderLeft = 'solid 5px #f4f0ec';
		zipInput.disabled = true;
	}
	else {
		zipInput.style.opacity = '1';
		zipInput.style.borderLeft = 'solid 5px crimson';
		zipInput.disabled = false;
	}

	json_order = '{"Shipping" : [{"shipping_id" : "' + RES_SHIPPING[SHIPPING_INDEX].agent_id + '", "shipping_type": "' + RES_SHIPPING[SHIPPING_INDEX].agent_type + '", "shipping_cost": "' + RES_SHIPPING[SHIPPING_INDEX].agent_cost + '" }]}';
	localStorage.setItem('delta', json_order);								//Update local storage for Receipt Post
} 

//FUNCTION to prep Receipt post when 'Place order' is clicked
//PARAMETER: event is the click event for submit form 
function submitForm(event) {
	event.preventDefault();

	const formData = new FormData(event.target);				//Get input data from FORM
	const plainForm = Object.fromEntries(formData.entries());	//Set input stringification for local storage

	localStorage.setItem('echo', JSON.stringify(plainForm));	//update local storage for Recepeit POST 
	window.location = '/receipt';								//Send off for receipt page
}

window.addEventListener('DOMContentLoaded', getItem, false);
window.addEventListener('submit', submitForm, false);

window.onload = () => {												//anonymous function to detect clicks on shipping card 
	let arrowLeft = document.getElementById('left_arrow');
	let arrowRight = document.getElementById('right_arrow');

	arrowLeft.addEventListener('click', function (e) { shippingTurnstile(e); }, false);
	arrowRight.addEventListener('click', function (e) { shippingTurnstile(e); }, false);
}