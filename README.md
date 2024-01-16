# Job Board

**Created by Githendra Perera (Backend) and Julian Schneider (Frontend)**

Job Board is a web application designed to streamline the connection between job seekers and employers. This platform offers a user-friendly experience for both parties, allowing companies to post job advertisements and candidates to apply for positions effortlessly.

## Technologies Used:

**Backend:**

<a href="https://nodejs.org/docs/latest/api/" target="_blank"><img src="https://img.icons8.com/fluency/48/node-js.png"/></a>
<a href="https://expressjs.com/en/5x/api.html" target="_blank"><img src="https://img.icons8.com/fluency/48/express-js.png"/></a>
<a href="https://dev.mysql.com/doc/" target="_blank"><img src="https://img.icons8.com/fluency/48/mysql-logo.png"/></a>

**Frontend:**

<a href="https://www.w3.org/html" target="_blank"><img src="https://img.icons8.com/color/48/000000/html-5--v1.png"/></a>
<a href="https://www.linux.org" target="_blank"><img src="https://img.icons8.com/color/48/000000/css3--v1.png"/></a>
<a href="https://devdocs.io/javascript/" target="_blank"><img src="https://img.icons8.com/color/48/000000/javascript--v1.png"/></a>

## Key Features:

#### For Companies:

- Easily add or remove employers associated with the company.
- Post job advertisements to attract potential candidates.

#### For Candidates:

- Find job advertisements that match their interests.
- Apply for job positions and submit job applications.

Job Board simplifies the job search and hiring process, providing a seamless platform for employers and candidates.

#### For Employers:

- Create job advertisements.
- Manage applicants' information, including resumes and cover letters.

#### For Administrators:

- Manage company, candidate, and employer accounts.
- Monitor platform activity.

Administrators can log in to their accounts using the "Candidates" tab.

---
### Database

![db](https://github.com/Githendra23/Job-Board/assets/51377697/77ea21b5-f169-4a59-96fd-f876848bb956)

### REST-API CRUD

- Create: Company, employer, candidate, and administrator accounts, as well as job advertisements
- Read: Account information (excluding account passwords), job advertisements, and job applications
- Update: Account details, job advertisements, and job applications
- Delete: Accounts, job advertisements, job applications

Passwords are encrypted during the creation or update of accounts and are stored in the database through the API
