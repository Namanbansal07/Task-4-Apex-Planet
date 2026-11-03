const products = [
  { id: "arc-chair", name: "Arc Lounge Chair", category: "Furniture", price: 420, rating: 4.9, reviews: 28, badge: "Bestseller", image: "photo-1503602642458-232111445657" },
  { id: "column-lamp", name: "Column Table Lamp", category: "Lighting", price: 185, rating: 4.8, reviews: 42, badge: "Staff pick", image: "photo-1507473885765-e6ed057f782c" },
  { id: "stoneware-vase", name: "Stoneware Vessel", category: "Decor", price: 68, rating: 4.7, reviews: 19, badge: "Handmade", image: "photo-1578500494198-246f612d3b3d" },
  { id: "linen-throw", name: "Washed Linen Throw", category: "Textiles", price: 95, rating: 4.9, reviews: 36, badge: "Bestseller", image: "photo-1600210492486-724fe5c67fb0" },
  { id: "oak-side-table", name: "Oak Side Table", category: "Furniture", price: 245, rating: 4.6, reviews: 17, badge: "", image: "photo-1499933374294-4584851497cc" },
  { id: "globe-pendant", name: "Opal Globe Pendant", category: "Lighting", price: 310, rating: 4.8, reviews: 24, badge: "New", image: "photo-1513506003901-1e6a229e2d15" },
  { id: "everyday-bowl", name: "Everyday Serving Bowl", category: "Decor", price: 54, rating: 4.5, reviews: 31, badge: "", image: "photo-1490312278390-ab64016e0aa9" },
  { id: "cotton-cushion", name: "Cotton Cushion Cover", category: "Textiles", price: 48, rating: 4.7, reviews: 22, badge: "", image: "photo-1584100936595-c0654b55a2e2" },
  { id: "low-bench", name: "Low Oak Bench", category: "Furniture", price: 385, rating: 4.9, reviews: 13, badge: "Limited", image: "photo-1505693416388-ac5ce068fe85" },
  { id: "mushroom-light", name: "Mushroom Portable Light", category: "Lighting", price: 128, rating: 4.6, reviews: 38, badge: "New", image: "photo-1543198126-a8ad8e47fb22" },
  { id: "clay-candle", name: "Clay Candle Holder", category: "Decor", price: 42, rating: 4.4, reviews: 16, badge: "", image: "photo-1603006905003-be475563bc59" },
  { id: "woven-runner", name: "Woven Table Runner", category: "Textiles", price: 76, rating: 4.8, reviews: 27, badge: "Handmade", image: "photo-1600210492486-724fe5c67fb0" }
];

const productGrid = document.querySelector("#productGrid");
const categoryInputs = document.querySelectorAll('input[name="category"]');
const priceRange = document.querySelector("#priceRange");
const priceValue = document.querySelector("#priceValue");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const bagCount = document.querySelector(".bag-count");
const bagButton = document.querySelector(".bag-button");
const themeToggle = document.querySelector("#themeToggle");
const THEME_STORAGE_KEY = "common-ground-theme";

let bagItems = 0;

function setTheme(theme, persist = false) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;
  themeToggle.setAttribute("aria-label", label);
  themeToggle.title = label;

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch (error) {
      console.warn("Unable to save the theme preference:", error);
    }
  }
}

try {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  setTheme(savedTheme === "dark" ? "dark" : "light");
} catch (error) {
  console.warn("Unable to load the saved theme preference:", error);
  setTheme("light");
}

function getVisibleProducts() {
  const selectedCategories = new Set(
    [...categoryInputs].filter((input) => input.checked).map((input) => input.value)
  );
  const query = searchInput.value.trim().toLowerCase();
  const maximumPrice = Number(priceRange.value);

  const visible = products.filter((product) => {
    const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.category);
    const matchesPrice = product.price <= maximumPrice;
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesPrice && matchesSearch;
  });

  switch (sortSelect.value) {
    case "rating":
      visible.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case "price-low":
      visible.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      visible.sort((a, b) => b.price - a.price);
      break;
  }
  return visible;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image";
  const image = document.createElement("img");
  image.src = `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=720&q=82`;
  image.alt = product.name;
  image.loading = "lazy";
  imageWrap.append(image);

  if (product.badge) {
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    imageWrap.append(badge);
  }

  const addButton = document.createElement("button");
  addButton.className = "quick-add";
  addButton.type = "button";
  addButton.textContent = "Add to bag +";
  addButton.setAttribute("aria-label", `Add ${product.name} to bag`);
  addButton.addEventListener("click", () => {
    bagItems += 1;
    bagCount.textContent = String(bagItems);
    bagButton.setAttribute("aria-label", `Shopping bag, ${bagItems} ${bagItems === 1 ? "item" : "items"}`);
    addButton.textContent = "Added to bag ✓";
    window.setTimeout(() => {
      addButton.textContent = "Add to bag +";
    }, 1200);
  });
  imageWrap.append(addButton);

  const info = document.createElement("div");
  info.className = "product-info";
  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;

  const titleRow = document.createElement("div");
  titleRow.className = "product-title-row";
  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.name;
  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = `$${product.price}`;
  titleRow.append(title, price);

  const rating = document.createElement("p");
  rating.className = "product-rating";
  const stars = document.createElement("span");
  stars.className = "stars";
  stars.setAttribute("aria-label", `${product.rating} out of 5 stars`);
  const roundedRating = Math.round(product.rating);
  stars.append(
    document.createTextNode("★".repeat(roundedRating)),
    Object.assign(document.createElement("span"), {
      className: "empty-star",
      textContent: "☆".repeat(5 - roundedRating)
    })
  );
  const reviewCount = document.createElement("span");
  reviewCount.textContent = `${product.rating} (${product.reviews})`;
  rating.append(stars, reviewCount);
  info.append(category, titleRow, rating);
  card.append(imageWrap, info);
  return card;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.replaceChildren(...visibleProducts.map(createProductCard));
  resultCount.textContent = `Showing ${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function clearFilters() {
  categoryInputs.forEach((input) => {
    input.checked = false;
  });
  priceRange.value = priceRange.max;
  priceValue.textContent = `$${priceRange.value}`;
  searchInput.value = "";
  sortSelect.value = "featured";
  renderProducts();
}

categoryInputs.forEach((input) => input.addEventListener("change", renderProducts));
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
priceRange.addEventListener("input", () => {
  priceValue.textContent = `$${priceRange.value}`;
  renderProducts();
});
document.querySelector("#clearFilters").addEventListener("click", clearFilters);
document.querySelector("#emptyReset").addEventListener("click", clearFilters);
themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
});
document.querySelectorAll("[data-nav-category]").forEach((link) => {
  link.addEventListener("click", () => {
    clearFilters();
    const categoryInput = [...categoryInputs].find((input) => input.value === link.dataset.navCategory);
    if (link.dataset.navCategory !== "all" && categoryInput) {
      categoryInput.checked = true;
      renderProducts();
    }
    document.querySelectorAll("[data-nav-category]").forEach((navLink) => {
      navLink.classList.toggle("active", navLink === link);
    });
  });
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

renderProducts();
