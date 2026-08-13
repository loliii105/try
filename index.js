// ==========================================
// 1. تفعيل مكتبة Flatpickr (التقويم)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    flatpickr(".date-picker", {
        dateFormat: "d F Y",
        minDate: "today",
        disableMobile: true,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
                longhand: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
            },
            months: {
                shorthand: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                longhand: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
            }
        }
    });
});

// ==========================================
// 2. دالة تغيير التبويبات الكبيرة (طيران / فنادق)
// ==========================================
function switchTab(tabId, bgClass) {
    const mainContainer = document.getElementById('main-container');
    const bgClasses = ['bg-flights', 'bg-hotels', 'bg-packages', 'bg-cars', 'bg-marine', 'bg-umrah'];
    mainContainer.classList.remove(...bgClasses);
    mainContainer.classList.add(bgClass);

    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active-content'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-content');
    
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabId));
    if(activeBtn) activeBtn.classList.add('active');
}

// ==========================================
// 3. أزرار نوع الرحلة (ذهاب وعودة / اتجاه واحد / وجهات متعددة)
// ==========================================
function selectTripType(clickedBtn, type) {
    const buttons = clickedBtn.parentElement.querySelectorAll('.trip-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    const currentTab = clickedBtn.closest('.tab-content');
    const returnBox = currentTab.querySelector('.return-date-box');

    if (!returnBox) return;

    if (type === 'round') {
        returnBox.style.display = 'flex';
    } else if (type === 'oneway') {
        returnBox.style.display = 'none';
    } else if (type === 'multi') {
        alert("عذراً، خدمة الوجهات المتعددة قيد التطوير حالياً.");
        const firstBtn = buttons[0];
        if(firstBtn) firstBtn.click();
    }
}

// ==========================================
// 4. زر السويتش (التبديل بين المدن + دوران الأسهم)
// ==========================================
function switchCities() {
    const activeTab = document.querySelector('.tab-content.active-content');
    if (!activeTab) return;

    const fromSelect = activeTab.querySelectorAll('.city-select')[0];
    const toSelect = activeTab.querySelectorAll('.city-select')[1];

    if (!fromSelect || !toSelect) return;

    const tempValue = fromSelect.value;
    const tempText = fromSelect.options[fromSelect.selectedIndex].text;

    fromSelect.value = toSelect.value;
    fromSelect.options[fromSelect.selectedIndex].text = toSelect.options[toSelect.selectedIndex].text;
    
    toSelect.value = tempValue;
    toSelect.options[toSelect.selectedIndex].text = tempText;

    const swapIcon = activeTab.querySelector('.swap-icon i');
    if (swapIcon) {
        swapIcon.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            swapIcon.style.transform = 'rotate(180deg)';
        }, 10);
        setTimeout(() => {
            swapIcon.style.transform = 'rotate(0deg)';
        }, 1000);
    }
}

