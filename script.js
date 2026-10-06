console.log("Kampüs Etkinlik Portalı JavaScript Dosyası Bağlandı!");

// 1. Formu yakalayalım
const etkinlikFormu = document.querySelector("form");

// 2. Eğer form bu sayfada VARSA submit olayını dinleyelim
if (etkinlikFormu) {
    etkinlikFormu.addEventListener("submit", function(event) {
        // EN ÖNEMLİ SATIR: Sayfanın yenilenmesini EN BAŞTA engelliyoruz
        event.preventDefault(); 
        
        // Form kutularını yakalayalım
        const etkinlikAdi = document.getElementById("etkinlik-adi");
        const etkinlikTarihi = document.getElementById("etkinlik-tarihi");
        const etkinlikAciklama = document.querySelector('textarea[name="aciklama"]');

        const adDegeri = etkinlikAdi ? etkinlikAdi.value.trim() : "";
        const tarihDegeri = etkinlikTarihi ? etkinlikTarihi.value : "";
        const aciklamaDegeri = etkinlikAciklama && etkinlikAciklama.value.trim() !== "" 
            ? etkinlikAciklama.value.trim() 
            : "Açıklama belirtilmedi.";

        // FORM DOĞRULAMA (VALIDATION)
        if (adDegeri === "") {
            alert("⚠️ Lütfen Etkinlik Adı alanını boş bırakmayınız!");
            if (etkinlikAdi) etkinlikAdi.focus();
            return; // Hata varsa kodu burada kes
        } 
        
        if (tarihDegeri === "") {
            alert("⚠️ Lütfen Etkinlik Tarihini seçiniz!");
            if (etkinlikTarihi) etkinlikTarihi.focus();
            return; // Hata varsa kodu burada kes
        }

        // =========================================================
        // DİNAMİK HTML ELEMANI OLUŞTURMA (DOM MANIPULATION)
        // =========================================================

        // A. Yeni bir <div> etiketi oluşturuyoruz
        const yeniKart = document.createElement("div");
        
        // B. Bu div'e CSS'teki kart sınıfımızı veriyoruz
        yeniKart.className = "card";
        
        // C. Kartın içini kullanıcının girdiği verilerle dolduruyoruz
        yeniKart.innerHTML = `
            <h3>🎉 Son Eklenen Etkinlik: ${adDegeri}</h3>
            <p><strong>Tarih:</strong> ${tarihDegeri}</p>
            <p><strong>Açıklama:</strong> ${aciklamaDegeri}</p>
            <span style="color: #16a34a; font-weight: bold;">✓ Başarıyla Canlı Oluşturuldu</span>
        `;

        // D. Bu yeni kartı formun hemen altına ekliyoruz
        etkinlikFormu.after(yeniKart);

        // E. Başarı mesajı verip formu temizliyoruz
        alert("✅ Etkinlik canlı olarak sayfaya eklendi!");
        etkinlikFormu.reset(); // Form kutularını sıfırla
    });
}