let useremail
let userId
let userRole


console.log(getCookie("token"))

function getCookie(cookie)
{
    cookiestring = document.cookie.split(';')
    for (let i=0; i<cookiestring.length;i++)
    {
        cookiepair=cookiestring[i].split("=")
        if (cookiepair[0] == cookie)
        {
            return cookiepair[1]
        }
    }
}

fetch("http://localhost:8080/verifyToken",
    {method:"POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({"token" : getCookie("token")})
})
.then(function(response)
{
    if (response.ok) {
        {return response.json();}
    } else {
        window.alert("there has been an error, returning you to login page")
        window.location.href="../login/login.html"
        return response.json().then((data) => {
            console.error(data)})
            
    }
})
.then(function(data)
{
    console.log(data)
    userId=data.id
    useremail=data.email
    userRole=data.role
    if(userRole==="company")
{
    window.location.href="../company/company.html"
}

    if(userRole==="candidate")
    {
        window.location.href="../user/"
    }
})



function logout()
{
    document.cookie="token=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
    window.location.href="../login/login.html"
}








company=document.getElementById("company");
ad=document.getElementById("ad");
user=document.getElementById("user");
app=document.getElementById("jobApp");
content=document.getElementById("content");
spInput=document.getElementById("specialInput");
employer=document.getElementById("employer");
bg=document.getElementsByClassName("background")[0];
var current_tab=""
var inputAmt=0
var inputs=[]
var addJson=[]

company.addEventListener('click',function()
{
    content.innerHTML="company :("
    loadtable("company")
    current_tab="company"
    spInput.innerHTML=""


    
}
)

user.addEventListener('click',function()
{
    content.innerHTML="users :3"
    loadtable("user")
    current_tab="user"
    spInput.innerHTML=""
}
)
ad.addEventListener('click',function()
{
    content.innerHTML="ads :/"
    loadtable("advertisement")
    current_tab="advertisement"
    spInput.innerHTML=""
}
)


app.addEventListener('click',function()
{
    content.innerHTML="job applications..................."
    loadtable("job_application")
    current_tab="job_application"
    spInput.innerHTML=""
}
)

employer.addEventListener('click',function()
{
    content.innerHTML="employer >:I"
    loadtable("employer")
    current_tab="employer"
    spInput.innerHTML=""
}


)

setInterval(function ()
    {
        if (current_tab!="")
        {loadtable(current_tab)}
    },4000)

function loadtable(tabledb)
{
    
    inputs=[]
    tableLink=JSON.stringify(tabledb)
    fetch("http://localhost:8080/"+tabledb)
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
            if (Object.keys(data).length<=0)
            {
                content.innerHTML="this table is empty"
            }
            else
            {
                table=`<table class ="table"><tr>`
                Object.keys(data[0]).forEach(function(key) 
                {
                    table+=`<th>${key}</th>`
                    inputs.push(key)
                })
                table+="<th></th><th></th></tr>"
                for(let i=0; i<Object.keys(data).length; i++)
                {
                table+=`<tr>`
                Object.keys(data[0]).forEach(function(key) 
                    {
                        table+=`<td class="tabValue">${data[i][key]}</td>`
                    })
                    table+=`<td><button onclick=edit(${i})>edit</button></td>
                    <td><button onclick=deletedb(${tableLink},${data[i].id})>delete</button></td>
                    </tr>`
                }
                table+="</table>"
                content.innerHTML=table
            }
            content.innerHTML+=`<br><button onclick=add(${tableLink})>Add</button>`     
})
}

function deletedb(table, num)
{
    fetch(`http://localhost:8080/${table}/${num}`,{method:"DELETE"})
    loadtable(current_tab)
}

