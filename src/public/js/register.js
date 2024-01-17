const form = document.getElementById('registerUsers');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    //usamos fetch
    fetch('/api/session/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content.Type': 'application/json'
        }
    }).then( (res) => {
        if(res.status === 200) {
            window.location.replace('/users/login')
        }
    })
})