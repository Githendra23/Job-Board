content=document.getElementById("content");
spInput=document.getElementById("specialInput");

bg=document.getElementsByClassName("background")[0];

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
                    if (key!=="createdAt" && key!=="updatedAt"&& key!=="company_id")
                    {
                        table+=`<th>${key}</th>`
                        inputs.push(key)
                    }
                })
                table+="<th></th><th></th></tr>"
                for(let i=0; i<Object.keys(data).length; i++)
                {
                table+=`<tr>`
                Object.keys(data[0]).forEach(function(key) 
                    {
                        if (key!=="createdAt" && key!=="updatedAt" && key!=="company_id")
                            table+=`<td class="tabValue">${data[i][key]}</td>`
                    })
                    table+=`<td><button onclick=edit(${i})>edit</button></td>
                    <td><button onclick=deletedb('${tableLink}','${data[i].id}')>delete</button></td>
                    </tr>`
                }
                table+="</table>"
                content.innerHTML=table
            }
            content.innerHTML+=`<br><button onclick=add('${tableLink}')>Add</button>`     
})
}

function deletedb(table, num)
{
    fetch(`http://localhost:8080/employer/${num}`,{method:"DELETE"})
    loadtable("employer")
}


function add(table)
{
    inputAmt=0;
    if (inputs["length"]!=0)
    {
        console.log(inputs)
        spInput.innerHTML=""
        for (let i=0; i<Object.keys(inputs).length;i++)
        {
            if (inputs[i]!== "updatedAt" && inputs[i]!== "createdAt")
            {
                spInput.innerHTML+=`<input type="text" placeholder=${inputs[i]} class="toSend" id=${inputs[i]}>`
                inputAmt+=1
            }
        }
    }
    else
    {
    spInput.innerHTML=`
<input type="text" placeholder="Name">
<input type="text" placeholder="Surname">
<input type="email" placeholder="Email">
<input type="password" placeholder="Password">
`
    }
    spInput.innerHTML+=`<input type="password" placeholder="Password" class="toSend" id="password"></input>`
spInput.innerHTML+=`<button onclick=addDb('${table}')>Save</button>`
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
    senData+=',\n'

    }
    senData+='"company_id":"1"}'
    console.log(senData)
    fetch(`http://localhost:8080/employer/register`,{
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

    fetch(`http://localhost:8080/employer/${document.getElementsByClassName("toSend")[0].value}`,{
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

loadtable("employer")