console.log("Kampüs Etkinlik Portalı JavaScript Dosyası Bağlandı!");

const kaydetButonu = document.querySelector(".btn-primary");

if (kaydetButonu) {
    kaydetButonu.addEventListener("click", function(event) {
        
        const etkinlikAdi = document.getElementById("etkinlik-adi");
        const etkinlikTarihi = document.getElementById("etkinlik-tarihi");

        const adDegeri = etkinlikAdi ? etkinlikAdi.value.trim() : "";
        const tarihDegeri = etkinlikTarihi ? etkinlikTarihi.value : "";

        if (adDegeri === "") {
            event.preventDefault();
            alert("⚠️ Lütfen Etkinlik Adı alanını boş bırakmayınız!");
            if (etkinlikAdi) etkinlikAdi.focus();
        } 
        else if (tarihDegeri === "") {
            event.preventDefault();
            alert("⚠️ Lütfen Etkinlik Tarihini seçiniz!");
            if (etkinlikTarihi) etkinlikTarihi.focus();
        } 
        else {
            event.preventDefault();
            alert("✅ Etkinlik başarıyla eklendi/güncellendi!");
        }

    });
}