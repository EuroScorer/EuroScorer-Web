document.getElementById('formverif').style.visibility = 'hidden';
//Initialize table with the counters for the vote
tabCpt=[];
monCptTotal = 0;

//Minimum and maximum votes
maxVote = 20;
minVote =0;

// variable for picture size
const myDim = 200;

//For display singers and their musics
const getIdVoting = document.getElementById("voting");
const reqSong = 'https://us-central1-eurovision2020-ea486.cloudfunctions.net/api/v1/songs';
const req = new XMLHttpRequest();

req.open('GET', reqSong);
req.responseType = "json";
req.send();
req.onload = function () {
    var superVotes = req.response;
    showSongsVote(superVotes);
}

//Initialize the link for send the votes
const reqVotes = 'https://us-central1-eurovision2020-ea486.cloudfunctions.net/api/v1/vote'

//Initialize/Display the total counter
document.getElementById("monCptTotal").innerHTML = monCptTotal
/**
 * This function is the constructor of <div> in vote.html
 * @param {type} jsonObj
 * @returns {undefined}
 */
function showSongsVote(jsonObj) {
 
    if (Array.isArray(jsonObj)) {
        for (let i = 0; i< jsonObj.length; i++)
        {

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
            myImg.type = "images";
            //get img
            myImg.src = jsonObj[i].image_flag ;
            myImg.height = myDim;
            myImg.width = myDim;

            //create a tag : <h3>
            let myCountry = document.createElement('h3');
            //get name of the country
            myCountry.textContent = jsonObj[i].country.name + ' ';

            //get country code to put after the name of the country
            let myFlag = document.createElement("img")
            myFlag.src = jsonObj[i].country.flag;
            myFlag.width = 20;
            myFlag.height = 20;

            // create a tag : <p>
            let myTitle = document.createElement('p');
            //get the title of the card = name artist + name of the song
            myTitle.textContent = jsonObj[i].title;

            //get a "code" name
            let myCountryCode = jsonObj[i].country.code;

            //counter by country
            let monCompteur = new Object();
            monCompteur.name = myCountryCode;
            monCompteur.cpt = 0;

            //Display the counter for a specific country
            let myCpt = document.createElement('span');
            myCpt.innerHTML = monCompteur.cpt;
            myCpt.className = "counter"
            myCpt.id = "cpt_"+myCountryCode;
            document.createTextNode(myCpt);

            //create a button '-'
            let myButton = document.createElement('button');
            myButton.setAttribute("type", "button");
            myButton.className = "button"
            myButton.id = myCountryCode + "_moins";

            // Placeholder in button
            myButton.innerHTML = "-1";
            document.createTextNode(myButton);
            //Event on the button '-'
            //Remove one vote for the country if the totalCounter is < minVote 
            //and the counter for the country is < minVote
            myButton.addEventListener('click', function(col){
                return function(){
                    phone =document.getElementById('phone').value 
                    for (i=0; i< tabCpt.length; i++){
                        if(tabCpt[i].name== col){
                            if (phone !== "" && monCptTotal>minVote && tabCpt[i].cpt> minVote){
                                tabCpt[i].cpt-=1;
                                monCptTotal -=1;
                                document.getElementById('cpt_'+col).innerHTML = tabCpt[i].cpt;
                                document.getElementById("monCptTotal").innerHTML = monCptTotal;
                            }
                        }
                    }
                }  
            }(jsonObj[i].country.code),true);

            //Create button for the "+"
            let myButtonPlus = document.createElement('button');
            myButtonPlus.className = "button"
            myButtonPlus.type = "button";
            myButtonPlus.class = "button"+i;
            myButtonPlus.setAttribute("type", "button");
            myButtonPlus.id = myCountryCode + "_plus";
            // Placeholder in button
            myButtonPlus.innerHTML = "+1";
            document.createTextNode(myButtonPlus);

            //Event on the button "+"
            //Add one vote for the country if the total Counter is < maxVote
            myButtonPlus.addEventListener('click', function(col){
                return function(){

                    phone = document.getElementById('phone').value

                    for (i=0; i< tabCpt.length; i++){
                        if(tabCpt[i].name== col){
                            if (phone !== "" && monCptTotal<maxVote){
                                tabCpt[i].cpt+=1;
                                monCptTotal +=1;
                                document.getElementById('cpt_'+col).innerHTML = tabCpt[i].cpt;
                                document.getElementById("monCptTotal").innerHTML = monCptTotal;   
                            }
                        }
                    }
                }  
            }(jsonObj[i].country.code),true);

            //Add each counter into the variable tabCpt
            tabCpt.push(monCompteur);

            // Adding HTML elements according to the tree structure
            myA.appendChild(myImg);
            myBox.appendChild(myA);
            myCountry.appendChild(myFlag);
            myBox.appendChild(myCountry);
            myBox.appendChild(myTitle);
            myBox.appendChild(myButton);
            myBox.appendChild(myCpt);
            myBox.appendChild(myButtonPlus);
            myDiv.appendChild(myBox);
            getIdVoting.appendChild(myDiv);

        }
    }
}

/**
 * Function to reset the form
 */
function reset3(){
    for (let i=0; i<tabCpt.length; i++){
        tabCpt[i].cpt = 0;
        document.getElementById('cpt_'+tabCpt[i].name).innerHTML = tabCpt[i].cpt;    
    }
    monCptTotal = 0;
    document.getElementById("monCptTotal").innerHTML = monCptTotal;
}


/**
 * Function to send the votes of the form in the database firebase
 * @returns {undefined}
 */
function envoieData(){
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        if(monCptTotal==0){
            alert("Please vote for at least one country");
        }
        else{
            //Create a table with all the votes
            let listeVotes = [];
            for (i =0; i < tabCpt.length; i++){
                for (j=0; j< tabCpt[i].cpt; j++){
                    listeVotes.push(tabCpt[i].name);
                }
            }


            let toSend = {
                votes : listeVotes
            }

            const jsonString = JSON.stringify(toSend);
            let reqV = new XMLHttpRequest();

            reqV.open('POST', reqVotes);
            reqV.setRequestHeader('Content-Type', 'application/json');
            reqV.setRequestHeader('Authorization', idToken);
            reqV.send(jsonString);

            //After the vote, display the index page
            reqV.onload = function(){
                alert("Thank you for your vote!");
                window.location.href="index.html";  
            }
        }
    }).catch(function(error) {
        // Handle error
        alert("Error with the form : " + error.message);
    });
    
}
