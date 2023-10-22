let useremail
let userId
let userRole
let company_id


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

function submit()
{
    title=document.getElementById("title").value
    desc=document.getElementById("desc").value
    address=document.getElementById("address").value
    wage=document.getElementById("wage").value
    tag=document.getElementById("tag").value
    contract=document.getElementById("contract").value
    msg=document.getElementById("msg")
    let content=`{
    "title":"${title}",
        "description":"${desc}",
        "address":"${address}",
        "wage":${wage},
        "tag":"${tag}",
        "employment_contract_type": "${contract}",
        "employer_id":${userId},
        "company_id":${getCompanyId(userId)}
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
    fetch("http://localhost:8080/"+tabledb)
    .then(function(response){

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function(data){
        for (let i =0;i<Object.keys(data);i++)
        {
            if (data[i].id=id)
            return data[i].company_id
        }

})
}