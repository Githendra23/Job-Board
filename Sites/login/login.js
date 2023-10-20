email=document.getElementById("email")
pass=document.getElementById("password")
role=document.getElementById("role")
msg=document.getElementsByClassName("serverReturn")[0]


function login()
{
    console.log (email.value)
    console.log(password.value)
    
    // const password = password.value;
    // const email = email.value;
    loginInfo=`
    {
        "email":"${email.value}",
        "password":"${pass.value}"
    }
    `
    console.log(loginInfo)

    fetch(`http://localhost:8080/${role.value}/login`,{
    method: "POST",
    body:loginInfo,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    
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
    .then(function(data){
        console.log(data.message)
        msg.innerHTML=`<p class="col-sm-offset-2 col-sm-10">${data.message}</p>`
        document.cookie="token="+data.token+"; path=/"
        console.log(document.cookie)
        window.location.href="../user/index.html"
    })
}