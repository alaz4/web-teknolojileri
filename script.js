console.log("Kampüs Etkinlik Portalı JavaScript Dosyası Bağlandı!");

// Sayfa ilk yüklendiğinde hafızada önceden kayıtlı etkinlik varsa ekrana bas
window.onload = function() {
    yukluEtkinlikleriEkranaBas();
};

// Formu yakalayalım
const etkinlikFormu = document.querySelector("form");

if (etkinlikFormu) {
    etkinlikFormu.addEventListener("submit", function(event) {
        event.preventDefault(); // Sayfa yenilenmesini engelle
        
        // Form alanlarını oku
        const etkinlikAdi = document.getElementById("etkinlik-adi");
        const etkinlikTarihi = document.getElementById("etkinlik-tarihi");
        const etkinlikAciklama = document.querySelector('textarea[name="aciklama"]');

        const adDegeri = etkinlikAdi ? etkinlikAdi.value.trim() : "";
        const tarihDegeri = etkinlikTarihi ? etkinlikTarihi.value : "";
        const aciklamaDegeri = etkinlikAciklama && etkinlikAciklama.value.trim() !== "" 
            ? etkinlikAciklama.value.trim() 
            : "Açıklama belirtilmedi.";

        // Form Doğrulama Kontrolleri
        if (adDegeri === "") {
            alert("⚠️ Lütfen Etkinlik Adı alanını boş bırakmayınız!");
            if (etkinlikAdi) etkinlikAdi.focus();
            return;
        } 
        
        if (tarihDegeri === "") {
            alert("⚠️ Lütfen Etkinlik Tarihini seçiniz!");
            if (etkinlikTarihi) etkinlikTarihi.focus();
            return;
        }

        // 1. YENİ ETKİNLİK NESNESİ (OBJECT)
        const yeniEtkinlik = {
            ad: adDegeri,
            tarih: tarihDegeri,
            aciklama: aciklamaDegeri
        };

        // 2. HAFIZADAKİ MEVCUT LİSTEYİ AL
        let kayitliEtkinlikler = JSON.parse(localStorage.getItem("etkinlikler")) || [];

        // 3. YENİ ETKİNLİĞİ DİZİYE EKLE
        kayitliEtkinlikler.push(yeniEtkinlik);

        // 4. GÜNCEL LİSTEYİ TARAYICI HAFIZASINA (LOCALSTORAGE) YAZ
        localStorage.setItem("etkinlikler", JSON.stringify(kayitliEtkinlikler));

        // 5. EKRANI GÜNCELLE VE FORMU TEMİZLE
        yukluEtkinlikleriEkranaBas();
        alert("✅ Etkinlik kalıcı olarak kaydedildi!");
        etkinlikFormu.reset();
    });
}

// TARAYICI HAFIZASINDAKİ VERİLERİ OKUYUP EKRANA KART OLARAK ÇİZEN FONKSİYON
function yukluEtkinlikleriEkranaBas() {
    const formEl = document.querySelector("form");
    if (!formEl) return;

    // Varsa eski konteyneri bul veya sıfırdan oluştur
    let listeAlani = document.getElementById("liste-alani");
    if (!listeAlani) {
        listeAlani = document.createElement("div");
        listeAlani.id = "liste-alani";
        formEl.after(listeAlani);
    }

    // Hafızadan oku
    const kayitliEtkinlikler = JSON.parse(localStorage.getItem("etkinlikler")) || [];

    // İçini temizle ki üst üste birmesin
    listeAlani.innerHTML = "";

    if (kayitliEtkinlikler.length > 0) {
        const baslik = document.createElement("h2");
        baslik.innerText = "📌 Kayıtlı Etkinlikler (Hafızadan Okunan)";
        baslik.style.marginTop = "20px";
        listeAlani.appendChild(baslik);

        // Her bir etkinliği karta dönüştür
        kayitliEtkinlikler.forEach(function(etkinlik) {
            const kart = document.createElement("div");
            kart.className = "card";
            kart.innerHTML = `
                <h3>🎉 ${etkinlik.ad}</h3>
                <p><strong>Tarih:</strong> ${etkinlik.tarih}</p>
                <p><strong>Açıklama:</strong> ${etkinlik.aciklama}</p>
            `;
            listeAlani.appendChild(kart);
        });
    }
}