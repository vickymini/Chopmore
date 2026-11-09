import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const y=document.getElementById("pagePreloader");y&&setTimeout(()=>{y.classList.add("fade-out"),setTimeout(()=>{y.parentElement&&(y.style.display="none")},500)},350);const v=document.getElementById("mobileNavToggle"),h=document.getElementById("mobileDrawer"),b=document.getElementById("toggleIconOpen"),E=document.getElementById("toggleIconClose");v&&h&&(v.addEventListener("click",()=>{const t=h.classList.toggle("open");v.setAttribute("aria-expanded",String(t)),b&&E&&(b.style.display=t?"none":"inline-block",E.style.display=t?"inline-block":"none")}),h.querySelectorAll(".mobile-nav-link").forEach(t=>{t.addEventListener("click",()=>{h.classList.remove("open"),v.setAttribute("aria-expanded","false"),b&&E&&(b.style.display="inline-block",E.style.display="none")})}));const J=document.querySelectorAll("section[id], footer[id]"),O=document.querySelectorAll(".desktop-nav .nav-link");function _(){if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-60){O.forEach(n=>{n.classList.remove("active"),n.getAttribute("href")==="#footer"&&n.classList.add("active")});return}const t=window.scrollY+120;J.forEach(n=>{const o=n.offsetTop,a=n.offsetHeight,c=n.getAttribute("id");t>=o&&t<o+a&&O.forEach(i=>{i.classList.remove("active"),i.getAttribute("href")===`#${c}`&&i.classList.add("active")})})}window.addEventListener("scroll",_,{passive:!0});const L=document.getElementById("headerAuthWidget");function C(){const e=localStorage.getItem("laHotActiveSession");let t=null;if(e)try{t=JSON.parse(e)}catch{t=null}const n=document.getElementById("mobileAuthLink");if(t&&t.loggedIn&&t.name){if(L){L.innerHTML=`
          <div class="user-logged-box">
            <span class="user-greeting">Hi,</span>
            <span class="user-name-badge">${f(t.name.split(" ")[0])}</span>
            <button type="button" class="btn-logout" id="btnLogoutUser" title="Sign Out" aria-label="Sign Out">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        `;const o=document.getElementById("btnLogoutUser");o&&o.addEventListener("click",()=>{localStorage.removeItem("laHotActiveSession"),r("You have been signed out.","info"),C()})}if(n){const o=n.cloneNode(!0);n.parentNode.replaceChild(o,n),o.innerHTML=`
          <i class="fa-solid fa-user-check"></i>
          <span>Signed in as ${f(t.name)} (Sign Out)</span>
        `,o.setAttribute("href","#"),o.addEventListener("click",a=>{a.preventDefault(),localStorage.removeItem("laHotActiveSession"),r("You have been signed out.","info"),C()})}}else if(L&&(L.innerHTML=`
          <a href="accountlogin.html" class="btn-auth-link" id="authBtnLink">
            <i class="fa-solid fa-user" aria-hidden="true"></i>
            <span>Log In</span>
          </a>
        `),n){const o=n.cloneNode(!0);n.parentNode.replaceChild(o,n),o.innerHTML=`
          <i class="fa-solid fa-user"></i>
          <span>Sign In / Register</span>
        `,o.setAttribute("href","accountlogin.html")}}C();const q=document.querySelectorAll(".category-btn"),j=document.querySelectorAll(".dish-card");q.forEach(e=>{e.addEventListener("click",()=>{q.forEach(n=>n.classList.remove("active")),e.classList.add("active");const t=e.getAttribute("data-category");j.forEach(n=>{const o=n.getAttribute("data-category");t==="all"||o===t?n.classList.remove("hidden"):n.classList.add("hidden")})})});let s=[];const w=localStorage.getItem("chopeMoreCart");if(w)try{const e=JSON.parse(w);s=Array.isArray(e)?e:[]}catch{s=[]}const M=document.getElementById("cartCountBadge"),D=document.getElementById("openCartBtn"),H=document.getElementById("heroOrderBtn"),d=document.getElementById("orderModalBackdrop"),N=document.getElementById("closeOrderModalBtn"),m=document.getElementById("cartItemsList"),P=document.getElementById("cartTotalPrice"),$=document.getElementById("orderCheckoutForm"),I=document.getElementById("btnSubmitOrder");function p(){localStorage.setItem("chopeMoreCart",JSON.stringify(s)),x()}function G(){return s.reduce((e,t)=>e+t.quantity,0)}function k(){return s.reduce((e,t)=>e+t.price*t.quantity,0)}function x(){const e=G();M&&(M.textContent=e),P&&(P.textContent=`₦${k().toLocaleString()}`),R()}function R(){if(m){if(s.length===0){m.innerHTML=`
        <div class="cart-empty-state">
          <i class="fa-solid fa-bowl-food"></i>
          <p>Your order is empty right now.</p>
          <span>Click "+ Add to Order" on any dish in the menu to begin!</span>
        </div>
      `;return}m.innerHTML="",s.forEach(e=>{const t=document.createElement("div");t.className="cart-item-row",t.innerHTML=`
        <div class="cart-item-info">
          <img src="${f(e.img)}" alt="${f(e.name)}" class="cart-item-thumb">
          <div>
            <div class="cart-item-name">${f(e.name)}</div>
            <div class="cart-item-unit-price">₦${(e.price*e.quantity).toLocaleString()} (₦${e.price.toLocaleString()} each)</div>
          </div>
        </div>
        <div class="cart-qty-controls">
          <button type="button" class="btn-qty btn-qty-minus" data-id="${e.id}" aria-label="Decrease quantity">-</button>
          <span class="cart-qty-num">${e.quantity}</span>
          <button type="button" class="btn-qty btn-qty-plus" data-id="${e.id}" aria-label="Increase quantity">+</button>
          <button type="button" class="btn-remove-item" data-id="${e.id}" aria-label="Remove item" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `,m.appendChild(t)}),m.querySelectorAll(".btn-qty-plus").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-id"),n=s.find(o=>o.id===t);n&&(n.quantity+=1,p())})}),m.querySelectorAll(".btn-qty-minus").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-id"),n=s.find(o=>o.id===t);n&&(n.quantity-=1,n.quantity<=0&&(s=s.filter(o=>o.id!==t)),p())})}),m.querySelectorAll(".btn-remove-item").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-id");s=s.filter(n=>n.id!==t),p()})})}}document.querySelectorAll(".btn-add-cart").forEach(e=>{e.addEventListener("click",()=>{const t=e.closest(".dish-card");if(!t)return;const n=t.getAttribute("data-id"),o=t.getAttribute("data-name"),a=parseInt(t.getAttribute("data-price"),10)||0,c=t.getAttribute("data-img")||"images/egusi 2.png",i=s.find(l=>l.id===n);i?i.quantity+=1:s.push({id:n,name:o,price:a,img:c,quantity:1}),p(),r(`Added ${o} to your order!`,"success",2500),e.innerHTML='<i class="fa-solid fa-check"></i> Added!',setTimeout(()=>{e.innerHTML='<i class="fa-solid fa-plus"></i> Add to Order'},1e3)})});function Y(){if(!d)return;R(),d.removeAttribute("hidden"),document.body.style.overflow="hidden";const e=localStorage.getItem("laHotActiveSession");if(e)try{const t=JSON.parse(e),n=document.getElementById("orderCustomerName");n&&!n.value&&t.name&&(n.value=t.name)}catch{}}function A(){d&&(d.setAttribute("hidden",""),document.body.style.overflow="")}D&&D.addEventListener("click",Y),H&&H.addEventListener("click",Y),N&&N.addEventListener("click",A),d&&d.addEventListener("click",e=>{e.target===d&&A()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&d&&!d.hasAttribute("hidden")&&A()}),$&&$.addEventListener("submit",e=>{if(e.preventDefault(),I&&I.classList.contains("loading"))return;if(s.length===0){r("Your order is empty. Please select some dishes first!","error");return}const t=document.getElementById("orderCustomerName").value.trim(),n=document.getElementById("orderCustomerPhone").value.trim(),o=document.getElementById("orderCustomerAddress").value.trim();if(!t||!n||!o){r("Please fill in your name, phone, and delivery address.","error");return}I.classList.add("loading"),setTimeout(()=>{I.classList.remove("loading");const a=`Thank you, ${t}! Your order of ₦${k().toLocaleString()} is confirmed and will be delivered to ${o}.`;s=[],p(),$.reset(),A(),r(a,"success",6e3)},1e3)});const U=document.getElementById("btnWhatsAppOrder");U&&U.addEventListener("click",()=>{if(s.length===0){r("Your order is empty. Please select some dishes first!","error");return}const e=document.getElementById("orderCustomerName").value.trim()||"Valued Customer",t=document.getElementById("orderCustomerPhone").value.trim()||"Not provided",n=document.getElementById("orderCustomerAddress").value.trim()||"Pickup / Direct order",o=document.getElementById("orderPaymentMethod"),a=o?o.options[o.selectedIndex].text:"Pay on Delivery";let c=s.map(g=>`• ${g.name} x ${g.quantity} = ₦${(g.price*g.quantity).toLocaleString()}`).join(`
