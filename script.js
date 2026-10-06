console.log("Kampüs Etkinlik Portalı JavaScript Dosyası Bağlandı!");

// Sayfa ilk yüklendiğinde çalışacak fonksiyonlar
window.onload = function() {
    yukluEtkinlikleriEkranaBas();   // Etkinlik Ekle sayfasındaki liste
    etkinliklerSayfasiniYukle();  // Etkinlikler.html sayfasındaki liste
};

const etkinlikFormu = document.querySelector("form");

if (etkinlikFormu) {
    etkinlikFormu.addEventListener("submit", function(event) {
        event.preventDefault(); // Sayfa yenilenmesini engelle
        
        // Input alanlarını oku
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

        // 1. BENZERSİZ ID İLE ETKİNLİK NESNESİ (OBJECT)
        const yeniEtkinlik = {
            id: Date.now(),
            ad: adDegeri,
            tarih: tarihDegeri,
            aciklama: aciklamaDegeri
        };

        // 2. HAFIZAYA KAYDET
        let kayitliEtkinlikler = JSON.parse(localStorage.getItem("etkinlikler")) || [];
        kayitliEtkinlikler.push(yeniEtkinlik);
        localStorage.setItem("etkinlikler", JSON.stringify(kayitliEtkinlikler));

        // 3. EKRANI GÜNCELLE VE FORMU TEMİZLE
        yukluEtkinlikleriEkranaBas();
        alert("✅ Etkinlik kalıcı olarak kaydedildi!");
        etkinlikFormu.reset();
    });
}

// ETKİNLİK EKLE SAYFASINDAKİ LİSTELEME
function yukluEtkinlikleriEkranaBas() {
    const formEl = document.querySelector("form");
    if (!formEl) return;

    let listeAlani = document.getElementById("liste-alani");
    if (!listeAlani) {
        listeAlani = document.createElement("div");
        listeAlani.id = "liste-alani";
        formEl.after(listeAlani);
    }

    const kayitliEtkinlikler = JSON.parse(localStorage.getItem("etkinlikler")) || [];
    listeAlani.innerHTML = "";

    if (kayitliEtkinlikler.length > 0) {
        const baslik = document.createElement("h2");
        baslik.innerText = "📌 Kayıtlı Etkinlikler (Hafızadan Okunan)";
        baslik.style.marginTop = "20px";
        listeAlani.appendChild(baslik);

        kayitliEtkinlikler.forEach(function(etkinlik) {
            const kart = document.createElement("div");
            kart.className = "card";
            
            kart.innerHTML = `
                <h3>🎉 ${etkinlik.ad}</h3>
                <p><strong>Tarih:</strong> ${etkinlik.tarih}</p>
                <p><strong>Açıklama:</strong> ${etkinlik.aciklama}</p>
                <button onclick="etkinlikSil(${etkinlik.id})" style="background-color: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-top: 8px;">
                    🗑️ Etkinliği Sil
                </button>
            `;
            listeAlani.appendChild(kart);
        });
    }
}

// ETKİNLİK SİLME FONKSİYONU
function etkinlikSil(id) {
    if (confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) {
        let kayitliEtkinlikler = JSON.parse(localStorage.getItem("etkinlikler")) || [];
        
        kayitliEtkinlikler = kayitliEtkinlikler.filter(function(etkinlik) {
            return etkinlik.id !== id;
        });

        localStorage.setItem("etkinlikler", JSON.stringify(kayitliEtkinlikler));

        // İki sayfadaki listeyi de yenile
        yukluEtkinlikleriEkranaBas();
        etkinliklerSayfasiniYukle();
    }
}

// =========================================================
// 🌟 YENİ EKLENEN: ETKİNLİKLER.HTML SAYFASINDA LİSTELEME
// =========================================================
function etkinliklerSayfasiniYukle() {
    const tumEtkinliklerAlani = document.getElementById("tum-etkinlikler-alani");
    if (!tumEtkinliklerAlani) return; // Eğer etkinlikler.html sayfasında değilsek susar

    const kayitliEtkinlikler = JSON.parse(localStorage.getItem("etkinlikler")) || [];
    tumEtkinliklerAlani.innerHTML = "";

    if (kayitliEtkinlikler.length === 0) {
        tumEtkinliklerAlani.innerHTML = "<p><em>Henüz eklenmiş bir etkinlik bulunmuyor. Etkinlik Ekle sayfasından yeni etkinlik ekleyebilirsiniz.</em></p>";
    } else {
        kayitliEtkinlikler.forEach(function(etkinlik) {
            const kart = document.createElement("div");
            kart.className = "card";
            kart.innerHTML = `
                <h3>🎉 ${etkinlik.ad}</h3>
                <p><strong>Tarih:</strong> ${etkinlik.tarih}</p>
                <p><strong>Açıklama:</strong> ${etkinlik.aciklama}</p>
                <button onclick="etkinlikSil(${etkinlik.id})" style="background-color: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-top: 8px;">
                    🗑️ Etkinliği Sil
                </button>
            `;
            tumEtkinliklerAlani.appendChild(kart);
        });
    }
}