export function checkToken() 
{
    let token;
    const cookies = document.cookie.split('; ');

    if (!cookies) return Promise.reject('No cookies found');

    for (const cookie of cookies) 
    {
        const [name, value] = cookie.split('=');
        if (name === 'token') 
        {
            token = value;
            break;
        }
    }

    if (!token) return Promise.reject('Token not found');

    return fetch(`http://localhost:8080/verifyToken`, {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        if (response.ok) return response.json();
        else 
        {
            document.cookie = token + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            return Promise.reject('Failed to verify token');
        }
    });
}