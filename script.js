const kaydetButonu = document.querySelector(".btn-primary");
if(kaydetButonu){
    kaydetButonu.addEventListener("click", function(event){
        const etkinlikAdi = document.querySelector('input[type="text"]');
        const etkinlikTarihi = document.querySelector('input[type="data"]');
        if (etkinlikAdi && etkinlikAdi.value.trim() == ""){
            event.preventDefault();
            alert("⚠️ Lütfen Etkinlik Adı alanını boş bırakmayınız!")
            etkinlikAdi.focus();
        }
        else if (etkinlikTarihi && etkinlikTarihi.value.trim() == ""){
            event.preventDefault();
            alert("⚠️ Lütfen Etkinlik Tarihini seçiniz!");
            etkinlikTarihi.focus();
        }
        else{
            event.preventDefault();
            alert("✅ Etkinlik başarıyla eklendi/güncellendi!")
        }

    });
}