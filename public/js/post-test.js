function createItems() {
    //const chk = ["CARNIVORE", "INSECTIVORE", "PESCIVORE"];
    //const chk = ["CARNIVORE", "INSECTIVORE"];
    const chk = ["CARNIVORE"];
    // window.location.href = 'http://localhost:1337/test?fname=test&lname=meep';
    document.getElementById('demo').innerText = localStorage.getItem('alpha');
    document.getElementById('demo').style.margin = '0px auto';
    
    //TESING this works for POST
    /**
    var getting = document.getElementsByTagName('form')[0];
    for (x in chk) {
        getting.innerHTML += '<input type=\"input\" id=\"fname\" name=\"fname\" value=\"' + chk[x] + '\">';
    }
    
    //getting.innerHTML += '<input type=\"submit\" value=\"Submit\">';
    getting.submit();
    **/

    //let temp;
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/test", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(chk));
    
    xhttp.onload = () => {
        if (xhttp.readyState === xhttp.DONE) {
            if (xhttp.status === 200) {
                //console.log(xhttp.response);
                console.log(xhttp.responseText);

                //var el = JSON.parse(xhttp.response);
                //console.log('>>> ', el.data[0].item_name);
            }
        }
    };
    
}

window.addEventListener('DOMContentLoaded', createItems, false);//TEST

/**
<form action="/test">
    <label for="fname">First name:</label>
    <br>
    <input type="text" id="fname" name="fname" value="John">
    <br>
    <label for="lname">Last name:</label>
    <br>
    <input type="text" id="lname" name="lname" value="Doe">
    <br>
    <br>
    <input type="submit" value="Submit">
</form>
**/