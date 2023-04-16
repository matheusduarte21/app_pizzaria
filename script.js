let modalQT = 1
let cart = [] // tudo que adicionarmos nesse array, vai ser o nosso carrinho
let modalKey = 0
const c = (el) => document.querySelector(el) // crie uma função que retorna pra mim um document.querySelector
const cs = (el)=> document.querySelectorAll(el)

pizzaJson.map((item, index)=>{  // preenche joga na tela 
    let pizzaItem = c('.models .pizza-item').cloneNode(true)  // usar o cloneNode para clonar os itens 
    //preencher as informações em pizzaItem

    pizzaItem.setAttribute('data-key', index) // aqui colocamos o id das pizzas
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault()  // previna a acão padrão, nós tiramos o f5 da tag a 
        let key = e.target.closest('.pizza-item').getAttribute('data-key')  // a tag closest procura o item mais próximo 
        modalQT = 1
        modalKey = key 
       
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaInfo H1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        c('.pizzaInfo--size.selected').classList.remove('selected') // nós tiremos o item selecionado
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {  /// forEach = para cada um dos itens 
            if(sizeIndex == 2) {
                size.classList.add('selected')  /// somente grande no selecionado
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });
        
        c('.pizzaInfo--qt').innerHTML = modalQT 

        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1
        },200);
        
    })
    c('.pizza-area').append(pizzaItem) // append adiciona conteudo, o innerhtml ele substitui // aqui adicionarmos o pizzaItem ai pizza-area

})

// EVENTOS DO MODAL
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display ='none'
    },500);
}

cs ('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{  // para ambos os times nós colocamos o evento de click
    item.addEventListener('click', closeModal)
})

c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if (modalQT > 1) {
        modalQT--
         c('.pizzaInfo--qt').innerHTML = modalQT
    }
    
})
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQT++
    c('.pizzaInfo--qt').innerHTML = modalQT // o novo valor do modal vem pra cá 
})

cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {  /// forEach = para cada um dos itens 
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
});

//CARRINHO
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = pizzaJson[modalKey].id+'@'+size
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier
    })
    if(key > -1 ){
        cart[key].qt += modalQT
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQT
        })
    }
    updateCart()
    closeModal()
    
})
c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        c('aside').style.left = '0'
    } 
})
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'
})
function updateCart(){  // para atualizar o carrinho 
    c('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = '' // zeramos

        let subtotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id) //vamos procurar o id que tem dentro do carrinho que está dentro do json 
            subtotal+= pizzaItem.price * cart[i].qt

            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSizeName 
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'p'
                break;

                case 1:
                    pizzaSizeName = 'M'
                break;

                case 2:
                    pizzaSizeName = 'G'
                break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i] > 1){
                    cart[i].qt--
                }else{
                    cart.splice(i, 1)
                }
                updateCart()
            } )
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++
                updateCart()
            } )
            c('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}