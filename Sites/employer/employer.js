let useremail
let userId
let userRole
let companyid

ads=document.getElementById("ads")

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
    getCompanyId(userId)
    if(userRole==="company")
{
    window.location.href="../company/company.html"
}

    if(userRole==="candidate")
    {
        window.location.href="../user/"
    }



    loadtable()
    
})

setInterval(function ()
    {
        loadtable()
    },4000)


function logout()
{
    document.cookie="token=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
    window.location.href="../login/login.html"
}

function submit()
{
    getCompanyId(userId)
    title=document.getElementById("title").value
    desc=document.getElementById("desc").value
    address=document.getElementById("address").value
    country=document.getElementById("country").value
    wage=document.getElementById("wage").value
    tag=document.getElementById("tag").value
    contract=document.getElementById("contract").value
    msg=document.getElementById("msg")
    let content=`{
    "title":"${title}",
        "description":"${desc}",
        "address":"${address}",
        "country":"${country}",
        "wage":${wage},
        "tag":"${tag}",
        "employment_contract_type": "${contract}",
        "employer_id":${userId},
        "company_id":${companyid}
    }
    `
    console.log(content)
    fetch("http://localhost:8080/advertisement",
    
    {method:"POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: content
      
    })
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            return response.json().then((data) => {
                msg.innerHTML=`<p class="col-sm-offset-2 col-sm-10">${data.message}</p>`
                console.error(data.message)})
        }
    })
    .then (function(data)
    {
        msg.innerHTML=`<p class="col-sm-offset-2 col-sm-10">${data.message}</p>`
    })

}


function getCompanyId(id)
{
    fetch("http://localhost:8080/employer/"+id)
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
        console.log(data)
        console.log(data.company_id)
        companyid=data.company_id;
        return data.company_id;

})
}


function loadtable()
{
    num=0
    fetch("http://localhost:8080/advertisement")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function (data) {
        ads.innerHTML=""
        if (Object.keys(data).length > 0) {
            for (let i = 0; i < Object.keys(data).length; i++) {
                // const companyid = data[i].company_id;
                // const employerid = data[i].employer_id;
                if (data[i].employer_id==userId)
                {
                    ads.innerHTML += `
                    <div id="jobListing-${i}" class="jobListing">
                    <h2 id="title-${i}">Title: <span class="titleinfo">${data[i]["title"]}</span></h2>
                    <h4>Description: <span class="descriptioninfo">${data[i]["description"]}</span></h4>
                    <h4>Salary: <span class="wageinfo">${data[i]["wage"]}</span></h4>
                    <h4>Address: <span class="addressinfo">${data[i]["address"]}</span></h4>
                    <h4>Country: <span class="countryinfo">${data[i]["country"]}</span></h4>
                    <h4>Contract: <span class="contractinfo">${data[i].employment_contract_type}</span></h4>
                    <h4 class="tag">tags: <span class="taginfo">${data[i]["tag"]}</span></h4>
                    <button onclick=edit(${data[i].id},${num})>edit</button>
                    <button onclick=deletedb(${data[i].id})>delete</button>
                    </div></div>
                    `;
                    num++
                }
            }
        } else {
            bg.innerHTML += "There are no job offers currently.....";
        }
    });
}
function deletedb(id)
{
    spInput= document.getElementsByClassName("specialInput")[0];
    fetch(`http://localhost:8080/advertisement/${id}`,{method:"DELETE"})
    .then(function(response)
    {
        if (response.ok) {
            spInput.innerHTML="<p>Successfully deleted</p>"
            return response.text();
            } 
        else {
            return response.json().then((data) => {
                spInput.innerHTML=data.message
                console.error(data.message);})}
    })
    
    
}

function edit(id, num)
{
    spInput= document.getElementsByClassName("specialInput")[0];
    adsInfo=document.getElementsByClassName("jobListing")[num];
    titleinfo=document.getElementsByClassName("titleinfo")[num];
    descinfo=document.getElementsByClassName("descriptioninfo")[num];
    wageinfo=document.getElementsByClassName("wageinfo")[num];
    addressinfo=document.getElementsByClassName("addressinfo")[num];
    countryinfo=document.getElementsByClassName("countryinfo")[num];
    taginfo=document.getElementsByClassName("taginfo")[num];
    contractinfo=document.getElementsByClassName("contractinfo")[num]
    console.log(titleinfo.innerText);
    spInput.innerHTML=`
    <input placeholder="Title" id="title" class="toSend" value="${titleinfo.innerText}">
            <textarea placeholder="description" id="desc" class="toSend" >${descinfo.innerText}</textarea>
            <input type="number" placeholder="wage" id="wage" class="toSend" value="${wageinfo.innerText}">
            <input type="text" placeholder="Address" id="address" class="toSend" value="${addressinfo.innerText}">
            <input type="text" placeholder="Country" id="country" class="toSend" value="${countryinfo.innerText}">
            <input type="text" placeholder="Contract type" id="employment_contact_type" class="toSend" value="${contractinfo.innerText}">
            <input type="text" placeholder="tag" id="tag" class="toSend" value="${taginfo.innerText}">
            <button type="button" onclick="editDb(${id})">Submit</button>
    `
}

function editDb(id)
{
    senData=""
    senData+='{'
    for(let i=0;i<7;i++)
    {
        
        let inputVal=document.getElementsByClassName("toSend")[i]
        
        
        if (inputVal.id !=="company_id")
        senData+='"'+inputVal.id+'"'+" : "+'"'+inputVal.value+'"'
        else
        senData+='"'+inputVal.id+'"'+" : "+inputVal.value
        if (i<6) senData+=","
    }
    senData+='}'
    console.log(senData)
    fetch(`http://localhost:8080/advertisement/${id}`,{
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
            return response.json().then((data) => {
                console.error(data.message);
            });
        }
    })
    

}

