
//let highestStat = [255,190,230,194,230,180];


/// When the user presses the search button run this
function getPokemon(){

    
   
    /*
    Gets the search term from the input field.
    Turns into lower case since the PokeApi only takes pokemon in lowercase letters
    Remember to add trim() for farfetch'd
    Get the dropDownMenu(select Tag)< <- The problem child
    */
    let searchTerm = document.getElementById("search");
    let name = searchTerm.value.toLowerCase();
    //let mvSelect = document.querySelector("select")

    //Print the pokemon name
    console.log(name);

    //Creates the first of many fetch to the pokeApi app
    fetch('https://pokeapi.co/api/v2/pokemon/'+name)
    .then(response => response.json())
    .then(data => {
        
     

        //data is the base information received from the pokeApi. It is returned as a JSON object.


        //Variables that will hold data from pokeApi. Stat Card is the flex box that contains the data. Stat List is
        //The unordered list.
        //Image tag holds the image of the pokemon.

        /*
        MoveContainer is the container that holds all the moves for a pokemon. mvSelect is the drag
        */
        let name = data.name;
        let abilities = [];
        let moves = [];
        let types = data.types;
        let type_name;
        let statList = document.querySelector(".statcard>ul");
        let statCard = document.querySelector(".statcard")
        let image_tag = document.getElementById("pokeimg");
        let capitalizedName = capitalizeWord(name);
        let name_tag = document.getElementById("name").innerText = capitalizedName;
        let type_tag = document.getElementById("type");
        let parent = document.getElementById("abilities")
        let mvContainer = document.querySelector(".moveContainer");
        let mvSelect = document.createElement("select"); ///<---I hate you so much.
        let statUl = document.createElement("ul");
        
        
        image_tag.src = data.sprites.front_default;
       


        

        /*

        Checks to see if pokemon has two types. If it can't find the second type. The type name is the first type
        and display on the document.
        If it find the second type, add a "/" and the second type to the document.

        Not relatetd to the problem.

        */
        if(types[1] === undefined){
            type_name = capitalizeWord(types[0].type.name);
            
        }
        else{
            type_name = capitalizeWord(types[0].type.name) + "/ "+ capitalizeWord(types[1].type.name);
        }

        console.log("The type name " + type_name);
        type_tag.textContent = type_name;

        

        /*
        Not related to the problem, but GOOD LORD, this made me hate the PokeApi.
        
        When making a pokemon fetch, it only gives the base information for that pokemon(Pokemon Name,
            Ability Name, Move Name, Image, Type Name). If you want more details about the ability 
            or move(I NEED DAMAGE NUMBERS!), you have to make another fetch for that 
            move, ability, type ,or etc. to get more details. The pokeAPI gives the url to go to for more info. 
        */
       

        for(d in data.abilities){
            let currAbName = data.abilities[d].ability.name;
            let url = data.abilities[d].ability.url;
            
            
            getAbilityDesc(url,currAbName,parent);///<-This wasn't that hard.

        }

        
        


        //// Removes the current contents of the moveContainer and MvSelect.
        //// So none of the old moves from the previous pokemon are attached to the new pokemon the user search for
        
        //Note:.innerHTML = "" removes everthing inside the element when used. 
        //resetTag function might be useful for removing certain tags for later.
        
        mvContainer.innerHTML = "";
        mvSelect.innerHTML = "";


        

        //Adds the dropdown menu <select> to the moveContainer
        mvContainer.append(mvSelect);
        
  
        /*The pokeApi returns everything in lowercase and all space have dashes. 
        For each move received from the data object. 
        Capitialized the name and replace the dash with a space.

        Then make another fetch request to get the FULL move description.

        MOVE TO LINE 448!
        */


        for(m in data.moves){
            let currMoveName = data.moves[m].move.name;
            let murl = data.moves[m].move.url;
            currMoveName = currMoveName.charAt(0).toUpperCase() + currMoveName.slice(1);
            currMoveName = currMoveName.replace("-", " ");
           
           
            getMoveDesc(murl,currMoveName,mvContainer,mvSelect);

            
        }

      

        /*

        So here is the idea. I have all the moves on the page ready to be displayed. I have created a class
        called hiddenCard that has the display:none style.All the moves are set to hiddenCard so it doesn't display on the page 
        When the user changes something from the drop downbox. It triggers my function that changes the hiddnCard 
        into a moveCard. Now the user can see the move that they selected instead of all the move.

        Problem: Every time the user switches to another option in the drop down. It returns a null container.
        
        Why!?
        Syntax? Nope.It can find if I set all the cards to moveCards instead of hiddenCards. 
        
        Document can't find it because it is in display:none? NOPE! 
            Tested in codepen. https://codepen.io/BLewis32/pen/OJgNYZy?editors=1111 It can find display:none elements
            
        Asyncronous problems? The option tag doesen't know that the moveCard because it is not ready yet?
            Ask the J4 about and research asynchronous solution......AND GO TO BED!
            */

        
        //window.addEventListener('load',function()<-----Wait for page to load then make a event listener? NOPE DOESN'T WORK AT ALL! 
            mvSelect.addEventListener("change",function(){
                let selectedName = event.target.value;
                let selectedCard = mvContainer.querySelector(`.moveCard[for="${selectedName}"]`); //Why do you keep returning null
                selectedCard.className = "moveCard";
                console.log(selectedName); 
                console.log(selectedCard);
        })

    //})

        
        statCard.innerHTML = "";

       
        for (let index = 0;index < 6;index++) {
            let currStat = data.stats[index];
            let currName = currStat.stat.name;
            let capStatName = currName.charAt(0).toUpperCase() + currName.slice(1);
            capStatName = capStatName.replace("-", " ");

            let statli = document.createElement("li");
            let statNameDiv = document.createElement("div");
            let statNumberDiv = document.createElement("div");

            statli.className = "statListItem";
            
            statNameDiv.className = "statName";
            statNumberDiv.className = "statNumber";
            
            statNameDiv.textContent = capStatName + ": ";
            statNumberDiv.innerHTML = currStat.base_stat;
            //statli.textContent = capStatName + ": " + currStat.base_stat;

            statli.append(statNameDiv);
            statli.append(statNumberDiv);
            let barSize = (currStat.base_stat/255) * 200;
    
            let barDiv = document.createElement("div");
           
            barDiv.style.width = barSize+"px";
            barDiv.style.height = "1rem";
            barDiv.style.backgroundColor = "green";

            statli.append(barDiv);
            statUl.append(statli);
        }

        statCard.append(statUl);

        
       let mytypes =  types.map((type) => {
        return type.type;
    })

   


        getMultiplyier(mytypes,statCard);
    

        
        })
       
    }

