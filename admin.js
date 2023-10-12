company=document.getElementById("company");
ad=document.getElementById("ad");
user=document.getElementById("user");
app=document.getElementById("jobApp");
content=document.getElementById("content");
employer=document.getElementById("employer")
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
            content.innerHTML="fetching data..."
            
            console.log(data)
            console.log(Object.keys(data).length)
            if (Object.keys(data).length<=0)
            {
                content.innerHTML="this table is empty"
            }
            else
            {
                table=""
                table=`<table class="table"><tr><th>Name</th><th>Description</th><th>Email</th><th>phone</th><th>country</th><th></th><th></th>`
                for(let i=0; i<Object.keys(data).length; i++)
                {
                    table+=`<tr>
                    <td>${data[i].name}</td>
                    <td>${data[i].description}</td>
                    <td>${data[i].email}</td>
                    <td>${data[i].telephone}</td>
                    <td>${data[i].country}</td>
                    <td><button>edit</button></td>
                    <td><button onclick=deletedb("company",${data[i].id})>delete</button></td>
                    </tr>`
                }
                table+="</table>"
            }
            content.innerHTML=table
            // content.innerHTML=`<table><tr><th>Name</th><th>Description</th><th>Email</th><th>phone</th><th>country</th><tr>${table}</table>`
                    
                
            
        
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
        content.innerHTML="fetching data..."
            
        console.log(data)
        console.log(Object.keys(data).length)
        if (Object.keys(data).length<=0)
            {
                content.innerHTML="this table is empty"
            }
            else
            {
        table=""
        table=`<table class="table"><tr><th>Name</th><th>Last name</th><th>Age</th><th>Address</th><th>Country</th><th>Phone</th><th>Email</th><th></th><th></th><tr>`
        for(let i=0; i<Object.keys(data).length; i++)
        {
            table+=`<tr>
            <td>${data[i].name}</td>
            <td>${data[i].surname}</td>
            <td>${data[i].age}</td>
            <td>${data[i].address}</td>
            <td>${data[i].country}</td>
            <td>${data[i].telephone}</td>
            <td>${data[i].email}</td>
            <td><button>edit</button></td>
            <td><button onclick=deletedb("candidate",${data[i].id})>delete</button></td>
            </tr>`
        }
        table+="</table>"
        content.innerHTML=table
    }
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

function deletedb(table, num)
{
    console.log("delete: "+table+num)
    fetch(`http://localhost:8080/api/work_trailer/${table}/delete/${num}`,{method:"DELETE"})
}