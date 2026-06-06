function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
    }
}


const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

if (localStorage.getItem('theme') === 'dark') {
    bodyElement.classList.add('dark-mode');
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; 
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        bodyElement.classList.toggle('dark-mode'); 
        
        if (bodyElement.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}


const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        
        if (user === 'elyas' && pass === '24816') {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'view-admin.html'; 
        } else {
            alert('خطأ في اسم المستخدم أو كلمة المرور! يرجى المحاولة مرة أخرى.');
        }
    });
}

const currentPath = window.location.pathname;
const isRestrictedPage = currentPath.includes('add.html') || currentPath.includes('view-admin.html') || currentPath.includes('edit.html');

if (isRestrictedPage && localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html'; 
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn'); 
        window.location.href = 'index.html'; 
    });
}


let productsArray = JSON.parse(localStorage.getItem('products')) || [];

const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newProduct = {
            id: Date.now(), 
            name: document.getElementById('prodName').value.trim(),
            price: document.getElementById('prodPrice').value,
            image: document.getElementById('prodImage').value.trim()
        };
        
        productsArray.push(newProduct); 
        localStorage.setItem('products', JSON.stringify(productsArray)); 
        
        alert('تم نشر وإضافة المنتج الجديد بنجاح!');
        window.location.href = 'view-admin.html';
    });
}

const adminTableBody = document.getElementById('admin-table-body');
if (adminTableBody) {
    adminTableBody.innerHTML = ''; 
    
    if (productsArray.length === 0) {
        adminTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#999;">لا توجد منتجات متوفرة حالياً في المخزن، قم بإضافة أول منتج.</td></tr>';
    } else {
        productsArray.forEach(function(product) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight: 600; color: var(--primary-color);">${product.name}</td>
                <td style="font-weight: bold; color: var(--secondary-color);">$${product.price}</td>
                <td><img src="${product.image}" alt="product" width="50" style="border-radius:6px; object-fit:cover; height:50px;"></td>
                <td>
                    <button onclick="redirectToEdit(${product.id})" class="btn-edit"><i class="fas fa-edit"></i> Edit</button>
                    <button onclick="handleDeleteProduct(${product.id})" class="btn-danger"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
            adminTableBody.appendChild(row);
        });
    }
}

window.handleDeleteProduct = function(productId) {
    const confirmDelete = confirm('هل أنت متأكد تماماً من حذف هذا المنتج بشكل نهائي من المتجر؟');
    if (confirmDelete) {
        productsArray = productsArray.filter(prod => prod.id !== productId);
        localStorage.setItem('products', JSON.stringify(productsArray)); 
        location.reload(); 
    }
}

window.redirectToEdit = function(productId) {
    localStorage.setItem('currentEditId', productId); 
    window.location.href = 'edit.html'; 
}

const editProductForm = document.getElementById('editProductForm');
if (editProductForm) {
    const targetId = localStorage.getItem('currentEditId');
    const productData = productsArray.find(prod => prod.id == targetId);
    
    if (productData) {
        document.getElementById('editName').value = productData.name;
        document.getElementById('editPrice').value = productData.price;
        document.getElementById('editImage').value = productData.image;
    }

    editProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const targetIndex = productsArray.findIndex(prod => prod.id == targetId);
        
        if (targetIndex !== -1) {
            productsArray[targetIndex].name = document.getElementById('editName').value.trim();
            productsArray[targetIndex].price = document.getElementById('editPrice').value;
            productsArray[targetIndex].image = document.getElementById('editImage').value.trim();
            
            localStorage.setItem('products', JSON.stringify(productsArray)); 
            alert('تم تحديث وتعديل بيانات المنتج بنجاح واحترافية!');
            window.location.href = 'view-admin.html'; 
        }
    });
}


const customerProductsContainer = document.getElementById('customer-products-container');
if (customerProductsContainer) {
    customerProductsContainer.innerHTML = ''; 
    
    if (productsArray.length === 0) {
        customerProductsContainer.innerHTML = '<p style="text-align:center; width:100%; color: #999; font-size:16px; padding:20px;">نرحب بكم في متجر نقاء! لا توجد منتجات معروضة حالياً، يرجى دخول لوحة الإدارة لإضافة منتجاتك الأولى.</p>';
    } else {
        productsArray.forEach(function(product) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price}</p>
                    <button class="btn-primary" style="margin-top:15px; width:100%; border-radius:8px;"><i class="fas fa-shopping-cart"></i> Add To Cart</button>
                </div>
            `;
            customerProductsContainer.appendChild(card);
        });
    }
}
