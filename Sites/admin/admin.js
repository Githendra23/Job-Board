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
    loadtable("candidate")
    current_tab="candidate"
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
    },1000000)

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

function loadtable(tabledb)
{   //console.log(tabledb)
    
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
            //console.log(Object.keys(data).length)
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
                // table=`<table class="table"><tr><th>Name</th><th>Description</th><th>Email</th><th>phone</th><th>country</th><th></th><th></th>`
                for(let i=0; i<Object.keys(data).length; i++)
                {
                table+=`<tr>`
                Object.keys(data[0]).forEach(function(key) 
                    {
                        //console.log(JSON.stringify(data[i][key]))
                        table+=`<td class="tabValue">${data[i][key]}</td>`
                    })
                    //console.log(tabledb)
                    table+=`<td><button onclick=edit(${i})>edit</button></td>
                    <td><button onclick=deletedb(${tableLink},${data[i].id})>delete</button></td>
                    </tr>`
                }
                table+="</table>"
                content.innerHTML=table
            }
            // console.log(inputs);
            content.innerHTML+=`<br><button onclick=add(${tableLink})>Add</button>`     
})
}

function deletedb(table, num)
{
    //console.log("delete: "+table+num)
    fetch(`http://localhost:8080/api/work_trailer/${table}/delete/${num}`,{method:"DELETE"})
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
    // console.log(tabData)
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

if (table =="candidate")
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
spInput.innerHTML+=`<input type="text" placeholder="Password" class="toSend" id="password"></input>`
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

        senData+='"'+inputVal.id+'"'+" : "+'"'+inputVal.value+'"'
        
    

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
}

function edit(id)
{
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
        
        var inputVal=document.getElementsByClassName("toSend")[i]
        var nextInput=document.getElementsByClassName("toSend")[i+1]
        if (inputVal.value !=="")
        {
        if (inputVal.id !=="telephone")
        senData+='"'+inputVal.id+'"'+" : "+'"'+inputVal.value+'"'
    else
    senData+='"'+inputVal.id+'"'+" : "+inputVal.value
    

    if (nextInput.value !=="" && nextInput.id!=="createdAt" && nextInput.id!=="updatedAt")
    senData+=',\n'}
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

}