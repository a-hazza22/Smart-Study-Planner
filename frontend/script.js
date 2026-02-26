// إضافة مادة افتراضية عند التحميل
addCourse();

// دالة إضافة صف مادة جديد
function addCourse(name = "", diff = "Orta") {
    const container = document.getElementById("coursesList");
    const div = document.createElement("div");
    div.className = "flex gap-2 course-row items-center animate-fade-in";
    div.innerHTML = `
        <input type="text" value="${name}" placeholder="Ders Adı" class="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
        <select class="p-3 border rounded-lg bg-white shadow-sm cursor-pointer">
            <option value="Zor" ${diff === 'Zor' ? 'selected' : ''}>Zor</option>
            <option value="Orta" ${diff === 'Orta' ? 'selected' : ''}>Orta</option>
            <option value="Kolay" ${diff === 'Kolay' ? 'selected' : ''}>Kolay</option>
        </select>
        <button onclick="this.parentElement.remove()" class="text-red-400 hover:text-red-600 font-bold px-3 text-lg">×</button>
    `;
    container.appendChild(div);
}

// دالة رفع الصورة وتحليلها
async function uploadImage() {
    const file = document.getElementById("imageInput").files[0];
    if (!file) return;

    const status = document.getElementById("uploadStatus");
    status.innerText = "⏳ Yapay Zeka Analiz Ediyor...";
    status.className = "mt-2 text-blue-600 font-bold animate-pulse";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/api/scheduler/upload-schedule", { method: "POST", body: formData });
        const data = await res.json();
        
        if (data.success && data.courses) {
            document.getElementById("coursesList").innerHTML = ""; // مسح القديم
            data.courses.forEach(c => addCourse(c.name, c.difficulty));
            status.innerText = "✅ Analiz Tamamlandı!";
            status.className = "mt-2 text-green-600 font-bold";
        } else {
            throw new Error("Ders bulunamadı");
        }
    } catch (e) {
        status.innerText = "❌ Hata: " + e.message;
        status.className = "mt-2 text-red-600 font-bold";
    }
}

// دالة إنشاء الجدول النهائي
async function createPlan() {
    const btn = document.getElementById("createBtn");
    const rows = document.querySelectorAll(".course-row");
    
    // تجميع البيانات من الحقول
    const courses = Array.from(rows).map(row => ({
        name: row.querySelector("input").value,
        difficulty: row.querySelector("select").value
    })).filter(c => c.name.trim() !== "");

    if (courses.length === 0) return alert("Lütfen en az bir ders ekleyin!");

    // تغيير حالة الزر أثناء التحميل
    const originalText = btn.innerText;
    btn.innerText = "✨ Yapay Zeka Planlıyor...";
    btn.disabled = true;
    btn.classList.add("opacity-75", "cursor-wait");

    try {
        const res = await fetch("/api/scheduler/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courses, freeTime: document.getElementById("freeTime").value })
        });
        
        const data = await res.json();
        if (data.week_plan) {
            renderPlan(data.week_plan);
        } else {
            throw new Error("Plan oluşturulamadı (Backend yanıtı boş)");
        }
    } catch (e) {
        alert("Hata oluştu: " + e.message + "\nBackend çalışıyor mu?");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove("opacity-75", "cursor-wait");
    }
}

// دالة رسم الجدول على الشاشة
function renderPlan(plan) {
    document.getElementById("inputSection").classList.add("hidden");
    document.getElementById("resultBox").classList.remove("hidden");
    const container = document.getElementById("planContent");

    plan.forEach(day => {
        let html = `
            <div class="border border-gray-200 rounded-xl overflow-hidden break-inside-avoid shadow-sm hover:shadow-md transition">
                <div class="bg-blue-600 text-white p-3 font-bold text-center text-lg tracking-wide">${day.day}</div>
                <div class="p-4 bg-white space-y-3">
        `;
        
        day.sessions.forEach(s => {
            const isBreak = s.type === 'break';
            // تنسيق الألوان حسب نوع النشاط
            const style = isBreak 
                ? 'bg-orange-50 border-orange-100 text-orange-800' 
                : 'bg-blue-50 border-blue-100 text-blue-900';
            
            // تمييز المدرسة بلون خاص
            const isSchool = s.task.toLowerCase().includes('okul');
            const finalStyle = isSchool ? 'bg-gray-100 border-gray-200 text-gray-500 italic' : style;

            html += `
                <div class="flex justify-between items-center p-3 rounded-lg border ${finalStyle}">
                    <span class="font-medium text-sm w-2/3">${s.task}</span>
                    <span class="text-xs font-bold bg-white px-2 py-1 rounded border shadow-sm">${s.time}</span>
                </div>
            `;
        });

        html += `</div></div>`;
        container.innerHTML += html;
    });
}