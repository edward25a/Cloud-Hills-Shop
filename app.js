// Cambia este numero por el WhatsApp real de la tienda, solo con codigo de pais y digitos.
const WHATSAPP_NUMBER = "50760000000";

const PRODUCTS_STORAGE_KEY = "cloudHillsProducts";

const defaultProducts = [
  {
    id: "blusa-lino-azul",
    name: "Blusa lino azul",
    category: "blusas",
    price: 24.99,
    sizes: ["S", "M", "L"],
    stock: 8,
    isNew: true,
    description: "Blusa fresca con caída suave, ideal para outfits casuales y oficina.",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "vestido-floral-midi",
    name: "Vestido floral midi",
    category: "vestidos",
    price: 42.5,
    sizes: ["S", "M"],
    stock: 5,
    isNew: true,
    description: "Vestido liviano con estampado floral y silueta cómoda para salidas.",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "jean-recto-claro",
    name: "Jean recto claro",
    category: "jeans",
    price: 39.99,
    sizes: ["M", "L", "XL"],
    stock: 7,
    isNew: false,
    description: "Denim de tiro alto con corte recto y lavado claro fácil de combinar.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "set-satin-verde",
    name: "Set satín verde",
    category: "conjuntos",
    price: 54.99,
    sizes: ["S", "M", "L"],
    stock: 4,
    isNew: true,
    description: "Conjunto de dos piezas con brillo sutil para un look arreglado sin esfuerzo.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "bolso-mini-negro",
    name: "Bolso mini negro",
    category: "accesorios",
    price: 22.0,
    sizes: ["Única"],
    stock: 12,
    isNew: false,
    description: "Bolso compacto con asa corta y correa larga para uso diario.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "top-rib-coral",
    name: "Top rib coral",
    category: "ofertas",
    price: 14.99,
    sizes: ["S", "M", "L"],
    stock: 9,
    isNew: false,
    description: "Top básico en tejido rib, perfecto para combinar con jeans o faldas.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "chaqueta-denim",
    name: "Chaqueta denim",
    category: "jeans",
    price: 48.0,
    sizes: ["M", "L"],
    stock: 3,
    isNew: true,
    description: "Chaqueta de mezclilla con fit relajado para capas de temporada.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "vestido-negro-corto",
    name: "Vestido negro corto",
    category: "vestidos",
    price: 36.99,
    sizes: ["S", "M", "L"],
    stock: 6,
    isNew: false,
    description: "Vestido corto versátil con textura suave para día o noche.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=82"
  },
  {
    id: "camisa-rayas",
    name: "Camisa de rayas",
    category: "blusas",
    price: 29.5,
    sizes: ["S", "M", "XL"],
    stock: 0,
    isNew: false,
    description: "Camisa de manga larga con rayas finas y botones frontales.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=82"
  }
];

let products = loadProducts();

const categoryNames = {
  blusas: "Blusas",
  vestidos: "Vestidos",
  jeans: "Jeans",
  conjuntos: "Conjuntos",
  accesorios: "Accesorios",
  ofertas: "Oferta"
};

const state = {
  category: "all",
  size: "all",
  maxPrice: 75,
  query: "",
  sort: "featured",
  stockOnly: true,
  selectedSizeByProduct: {},
  cart: []
};

