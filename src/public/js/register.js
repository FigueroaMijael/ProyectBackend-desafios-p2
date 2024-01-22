const form = document.getElementById('registerUsers');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => {
        obj[key] = value;
    });

    try {
        const response = await fetch('/api/session/register', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json' // Corregido 'Content.Type' a 'Content-Type'
            }
        });

        if (response.status === 200) {
            const result = await response.json(); // Parsear la respuesta JSON
            console.log(result);
            window.location.replace('/users/login');
        } else {
            console.error('Error en la solicitud:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
});
