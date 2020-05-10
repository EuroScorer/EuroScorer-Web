// hidden the pop-up
document.getElementById('bg-modal').style.display = 'none';

// get the div element to construct the presentation of artists
const getIdTst = document.getElementById("tst");

// variable for picture size
const myDim = 200;

// url of API REST to get the element

const reqSong = 'https://api.euroscorer2020.com/v1/songs';
const req = new XMLHttpRequest();
req.open('GET', reqSong);
req.responseType = "json";
req.send();

/**
 * Create the div element
 */
req.onload = function () {
    const superSong = req.response;
    showSongs(superSong); 
}

/**
 * Constructor of <div> in index.html
 */
function showSongs(jsonObj) {
    for (let i = 0; i< jsonObj.length; i++){
        //create a tag : <article> with class name
        let myBox = document.createElement('article');
        myBox.className = "box post";

        //create a tag : <div> with a class name
        let myDiv = document.createElement('div');
        myDiv.className = "4u 6u(2) 12u$(3)";

        //create a tag : <a> with class name
        let myA = document.createElement("a");
        myA.className = "image fit";

        //create a tag : <img>>
        let myImg = document.createElement("img");
        //get img
        myImg.src = jsonObj[i].image_flag ;
        myImg.height = myDim;
        myImg.width = myDim;

        //create a tag : <h3>
        let myCountry = document.createElement('h3');
        //get name of the country
        myCountry.textContent = jsonObj[i].country.name + ' ';

        //get country code to put after the name of the country
        let myFlag = document.createElement("img");
        myFlag.src = jsonObj[i].country.flag;
        myFlag.width = 20;
        myFlag.height = 20;

        // create a tag : <p> and initialise with name of artist
        let myTitle = document.createElement('p');
        //get the title of the card = name artist + name of the song
        myTitle.textContent = jsonObj[i].title;

        //get a "code" name
        let myCountryCode = jsonObj[i].country.code;

        //create a tag : a like button
        let myButton = document.createElement('a');
        myButton.className = "button"
        // Placeholder in button
        myButton.textContent = "Learn more";
        // set id of button
        myButton.idContext = myCountryCode;
        document.createTextNode(myButton);
        //Event when we click on Learn More

        //myButton.addEventListener('click', createPopUp(jsonObj[i].title, jsonObj[i].link, jsonObj[i].country.name),true);
        myButton.onclick = createPopUp(jsonObj[i].title, jsonObj[i].link, jsonObj[i].country.name);
        // Adding HTML elements according to the tree structure
        myA.appendChild(myImg);
        myBox.appendChild(myA);
        myCountry.appendChild(myFlag);
        myBox.appendChild(myCountry);
        myBox.appendChild(myTitle);
        myBox.appendChild(myButton);
        myDiv.appendChild(myBox);
        getIdTst.appendChild(myDiv);

    }

}

function createPopUp(col, link, country) {
    return function(){
        let PdivP = document.getElementById('bg-modal');
        let  divP = document.createElement("div");
        divP.className = "modal-content";
        divP.id = "divP";
        document.createTextNode(divP);

        let titleP = document.createElement("h2");
        titleP.id = "titleP";
        titleP.textContent = "EUROVISION";
        document.createTextNode(titleP);

        let spanP = document.createElement("span");
        spanP.className = "btnClose";
        spanP.id = "btnClose";
        spanP.addEventListener('click', function(){

            closeBtn();
        });
        document.createTextNode(spanP);

        let divPs = document.createElement("div");
        divPs.className = "icon fa-times-circle";
        divPs.id = "divPs";
        document.createTextNode(divPs);

        let h3P = document.createElement("h3");
        h3P.id = "countryYt";
        h3P.textContent = country;
        document.createTextNode(h3P);

        let pP = document.createElement("p");
        pP.id = "song";
        pP.textContent = col;
        document.createTextNode(pP);

        let divPYt = document.createElement("div");
        divPYt.className = "align-center";
        divPYt.id = "divPYt";
        document.createTextNode(divPYt);


        let framP = document.createElement("iframe");
        framP.id = "ytLink";
        if (screen.width > 1400) {
            framP.width = "560";
            framP.height ="315";
        } else if (screen.width > 600 && screen.width < 1400) {
            framP.width = "400";
            framP.height ="225";
        } else {
            //no thing
        }

        framP.src = link;
        framP.frameborder="0";

        framP.allowFullscreen = true ;

        framP.setAttribute('allow', "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
        document.createTextNode(framP);

        // Adding HTML elements according to the tree structure
        divPYt.appendChild(framP);
        spanP.appendChild(divPs);
        divP.appendChild(titleP);
        divP.appendChild(spanP);
        divP.appendChild(h3P);
        divP.appendChild(pP);
        divP.appendChild(divPYt);
        PdivP.appendChild(divP);
        document.getElementById('bg-modal').style.display = 'flex';

    }
}

/**
 * Function to close the pop-up : remove all HTML element from the modal element
 * hidden the pop-up
 */
function closeBtn(){
   document.getElementById('bg-modal').removeChild(document.getElementById('divP'));
   document.getElementById('bg-modal').style.display = 'none';
}


// Get the modal
const modal = document.getElementById("bg-modal");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        closeBtn();
    }
}