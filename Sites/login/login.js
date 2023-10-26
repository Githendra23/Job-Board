email=document.getElementById("email")
pass=document.getElementById("password")
role=document.getElementById("role")
msg=document.getElementsByClassName("serverReturn")[0]


function login() {
    console.log(email.value);
    console.log(password.value);

    const loginInfo = {
        email: email.value,
        password: password.value
    };

    console.log(loginInfo);

    fetch(`http://localhost:8080/${role.value}/login`, {
        method: "POST",
        body: JSON.stringify(loginInfo), // Convert loginInfo to JSON
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then((data) => {
                msg.innerHTML = `<p class="col-sm-offset-2 col-sm-10">${data.message}</p>`;
                console.error(data.message);
            });
        }
    })
    .then(function (data) {
        if (data.token) {
            const expirationDate = new Date();
            expire = expirationDate.setTime(expirationDate.getTime() + 3600 * 1000);

            console.log(data.message);
            msg.innerHTML = `<p class="col-sm-offset-2 col-sm-10">${data.message}</p>`;

            // Set the 'token' cookie with the token from the response
            document.cookie = `token=${data.token}; expires=${expirationDate.toUTCString()}; path=/`;
            console.log(document.cookie);

            // Redirect to the user index page
            window.location.href = `../${role.value}/index.html`; // Use the role to determine the path
        } else {
            console.error("Token not found in the response data.");
        }
    });
}