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
})

console.log(userRole)
console.log(useremail)
console.log(userId)

function logout()
{
    document.cookie="token=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
    window.location.href="../login/login.html"
}

var bg = document.getElementById("background");


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
            companyid=data[i].company_id
            employerid=data[i].employer_id
            bg.innerHTML+=`<div id="jobListing, `+i+`" class="jobListing">
            <h1 id="title,`+i+`" class="title">${data[i]["title"]}</h1>
            <h3 id="descr,`+i+`" class="descr">${data[i]["description"]}</h3>
            <button id="learnMore,`+i+`" class="learnMore" onclick="learn(`+i+`)">Learn more</button>
            <div id="addInfo,`+i+`" class="addInfo">
            
            </div>
            <button id="apply,`+i+`" class="learnMore" onclick="apply(${i},${data[i].id},${companyid},${employerid})">Apply</button>
            `;

        }}
        else
        {
            bg.innerHTML+="There are no job offers currently....."
        }
    })


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

    function apply(num,id ,employerid,companyid )
    {

            var info = document.getElementsByClassName("addInfo")[num];
            isApplying=true;
            info.innerHTML=`<form>
            <label for="CV">CV:</label>
            <input type="file" id="cv" class="cv" placeholder="CV" accept=".pdf"><br>
            <label for="CV">Cover Letter:</label>
            <input type="file" id="coverLetter" class="coverLetter" placeholder="Cover letter" accept=".pdf"><br>
            <button type="button" onclick="send(${id},${num},${employerid},${companyid})">submit</button>
        </form>`

    }

    function send(id,num, employerid, companyid)
    {
        cv=document.getElementsByClassName("cv")[num]
        coverLetter=document.getElementsByClassName("coverLetter")[num]
        console.log(cv.files)
        console.log(coverLetter.files)
        fetch("http://localhost:8080/job_application/",{
            method:"POST",
            body:JSON.stringify({
                "cv": JSON.stringify(cv.files) ,
                "cover_letter": JSON.stringify(coverLetter.files) ,
                "advertisement_id": id ,
                "candidate_id": userId,
                "employer_id": employerid,
                "company_id" : companyid
            })
        })
    }

