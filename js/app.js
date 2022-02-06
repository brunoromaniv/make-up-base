//EXEMPLO DO CÓDIGO PARA UM PRODUTO

obtemProdutos("Melhor Avaliados", "Todos", "Todos")

let textName = document.querySelector("catalog-control")

textName.addEventListener("submit", function (e) {
    e.preventDefault();
    selectName()
})

function displayDetails(e) {

  if (e.getElementsByClassName('imagemProduto')[0].width === 100) {
    e.getElementsByClassName('container')[0].style.display = "none"
    e.getElementsByClassName('imagemProduto')[0].width = "185"
    e.getElementsByClassName('imagemProduto')[0].height = "185"



  } else {
    e.getElementsByClassName('container')[0].style.display = "block"
    e.getElementsByClassName('imagemProduto')[0].width = "100"
    e.getElementsByClassName('imagemProduto')[0].height = "100"
    e.getElementsByClassName('imagemProduto')[0].style.transform = "0.3s"
  }

}

function selectBrand() {
  var select = document.getElementById('filter-brand')
  var selectType = document.getElementById('filter-type')
  var text = select.options[select.selectedIndex].text;
  var textType = selectType.options[selectType.selectedIndex].text;
  document.getElementById('lista_de_produtos').innerHTML = ''
  console.log(text, textType)
  obtemProdutos("Melhor Avaliados", text, textType)

}

function selectType() {

  var select = document.getElementById('filter-type')
  var selectBrand = document.getElementById('filter-brand')
  var text = select.options[select.selectedIndex].text;
  var textBrand = selectBrand.options[selectBrand.selectedIndex].text;
  document.getElementById('lista_de_produtos').innerHTML = ''

  obtemProdutos("Melhor Avaliados", textBrand, text)

}

function selectName(){


  var selectType = document.getElementById('filter-type')
  var selectBrand = document.getElementById('filter-brand')
  var textType = selectType.options[selectType.selectedIndex].text;
  var textBrand = selectBrand.options[selectBrand.selectedIndex].text;
  var inputName = document.getElementById('filter-name').value
  document.getElementById('lista_de_produtos').innerHTML = ''
  if(inputName == ""){
    inputName=undefined
   
}

obtemProdutos("Melhor Avaliados", textBrand, textType, inputName )
 console.log(inputName)

  
  
}



function classificacao() {
  var select = document.getElementById('sort-type')
  var text = select.options[select.selectedIndex].text;
  document.getElementById('lista_de_produtos').innerHTML = ''
  obtemProdutos(text, "Todos", "Todos")

}

function obtemProdutos(filtro, brand, product_type, inputName) {

  //var url = "http://makeup-api.herokuapp.com/api/v1/products.json"
  //var url = "http://localhost:3000/produtos"
  var url = "/data/products.json"
  var itens;

  fetch(url)
    .then((response) => {
      response.json().then((produtos) => {
        console.log(produtos[0])
        var todos_produtos = ''
        if (filtro === "Menores Preços") {
          produtos.sort(function (a, b) {
            item1 = parseFloat(a.price)
            item2 = parseFloat(b.price)
            if (item1 < item2) {
              return -1
            } else {
              return true
            }
          })
        } else if (filtro === "Maiores Preços") {
          produtos.sort(function (a, b) {
            item1 = parseFloat(a.price)
            item2 = parseFloat(b.price)
            if (item1 > item2) {
              return -1
            } else {
              return true
            }
          })
        } else if (filtro === "Melhor Avaliados") {
          produtos.sort(function (a, b) {
            item1 = a.rating
            item2 = b.rating
            if (item1 == null) {
              item1 = 0
            }
            if (item2 == null) {
              item2 = 0
            }

            if (item1 > item2) {
              return -1
            } else {
              return true
            }
          })
        } else if (filtro === "A-Z") {
          produtos.sort(function (a, b) {
            item1 = a.name
            item2 = b.name
            if (item1 < item2) {
              return -1
            } else {
              return true
            }
          })
        } else if (filtro === "Z-A") {
          produtos.sort(function (a, b) {
            item1 = a.name
            item2 = b.name
            if (item1 < item2) {
              return -1
            } else {
              return true
            }
          })
        } else {

          produtos
        }
        if (brand != "Todos") {
          produtos = produtos.filter(function (el) {
            return el.brand == brand
          })
        }
        if (product_type != "Todos") {
          produtos = produtos.filter(function (el) {
            return el.product_type == product_type
          })
        }
        
        if (inputName != undefined){
            produtos = produtos.filter(function (el) {
              return el.name.includes(new RegExp(inputName, "i"))
              
            })
        }
        for (i = 0; i < produtos.length; i++) {
          var item = productItem(produtos[i])





          todos_produtos = todos_produtos + item


        }
        document.getElementById('lista_de_produtos').innerHTML += todos_produtos

        var brands = produtos.map(function (item, indice) {
          return item.brand
        })
        var types = produtos.map(function (item, indice) {
          return item.product_type
        })

        const brandsUnique = [...new Set(brands)].sort()
        const typesUnique = [...new Set(types)].sort()


        var selBrand = document.getElementById('filter-brand')
        for (j = 0; j < brandsUnique.length; j++) {
          var opt = document.createElement('option')
          opt.appendChild(document.createTextNode(brandsUnique[j]))
          selBrand.appendChild(opt)
        }

        var selType = document.getElementById('filter-type')
        for (j = 0; j < typesUnique.length; j++) {
          var opt = document.createElement('option')
          opt.appendChild(document.createTextNode(typesUnique[j]))
          selType.appendChild(opt)
        }
        console.log(selType)
      })
    })

  return itens
}