`);const i=`₦${k().toLocaleString()}`,l=`*NEW ORDER - CHOPE MORE FAST FOOD*
----------------------------------------
👤 *Customer:* ${e}
📞 *Phone:* ${t}
📍 *Delivery Address:* ${n}
💳 *Payment Method:* ${a}

🍲 *Items Ordered:*
${c}
----------------------------------------
💰 *TOTAL AMOUNT:* ${i}

_Order sent via Chope More Website_`,u=`https://wa.me/2348155800735?text=${encodeURIComponent(l)}`;window.open(u,"_blank"),r("Opening WhatsApp to dispatch your order to 08155800735...","info",4e3)}),x();const T=document.getElementById("tableReservationForm"),B=document.getElementById("reserveSubmitBtn");function S(e){const t=n=>String(n).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`}function F(){const e=new Date;return e.setDate(e.getDate()+1),e.setHours(19,0,0,0),e}if(T){const e=document.getElementById("reserveDateTime");e&&(e.min=S(new Date),e.value=S(F())),T.addEventListener("submit",t=>{if(t.preventDefault(),B&&B.classList.contains("loading"))return;const n=document.getElementById("reserveName").value.trim(),o=document.getElementById("reservePhone").value.trim(),a=document.getElementById("reserveEmail").value.trim(),c=document.getElementById("reserveGuests"),i=c?c.options[c.selectedIndex].text:"2 Persons",l=document.getElementById("reserveDateTime").value;if(!n||!o||!a||!l){r("Please fill in all required reservation fields.","error");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)){r("Please enter a valid email address for confirmation.","error");return}const g=new Date(l);if(g<=new Date){r("Please select a date and time in the future.","error");return}const V=g.toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"});B.classList.add("loading"),setTimeout(()=>{B.classList.remove("loading"),r(`Table reserved for ${n} (${i}) on ${V}! Confirmation sent to ${a}.`,"success",6e3),T.reset(),e&&(e.min=S(new Date),e.value=S(F()))},900)})}const W=document.getElementById("toastContainer");function r(e,t="info",n=4e3){if(!W)return;const o=document.createElement("div");o.className=`toast toast-${t}`;let a="fa-circle-info";t==="success"&&(a="fa-circle-check"),t==="error"&&(a="fa-triangle-exclamation"),o.innerHTML=`
      <i class="fa-solid ${a}" aria-hidden="true"></i>
      <span class="toast-message">${f(e)}</span>
      <button type="button" class="toast-close" aria-label="Dismiss message">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    `,o.querySelector(".toast-close").addEventListener("click",()=>l(o)),W.appendChild(o);const i=setTimeout(()=>{l(o)},n);function l(u){clearTimeout(i),u.style.opacity="0",u.style.transform="translateX(40px)",setTimeout(()=>{u.parentElement&&u.parentElement.removeChild(u)},300)}}function f(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}});
