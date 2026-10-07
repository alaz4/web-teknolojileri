import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const formMesaj = document.querySelector("#form-mesaj");

if (form) {
    // =========================================================
    // ADIM 11: Güncelleme Modu Kontrolü ve Formu Doldurma
    // =========================================================
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (form.dataset.mode === "guncelle") {
        const etkinlik = events.find(e => e.id === id);

        if (etkinlik) {
            // Etkinlik bulunduysa form alanlarını doldur
            form.elements.ad.value = etkinlik.title;
            form.elements.kategori.value = etkinlik.category;
            
            // Tarih GG-AA-YYYY formatından YYYY-MM-DD (input date) formatına çevrilir
            if (etkinlik.date && etkinlik.date.includes("-")) {
                const parts = etkinlik.date.split("-");
                if (parts.length === 3) {
                    form.elements.tarih.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }

            form.elements.saat.value = etkinlik.time;
            form.elements.mekan.value = etkinlik.location;
            form.elements.kontenjan.value = etkinlik.capacity;
            form.elements.aciklama.value = etkinlik.description;
        } else {
            // Etkinlik bulunamazsa veya id adreste yoksa formu gizle ve uyarı göster
            form.outerHTML = `
                <div class="hata-kutusu" style="margin-top: 20px;">
                    <h2>⚠️ Geçersiz Erişim veya Etkinlik Bulunamadı</h2>
                    <p>Güncellemek istediğiniz etkinlik bulunamadı. Lütfen detay sayfasındaki "Güncelle" bağlantısını kullanınız.</p>
                    <br>
                    <a href="etkinlikler.html" class="btn-detail">← Etkinliklere Git</a>
                </div>
            `;
            // Form gizlendiği için aşağıdaki submit event listener bağlanmayacak
        }
    }

    // =========================================================
    // Form Gönderimi (Submit & Validation)
    // =========================================================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Hata alanlarını temizle
        const tumHataSpanlari = form.querySelectorAll(".hata-mesaji");
        tumHataSpanlari.forEach(span => span.textContent = "");

        const tumInputlar = form.querySelectorAll("input, select, textarea");
        tumInputlar.forEach(input => input.removeAttribute("aria-invalid"));

        if (formMesaj) formMesaj.innerHTML = "";

        const fd = new FormData(form);

        const rawDate = fd.get("tarih") || "";
        let formattedDate = rawDate;
        if (rawDate.includes("-")) {
            const parts = rawDate.split("-");
            if (parts.length === 3) {
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        const data = {
            id: id || `event-${Date.now()}`,
            title: (fd.get("ad") || "").trim(),
            category: fd.get("kategori") || "",
            date: formattedDate,
            time: fd.get("saat") || "",
            location: (fd.get("mekan") || "").trim(),
            description: (fd.get("aciklama") || "").trim(),
            capacity: Number(fd.get("kontenjan")) || 0
        };

        // Doğrulama kuralları
        const errors = {};

        if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
        if (!data.category) errors.kategori = "Lütfen bir kategori seçiniz.";
        if (!fd.get("tarih")) errors.tarih = "Tarih alanı boş bırakılamaz.";
        if (!data.time) errors.saat = "Saat alanı boş bırakılamaz.";
        if (!data.location) errors.mekan = "Mekan alanı boş bırakılamaz.";
        if (data.capacity < 1 || data.capacity > 1000) errors.kontenjan = "Kontenjan 1 ile 1000 arasında olmalıdır.";

        const hataAlanlari = Object.keys(errors);

        if (hataAlanlari.length > 0) {
            hataAlanlari.forEach(alanKey => {
                const hataSpan = document.querySelector(`#${alanKey}-hata`);
                const inputElement = document.querySelector(`#${alanKey}`);

                if (hataSpan) hataSpan.textContent = errors[alanKey];
                if (inputElement) inputElement.setAttribute("aria-invalid", "true");
            });

            if (formMesaj) {
                formMesaj.innerHTML = `
                    <div class="hata-kutusu">
                        ⚠️ Lütfen formdaki hatalı veya eksik alanları düzeltiniz.
                    </div>
                `;
            }
            return;
        }

        if (formMesaj) {
            formMesaj.innerHTML = `
                <div class="basari-kutusu">
                    <h3>✅ Form Başarıyla Güncellendi!</h3>
                    <p>Güncellenen Etkinlik Nesnesi (JSON):</p>
                    <pre style="background: #1e293b; color: #f8fafc; padding: 10px; border-radius: 6px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;
        }
    });
}