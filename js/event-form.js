import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const formMesaj = document.querySelector("#form-mesaj");

if (form) {
    // URL'den id parametresini okuyoruz
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // =========================================================
    // MOD KONTROLÜ: EĞER ID VARSA FORMU DOLDUR (GÜNCELLEME MODU)
    // =========================================================
    if (id) {
        const etkinlik = events.find(e => e.id === id);

        if (etkinlik) {
            form.elements.ad.value = etkinlik.title;
            form.elements.kategori.value = etkinlik.category;
            
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

            // Başlığı Güncelle olarak değiştir
            const baslik = document.querySelector("h1");
            if (baslik) baslik.textContent = "Etkinlik Güncelle";
        }
    }

    // =========================================================
    // FORM GÖNDERİMİ (EKLEME & GÜNCELLEME ORTAK DOĞRULAMA)
    // =========================================================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Önceki Hataları Temizle
        const tumHataSpanlari = form.querySelectorAll(".hata-mesaji");
        tumHataSpanlari.forEach(span => span.textContent = "");

        const tumInputlar = form.querySelectorAll("input, select, textarea");
        tumInputlar.forEach(input => input.removeAttribute("aria-invalid"));

        if (formMesaj) formMesaj.innerHTML = "";

        // 2. Form Verilerini Oku
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

        // 3. Doğrulama Kuralları (Adım 10)
        const errors = {};

        if (data.title.length < 3) errors.ad = "En az 3 karakter olmalı.";
        if (!data.category) errors.kategori = "Kategori seçilmeli.";
        if (!fd.get("tarih")) errors.tarih = "Tarih alanı boş bırakılamaz.";
        if (!data.time) errors.saat = "Saat alanı boş bırakılamaz.";
        if (!data.location) errors.mekan = "Mekan alanı boş bırakılamaz.";
        if (data.capacity < 1 || data.capacity > 1000) errors.kontenjan = "Kontenjan 1-1000 arasında olmalı.";

        // 4. Hata Varsa Göster
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

        // 5. Hata Yoksa Başarılı Gönderim Kutusu (JSON Gösterimi - Slayt Çıktısı)
        const islemTipi = id ? "Güncellendi" : "Oluşturuldu";

        if (formMesaj) {
            formMesaj.innerHTML = `
                <div class="basari-kutusu">
                    <p style="margin-bottom: 10px; font-weight: bold;">Etkinlik başarıyla ${islemTipi.toLowerCase()}! Bu aşamada form veri kaydetmez; sonuç aşağıda gösterilir.</p>
                    <pre style="background: #1e293b; color: #f8fafc; padding: 15px; border-radius: 6px; overflow-x: auto; font-family: monospace;">${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;
        }
    });
}