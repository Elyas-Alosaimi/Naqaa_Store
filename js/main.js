// =========================================================================
// 1. نظام التبويبات الحركي (Tabs Switcher) في الصفحة الرئيسية
// =========================================================================
function switchTab(tabId) {
    // جلب جميع الأقسام التي تحمل كلاس tab-content
    const tabs = document.querySelectorAll('.tab-content');
    
    // إخفاء جميع الأقسام تماماً
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    
    // إظهار القسم المطلوب الذي ضغط عليه المستخدم فقط
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
    }
}

// =========================================================================
// 2. ميزة الوضع الليلي والنهاري المتكاملة وحفظها (Dark/Light Mode)
// =========================================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

// فحص الذاكرة المحلية فور فتح المتصفح لتذكر الوضع المفضل للمستخدم
if (localStorage.getItem('theme') === 'dark') {
    bodyElement.classList.add('dark-mode');
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // تبديل الأيقونة إلى شمس
    }
}

// تفعيل ميزة التبديل عند النقر على الزر (Event Handling)
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        bodyElement.classList.toggle('dark-mode'); // دالة التبديل السحرية التي شرحها الدكتور
        
        // التحقق من الحالة الحالية لتخزينها في الـ LocalStorage وتغيير شكل الأيقونة
        if (bodyElement.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// =========================================================================
// 3. بوابة تسجيل الدخول الآمنة وحماية لوحة الإدارة
// =========================================================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // منع السلوك الافتراضي لتحديث الصفحة عند إرسال النموذج
        
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        
        // التحقق من بيانات المدير المطلوبة
        if (user === 'elyas' && pass === '24816') {
            localStorage.setItem('isLoggedIn', 'true'); // حفظ حالة الدخول بنجاح
            window.location.href = 'view-admin.html'; // التوجيه الفوري والسلس للوحة التحكم
        } else {
            alert('خطأ في اسم المستخدم أو كلمة المرور! يرجى المحاولة مرة أخرى.');
        }
    });
}

// نظام جدار الحماية (Security Router): منع الدخول المباشر لصفحات الإدارة عبر الرابط
const currentPath = window.location.pathname;
const isRestrictedPage = currentPath.includes('add.html') || currentPath.includes('view-admin.html') || currentPath.includes('edit.html');

if (isRestrictedPage && localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html'; // طرد المستخدم غير المصرح له فوراً إلى صفحة الدخول
}

// زر تسجيل الخروج الآمن (Logout)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn'); // مسح صلاحية الدخول من الذاكرة
        window.location.href = 'index.html'; // العودة الفورية للمتجر الرئيسي
    });
}

// =========================================================================
// 4. إدارة البيانات الشاملة وقاعدة بيانات المتجر (CRUD Operations)
// =========================================================================
// جلب مصفوفة المنتجات المخزنة من الذاكرة، أو إنشاء مصفوفة فارغة إذا كان المتجر جديداً
let productsArray = JSON.parse(localStorage.getItem('products')) || [];

// --- [أ] إضافة منتج جديد وحفظه (Create) ---
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // بناء كائن المنتج الجديد (Product Object)
        const newProduct = {
            id: Date.now(), // إنشاء رقم تعريفي فريد ومستحيل التكرار بناءً على الطابع الزمني بالملي ثانية
            name: document.getElementById('prodName').value.trim(),
            price: document.getElementById('prodPrice').value,
            image: document.getElementById('prodImage').value.trim()
        };
        
        productsArray.push(newProduct); // إضافة المنتج الجديد إلى المصفوفة الأساسية
        localStorage.setItem('products', JSON.stringify(productsArray)); // حفظ المصفوفة المحدثة بعد تحويلها لنص
        
        alert('تم نشر وإضافة المنتج الجديد بنجاح!');
        window.location.href = 'view-admin.html'; // إعادة المدير تلقائياً للوحة التحكم لرؤية المنتج المضاف
    });
}

