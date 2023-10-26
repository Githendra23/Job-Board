import { checkToken } from '../checkToken';

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
                    // Handle employer case
                    break;
                default:
                    window.location.href = "../login/login.html";
                    break;
            }
        })
        .catch((error) => {
            console.error(error);
            window.location.href = "../login/login.html";
        });
});