function getMultiplyier(pokeType,parent){


    console.log(parent.firstChild);
    let multiplier = {
        defense:{}
    }

    

    let weakTag = document.createElement("div");
    //document.querySelector(".weakness");
    weakTag.className = "weakness"
    weakTag.innerHTML = "";
    pokeType.forEach(type => {
        
        let typeName = type.name;
        let typeUrl = type.url;
    
       

        fetch(typeUrl)
        .then(response => response.json())
        .then(qdata =>{

            console.log(typeName);
            let damage_relations = qdata.damage_relations;
            let double_damage_from = damage_relations.double_damage_from;
            let half_damage_from = damage_relations.half_damage_from;
            let no_damage_from = damage_relations.no_damage_from;

            console.log(double_damage_from);

            double_damage_from.forEach(type => {
                
                if(multiplier.defense.hasOwnProperty(type.name))
                    multiplier.defense[type.name] *= 2;
    
                    else
                    multiplier.defense[type.name] = 2;
            });

            half_damage_from.forEach(type => {
                
                if(multiplier.defense.hasOwnProperty(type.name))
                    multiplier.defense[type.name] *= .5;
    
                    else
                    multiplier.defense[type.name] = .5;
            });

            no_damage_from.forEach(type => {
                
                if(multiplier.defense.hasOwnProperty(type.name))
                    multiplier.defense[type.name] *= 0;
    
                    else
                    multiplier.defense[type.name] = 0;
            });


            //let statCard = document.querySelector(".statcard");
            
            for(let key in multiplier.defense){

                console.log(key);

                let currKeyValue = multiplier.defense[key];

                if(currKeyValue === 1){

                    console.log("in the if " + currKeyValue);
                    delete multiplier.defense[key];
                }

                console.log(currKeyValue);
            }

            console.log(multiplier);

            let fourTimes = [];
            let twoTimes = [];
            let immune = [];
            let halfres = [];
            let quadres = [];

            for(item of Object.keys(multiplier.defense)){
                
                let currValue = multiplier.defense[item];
                if (currValue === 2)
                    twoTimes.push(item);
                if (currValue === 4)
                    fourTimes.push(item);
                if (currValue === .5)
                    halfres.push(item);
                if (currValue === .25)
                    quadres.push(item);
                if (currValue === 0)
                    immune.push(item);    

            
            }

            weakTag.innerHTML = "";
            
            let ulWeakTag = document.createElement("ul");
            
            weakTag.innerHTML += printWeaknessList(fourTimes,4);
            weakTag.innerHTML += printWeaknessList(twoTimes,2);
            weakTag.innerHTML += printWeaknessList(immune,0);
            weakTag.innerHTML += printWeaknessList(halfres,.5);
            weakTag.innerHTML += printWeaknessList(quadres,.25);

            



        

            ulWeakTag.append(weakTag);
            parent.append(ulWeakTag);

         
            

   
            console.log(multiplier);
    })
        
    });
    
    

}