// --- [ب] عرض المنتجات في لوحة تحكم الإدارة (Read Admin) ---
const adminTableBody = document.getElementById('admin-table-body');
if (adminTableBody) {
    adminTableBody.innerHTML = ''; // تفريغ الجدول من أي صفوف افتراضية
    
    if (productsArray.length === 0) {
        adminTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#999;">لا توجد منتجات متوفرة حالياً في المخزن، قم بإضافة أول منتج.</td></tr>';
    } else {
        // حلقة تكرار للمرور على المصفوفة وبناء صفوف الجدول ديناميكياً (DOM Manipulation)
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

// --- [ج] الحذف الفوري والذكي للمنتج (Delete) ---
window.handleDeleteProduct = function(productId) {
    const confirmDelete = confirm('هل أنت متأكد تماماً من حذف هذا المنتج بشكل نهائي من المتجر؟');
    if (confirmDelete) {
        // استخدام دالة الفلترة الذكية للاحتفاظ بجميع المنتجات باستثناء المنتج المحذوف
        productsArray = productsArray.filter(prod => prod.id !== productId);
        localStorage.setItem('products', JSON.stringify(productsArray)); // إعادة حفظ القائمة الجديدة في الذاكرة
        location.reload(); // تحديث فوري وسلس للصفحة لمشاهدة الجدول بعد الحذف
    }
}

// --- [د] التوجيه لصفحة التعديل (Update - Redirect) ---
window.redirectToEdit = function(productId) {
    localStorage.setItem('currentEditId', productId); // تخزين معرف المنتج المراد تعديله مؤقتاً في الذاكرة
    window.location.href = 'edit.html'; // نقل المدير لصفحة التعديل المستقلة
}

// --- [هـ] تنفيذ عملية التعديل وحفظ البيانات الجديدة (Update - Save) ---
const editProductForm = document.getElementById('editProductForm');
if (editProductForm) {
    const targetId = localStorage.getItem('currentEditId');
    // البحث عن المنتج المستهدف داخل المصفوفة باستخدام المعرف المؤقت
    const productData = productsArray.find(prod => prod.id == targetId);
    
    // تعبئة حقول النموذج تلقائياً ببيانات المنتج الحالية قبل التعديل لراحة المستخدم
    if (productData) {
        document.getElementById('editName').value = productData.name;
        document.getElementById('editPrice').value = productData.price;
        document.getElementById('editImage').value = productData.image;
    }

    // الاستماع لحدث حفظ التعديلات
    editProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // إيجاد مكان ترتيب المنتج (Index) داخل المصفوفة الأصلية لتبديله
        const targetIndex = productsArray.findIndex(prod => prod.id == targetId);
        
        if (targetIndex !== -1) {
            // تحديث قيم الكائن بالبيانات الجديدة التي أدخلها المدير في الحقول
            productsArray[targetIndex].name = document.getElementById('editName').value.trim();
            productsArray[targetIndex].price = document.getElementById('editPrice').value;
            productsArray[targetIndex].image = document.getElementById('editImage').value.trim();
            
            localStorage.setItem('products', JSON.stringify(productsArray)); // حفظ التعديلات النهائية في الذاكرة
            alert('تم تحديث وتعديل بيانات المنتج بنجاح واحترافية!');
            window.location.href = 'view-admin.html'; // إعادة المدير للوحة التحكم المركزية
        }
    });
}

// =========================================================================
// 5. عرض المنتجات بشكل شبكي وجذاب للزبائن في المتجر الرئيسي (Home Tab Read)
// =========================================================================
const customerProductsContainer = document.getElementById('customer-products-container');
if (customerProductsContainer) {
    customerProductsContainer.innerHTML = ''; // تفريغ الحاوية الافتراضية
    
    if (productsArray.length === 0) {
        customerProductsContainer.innerHTML = '<p style="text-align:center; width:100%; color: #999; font-size:16px; padding:20px;">نرحب بكم في متجر نقاء! لا توجد منتجات معروضة حالياً، يرجى دخول لوحة الإدارة لإضافة منتجاتك الأولى.</p>';
    } else {
        // بناء بطاقات المنتجات للزبائن حركياً بجمالية فائقة وتصميم متجاوب
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