function checkToken()
{
    let token;
    const cookies = document.cookie.split('; ');

    if (!cookies)
    {
        window.location.href = "../login/login.html";
    }

    for (const cookie of cookies) 
    {
        const [name, value] = cookie.split('=');
        if (name === 'token') 
        {
            token = value;
            break;
        }
    }

    if (token) console.log('Token:', token);
    else 
    {
        window.location.href = "../login/login.html"
    }

    fetch(`http://localhost:8080/${role.value}/verifyToken`,{
        method: "GET",
        body:loginInfo,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {

    })
}

document.addEventListener('DOMContentLoaded', function() {
    checkToken();
});