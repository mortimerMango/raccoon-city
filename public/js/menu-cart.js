$(document).ready(function (event) {
    const items = [];																	//Array to hold items added or removed
	var inc = 0;																		//Variable to hold IDs for elements (items)
	var state = true;																	//Boolean varibale for Cart click event
	var timestamp = 0;																	//Variable event time stamp to prevent duplicate rm

	checkStorage();																		//Start upon load

	//Function to Update Cart Count, 
	//add Items from selection to array, 
	//and ready items for display when drop down initiated
	function checkStorage() {
		try {
			if (localStorage.length > 0) {
				$('#counter').html('<p>' + localStorage.getItem('bravo') + '</p>');		//Update Cart Counter using Loc Storage

				let str = localStorage.getItem('alpha').split('0x001');					//Split loc Storage(Items) into array

				let newElement;															
				for (x in str) {														//Create DOM out of loc storage items
					newElement = document.createElement('li');
					newElement.setAttribute('class', 'select');
					newElement.innerHTML = JSON.parse(str[x]);
					items.push(newElement);												//Add them to array
				}
				inc = items.length;											//Upade inc from Items for Item ID (createCart())

				populateCart();												//Build cart for drop down display
			}
		}
		catch (err) {
			console.log('nothing in session storage: \n' + err);
		}
	}

	//Function to modify local storage after addition or removal of items
	function updateLocalStorage() {
		let jsonObjects = "";											//Variable to hold items to update local storage
		try {
			localStorage.removeItem('alpha');							//clear previous stored items
			localStorage.removeItem('bravo');							//clear previous total of items
			for (x in items) {											//get all items and stringify for local storage
				if (Number.parseInt(x) >= items.length - 1)
					jsonObjects += JSON.stringify(items[x].innerHTML);
				else
					jsonObjects += JSON.stringify(items[x].innerHTML) + " 0x001";	//0x001 is the delimiter
			}
		}
		catch (err) {
			console.log(err);
		}
		finally {
			localStorage.setItem('alpha', jsonObjects);					//Update local storage with update items
			localStorage.setItem('bravo', inc.toString());				//update local storage with new item total
		}
	}

	//Function to build items for drop down after clicking Cart
	function populateCart() {
		for (var i = 0; i < items.length; i++) {						//loop through items in array, and append to unordered list							
			$('#expnd').append(items[i]);								//append each element from array to unordered list
		}
	}

	//FUNCTION to create list DOM with dynmic ids and item names
	//PARAMETER itemID contains the event id that was clicked on from the menu 
	function createCart(itemID) {
		var newEl = document.createElement('li');
		newEl.setAttribute('class', 'select');
		var newItem = '<input type=\"button\" id=\"' + inc + '\" name=\"' + itemID + '\">';

		if (itemID == 'insc') {
			newItem += '<p style=\"color: #DD215C; \">INSECTIVORE</p>';

		}
		else if (itemID == 'carn') {
			newItem += '<p style=\"color: #41A0E6; \">CARNIVORE</p>';
		}
		else {
			newItem += '<p style=\"color: #FC6E2E; \">PESCIVORE</p>';
		}

		newEl.innerHTML = newItem;
		items.push(newEl);
	}

	//FUNCTION adds total to CART COUNTER
	function addToCart(e) {													
		if (inc < 10) {														//only allow 10 items to be added to the cart
			inc += 1;														//increment GLOBAL inc variable first
			$('#counter').html('<p>' + inc + '</p>');						//update html for COUNTER number in CART
			createCart(e.target.id);										//send event counting the ID of the specific clicked on item from menu
			populateCart();													//Ready cart items for drop down display
		}

		updateLocalStorage();												//Modify local storage with new item
	}

	//FUNCTION to decrement counter and update ID values in ITEMS array
	function removeFromCart(e) {												

		let index = parseInt(e.target.id);									//get ID of element to remove
		items.splice(index - 1, 1);											//splice element from array

		inc--;																//decrement ID number

		$('#counter').html('<p>' + inc + '</p>');							//change counter value to new ID count

		let x = 1;															//new ID number for elements
		for (let i = 0; i < inc; i++) {										//loop through elements in array
			items[i].firstChild.id = x++;									//change 1st child of elements in array to new ID number(1st = button id)
		}

		updateLocalStorage();												//Modify local storage with removed item
	}

	//FUNCTION to render drop down when Cart is clicked
	function openDisplay() {

		$('#indicator').css({ "display": "inline-block" });					//display arrow
		$('#black_out').fadeIn("slow");										//display blackout screen

		$('button').css("pointer-events", "none");							//Stop items from being added



		$("#cart_title").css({
			"width": "75%",
			"text-align": "left",
			"text-indent": "5px"
		});
		$('#cart')
			.css({
				"position": "relative",
				"border": "none",
				"box-shadow": "4px 4px 0px #FA522B",
				"background-color": "#FFF5EE"
			})
			.animate({
				width: '200px',
				right: '96px'
			}, "100");
    }

	//FUNCTION to render drop down closure
	function closeDisplay() {

		$('#indicator').css({ "display": "none" });						//hide arrow							
		$('#black_out').fadeOut("slow");								//hide blackout screen

		$('button').css("pointer-events", "auto");						//Allow items to be clickable again

		$("#cart_title").css({
			"width": "50%",
			"text-align": "center",
			"text-indent": "0px"
		});

		$('#cart')
			.css({
				"position": "relative",
				"border": "solid 2px black",
				"border-radius": "0px",
				"box-shadow": "none",
				"background-color": "#ffffff"
			})
			.animate({
				width: '100px',
				right: '0px'
			}, "100");
		$('#exp').slideUp('100');
    }

	//FUNCTION TO openDisplay() and closeDisplay()
	//PARAMETER event is click event of cart to stop prapagation
	$('#cart').click(function (event) {
		if (items.length <= 0)												//IF there aren't any items, don't render
			return;

		if (state) {														//Stop event display of items
			event.stopPropagation();
			openDisplay();													//Drop down to display items
			
			let setupBtn = document.createElement('li');					//create element for Setup Button
			setupBtn.setAttribute('id', 'setup');							//make new element have ID = setup
			setupBtn.innerHTML = '<a href="/order" >Continue</button>';		//setup a link to ORDER page

			$('#expnd').append(setupBtn);									//Add order button for Order page

			$("#exp").slideDown("100");

			$('input').click(function (e) {									//Detect if removal was requested 
				e.stopPropagation();										//Stop bubbling of cart element
				if (timestamp != e.timeStamp) {								//Check time stamp is not duplicated (JQ)
					rmItem(e);												//call func to remove item
				}
				else {
					console.log('not removing: time stamp matches');
                }
			});
		}
		else {
			closeDisplay();
			$('#setup').remove();											//remove Order page button after slideUp
		}

		state = !state;														//Change state for click event drop down
		
	});

	$('button').click((evt) => { addToCart(evt); });						//Check if ADD button was clicked

	function rmItem(e) {
		timestamp = e.timeStamp;											//Get time stamp of event to prevent duplicate removals
		$('.select').eq(parseInt(e.target.id) - 1).remove();				//Remove items from List of items in cart
		removeFromCart(e);													//update array containing items

		if (items.length <= 0) {											//IF ALL items were removed
			localStorage.clear();											//CLEAR ALL LOCAL STORAGE!
			$('#exp').slideUp("100", () => { state = !state; console.log('state changed'); closeDisplay() });
			$('#setup').remove();											//Render SlideUP and remove Order page button
		}
    }
});