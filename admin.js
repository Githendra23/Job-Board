company=document.getElementById("company");
ad=document.getElementById("ad");
user=document.getElementById("user");
app=document.getElementById("jobApp");
content=document.getElementById("content");
bg=document.getElementsByClassName("background")[0];


company.addEventListener('click',function()
{
    content.innerHTML="company :("
    fetch("http://localhost:8080/api/work_trailer/company")
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
        content.innerHTML=JSON.stringify(data);
        console.log(data.name);
        
})
    
}
)

user.addEventListener('click',function()
{
    content.innerHTML="users :3"
    
    fetch("http://localhost:8080/api/work_trailer/candidate")
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
        content.innerHTML=JSON.stringify(data);
        console.log(data);
        
})
}
)
ad.addEventListener('click',function()
{
    content.innerHTML="ads :/"
    fetch("http://localhost:8080/api/work_trailer/advertisement")
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
        content.innerHTML=JSON.stringify(data);
        console.log(data);
        
})
}
)
app.addEventListener('click',function()
{
    content.innerHTML="job applications..................."
    fetch("http://localhost:8080/api/work_trailer/job_application")
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
        content.innerHTML=JSON.stringify(data);
        console.log(data);
        
})
}
)
// var colordir=false
// let color=0
// var intervalId = setInterval(function(){
//     let maxVal = 0xFFFFFF;
    
//     // let randomNumber = Math.random() * maxVal;
//     // randomNumber = Math.floor(randomNumber);
//     // bg.style.backgroundColor="#"+randomNumber.toString(16).toUpperCase();
//     // document.body.style.backgroundColor="#"+randomNumber.toString(16).toUpperCase();
    
//     // document.style.backgroundColor=randomNumber.toString(16);
//     content.innerHTML+=color.toString(16).toUpperCase()+"<br>"
//     if (color==0)
//     {
//         colordir=false
//     }
//     if (color==maxVal)
//     {
//         colordir=false
//     }


//     if (colordir==false)
//     {
//         color++
//     }
//     else
//     {
//         color--
//     }
//     bg.style.backgroundColor="#"+color.toString(16).toUpperCase();
//     document.body.style.backgroundColor="#"+color.toString(16).toUpperCase();

// },1);

// clearInterval(intervalId);