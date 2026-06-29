/**
 * Demo Shop — a tiny, fully deterministic single-page app used as the system
 * under test. No backend, no network, no clock: state is in-memory, so the test
 * suite is reproducible to the byte (the precondition for "prove zero flake").
 *
 * Accessibility is intentional: every control has a role/label so the tests can
 * use role-based locators (getByRole/getByLabel) instead of brittle CSS/XPath.
 */

const PRODUCTS = [
  { id: "sku-keyboard", name: "Mechanical Keyboard", price: 89.0 },
  { id: "sku-mouse", name: "Wireless Mouse", price: 39.5 },
  { id: "sku-monitor", name: "27\" Monitor", price: 219.0 },
];

const CREDENTIALS = { email: "buyer@example.com", password: "correct horse" };

const state = { cart: new Map() };

const views = ["login", "products", "cart", "confirmation"];
function show(view) {
  for (const v of views) document.getElementById(`${v}-view`).hidden = v !== view;
}

const money = (n) => `£${n.toFixed(2)}`;

function cartCount() {
  let n = 0;
  for (const qty of state.cart.values()) n += qty;
  return n;
}
function cartTotal() {
  let t = 0;
  for (const [id, qty] of state.cart) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) t += p.price * qty;
  }
  return t;
}
function refreshCartCount() {
  document.querySelector('[data-testid="cart-count"]').textContent = String(cartCount());
}

function renderProducts() {
  const ul = document.getElementById("product-list");
  ul.innerHTML = "";
  for (const p of PRODUCTS) {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${p.name} — ${money(p.price)}`;
    const btn = document.createElement("button");
    btn.type = "button";
    // accessible name includes the product so getByRole('button', {name}) is unambiguous
    btn.textContent = `Add ${p.name} to cart`;
    btn.dataset.testid = `add-${p.id}`;
    btn.addEventListener("click", () => {
      state.cart.set(p.id, (state.cart.get(p.id) ?? 0) + 1);
      refreshCartCount();
    });
    li.append(label, btn);
    ul.append(li);
  }
}

function renderCart() {
  const ul = document.getElementById("cart-list");
  ul.innerHTML = "";
  for (const [id, qty] of state.cart) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) continue;
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${p.name} ×${qty} — ${money(p.price * qty)}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = `Remove ${p.name}`;
    remove.dataset.testid = `remove-${id}`;
    remove.addEventListener("click", () => {
      state.cart.delete(id);
      renderCart();
      refreshCartCount();
    });
    li.append(label, remove);
    ul.append(li);
  }
  document.querySelector('[data-testid="cart-total"]').textContent = money(cartTotal());
  document.getElementById("empty-cart").hidden = state.cart.size > 0;
  document.querySelector('[data-testid="checkout"]').disabled = state.cart.size === 0;
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const err = document.getElementById("login-error");
  if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
    err.hidden = true;
    show("products");
  } else {
    err.textContent = "Invalid email or password.";
    err.hidden = false;
  }
}

// deterministic order ref (no Date/random) so the confirmation is assertable
let orderSeq = 1000;

function init() {
  renderProducts();
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.querySelector('[data-testid="view-cart"]').addEventListener("click", () => {
    renderCart();
    show("cart");
  });
  document.querySelector('[data-testid="back-to-products"]').addEventListener("click", () => show("products"));
  document.querySelector('[data-testid="checkout"]').addEventListener("click", () => {
    if (state.cart.size === 0) return;
    orderSeq += 1;
    document.querySelector('[data-testid="order-ref"]').textContent = `ORD-${orderSeq}`;
    state.cart.clear();
    refreshCartCount();
    show("confirmation");
  });
  document.querySelector('[data-testid="new-order"]').addEventListener("click", () => show("products"));
  show("login");
}

init();
