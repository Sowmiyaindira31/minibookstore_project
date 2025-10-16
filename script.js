const books = [
  {id:'b1',title:'Romantic Nights',author:'Karthi',price:249,cat:'romance',cover:'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=60'},
  {id:'b2',title:'Endless Love',author:'Das',price:399,cat:'love',cover:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60'},
  {id:'b3',title:'Tears of Life',author:'Iyer',price:299,cat:'sad',cover:'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=60'},
  {id:'b4',title:'Steps to Success',author:'Kiya',price:349,cat:'success',cover:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60'},
  {id:'b5',title:'Power of Pain',author:'soui',price:279,cat:'pain',cover:'https://images.unsplash.com/photo-1553729784-e91953dec042?auto=format&fit=crop&w=800&q=60'},
  {id:'b6',title:'Motivation Daily',author:'Sanem Bose',price:319,cat:'motivation',cover:'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=60'}
];

let cart = {};
let activeCategory = 'all';
const fmt = n => '₹' + n.toFixed(2);

const calc = () => {
  const items = Object.values(cart);
  const subtotal = items.reduce((s,i)=>s + i.price*i.qty, 0);
  const tax = +(subtotal * 0.05);
  const discount = subtotal >= 1000 ? +(subtotal * 0.05) : 0;
  const total = +(subtotal + tax - discount);
  return {subtotal,tax,discount,total};
}

const productsEl = document.getElementById('products');
function renderProducts(list){
  productsEl.innerHTML='';
  list.forEach(b=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="cover" style="background-image:url('${b.cover}')"></div>
      <h3 class="book-title">${b.title}</h3>
      <div class="author">by ${b.author}</div>
      <div class="price-row"><strong>${fmt(b.price)}</strong><button class="add" data-id="${b.id}">Add</button></div>
    `;
    productsEl.appendChild(card);
  });
}
renderProducts(books);

productsEl.addEventListener('click', e=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; if(!id) return;
  const book = books.find(x=>x.id===id);
  if(!cart[id]) cart[id] = {...book, qty:1}; else cart[id].qty++;
  renderCart();
});

function renderCart(){
  const list = document.getElementById('cart-list');
  list.innerHTML='';
  const count = Object.values(cart).reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').innerText = count;
  if(count===0){ list.innerHTML = '<div style="color:var(--muted)">Your cart is empty — add some books!</div>'; document.getElementById('checkout-btn').disabled = true; }
  else{
    Object.values(cart).forEach(item=>{
      const el = document.createElement('div'); el.className='cart-item';
      el.innerHTML = `
        <div class="thumb" style="background-image:url('${item.cover}')"></div>
        <div class="ci-meta">
          <h4>${item.title}</h4>
          <div class="qty">Qty: ${item.qty}</div>
          <div>${fmt(item.price*item.qty)}</div>
          <button class="remove" data-id="${item.id}">Remove</button>
        </div>
      `;
      list.appendChild(el);
    });
    document.getElementById('checkout-btn').disabled = false;
  }
  const {subtotal,tax,discount,total} = calc();
  document.getElementById('subtotal').innerText = fmt(subtotal);
  document.getElementById('tax').innerText = fmt(tax);
  document.getElementById('discount').innerText = '-'+fmt(discount);
  document.getElementById('total').innerText = fmt(total);
}

document.getElementById('cart-list').addEventListener('click', e=>{
  const id = e.target.dataset.id; if(!id) return;
  if(e.target.classList.contains('remove')){ delete cart[id]; }
  renderCart();
});

// Search
document.getElementById('search-btn').addEventListener('click', ()=>{
  const q = document.getElementById('search').value.toLowerCase();
  const filtered = books.filter(b=> b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  renderProducts(filtered);
});

// Category filter
document.querySelectorAll('nav a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    activeCategory = a.dataset.cat;
    const filtered = activeCategory==='all' ? books : books.filter(b=>b.cat===activeCategory);
    renderProducts(filtered);
  });
});

// Payment Modal
function openPayment(){document.getElementById("paymentModal").style.display="flex";}
function closePayment(){document.getElementById("paymentModal").style.display="none";}
function confirmOrder(){alert("✅ Order placed successfully! Thank you for shopping."); closePayment();}
document.getElementById('checkout-btn').addEventListener('click', openPayment);
