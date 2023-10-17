var bg = document.getElementById("background");


// bg.innerHTML+=`<div id="jobListing" class="jobListing">
// <h1 id="title" class="title">Title</h1>
// <h3 id="descr" class="descr">description<br>second line <br>third line<br>too many lines</h3>
// <button id="learnMore" class="learnMore">Learn more</button>
// <div id="addInfo" class="addInfo">

// </div>
// <button id="apply" class="learnMore">Apply</button>
// </div>`


    fetch("http://localhost:8080/advertisement")
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
    if (Object.keys(data).length>0)    
    {    
        for (let i = 0; i<Object.keys(data).length  ; i++)
        {

            bg.innerHTML+=`<div id="jobListing, `+i+`" class="jobListing">
            <h1 id="title,`+i+`" class="title">${data[i]["title"]}</h1>
            <h3 id="descr,`+i+`" class="descr">${data[i]["description"]}</h3>
            <button id="learnMore,`+i+`" class="learnMore" onclick="learn(`+i+`)">Learn more</button>
            <div id="addInfo,`+i+`" class="addInfo">
            
            </div>
            <button id="apply,`+i+`" class="learnMore" onclick="apply(`+i+`)">Apply</button>
            `;

        }}
        else
        {
            bg.innerHTML+="There are no job offers currently....."
        }
    })

    // var learnBtn=document.getElementsByClassName("learnMore")[i];
    // var info = document.getElementsByClassName("addInfo")[i];
    // var applyBtn=document.getElementsByClassName("apply")[i];
    // var isApplying=false;

    // learnBtn.addEventListener('click', function(){
    // isApplying=false;
    // info.innerHTML=`<h1 id="title, `+i+`" >Title</h1>
    // <h3 id="descr">description<br>second line <br>third line<br>too many lines</h3>
    // </div>`
        
    // })

    // applyBtn.addEventListener('click', function(){
    // if (isApplying==false)
    // {
    //     isApplying=true;
    //     info.innerHTML=`<form>
    //     <input type="text" id="name " placeholder="First Name">
    //     <input type="text" id="surname" placeholder="Last Name"><br>
    //     <input type="email" id="email" placeholder="E-mail">
    //     <input type="tel" id="phone" placeholder="Phone number">
    //     <input type="submit">
    // </form>`
    // }
    // else{ 
    //     info.innerHTML="all is good :)";
    //     isApplying=false;
    // }
    // })




    function learn(num){
        fetch("http://localhost:8080/advertisement")
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
    var info = document.getElementsByClassName("addInfo")[num];
    isApplying=false;
    info.innerHTML=`<h2 id="title, `+num+`">${data[num]["title"]}</h2>
    <h4>${data[num]["description"]}</h4>
    <h4>Salary: ${data[num]["wage"]}</h4>
    <h4>Address: ${data[num]["address"]}, ${data[num]["country"]}</h4>
    <h4 class="tag">tags: ${data[num]["tag"]}</h4>
    </div>`
    })
    }

    function apply(num)
    {

            var info = document.getElementsByClassName("addInfo")[num];
            isApplying=true;
            info.innerHTML=`<form>
            <input type="text" id="name " placeholder="First Name">
            <input type="text" id="surname" placeholder="Last Name"><br>
            <input type="email" id="email" placeholder="E-mail">
            <input type="tel" id="phone" placeholder="Phone number"><br><br>
            <textarea id="msg"></textarea>
            <input type="submit">
        </form>`

    }


