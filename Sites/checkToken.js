export function checkToken()
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

    fetch(`http://localhost:8080/verifyToken`,{
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        if (response.ok)
        {
            return response.json();
        }
    })
    .then((data) => {
        const id = data.id;
        const email = data.email;
        const role = data.role;

        return data;
    })
}