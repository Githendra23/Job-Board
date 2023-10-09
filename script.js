var learnBtn=document.getElementById("learnMore");
var info = document.getElementById("addInfo");
var applyBtn=document.getElementById("apply");
var isApplying=false;

learnBtn.addEventListener('click', function(){
isApplying=false;
info.innerHTML=`<h1 id="title" >Title</h1>
<h3 id="descr">description<br>second line <br>third line<br>too many lines</h3>
</div>`
    
})

applyBtn.addEventListener('click', function(){
if (isApplying==false)
{
    isApplying=true;
    info.innerHTML=`<form>
    <input type="text" id="name" placeholder="First Name">
    <input type="text" id="surname" placeholder="Last Name"><br>
    <input type="email" id="email" placeholder="E-mail">
    <input type="tel" id="phone" placeholder="Phone number">
    <input type="submit">
</form>`
}
else{ 
    info.innerHTML="all is good :)";
    isApplying=false;
}
})