function loadProducts() {
  const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!savedProducts) return defaultProducts;

  try {
    const parsedProducts = JSON.parse(savedProducts);
    return Array.isArray(parsedProducts) && parsedProducts.length > 0 ? parsedProducts : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

const productGrid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const priceRange = document.querySelector("#priceRange");
const priceOutput = document.querySelector("#priceOutput");
const stockOnly = document.querySelector("#stockOnly");
const clearFilters = document.querySelector("#clearFilters");
const modal = document.querySelector("#productModal");
const modalBody = document.querySelector("#modalBody");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("[data-cart-count]");
const whatsappLink = document.querySelector("#whatsappLink");
const checkoutForm = document.querySelector("#checkoutForm");
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerNote = document.querySelector("#customerNote");
const firebaseOrderButton = document.querySelector("#firebaseOrderButton");
const firebaseOrderStatus = document.querySelector("#firebaseOrderStatus");
const scrim = document.querySelector("#scrim");
const clearCart = document.querySelector("#clearCart");

let firebaseOrdersApi = null;

function formatPrice(value) {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function isFirebaseConfigured() {
  const config = window.firebaseConfig;
  return Boolean(
    config &&
      config.apiKey &&
      !config.apiKey.includes("PEGA_AQUI") &&
      config.databaseURL &&
      config.databaseURL.startsWith("https://")
  );
}

function updateFirebaseOrderButton() {
  if (!firebaseOrderButton) return;
  firebaseOrderButton.disabled = state.cart.length === 0 || !firebaseOrdersApi;
}

async function initFirebaseOrders() {
  if (!isFirebaseConfigured()) {
    firebaseOrderStatus.textContent = "Configura firebase-config.js para activar pedidos en vivo.";
    updateFirebaseOrderButton();
    return;
  }

  try {
    const appModule = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const databaseModule = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
    const app = appModule.initializeApp(window.firebaseConfig);
    const db = databaseModule.getDatabase(app);

    firebaseOrdersApi = {
      db,
      ref: databaseModule.ref,
      push: databaseModule.push,
      serverTimestamp: databaseModule.serverTimestamp
    };

    firebaseOrderStatus.textContent = "Firebase conectado. Los pedidos se guardan en el panel del dueño.";
  } catch (error) {
    firebaseOrderStatus.textContent = "No se pudo conectar Firebase. Revisa la configuración.";
    console.error(error);
  }

  updateFirebaseOrderButton();
}

function getCartOrderItems() {
  return state.cart
    .map((item) => {
      const product = products.find((productItem) => productItem.id === item.id);
      if (!product) return null;

      return {
        id: product.id,
        nombre: product.name,
        talla: item.size,
        cantidad: item.qty,
        precio: product.price,
        subtotal: product.price * item.qty,
        imagen: product.image
      };
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartOrderItems().reduce((sum, item) => sum + item.subtotal, 0);
}

function getFilteredProducts() {
  const normalizedQuery = state.query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory = state.category === "all" || product.category === state.category;
    const matchesPrice = product.price <= state.maxPrice;
    const matchesStock = !state.stockOnly || product.stock > 0;
    const matchesSize = state.size === "all" || product.sizes.includes(state.size);
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      categoryNames[product.category].toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesPrice && matchesStock && matchesSize && matchesQuery;
  });

  return filtered.sort((a, b) => {
    if (state.sort === "priceAsc") return a.price - b.price;
    if (state.sort === "priceDesc") return b.price - a.price;
    if (state.sort === "new") return Number(b.isNew) - Number(a.isNew);
    return Number(b.isNew) - Number(a.isNew) || b.stock - a.stock;
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  resultCount.textContent = `${filteredProducts.length} producto${filteredProducts.length === 1 ? "" : "s"}`;
  emptyState.hidden = filteredProducts.length > 0;

  productGrid.innerHTML = filteredProducts
    .map((product) => {
      const badgeClass = product.category === "ofertas" ? "badge sale" : "badge";
      const badgeText = product.category === "ofertas" ? "Oferta" : product.isNew ? "Nuevo" : categoryNames[product.category];
      const stockLabel = product.stock > 0 ? `${product.stock} disponibles` : "Agotado";

      return `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <span class="${badgeClass}">${badgeText}</span>
          </div>
          <div class="product-info">
            <div class="product-top">
              <h3>${product.name}</h3>
              <span class="product-price">${formatPrice(product.price)}</span>
            </div>
            <p>${product.description}</p>
            <div class="product-tags">
              <span>${categoryNames[product.category]}</span>
              <span>Tallas ${product.sizes.join(", ")}</span>
              <span>${stockLabel}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-view-product="${product.id}">Ver detalle</button>
              <button type="button" data-add-product="${product.id}" ${product.stock === 0 ? "disabled" : ""}>Agregar</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (window.lucide) window.lucide.createIcons();
}

function openProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const selectedSize = state.selectedSizeByProduct[product.id] || product.sizes[0];
  const stockLabel = product.stock > 0 ? `${product.stock} disponibles` : "Agotado";

  modalBody.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="modal-info">
      <div>
        <p class="eyebrow">${categoryNames[product.category]} · ${stockLabel}</p>
        <h2>${product.name}</h2>
      </div>
      <p class="modal-copy">${product.description}</p>
      <strong class="modal-price">${formatPrice(product.price)}</strong>
      <div>
        <p class="eyebrow">Talla</p>
        <div class="size-select" data-modal-sizes>
          ${product.sizes
            .map(
              (size) =>
                `<button class="${size === selectedSize ? "active" : ""}" type="button" data-modal-size="${size}" data-product-id="${product.id}">${size}</button>`
            )
            .join("")}
        </div>
      </div>
      <button class="primary-action" type="button" data-add-product="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
        Agregar al pedido
      </button>
    </div>
  `;

  modal.showModal();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || product.stock === 0) return;

  const selectedSize = state.selectedSizeByProduct[product.id] || product.sizes[0];
  const existing = state.cart.find((item) => item.id === product.id && item.size === selectedSize);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: product.id, size: selectedSize, qty: 1 });
  }

  renderCart();
  openCart();
}

function renderCart() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = getCartTotal();

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (state.cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-state">Tu pedido está vacío.</p>`;
  } else {
    cartItems.innerHTML = state.cart
      .map((item) => {
        const product = products.find((productItem) => productItem.id === item.id);
        if (!product) return "";

        return `
          <article class="cart-item">
            <img src="${product.image}" alt="${product.name}">
            <div>
              <strong>${product.name}</strong>
              <small>${item.size} · ${formatPrice(product.price)} c/u</small>
            </div>
            <div class="cart-qty">
              <button type="button" data-cart-decrease="${product.id}" data-size="${item.size}" aria-label="Quitar uno">-</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-increase="${product.id}" data-size="${item.size}" aria-label="Agregar uno">+</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const orderLines = state.cart.map((item) => {
    const product = products.find((productItem) => productItem.id === item.id);
    return product ? `- ${product.name} / Talla ${item.size} / Cantidad ${item.qty} / ${formatPrice(product.price)}` : "";
  });

  const message = encodeURIComponent(
    `Hola Cloud Hills Shop, quiero hacer este pedido:\n${orderLines.join("\n")}\nTotal estimado: ${formatPrice(totalPrice)}`
  );
  whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  whatsappLink.setAttribute("aria-disabled", state.cart.length === 0 ? "true" : "false");
  updateFirebaseOrderButton();
}

function updateCartQty(productId, size, amount) {
  const item = state.cart.find((cartItem) => cartItem.id === productId && cartItem.size === size);
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((cartItem) => !(cartItem.id === productId && cartItem.size === size));
  }

  renderCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  scrim.hidden = false;
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  scrim.hidden = true;
}

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.category = button.dataset.category;
    renderProducts();
  });
});

document.querySelectorAll("[data-size]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-size]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.size = button.dataset.size;
    renderProducts();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

priceRange.addEventListener("input", (event) => {
  state.maxPrice = Number(event.target.value);
  priceOutput.textContent = `$${state.maxPrice}`;
  renderProducts();
});

stockOnly.addEventListener("change", (event) => {
  state.stockOnly = event.target.checked;
  renderProducts();
});

clearFilters.addEventListener("click", () => {
  state.category = "all";
  state.size = "all";
  state.maxPrice = 75;
  state.query = "";
  state.sort = "featured";
  state.stockOnly = true;

  searchInput.value = "";
  sortSelect.value = "featured";
  priceRange.value = "75";
  priceOutput.textContent = "$75";
  stockOnly.checked = true;

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === "all");
  });
  document.querySelectorAll("[data-size]").forEach((button) => {
    button.classList.toggle("active", button.dataset.size === "all");
  });

  renderProducts();
});

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-product]");
  const addButton = event.target.closest("[data-add-product]");
  const modalSizeButton = event.target.closest("[data-modal-size]");
  const decreaseButton = event.target.closest("[data-cart-decrease]");
  const increaseButton = event.target.closest("[data-cart-increase]");

  if (viewButton) openProduct(viewButton.dataset.viewProduct);
  if (addButton) addToCart(addButton.dataset.addProduct);

  if (modalSizeButton) {
    state.selectedSizeByProduct[modalSizeButton.dataset.productId] = modalSizeButton.dataset.modalSize;
    document.querySelectorAll("[data-modal-size]").forEach((button) => button.classList.remove("active"));
    modalSizeButton.classList.add("active");
  }

  if (decreaseButton) {
    updateCartQty(decreaseButton.dataset.cartDecrease, decreaseButton.dataset.size, -1);
  }

  if (increaseButton) {
    updateCartQty(increaseButton.dataset.cartIncrease, increaseButton.dataset.size, 1);
  }
});

document.querySelectorAll("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
document.querySelector("[data-close-modal]").addEventListener("click", () => modal.close());
scrim.addEventListener("click", closeCart);

clearCart.addEventListener("click", () => {
  state.cart = [];
  renderCart();
});

whatsappLink.addEventListener("click", (event) => {
  if (state.cart.length === 0) event.preventDefault();
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (state.cart.length === 0) {
    firebaseOrderStatus.textContent = "Agrega productos antes de enviar el pedido.";
    return;
  }

  if (!firebaseOrdersApi) {
    firebaseOrderStatus.textContent = "Firebase no está conectado todavía. Revisa firebase-config.js.";
    return;
  }

  const items = getCartOrderItems();
  const orderPayload = {
    cliente: {
      nombre: customerName.value.trim(),
      whatsapp: customerPhone.value.trim(),
      nota: customerNote.value.trim()
    },
    productos: items,
    total: getCartTotal(),
    estado: "nuevo",
    origen: "web",
    creadoEn: firebaseOrdersApi.serverTimestamp()
  };

  firebaseOrderButton.disabled = true;
  firebaseOrderStatus.textContent = "Enviando pedido...";

  try {
    await firebaseOrdersApi.push(firebaseOrdersApi.ref(firebaseOrdersApi.db, "pedidos"), orderPayload);
    state.cart = [];
    checkoutForm.reset();
    renderCart();
    firebaseOrderStatus.textContent = "Pedido enviado. La tienda ya puede verlo en el panel.";
  } catch (error) {
    firebaseOrderStatus.textContent = "No se pudo enviar el pedido. Intenta de nuevo.";
    updateFirebaseOrderButton();
    console.error(error);
  }
});

modal.addEventListener("click", (event) => {
  const dialogBox = modal.getBoundingClientRect();
  const clickedOutside =
    event.clientX < dialogBox.left ||
    event.clientX > dialogBox.right ||
    event.clientY < dialogBox.top ||
    event.clientY > dialogBox.bottom;

  if (clickedOutside) modal.close();
});

renderProducts();
renderCart();
initFirebaseOrders();

if (window.lucide) window.lucide.createIcons();
