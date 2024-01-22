const socketClient = io();

socketClient.emit("message", "Mensaje desde el cliente");

socketClient.on("server_message", (data) => {
  console.log(data);
});

socketClient.on("message_all", (data) => {
  console.log(data);
});

socketClient.on("message_all_2", (data) => {
  console.log(data);
});

const setActive = (button) => {
  // Obtén todos los botones de clasificación
  let buttons = document.querySelectorAll('.sort-button');

  // Elimina la clase 'active' de todos los botones
  buttons.forEach((btn) => {
    btn.classList.remove('active');
  });

  // Agrega la clase 'active' al botón clicado
  button.classList.add('active');

  console.log('Botón activado:', button);
};


document.getElementById('searchBtn').addEventListener('click', function() {
  var searchTerm = document.getElementById('searchInput').value;
  alert('Buscando: ' + searchTerm);
});

// Simulación de agregar productos al carrito
var cartCount = 0;

document.getElementById('cartIcon').addEventListener('click', () => {
  cartCount++;
  updateCartCount(cartCount);

});

function updateCartCount(count) {
  document.getElementById('cartCount').textContent = count;
}