function add(table)
{
    inputAmt=0;
    if (inputs["length"]!=0)
    {
        console.log(inputs)
        spInput.innerHTML=""
        for (let i=1; i<Object.keys(inputs).length;i++)
        {
            if (inputs[i]!== "updatedAt" && inputs[i]!== "createdAt")
            {
                spInput.innerHTML+=`<input type="text" placeholder=${inputs[i]} class="toSend" id=${inputs[i]}>`
                inputAmt+=1
            }
        }
    }
    else{
    if (table =="company")
    spInput.innerHTML=`
<input type="text" placeholder="Name">
<input type="text" placeholder="Description">
<input type="email" placeholder="Email">
<input type="text" placeholder="Phone">
<input type="text" placeholder="Country">
`

if (table =="advertisement")
    spInput.innerHTML=`
<input type="text" placeholder="Title">
<input type="text" placeholder="Description">
<input type="text" placeholder="Address">
<input type="text" placeholder="Employement type">
<input type="text" placeholder="Country">
<input type="text" placeholder="Wage">
<input type="text" placeholder="Type">
`

if (table =="employer")
    spInput.innerHTML=`
<input type="text" placeholder="Name">
<input type="text" placeholder="Surname">
<input type="text" placeholder="Phone">
<input type="text" placeholder="Email">
<input type="text" placeholder="Password">
<input type="text" placeholder="Company id">
`

if (table =="user")
    spInput.innerHTML=`
<input type="text" placeholder="Title">
<input type="text" placeholder="Title">
<input type="text" placeholder="Title">
<input type="text" placeholder="Title">
<input type="text" placeholder="Title">
<input type="text" placeholder="Title">
<input type="text" placeholder="Title">
`

if (table =="job_application")
    spInput.innerHTML=`
<input type="text" placeholder="Title">
`}
spInput.innerHTML+=`<input type="password" placeholder="Password" class="toSend" id="password"></input>`
spInput.innerHTML+=`<button onclick=addDb(${table})>Save</button>`
}

var senData=""
function addDb(table)
{
    senData=""
    table=JSON.stringify(table)
    senData+='{'
    for(let i=0;i<=inputAmt;i++)
    {
        
        inputVal=document.getElementsByClassName("toSend")[i]

        if (inputVal.id !=="company_id")
        senData+='"'+inputVal.id+'"'+" : "+'"'+inputVal.value+'"'
        else
        senData+='"'+inputVal.id+'"'+" : "+inputVal.value
    
        
    

    if (i<inputAmt)
    senData+=',\n'
    }
    senData+='}'
    console.log(senData)
    fetch(`http://localhost:8080/${current_tab}/register`,{
        method:"POST",
        body: senData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        
    })
    .then(function(response){

        if (response.ok) { 
            spInput.innerHTML="<p>Row added</p>";
            return response.text();
        } else {
            spInput.innerHTML="<p>Invalid creation</p>";
        }
    })
    .then(function(data){
    // spInput.innerHTML=data;
    })
}

function edit(id)
{
    inputAmt=0
    spInput.innerHTML=""
        for (let i=0; i<Object.keys(inputs).length;i++)
        {
            inputVal=document.getElementsByClassName("tabValue")[i+(Object.keys(inputs).length*id)].innerText
            console.log(inputVal)
            if (inputs[i]!== "updatedAt" && inputs[i]!== "createdAt")
                {
                    if (inputs[i]=="id")
                    spInput.innerHTML+=`<input type="text" placeholder="${inputVal}" class="toSend" id=${inputs[i]} value="${inputVal}" readonly>`
                    else
                    spInput.innerHTML+=`<input type="text" placeholder="${inputVal}" class="toSend" id=${inputs[i]}>`
                    inputAmt+=1
            }
                
        }
        spInput.innerHTML+=`<button onclick=editDb()>Save</button>`
}

function editDb()
{

    senData=""
    table=JSON.stringify(table)
    senData+='{'
    console.log(inputAmt)
    for(let i=1;i<inputAmt;i++)
    {
        console.log(inputAmt)
        let inputVal=document.getElementsByClassName("toSend")[i]
        let nextInput=document.getElementsByClassName("toSend")[i+1]
        if (inputVal.value !=="")
        {
        if (inputVal.id !=="company_id")
        senData+='"'+inputVal.id+'"'+" : "+'"'+inputVal.value+'"'
        else
        senData+='"'+inputVal.id+'"'+" : "+inputVal.value
    
        if (nextInput!==undefined)
        {if (nextInput.value !=="" && nextInput.id!=="createdAt" && nextInput.id!=="updatedAt")
        senData+=',\n'}}
    }
    senData+='}'
    console.log(senData)

    fetch(`http://localhost:8080/${current_tab}/${document.getElementsByClassName("toSend")[0].value}`,{
        method:"PUT",
        body: senData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        
    })
    .then(function(response){
        if (response.ok) {
            spInput.innerHTML="<p>Successful edit</p>"
            return response.text();
        } else {
            spInput.innerHTML="<p>Invalid edit</p>";
        }
    })
    .then(function(data){
        console.log(data)
    // spInput.innerHTML=data
    })

}