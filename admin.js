const OWNER_PASSWORD = "cloudhills2019";
const PRODUCTS_STORAGE_KEY = "cloudHillsProducts";
const OWNER_SESSION_KEY = "cloudHillsOwnerSession";

const fallbackProducts = [
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
    price: 22,
    sizes: ["Unica"],
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
    price: 48,
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

const categoryNames = {
  blusas: "Blusas",
  vestidos: "Vestidos",
  jeans: "Jeans",
  conjuntos: "Conjuntos",
  accesorios: "Accesorios",
  ofertas: "Ofertas"
};

const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const loginForm = document.querySelector("#loginForm");
const ownerPassword = document.querySelector("#ownerPassword");
const loginError = document.querySelector("#loginError");
const logoutButton = document.querySelector("#logoutButton");
const productForm = document.querySelector("#productForm");
const productId = document.querySelector("#productId");
const productName = document.querySelector("#productName");
const productCategory = document.querySelector("#productCategory");
const productPrice = document.querySelector("#productPrice");
const productSizes = document.querySelector("#productSizes");
const productStock = document.querySelector("#productStock");
const productDescription = document.querySelector("#productDescription");
const productImage = document.querySelector("#productImage");
const productIsNew = document.querySelector("#productIsNew");
const imagePreview = document.querySelector("#imagePreview");
const ownerProducts = document.querySelector("#ownerProducts");
const inventoryCount = document.querySelector("#inventoryCount");
const ordersCount = document.querySelector("#ordersCount");
const ordersStatus = document.querySelector("#ordersStatus");
const ordersList = document.querySelector("#ordersList");
const editorTitle = document.querySelector("#editor-title");
const newProductButton = document.querySelector("#newProductButton");
const deleteProductButton = document.querySelector("#deleteProductButton");
const saveNote = document.querySelector("#saveNote");

let products = loadProducts();
let currentImage = "";
let firebaseOrdersStarted = false;

function loadProducts() {
  const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!savedProducts) return fallbackProducts;

  try {
    const parsedProducts = JSON.parse(savedProducts);
    return Array.isArray(parsedProducts) ? parsedProducts : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

function saveProducts() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

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

function formatOrderDate(value) {
  if (!value) return "Fecha pendiente";
  return new Intl.DateTimeFormat("es-PA", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

async function initFirebaseOrdersPanel() {
  if (firebaseOrdersStarted) return;
  firebaseOrdersStarted = true;

  if (!isFirebaseConfigured()) {
    ordersStatus.textContent = "Configura firebase-config.js para recibir pedidos en vivo.";
    return;
  }

  try {
    const appModule = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const databaseModule = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
    const app = appModule.initializeApp(window.firebaseConfig);
    const db = databaseModule.getDatabase(app);
    const pedidosRef = databaseModule.ref(db, "pedidos");

    ordersStatus.textContent = "Escuchando pedidos nuevos...";

    databaseModule.onValue(pedidosRef, (snapshot) => {
      const orders = [];
      snapshot.forEach((child) => {
        orders.push({ id: child.key, ...child.val() });
      });

      orders.sort((a, b) => (b.creadoEn || 0) - (a.creadoEn || 0));
      renderOrders(orders);
    });
  } catch (error) {
    ordersStatus.textContent = "No se pudo conectar Firebase. Revisa la configuración.";
    console.error(error);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function showDashboard() {
  loginView.hidden = true;
  dashboardView.hidden = false;
  renderProducts();
  initFirebaseOrdersPanel();
}

function showLogin() {
  dashboardView.hidden = true;
  loginView.hidden = false;
}

function resetForm() {
  productForm.reset();
  productId.value = "";
  currentImage = "";
  editorTitle.textContent = "Agregar prenda";
  deleteProductButton.hidden = true;
  saveNote.hidden = true;
  imagePreview.innerHTML = "<span>Vista previa</span>";
}

function renderImagePreview(src) {
  imagePreview.innerHTML = src ? `<img src="${src}" alt="Vista previa de la prenda">` : "<span>Vista previa</span>";
}

function renderProducts() {
  inventoryCount.textContent = products.length;

  if (products.length === 0) {
    ownerProducts.innerHTML = `<p class="empty-state">Todavía no hay productos publicados.</p>`;
    return;
  }

  ownerProducts.innerHTML = products
    .map(
      (product) => `
        <article class="owner-product">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <p>${categoryNames[product.category]} · ${formatPrice(product.price)} · Stock ${product.stock}</p>
            <p>Tallas: ${product.sizes.join(", ")}</p>
          </div>
          <button type="button" data-edit-product="${product.id}">Editar</button>
        </article>
      `
    )
    .join("");
}

function renderOrders(orders) {
  ordersCount.textContent = orders.length;

  if (orders.length === 0) {
    ordersStatus.textContent = "Todavía no hay pedidos.";
    ordersList.innerHTML = "";
    return;
  }

  ordersStatus.textContent = `${orders.length} pedido${orders.length === 1 ? "" : "s"} recibido${orders.length === 1 ? "" : "s"}.`;
  ordersList.innerHTML = orders
    .map((order) => {
      const productsList = Array.isArray(order.productos) ? order.productos : [];

      return `
        <article class="order-card">
          <header>
            <div>
              <h3>${order.cliente?.nombre || "Cliente sin nombre"}</h3>
              <p>${order.cliente?.whatsapp || "Sin WhatsApp"} · ${formatOrderDate(order.creadoEn)}</p>
            </div>
            <strong class="order-total">${formatPrice(order.total || 0)}</strong>
          </header>
          <ul>
            ${productsList
              .map(
                (product) =>
                  `<li>${product.nombre} · Talla ${product.talla} · Cantidad ${product.cantidad} · ${formatPrice(product.precio || 0)}</li>`
              )
              .join("")}
          </ul>
          ${order.cliente?.nota ? `<p><strong>Nota:</strong> ${order.cliente.nota}</p>` : ""}
        </article>
      `;
    })
    .join("");
}

function editProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  productId.value = product.id;
  productName.value = product.name;
  productCategory.value = product.category;
  productPrice.value = product.price;
  productSizes.value = product.sizes.join(", ");
  productStock.value = product.stock;
  productDescription.value = product.description;
  productIsNew.checked = Boolean(product.isNew);
  currentImage = product.image;

  editorTitle.textContent = "Editar prenda";
  deleteProductButton.hidden = false;
  saveNote.hidden = true;
  renderImagePreview(currentImage);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildProductFromForm() {
  const name = productName.value.trim();
  const sizes = productSizes.value
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);

  return {
    id: productId.value || `${slugify(name)}-${Date.now()}`,
    name,
    category: productCategory.value,
    price: Number(productPrice.value),
    sizes,
    stock: Number(productStock.value),
    isNew: productIsNew.checked,
    description: productDescription.value.trim(),
    image: currentImage || "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=82"
  };
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (ownerPassword.value === OWNER_PASSWORD) {
    sessionStorage.setItem(OWNER_SESSION_KEY, "true");
    loginError.hidden = true;
    showDashboard();
    return;
  }

  loginError.hidden = false;
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(OWNER_SESSION_KEY);
  resetForm();
  showLogin();
});

newProductButton.addEventListener("click", resetForm);

productImage.addEventListener("change", () => {
  const file = productImage.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentImage = reader.result;
    renderImagePreview(currentImage);
  });
  reader.readAsDataURL(file);
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const product = buildProductFromForm();
  const existingIndex = products.findIndex((item) => item.id === product.id);

  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.unshift(product);
  }

  saveProducts();
  renderProducts();
  saveNote.hidden = false;
  editProduct(product.id);
});

deleteProductButton.addEventListener("click", () => {
  if (!productId.value) return;

  products = products.filter((product) => product.id !== productId.value);
  saveProducts();
  renderProducts();
  resetForm();
});

ownerProducts.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-product]");
  if (editButton) editProduct(editButton.dataset.editProduct);
});

if (sessionStorage.getItem(OWNER_SESSION_KEY) === "true") {
  showDashboard();
} else {
  showLogin();
}