/* function productItem(product) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL'
  })
  const details = loadDetails(product)
  const item =
  //Trocar o + para interpolação ${product.name}
    '<div class="product" data-name=' + product.name + 'data-brand=' + product.brand + 'data-type=' + product.product_type + 'tabindex="${product.id}" onclick="displayDetails(this)">' +
    '<figure class="product-figure">' +
    '<img class="imagemProduto" src=' + product.api_featured_image + 'width="215" height="215" alt=' + product.description + 'onerror="javascript:this.src="img/unavailable.png""/>' +
    '</figure>' +
    '<section class="product-description">' +
    '<h1 class="product-name">' + product.name + '</h1>' +
    '<div class="product-brands"><span class="product-brand background-brand">' + product.brand + '</span>' +
    '<span class="product-brand background-price">' + formatter.format(product.price * 5.5) + '</span></div>' +
    details
  '</section>' +



    '</div>'

  return item
}  */


//Função troacada para interpolação conforme a Aula.
function productItem(product) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL'
  })
  const details = loadDetails(product)
  const item =

    `<div class="product" data-name="${product.name}"  data-brand= "${product.brand}" data-type= "${product.product_type}"  tabindex="${product.id}" onclick="displayDetails(this)">
    <figure class="product-figure">
    <img class="imagemProduto" src="${product.api_featured_image}" width="215" height="215" alt= "${product.description}" onerror="javascript:this.src="img/unavailable.png""/>
    </figure>
    <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${product.brand}</span>
    <span class="product-brand background-price">${formatter.format(product.price * 5.5)}</span></div>
    
  </section>
  <section class="product-details">${details}

    </div>`

  return item
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
/* function loadDetails(product) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL'
  })
  let details = `
        <div style="display:none" class="container" style="width=250">
        <div   class="details-row">
          <div>Brand:  ` + product.brand + `</div>
          </div>
        
        <div class="details-row">
          <div>Price:  `+ formatter.format(product.price * 5.5) + `</div>
        </div>
        <div class="details-row">
          <div>Rating:  `+ product.rating + `</div>
         
        </div>
        <div class="details-row">
          <div>Category:  `+ product.category + `</div>
          </div>
         <div class="details-row">
          <div>Type:  `+ product.product_type + `</div>
         
        </div>
        </div>
        </div>`
    ;
  return details
}
 */

function loadDetails(product) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL'
  })


  let details = ["brand", "price", "rating", "category", "product_type"];

  return Object.entries(product).filter(([name, value]) =>
    details.includes(name)
  ).map(([name, value]) =>
    `
  <div class="details-row">
  <div>${name}</div>
  <div class="details-bar">
    <div class="details-bar-bg" style="width=250">${value}</div>
  </div>
  </div>
  `).join("");


}


function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
