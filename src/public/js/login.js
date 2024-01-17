const form = document.getElementById('loginUsers');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    //usamos fetch
    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content.Type': 'application/json'
        }
    }).then( (res) => {
        if(res.status === 200) {
            window.location.replace('/users/profile')
        }
    })
})