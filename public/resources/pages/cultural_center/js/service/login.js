(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('.loginForm');

        form.onsubmit = () => {
            const data = JSON.stringify({
                'username': form.username.value,
                'password': form.password.value
            });

            fetch('http://localhost:1337/culturalcenter/login', {
                'method': 'POST',
                'headers': {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                },
                'mode': 'cors',
                'cache': 'default',
                'body': data
            })
                .then((result) => result.json())
                .then((data) => {
                    localStorage.setItem('token', data.AccessToken);
                    localStorage.setItem('userid', data.ID);
                    // document.getElementById('status').innerHTML = "Du er nu logget ind ...";
                    window.location.replace(`/culturalcenter/admin`);
        
                })
                .catch((err) => {
                    console.log(err);
                    document.getElementById('status').innerHTML = "Forkert brugernavn eller kodeord";                    
                });

            return false;
        };
    });
})();

document.getElementById('logud').addEventListener('click', () => {
    if (confirm('Vil du logge af?')) {
        localStorage.clear();
        window.location.replace(`/culturalcenter`);
    }
})