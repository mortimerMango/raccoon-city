//Update cart based on LocalStorage length
//Checks to see if Cart is clicked
function checkCart() {
	try {
		if (localStorage.length > 0) {
			//UPDATE CART COUNTER
			document.getElementById('counter').innerHTML = '<p>' + localStorage.getItem('bravo') + '</p>';
		}
	}
	catch (err) {
		console.log('local storage empty');
	}

	let cartClicked = document.getElementById('cart_title');			//send to menu if CART is clicked on INDEX page
	cartClicked.addEventListener('click', () => { window.location = '/menu'; }, false);
}

window.addEventListener('DOMContentLoaded', checkCart, false);