// ==========================================
// 5. دوال اختيار الأزرار الفرعية (الفنادق)
// ==========================================
function selectSubCategory(clickedBtn) {
    const buttons = clickedBtn.parentElement.querySelectorAll('.sub-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
}

// ==========================================
// 6. دالة تغيير العملة
// ==========================================
function changeCurrency(currencyCode) {
    const currencyDropdown = document.querySelectorAll('.dropdown')[1];
    if(currencyDropdown) {
        const triggerSpan = currencyDropdown.querySelector('.dropdown-trigger span');
        if(triggerSpan) triggerSpan.textContent = currencyCode;
    }
}

// ==========================================
// 🟢 7. زر البحث (جمع البيانات وتخزينها والذهاب لصفحة النتائج)
// ==========================================
function triggerSearch() {
    const activeTab = document.querySelector('.tab-content.active-content');
    if (!activeTab) return;

    const fromSelect = activeTab.querySelectorAll('.city-select')[0];
    const toSelect = activeTab.querySelectorAll('.city-select')[1];
    const dateInputs = activeTab.querySelectorAll('.date-picker');
    const passengerDisplay = activeTab.querySelector('#passenger-display');

    if(!fromSelect || !toSelect) {
        alert('يرجى التأكد من ملء بيانات البحث');
        return;
    }

    const fromCity = fromSelect ? fromSelect.value : "CAI";
    const toCity = toSelect ? toSelect.value : "JED";
    const departDate = dateInputs[0] ? dateInputs[0].value : "";
    const returnDate = dateInputs[1] ? dateInputs[1].value : "";
    const passengersText = passengerDisplay ? passengerDisplay.textContent.trim() : "1 بالغ / درجة رجال الأعمال";

    if(!departDate) {
        alert("الرجاء اختيار تاريخ المغادرة.");
        return;
    }

    const searchData = {
        from: fromCity,
        to: toCity,
        depart: departDate,
        return: returnDate,
        passengers: passengersText
    };
    localStorage.setItem('ucornos_search', JSON.stringify(searchData));

    // 🛑 تم حذف إظهار اللودر تماماً من هنا، لأن اللودر موجود في الصفحة التانية
    // window.location.href = 'try.html' بتم نقل المستخدم لصفحة النتائج حيث سيظهر الـ Skeleton
    window.location.href = 'try.html';
}

// ==========================================
// 8. دوال قسم "إلى أين ستسافر؟"
// ==========================================
const destinationsDB = [
    { id: 1, city: 'kuwait', name: 'دبي', sub: '14 أكتوبر حتى 15 ديسمبر', price: '500 KWD', img: 'photos/Burj-Khalifa-best-1024x683.jpg' },
    { id: 2, city: 'kuwait', name: 'الكويت', sub: 'جولة في أبراج الكويت', price: '350 KWD', img: 'photos/Kuwait.webp' },
    { id: 3, city: 'kuwait', name: 'لندن', sub: 'رحلة نهاية العام', price: '700 KWD', img: 'photos/صورة-معالم-سياحية-في-لندن.jpg' },
    { id: 4, city: 'ahmadi', name: 'الأحمدي', sub: 'زيارة حديقة الحيوان', price: '180 KWD', img: 'photos/zoo.jpg' },
    { id: 5, city: 'ahmadi', name: 'إسطنبول', sub: 'حتى 30 نوفمبر', price: '420 KWD', img: 'photos/great-seto-bridge.jpg' },
    { id: 6, city: 'ahmadi', name: 'مصر', sub: 'رحلات نيلية', price: '400 KWD', img: 'photos/nile cruise.jpeg' },
    { id: 7, city: 'farwaniya', name: 'روما', sub: 'زيارة اجمل المعالم السياحية', price: '850 KWD', img: 'photos/roma.jpg' },
    { id: 8, city: 'farwaniya', name: 'اليابان', sub: 'مهرجان الأزهار', price: '1100 KWD', img: 'photos/GAPAN.webp' },
];

function renderCityCards(filteredData) {
    const container = document.getElementById('city-results');
    container.innerHTML = '';
    if (filteredData.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#888; grid-column: 1/-1;">لا توجد عروض لهذه المدينة حالياً.</div>`;
        return;
    }
    filteredData.forEach(item => {
        const cardHTML = `
            <div class="city-card">
                <img src="${item.img}" alt="${item.name}">
                <div class="city-overlay">
                    <div class="city-price-pill">إبتداءاً من ${item.price}</div>
                    <h3>${item.name}</h3>
                    <div class="sub-detail">${item.sub}</div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function filterCity(cityCode) {
    const tabs = document.querySelectorAll('.city-tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = Array.from(tabs).find(tab => tab.textContent.includes(
        cityCode === 'kuwait' ? 'الكويت' :
        cityCode === 'ahmadi' ? 'الأحمدي' :
        cityCode === 'farwaniya' ? 'الفروانية' : 'الجهراء'
    ));
    if(activeTab) activeTab.classList.add('active');
    document.getElementById('city-select').value = cityCode;
    let filtered = [];
    if (cityCode === 'all') {
        filtered = destinationsDB;
    } else {
        filtered = destinationsDB.filter(item => item.city === cityCode);
    }
    renderCityCards(filtered);
}

// ==========================================
// 9. دوال الوجهات المتعددة و الخيارات المتقدمة
// ==========================================
function addMultiCityRow() {
    const container = document.getElementById('multi-city-rows-container');
    const newRow = document.createElement('div');
    newRow.className = 'multi-row';
    newRow.style.cssText = "display: flex; gap: 10px; align-items: center; margin-bottom: 10px; background: #f7f9fa; padding: 10px; border-radius: 10px;";
    newRow.innerHTML = `
        <div class="input-box multi-input" style="flex:1;">
            <label>من</label>
            <select><option>CAI - القاهرة</option></select>
        </div>
        <div class="swap-icon-small" style="background:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; color:#4db6ac; border:1px solid #eee;">
            <i class="fas fa-exchange-alt"></i>
        </div>
        <div class="input-box multi-input" style="flex:1;">
            <label>إلى</label>
            <select><option>JED - جدة</option></select>
        </div>
        <div class="input-box multi-input" style="flex:1;">
            <label>تاريخ المغادرة</label>
            <input type="text" class="date-picker" placeholder="4 أغسطس 2026" readonly>
            <i class="far fa-calendar-alt icon"></i>
        </div>
        <button class="remove-row-btn" onclick="removeMultiRow(this)" style="background:transparent; border:none; color:#ff4d4d; font-size:18px; cursor:pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newRow);
    flatpickr(newRow.querySelector('.date-picker'), { dateFormat: "d F Y", minDate: "today" });
}

function removeMultiRow(btn) {
    const row = btn.parentElement;
    const container = document.getElementById('multi-city-rows-container');
    if (container.children.length > 1) {
        row.remove();
    } else {
        alert("يجب أن يكون هناك على الأقل وجهة واحدة.");
    }
}

function toggleAdvancedOptions() {
    const content = document.getElementById('advanced-content');
    const arrow = document.getElementById('adv-arrow');
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'flex';
        arrow.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

function toggleFlexibleDates() {
    const checkbox = document.getElementById('flexible-check');
    if (checkbox.checked) {
        console.log("تم تفعيل البحث برحلات مرنة ± 3 أيام");
    } else {
        console.log("تم إلغاء تفعيل البحث المرن");
    }
}

function togglePromoCodeField() {
    const wrapper = document.getElementById('promo-code-wrapper');
    if (wrapper.style.display === 'none' || wrapper.style.display === '') {
        wrapper.style.display = 'block';
        document.getElementById('promo-code-input').focus();
    } else {
        wrapper.style.display = 'none';
        document.getElementById('promo-code-input').value = '';
    }
}

// ==========================================
// 10. منطق قائمة المسافرين ودرجة السفر (Popup)
// ==========================================
let counts = { adults: 1, children: 0, infants: 0 };
let selectedClass = 'business';

function togglePassengerPopup(event) {
    if(event) event.stopPropagation();
    const popup = document.getElementById('passenger-popup');
    const arrow = document.getElementById('passenger-arrow');
    popup.classList.toggle('open');
    if (popup.classList.contains('open')) {
        arrow.style.transform = 'translateY(-50%) rotate(180deg)';
    } else {
        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    }
}

document.addEventListener('click', function(event) {
    const popup = document.getElementById('passenger-popup');
    const trigger = document.querySelector('.passenger-trigger');
    const arrow = document.getElementById('passenger-arrow');
    if (popup && trigger && popup.classList.contains('open')) {
        if (!popup.contains(event.target) && !trigger.contains(event.target)) {
            popup.classList.remove('open');
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
    }
});

function updateCount(type, change) {
    const total = counts.adults + counts.children + counts.infants;
    if (change > 0 && total >= 9) {
        alert("عذراً، الحد الأقصى لعدد المسافرين هو 9 أشخاص.");
        return;
    }
    if (counts[type] + change < 0) return;
    if (type === 'infants') {
        if (counts[type] + change > counts.adults) return;
    }
    counts[type] += change;
    const element = document.getElementById(type + '-count');
    if (element) element.textContent = counts[type];
}

function selectClass(btn, className) {
    const buttons = btn.parentElement.querySelectorAll('.class-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedClass = className;
}

function applyPassengerSelection() {
    let displayText = '';
    if (counts.adults > 0) displayText += `${counts.adults} بالغ`;
    if (counts.children > 0) displayText += `, ${counts.children} طفل`;
    if (counts.infants > 0) displayText += `, ${counts.infants} رضيع`;
    const classText = (selectedClass === 'business') ? 'درجة رجال الأعمال' : 'الدرجة الإقتصادية';
    displayText += ` / ${classText}`;
    const displayDiv = document.getElementById('passenger-display');
    if (displayDiv) displayDiv.textContent = displayText;
    
    const popup = document.getElementById('passenger-popup');
    const arrow = document.getElementById('passenger-arrow');
    popup.classList.remove('open');
    arrow.style.transform = 'translateY(-50%) rotate(0deg)';
}

// ==========================================
// 11. الفلترة الافتراضية للوجهات
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    filterCity('all');
});
// ==========================================
// 🔗 ربط عدد المسافرين مع صفحة النتائج
// ==========================================

// تحديث دالة triggerSearch الموجودة بالفعل - فقط نضيف لها حفظ بيانات المسافرين
// 🔴 ابحث عن دالة triggerSearch الموجودة واستبدلها بهذه النسخة المعدلة 🔴
// أو أضف هذا الكود في نهاية الملف

// ===== دالة البحث المعدلة لحفظ بيانات المسافرين =====
// إذا كانت دالة triggerSearch موجودة، استبدلها بهذه النسخة
// وإذا لم تكن موجودة، أضف هذه الدالة

function triggerSearch() {
    const activeTab = document.querySelector('.tab-content.active-content');
    if (!activeTab) {
        alert('يرجى اختيار نوع الخدمة أولاً');
        return;
    }

    // ===== جمع بيانات المسافرين من البوب أب =====
    let adults = parseInt(document.getElementById('adults-count')?.textContent || '1');
    let children = parseInt(document.getElementById('children-count')?.textContent || '0');
    let infants = parseInt(document.getElementById('infants-count')?.textContent || '0');
    
    // تحديد درجة السفر
    let classType = 'business';
    const classBtns = document.querySelectorAll('.class-btn');
    classBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            classType = btn.textContent.includes('رجال الأعمال') ? 'business' : 'economy';
        }
    });

    // جمع بيانات المدن
    const fromSelect = activeTab.querySelectorAll('.city-select')[0];
    const toSelect = activeTab.querySelectorAll('.city-select')[1];
    const dateInputs = activeTab.querySelectorAll('.date-picker');
    const passengerDisplay = document.getElementById('passenger-display');

    if(!fromSelect || !toSelect) {
        alert('يرجى التأكد من ملء بيانات البحث');
        return;
    }

    const fromCity = fromSelect ? fromSelect.value : "CAI";
    const toCity = toSelect ? toSelect.value : "JED";
    const departDate = dateInputs[0] ? dateInputs[0].value : "";
    const returnDate = dateInputs[1] ? dateInputs[1].value : "";
    const passengersText = passengerDisplay ? passengerDisplay.textContent.trim() : "1 بالغ / درجة رجال الأعمال";

    // إنشاء نص العرض للمسافرين
    let displayText = '';
    if (adults > 0) displayText += `${adults} بالغ`;
    if (children > 0) displayText += `, ${children} طفل`;
    if (infants > 0) displayText += `, ${infants} رضيع`;
    const classText = classType === 'business' ? 'درجة رجال الأعمال' : 'الدرجة الإقتصادية';
    displayText += ` / ${classText}`;

    if(!departDate) {
        alert("الرجاء اختيار تاريخ المغادرة.");
        return;
    }

    // ===== حفظ جميع البيانات في localStorage =====
    const searchData = {
        from: fromCity,
        to: toCity,
        depart: departDate,
        return: returnDate,
        passengers: passengersText,
        adults: adults,
        children: children,
        infants: infants,
        class: classType,
        displayText: displayText,
        totalPassengers: adults + children + infants
    };

    localStorage.setItem('ucornos_search', JSON.stringify(searchData));
    console.log("✅ تم حفظ بيانات البحث:", searchData);

    // الانتقال إلى صفحة النتائج
    window.location.href = 'try.html';
}