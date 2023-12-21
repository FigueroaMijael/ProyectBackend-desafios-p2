// Obtén una referencia al formulario
const realTimeForm = document.getElementById('realTimeForm');

// Agrega un evento de escucha para el envío del formulario
realTimeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtén los valores de los campos del formulario
    const title = document.getElementById('realTimeTitle').value;
    const description = document.getElementById('realTimeDescription').value;
    const price = document.getElementById('realTimePrice').value;
    const category = document.getElementById('realTimeCategory').value;
    const thumbnail = document.getElementById('realTimeThumbnail').value;
    const stock = document.getElementById('realTimeStock').value;
    const code = document.getElementById('realTimeCode').value;

    // Crea un objeto con los datos del formulario
    const productData = {
        title,
        description,
        price,
        category,
        thumbnail,
        stock,
        code,
    };

    // Envía el objeto al servidor a través de Socket.io
    socket.emit('actualizarProductos', productData);
});
