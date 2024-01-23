const form = document.getElementById('loginUsers');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => {
        obj[key] = value;
    });

    try {
        const response = await fetch('/api/session/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        if (response.status === 200) {
            window.location.replace('/users/profile');
        } else {
            console.error('Error en la solicitud:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
});
