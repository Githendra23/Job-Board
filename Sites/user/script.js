import { checkToken } from '../checkToken';

let useremail;
let userId;
let userRole;

document.addEventListener("DOMContentLoaded", function() {
    checkToken()
        .then((data) => {
            switch (data.role) {
                case 'company':
                    window.location.href = "../company/company.html";
                    break;
                case 'admin':
                    window.location.href = "../admin/admin.html";
                    break;
                case 'employer':
                    window.location.href = "../employer/employer.html";
                    break;
            }

            console.log(data);
            userId = data.id;
            useremail = data.email;
            userRole = data.role;

            console.log(userRole);
            console.log(useremail);
            console.log(userId);

        })
        .catch((error) => {
            console.error(error);
            window.location.href = "../login/login.html";
        });
});

console.log(getCookie("token"));

function getCookie(cookie) {
    const cookiestring = document.cookie.split(';');
    for (let i = 0; i < cookiestring.length; i++) {
        const cookiepair = cookiestring[i].split("=");
        if (cookiepair[0] === cookie) {
            return cookiepair[1];
        }
    }
}

/* fetch("http://localhost:8080/verifyToken", {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "token": getCookie("token") })
})
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            window.alert("There has been an error, returning you to the login page");
            window.location.href = "../login/login.html";
            return Promise.reject('Error occurred while fetching data.');
        }
    })
    .then(function (data) {
        console.log(data);
        userId = data.id;
        useremail = data.email;
        userRole = data.role;
        if (userRole === "company") {
            window.location.href = "../company/company.html";
        }
        console.log(userRole);
        console.log(useremail);
        console.log(userId);
    })
    .catch((error) => {
        console.error(error);
    }); */

const bg = document.getElementById("background");

fetch("http://localhost:8080/advertisement")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error occurred while fetching data.');
        }
    })
    .then(function (data) {
        if (Object.keys(data).length > 0) {
            for (let i = 0; i < Object.keys(data).length; i++) {
                const companyid = data[i].company_id;
                const employerid = data[i].employer_id;
                bg.innerHTML += `
                    <div id="jobListing-${i}" class="jobListing">
                        <h1 id="title-${i}" class="title">${data[i]["title"]}</h1>
                        <h3 id="descr-${i}" class="descr">${data[i]["description"]}</h3>
                        <button id="learnMore-${i}" class="learnMore" onclick="learn(${i})">Learn more</button>
                        <div id="addInfo-${i}" class="addInfo"></div>
                        <button id="apply-${i}" class="learnMore" onclick="apply(${i}, ${data[i].id}, ${employerid}, ${companyid})">Apply</button>
                    </div>
                `;
            }
        } else {
            bg.innerHTML += "There are no job offers currently.....";
        }
    });

function learn(num) {
    fetch("http://localhost:8080/advertisement")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error occurred while fetching data.');
            }
        })
        .then(function (data) {
            const info = document.getElementById(`addInfo-${num}`);
            info.innerHTML = `
                <h2 id="title-${num}">${data[num]["title"]}</h2>
                <h4>${data[num]["description"]}</h4>
                <h4>Salary: ${data[num]["wage"]}</h4>
                <h4>Address: ${data[num]["address"]}, ${data[num]["country"]}</h4>
                <h4 class="tag">tags: ${data[num]["tag"]}</h4>
            `;
        });
}

function apply(num, id, employerid, companyid) {
    const info = document.getElementById(`addInfo-${num}`);
    info.innerHTML = `
        <form>
            <label for="CV">CV:</label>
            <input type="file" id="cv" class="cv" placeholder="CV" name="cv" accept=".pdf"><br>
            <label for="CV">Cover Letter:</label>
            <input type file id="coverLetter" name="cover_letter" class="coverLetter" placeholder="Cover letter" accept=".pdf"><br>
            <button type="button" onclick="send(${id}, ${num}, ${employerid}, ${companyid})">Submit</button>
        </form>
    `;
}

function send(id, num, employerid, companyid) {
    const cvFileInput = document.querySelector(`#jobListing-${num} input[name="cv"]`);
    const coverLetterFileInput = document.querySelector(`#jobListing-${num} input[name="cover_letter"]`);

    const cvFile = cvFileInput.files[0];
    const coverLetterFile = coverLetterFileInput.files[0];

    if (!cvFile || !coverLetterFile) {
        console.log("Please select CV and cover letter files.");
        return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("cover_letter", coverLetterFile);
    formData.append("advertisement_id", parseInt(id));
    formData.append("user_id", parseInt(userId));
    formData.append("employer_id", parseInt(employerid));
    formData.append("company_id", parseInt(companyid));

    console.log(formData);

    fetch("http://localhost:8080/job_application/", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data) => {
                    console.error(data);
                });
            }
        })
        .then((data) => {
            console.log(data); // Handle the response as needed
        })
        .catch((error) => {
            console.error(error);
        });
}
