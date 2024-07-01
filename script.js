
const legajo = '16413'
const apiUrl = `https://api.yumserver.com/${legajo}/products`;

const productsContainer = document.getElementById('productsContainer');
const createProductForm = document.getElementById('createProductForm');
// Obtener todos los productos y mostrarlos en el HTML
function getAllProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            productsContainer.innerHTML = ''; 
            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <h2>${product.titulo}</h2>
                    <p>Precio en Pesos: $${product.precioPeso}</p>
                    <p>Precio en Dólares: $${product.precioDolar}</p>
                    <p>Fecha: ${product.fecha}</p>
                    <button onclick="confirmDelete('${product.idcod}')">Eliminar</button>
                    <button onclick="showUpdateForm('${product.idcod}', '${product.titulo}', '${product.precioPeso}', '${product.precioDolar}', '${product.fecha}', this)">Modificar</button>
                        <form style="display:none" class="update-form">
                            <input type="hidden" name="idcod" value="${product.idcod}">
                            <div class="form-group">
                                <label for="updateTitulo">Título:</label>
                                <input type="text" name="titulo" value="${product.titulo}" required>
                            </div>
                            <div class="form-group">
                                <label for="updatePrecioPeso">Precio en Pesos:</label>
                                <input type="number" name="precioPeso" value="${product.precioPeso}" required>
                            </div>
                            <div class="form-group">
                                <label for="updatePrecioDolar">Precio en Dólares:</label>
                                <input type="number" name="precioDolar" value="${product.precioDolar}" required>
                            </div>
                            <div class="form-group">
                                <label for="updateFecha">Fecha:</label>
                                <input type="date" name="fecha" value="${product.fecha}" required>
                            </div>
                            <button type="submit">Modificar Producto</button>
                            <button type="button" onclick="hideUpdateForm(this)">Cancelar</button>
                        </form>
                `;
                productDiv.querySelector('.update-form').addEventListener('submit', (event) => {
                    event.preventDefault();
                    const form = event.target;
                    const idcod = form.idcod.value;
                    const titulo = form.titulo.value;
                    const precioPeso = form.precioPeso.value;
                    const precioDolar = form.precioDolar.value;
                    const fecha = form.fecha.value;

                    updateProduct(idcod, titulo, precioPeso, precioDolar, fecha);
                });
                productsContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error al obtener productos:', error));
}
// Funcion de crear un producto nuevo
function createProduct(titulo, precioPeso, precioDolar, fecha) {
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, precioPeso, precioDolar, fecha })
    })
        .then(response => response.text())
        .then(data => {
            console.log('Respuesta al crear producto:', data);
            getAllProducts(); 
            window.location.href = "index.html";
        })
        .catch(error => console.error('Error al crear producto:', error));
}


// Funcion para modificar un produto 
function updateProduct(idcod, titulo, precioPeso, precioDolar, fecha) {
    fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idcod, titulo, precioPeso, precioDolar, fecha })
    })
        .then(response => response.text())
        .then(data => {
            console.log('Respuesta al modificar producto:', data);
            getAllProducts(); 
        })
        .catch(error => console.error('Error:', error));
}
window.confirmDelete = function(idcod) {
    if (confirm('¿Estás seguro que deseas eliminar este producto?')) {
        deleteProduct(idcod);
    }
};

// Eliminar un producto
function deleteProduct(idcod) {
    fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idcod })
    })
        .then(response => response.text())
        .then(data => {
            console.log('Respuesta al eliminar producto:', data);
            getAllProducts(); 
        })
        .catch(error => console.error('Error al eliminar producto:', error));
}
// Envío del form
createProductForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const titulo = createProductForm.titulo.value;
    const precioPeso = createProductForm.precioPeso.value;
    const precioDolar = createProductForm.precioDolar.value;
    const fecha = createProductForm.fecha.value;

    createProduct(titulo, precioPeso, precioDolar, fecha);

   
    createProductForm.reset();
});


// mostrar el formulario con los datos del producto
window.showUpdateForm = function(idcod, titulo, precioPeso, precioDolar, fecha, button) {
    const updateForm = button.nextElementSibling;
    updateForm.style.display = 'block';
};

// No mostrar form
window.hideUpdateForm = function(button) {
    const updateForm = button.parentElement;
    updateForm.style.display = 'none';
    updateForm.reset();
};

getAllProducts();
document.addEventListener('DOMContentLoaded', getAllProducts);