function printWeaknessList(myArray,num){

    let weaknessString = ""
    if(myArray.length === 0)
        return "";
    for (item of myArray){
        weaknessString += `<li>${num}x: ${item}</li>`
    }

    console.log("Weak " + weaknessString);
    return weaknessString;
}

function capitalizeWord(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function resetTags(statcard) {
    while (statcard.firstChild) {
        statcard.removeChild(statcard.firstChild);
    }
}

function getAbilityDesc(url,abName,parentTag) {
    let desc;

    console.log(parentTag.tag + "Parent");
    //let parentTag = document.getElementById("abilities");
    abName = abName.charAt(0).toUpperCase() + abName.slice(1);
    abName = abName.replace("-"," ");
    resetTags(parentTag);
    
    fetch(url)
        .then(response => response.json())
        .then(data2 => {

            let currDes;
            if(abName === "Overgrow")
            {
                currDes = data2.effect_entries[0].effect;
            }

            else{
                currDes = data2.effect_entries[1].effect;
            }


            
            let abTag = document.createElement("li");
            let ul = document.createElement("ul");
            let descTag = document.createElement("li");
            

            abTag.className = "lihead";
            abTag.innerText = abName;
            descTag.innerText = currDes;
            abTag.append(ul);
            ul.append(descTag);

            


            parentTag.append(abTag);
            
            console.log(abName);
            console.log(currDes);
            
            
            
        });
}



function printTypeWeakness(half, half_str) {
    for (let index = 0; index < half.length; index++) {

        if(index === half.length - 1){
            let type_name = capitalizeWord(half[index].name);
            half_str = half_str + type_name;    
        }
        else{

            let type_name = capitalizeWord(half[index].name);
            half_str = half_str + type_name + ", ";    
        }
        


    }
    return half_str;
}


function getMoveDesc(url,mvName,moveContainer,select){
    
   


    /*
    moveCard is a flex box that contains all the data for that move. divMoveTag is the name of the move.
    divDesc is the description of the move
    divPowTag is the damage that it does
    moveOption is one of the options in the dropdown menu. 
    */

    
    let moveCard = document.createElement("div");
    let divMoveTag = document.createElement("div");
    let divDescTag = document.createElement("div");
    let divPowTag = document.createElement("div");
    let moveOption = document.createElement("option");




    //Set the current Move Tag to current move. 
    //Set one of the option in the drop down menu to the current move 
    divDescTag.className = "moveDesc";
    divMoveTag.textContent = mvName;
    moveOption.textContent = mvName;
    moveOption.value = mvName;


    divMoveTag.className = "moveName";

    //Sets the attritbute so I can find it using queryselector. Then add it to the page
    moveCard.setAttribute("for",mvName);
    select.append(moveOption);
    
    
    
    
    
    fetch(url)
    .then(response => response.json())
    .then(moveData => {
        

        ///The move fetch 
        let move_Desc = moveData.effect_entries[0].effect;
        let effect_chance = moveData.effect_chance;
        divPowTag.textContent = 'Power: ' + moveData.power;
        
        
        
        
        
        
        if(effect_chance !== null){
            move_Desc = move_Desc.replace("$effect_chance",String(effect_chance));
            
        }
        //console.log("Description: " + moveData.effect_entries[0].effect);
        
        if(mvName === "Substitute"){
            divDescTag.textContent = "Transfers 1/4 the user's max HP into a"+ 
            "doll that absorbs damage and causes most negative move effects to fail"
        }
        else if(mvName === "Reversal"){
            divDescTag.textContent = "Inflicts regular damage. Power varies inversely with the user's proportional remaining HP."
        }
        else{
            
            divDescTag.textContent = move_Desc;
        }
        
        


        /*
        Now
        */
        
        divMoveTag.append(divPowTag);
        moveCard.append(divMoveTag);
        
        moveCard.append(divDescTag);
        
        moveContainer.append(moveCard);
        
        moveCard.className = "hiddenCard";////<-----
        
        
        
        
    });
    
    
    
    
}





function addPokemon(){

    let parent = document.querySelector(".pokeContainer");
    let searchTerm = document.getElementById("search");
    let name = searchTerm.value.toLowerCase();

    let parentHead = document.createElement("div");
    
    

    let pokeTitle = document.createElement("h1");
    let pokeType = document.createElement("h1");
    let typeName;

    pokeTitle.id = "name";


    let cardContainer = document.createElement("div");
    cardContainer.className ="cardContainer2";

    let imagecard2 = document.createElement("div");
    let img2 = document.createElement("img");
    imagecard2.className = "imgcard2";

    parentHead.className = "name_Head";

    parentHead.append(pokeTitle);
    parentHead.append(pokeType);

    imagecard2.append(parentHead)
    

    
    fetch('https://pokeapi.co/api/v2/pokemon/'+name)
    .then(response => response.json())
    .then(data => {
        let name = data.name;
        img2.className = "img2";

        img2.src = data.sprites.front_default;
        
        
        let capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        pokeTitle.innerText = capitalizedName;
        
        
        let types = data.types;
        imagecard2.append(img2);
        
        if(types[1] === undefined){
            typeName = capitalizeWord(types[0].type.name);
        }
        else{
            typeName = capitalizeWord(types[0].type.name) + "/ "+ capitalizeWord(types[1].type.name);
        }

        pokeType.textContent = typeName;

        let abilTitle = document.createElement("h2");
        abilTitle.textContent = "Abilities";
        imagecard2.append(abilTitle);

        let ul2 = document.createElement("ul");
        imagecard2.append(ul2);

        for(d in data.abilities){
            let currAbName = data.abilities[d].ability.name;
            let url = data.abilities[d].ability.url;
            
            getAbilityDesc(url,currAbName,ul2);

        }

        let moveContainer2 = document.createElement("div");
        moveContainer2.className = "moveContainer";

        let moveTitle = document.createElement("h2");
        moveTitle.textContent = "Moves";
        imagecard2.append(moveTitle);
        imagecard2.append(moveContainer2);

        let mvSelect2 = document.createElement("select");

        moveContainer2.append(mvSelect2);

        for(m in data.moves){
            let currMoveName = data.moves[m].move.name;
            let murl = data.moves[m].move.url;
            currMoveName = currMoveName.charAt(0).toUpperCase() + currMoveName.slice(1);
            currMoveName = currMoveName.replace("-", " ");

            getMoveDesc(murl,currMoveName,moveContainer2,mvSelect2);

           

            
        }

        cardContainer.append(imagecard2);

        
        let stCard = document.createElement("div");
        let statUl = document.createElement("ul");
        
        
        for (let index = 0;index < 6;index++) {
            let currStat = data.stats[index];
            let currName = currStat.stat.name;
            let capStatName = currName.charAt(0).toUpperCase() + currName.slice(1);
            capStatName = capStatName.replace("-", " ");

            let statli = document.createElement("li");
            let statNameDiv = document.createElement("div");
            let statNumberDiv = document.createElement("div");

            statli.className = "statListItem";
            
            statNameDiv.className = "statName";
            statNumberDiv.className = "statNumber";
            
            statNameDiv.textContent = capStatName + ": ";
            statNumberDiv.innerHTML = currStat.base_stat;
            //statli.textContent = capStatName + ": " + currStat.base_stat;

            statli.append(statNameDiv);
            statli.append(statNumberDiv);
            let barSize = (currStat.base_stat/255) * 200;
    
            let barDiv = document.createElement("div");
           
            barDiv.style.width = barSize+"px";
            barDiv.style.height = "1rem";
            barDiv.style.backgroundColor = "green";

            statli.append(barDiv);
            statUl.append(statli);
        }
        

        stCard.append(statUl);


        let typeDivParent = document.createElement("div");
        let typeUl = document.createElement("ul");
        
        let mytypes =  types.map((type) => {
            return type.type;
        })

        console.log("Types");
        console.log(mytypes);

        cardContainer.append(stCard);



        getMultiplyier(mytypes,stCard);


        
        })

        parent.append(cardContainer);

    };



let searchButton = document.querySelector("#searchButton");
let addButton = document.querySelector("#addButton");

searchButton.addEventListener("click",getPokemon);
addButton.addEventListener("click",addPokemon);
