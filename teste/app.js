
const productElement = document.querySelector(".catalog");
const sortFilter = document.getElementById("sort-type");
const brandFilter = document.getElementById("filter-brand");
const typeFilter = document.getElementById("filter-type");
const nameFilter = document.getElementById("filter-name");

let brandsValues = [];
let typeValues = [];
let products = "";
let elementsChilds;

(async () => {
  let response = await fetch("data/products.json");
  loadProducts(await response.json(), sortFilter.value);
})();


function loadProducts(json, sortType)
{
  let elements = sortProducts(json, sortType).map((product) => productItem(product)).join("");

  productElement.innerHTML = elements;

  elementsChilds = Array.from(productElement.querySelectorAll(".product"));

  loadComboOptions(brandFilter, brandsValues.uniq().sort());
  loadComboOptions(typeFilter, typeValues.uniq().sort());

  products = json;
}

nameFilter.addEventListener("keyup", loadFilters );
brandFilter.addEventListener("change", loadFilters);
typeFilter.addEventListener("change", loadFilters);
sortFilter.addEventListener("change", (e) => {
  loadProducts(products, sortFilter.value)
  loadFilters();
});

function loadFilters(){

  let name = nameFilter.value;
  let brand = brandFilter.value;
  let type = typeFilter.value;

  elementsChilds.forEach((product) => {
    if(validProduct(product, name, brand, type)){
      product.style.display = "block"
    } else {
      product.style.display = "none"
    }
  });
}

function validProduct(product, name, brand, type) {

  const search = new RegExp(name, "i");

  const checkName = search.test(product.dataset.name);

  const checkBrand = product.dataset.brand.includes(brand);

  const checkType = product.dataset.type.includes(type);

  return checkName && checkBrand && checkType;
}


function loadComboOptions(element, values) {
  values.map((item) => element.insertAdjacentHTML("beforeend", `<option>${item}</option>`));
}

//EXEMPLO DO CÓDIGO PARA UM PRODUTO
function productItem(product) {

  brandsValues = brandsValues.concat([product.brand]);
  typeValues = typeValues.concat([product.product_type]);

  return `<div class="product" data-name="${product.name}" data-brand="${product.brand}" data-type="${product.product_type}" tabindex="${product.id}">
  <figure class="product-figure">
    <img src="${product.image_link}" width="215" height="215" alt="${product.name}" onerror="javascript:this.src='img/unavailable.png'">
  </figure>
  <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${product.brand}</span>
<span class="product-brand background-price">R$ ${parseFloat(product.price * 5.5).toFixed(2)}</span></div>
  </section>
  <section class="product-details">${loadDetails(product)}</section>
</div>`;
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {

  let details = ["brand", "price", "rating", "category", "product_type"];

  return Object.entries(product)
  .filter(([name,value]) => details.includes(name))
  .map(([name, value])=> 
    `<div class="details-row">
      <div>${name}</div>
      <div class="details-bar">
        <div class="details-bar-bg" style="width= 250">${value}</div>
      </div>
    </div>`).join("");
}

function sortProducts(products, sort){
  switch (sort) {
    case "Melhores Avaliados":
      return products.sort((a, b) => 
          a.rating > b.rating ? -1 : a.rating < b.rating ? 1 : 0 )
    case "Menores Preços":
      return products.sort((a, b) => 
          parseFloat(a.price) > parseFloat(b.price) ? 1 : parseFloat(a.price) < parseFloat(b.price) ? -1 : 0 );
    case "Maiores Preços":
      return products.sort((a, b) => 
          parseFloat(a.price) > parseFloat(b.price) ? -1 : parseFloat(a.price) < parseFloat(b.price) ? 1 : 0 );
    case "A-Z":
      return products.sort((a, b) => 
          a.name > b.name ? 1 : a.name < b.name ? -1 : 0 );
    case "Z-A":
      return products.sort((a, b) => 
        a.name > b.name ? -1 : a.name < b.name ? 1 : 0 );
  }
}



Array.prototype.uniq = function () {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
