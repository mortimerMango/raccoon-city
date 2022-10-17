
//FUNCTION to prepare receipt details
//POST order details to DB
function receiptOrder() {
	console.log('in receiptOrder');

	if (localStorage.length <= 0) {
		alert('REDIRECTING (301) TO HOME PAGE \n Possible Reasons: \n -Refreshed Page After Order \n -No Items in Cart ');
		window.location = '/';
	}

	let post = [];
	post.push(JSON.parse(localStorage.getItem('bravo')));		//Total items in order
	post.push(JSON.parse(localStorage.getItem('charlie')));		//Items types in cart, price, quantity
	post.push(JSON.parse(localStorage.getItem('delta')));		//shipping type selected
	post.push(JSON.parse(localStorage.getItem('echo')));		//name for order along with zipcode if !Pick-up

	const http = new XMLHttpRequest();							//send form data to POST Receipt
	http.open("POST", "/receipt", true);
	http.setRequestHeader('Content-Type', 'application/json');
	http.send(JSON.stringify(post));

	http.onload = () => {
		if (http.readyState === http.DONE) {
			if (http.status === 200) {
				let resDetails = JSON.parse(http.response); //Response from Server, order number AND date time of order
				fillDetails(resDetails, post);				//Function to fill out Receipt display
			}
		}
	}
	localStorage.clear();									//Order Complete, remove local storage to prevent duplication
}

//FUNCTION to populate receipt with order details
//PARAMETERS: resDetails - order number, date time of order
//PARAMENTES: post - items details
function fillDetails(orderDetails, items) {

	console.log('orderDetails: ', orderDetails);
	console.log('items: ', items);
	let date = new Date(orderDetails.data[0].order_date);			//Format Date Time for receipt
	let el = document.getElementById('order_date');					
	let total_cost = 0.00;
	document.getElementById('order_total_items').innerText = 'Total Items: ' + items[0];
	el.textContent = date.toString();								//Get order date response in string format
	el = document.getElementById('order_id');
	el.textContent = "Order # " + orderDetails.data[0].order_id;	//Display order number (order_id from DB)

	el = document.getElementById('receipt_items');

	for (let i = 0; i < items[1].Items.length; i++) {				//Loop through each element to fill receipt
		document.getElementById('qty').innerHTML = items[1].Items[i].quantity;
		document.getElementById('item').innerHTML = items[1].Items[i].meal_name + " @ $" + items[1].Items[i].meal_cost;
		document.getElementById('price').innerHTML = "$"+parseFloat(items[1].Items[i].Total).toFixed(2);
		total_cost += parseFloat(items[1].Items[i].Total);

		if (i < items[1].Items.length -1) {							//IF another item remains, duplicate element and append
			let elemClone = document.createElement('div');
			elemClone.setAttribute('id', el.getAttribute('id'));
			elemClone.innerHTML = el.innerHTML;
			el.after(elemClone);
		}
	}

	document.getElementById('delivery_type').innerHTML = 'Type: ' + items[2].Shipping[0].shipping_type;	//Display delivery type
	document.getElementById('delivery_type').innerHTML += "<p>Deliver to: " + items[3].fname + "</p>";	//Display order name

	if (items[3].zip != null)																			//IF !Pick-up
		document.getElementById('delivery_type').innerHTML += "<p> Zip: " + items[3].zip + "</p>";		//Display zip code

	document.getElementById('delivery_cost').innerHTML = "$" + parseFloat(items[2].Shipping[0].shipping_cost).toFixed(2);
	total_cost += parseFloat(items[2].Shipping[0].shipping_cost);
	document.getElementById('total').innerHTML = "$" + total_cost.toFixed(2);			//Calculate total cost and display TOTAL
}

window.addEventListener('DOMContentLoaded', receiptOrder, false);