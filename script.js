var bg = document.getElementById("background");


// bg.innerHTML+=`<div id="jobListing" class="jobListing">
// <h1 id="title" class="title">Title</h1>
// <h3 id="descr" class="descr">description<br>second line <br>third line<br>too many lines</h3>
// <button id="learnMore" class="learnMore">Learn more</button>
// <div id="addInfo" class="addInfo">

// </div>
// <button id="apply" class="learnMore">Apply</button>
// </div>`



for (let i = 0; i<=100  ; i++)
{

    bg.innerHTML+=`<div id="jobListing, `+i+`" class="jobListing">
    <h1 id="title,`+i+`" class="title">Title</h1>
    <h3 id="descr,`+i+`" class="descr">description<br>second line <br>third line<br>too many lines</h3>
    <button id="learnMore,`+i+`" class="learnMore" onclick="learn(`+i+`)">Learn more</button>
    <div id="addInfo,`+i+`" class="addInfo">
    
    </div>
    <button id="apply,`+i+`" class="learnMore" onclick="apply(`+i+`)">Apply</button>
    `+i;

}
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
    var info = document.getElementsByClassName("addInfo")[num];
    isApplying=false;
    info.innerHTML=`<h1 id="title, `+num+`" >Title</h1>
    <h3 id="descr">description<br>second line <br>third line<br>too many lines</h3>
    </div>`
        
    }

    function apply(num)
    {
        if (isApplying==false)
        {
            var info = document.getElementsByClassName("addInfo")[num];
            isApplying=true;
            info.innerHTML=`<form>
            <input type="text" id="name " placeholder="First Name">
            <input type="text" id="surname" placeholder="Last Name"><br>
            <input type="email" id="email" placeholder="E-mail">
            <input type="tel" id="phone" placeholder="Phone number">
            <input type="submit">
        </form>`
        }
    }


