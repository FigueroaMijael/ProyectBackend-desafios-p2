// RealTimeProductsContainer.js
const socketClient = io();

const submit = document.querySelector("#realTimeButtonn")

socketClient.on("realTimeProducts_list", (data) => {
    console.log(data);

    const realTimeProductsContainer = document.querySelector(".realTimeProductsContainer");

    realTimeProductsContainer.innerHTML = `
        <h1>Lista de Productos en Tiempo Real</h1>
        <ul>
            ${data.map((prod) => `<li><strong>${prod.title}</strong> - ${prod.description} - ${prod.price} - ${prod.category} - ${prod.thumbnail} - ${prod.stock} - ${prod.code}</li>`).join('')}
        </ul>
    `;
});

submit.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("realTimeTitle").value;
    const description = document.getElementById("realTimeDescription").value;
    const price = document.getElementById("realTimePrice").value;
    const category = document.getElementById("realTimeCategory").value;
    const thumbnail = document.getElementById("realTimeThumbnail").value;
    const stock = document.getElementById("realTimeStock").value;
    const code = document.getElementById("realTimeCode").value;

    const product = {
        title: title,
        description: description,
        price: price,
        category: category,
        thumbnail: thumbnail,
        stock: stock,
        code: code,
    };

    socketClient.emit("realTimeForm_message", product);
});

