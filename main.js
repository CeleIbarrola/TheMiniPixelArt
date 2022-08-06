swal("Escribe tu nombre:", {
  content: "input",
}).then((value) => {
  swal(`Bienvenido ${value} a la página de TheMiniPixelArt`);
});

const contenedor = document.getElementById("productoContenedor");

fetch("/data.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("itemCard");
      div.innerHTML = `<div class="item">
                                <img class="item-image"src=${producto.img}>
                                <h2 class="item-title">${producto.nombre}</h2>
                                <h3 class="item-price">$${producto.precio}</h3>
                                <h4 class="item-cuotas">6 cuotas de $ ${(
                                  producto.precio / 6
                                ).toFixed(2)} sin interés</h4>
                                <button class="addToCart" id='product-${
                                  producto.id
                                }'>Añadir al carrito</button>
                        </div>`;
      contenedor.appendChild(div);

      /* LLamo el boton añadir carrito de cada producto */
      const addToShoppingCartButtons =
        document.getElementsByClassName("addToCart");
      /* Agrego el evento para agregar al carro los productos seleccionados */
      for (const btn of addToShoppingCartButtons) {
        btn.onclick = addToCartClicked;
      }
      /* Funcion para seleccionar los productos */
      function addToCartClicked(e) {
        const btn = e.target;
        const id = btn.id.split("-")[1];

        const product = data.find((p) => p.id == id);

        /* Ver por consola los productos seleccionados */
        console.log("Agregando producto ", product);
        /* Hacer funcion para mostrar en el carro */
        const item = btn.closest(".itemCard");

        const itemTitle = item.querySelector(".item-title").textContent;
        const itemPrice = item.querySelector(".item-price").textContent;
        const itemImage = item.querySelector(".item-image").src;

        addItemToShoppingCart(itemTitle, itemPrice, itemImage);
        const enJSON = JSON.stringify(product);
        localStorage.setItem("productos", enJSON);
        
        Toastify({
          text: "Agregaste un producto al carrito de compras",
          duration: 2000,
          gravity: "bottom",
          position: "left",
          style: {
            background: "#464445",
            color: "white",
          },
        }).showToast();
      }
    });
  });

const comprarButton = document.querySelector(".comprarButton");
comprarButton.addEventListener("click", comprarButtonClicked);

const shoppingCartItemsContainer = document.querySelector(
  ".shoppingCartItemsContainer"
);

function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName(
    "shoppingCartItemTitle"
  );
  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      let elementQuantity = elementsTitle[
        i
      ].parentElement.parentElement.parentElement.querySelector(
        "shoppingCartItemQuantity"
      );
      elementQuantity.value++;
      $(".toast").toast("show");
      updateShoppingCartTotal();
      return;
    }
  }

  const shoppingCartRow = document.createElement("div");
  const shoppingCartContent = `
    <div class="row shoppingCartItem">
          <div class="col-6">
              <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                  <img src=${itemImage} class="shopping-cart-image">
                  <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
              </div>
          </div>
          <div class="col-2">
              <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                  <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
              </div>
          </div>
          <div class="col-4">
              <div
                  class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                  <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                      value="1">
                  <button class="btn btn-danger buttonDelete" type="button">X</button>
              </div>
          </div>
      </div>`;
  shoppingCartRow.innerHTML = shoppingCartContent;
  shoppingCartItemsContainer.append(shoppingCartRow);

  shoppingCartRow
    .querySelector(".buttonDelete")
    .addEventListener("click", removeShoppingCartItem);

  shoppingCartRow
    .querySelector(".shoppingCartItemQuantity")
    .addEventListener("change", quantityChanged);
  shoppingCartRow
    .querySelector(".buttonDelete")
    .addEventListener("click", () => {
      swal({
        title: "¿Esta seguro de eliminar el producto?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((result) => {
        if (result) {
          swal({
            title: "Borrado!",
            icon: "success",
            text: "El producto ha sido borrado con éxito",
          });
        }
      });
    });

  updateShoppingCartTotal();
}

function updateShoppingCartTotal() {
  let total = 0;
  const shoppingCartTotal = document.querySelector(".shoppingCartTotal");

  const shoppingCartItems = document.querySelectorAll(".shoppingCartItem");

  shoppingCartItems.forEach((shoppingCartItem) => {
    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
      ".shoppingCartItemPrice"
    );
    const shoppingCartItemPrice = Number(
      shoppingCartItemPriceElement.textContent.replace("$", "")
    );
    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
      ".shoppingCartItemQuantity"
    );
    const shoppingCartItemQuantity = Number(
      shoppingCartItemQuantityElement.value
    );
    total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
  });
  shoppingCartTotal.innerHTML = `$ ${total.toFixed(2)}`;
  localStorage.setItem("precio total", total);
}

function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  buttonClicked.closest(".shoppingCartItem").remove();
  updateShoppingCartTotal();
  localStorage.removeItem("productos");
}

function quantityChanged(event) {
  const input = event.target;
  input.value <= 0 ? (input.value = 1) : null;
  updateShoppingCartTotal();
}

function comprarButtonClicked() {
  shoppingCartItemsContainer.innerHTML = "";
  updateShoppingCartTotal();
}
/* correccion del CARRO */
const vaciarCarrito = document.querySelector("#vaciarButton");
let carro =document.getElementById("carrito"); 
vaciarCarrito.addEventListener("click", () => {
  swal({
    title: "¿Esta seguro de vaciar el carrito?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((result) => {
    if (result) {
      swal({
        title: "Borrado!",
        icon: "success",
        text: "El carrito ha sido vaciado con éxito",
      });
    }
  });
});

vaciarCarrito.addEventListener("click", () => {
  /* evento click */
  carro.innerText = ""; /* vacio carro */
  updateShoppingCartTotal();
  localStorage.clear(); /* Borro el storage */
});


const formulario = document.getElementById("formulario");
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");

formulario.addEventListener("submit", validarFormulario);

function validarFormulario(event) {
  event.preventDefault();

  console.log(nombre.value);
  console.log(email.value);
}
