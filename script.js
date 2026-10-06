console.log("Kampüs Etkinlik Portalı JavaScript Dosyası Bağlandı!");

const etkinlikFormu = document.querySelector("form");

if (etkinlikFormu) {
    etkinlikFormu.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const etkinlikAdi = document.getElementById("etkinlik-adi");
        const etkinlikTarihi = document.getElementById("etkinlik-tarihi");
        const etkinlikAciklama = document.querySelector('textarea[name="aciklama"]');

        const adDegeri = etkinlikAdi ? etkinlikAdi.value.trim() : "";
        const tarihDegeri = etkinlikTarihi ? etkinlikTarihi.value : "";
        const aciklamaDegeri = etkinlikAciklama && etkinlikAciklama.value.trim() !== "" 
            ? etkinlikAciklama.value.trim() 
            : "Açıklama belirtilmedi.";

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

        const yeniEtkinlik = {
            id: Date.now(),
            ad: adDegeri,
            tarih: tarihDegeri,
            aciklama: aciklamaDegeri
        };
        etkinligiHafizayaKaydet(yeniEtkinlik);
        yukluEtkinlikleriGoster();
        alert("Etkinlik başarıyla kalıcı olarak kaydedildi");
        etkinlikFormu.reset();

    });
}

function hafizadakiEtkinlikleriGetir(){
   const kayitliVeri = localStorage.getItem("etkinlikler");
    return kayitliVeri ? JSON.parse(kayitliVeri) : [];
}
function etkinligiHafizayaKaydet(etkinlik) {
    const mevcutEtkinlikler = hafizadakiEtkinlikleriGetir();
    mevcutEtkinlikler.push(etkinlik);
    localStorage.setItem("etkinlikler", JSON.stringify(mevcutEtkinlikler));}

    function yukluEtkinlikleriGoster() {
    
    let kartAlani = document.getElementById("eklenen-etkinlikler-alani");
    
    if (!kartAlani && etkinlikFormu) {
        kartAlani = document.createElement("div");
        kartAlani.id = "eklenen-etkinlikler-alani";
        etkinlikFormu.after(kartAlani);
    }

    if (!kartAlani) return;

    const liste = hafizadakiEtkinlikleriGetir();
    kartAlani.innerHTML = "";

    if (liste.length > 0) {
        const baslik = document.createElement("h2");
        baslik.innerText = "📌 Kaydedilen Etkinlikler (Kalıcı Hafıza)";
        kartAlani.appendChild(baslik);

        liste.forEach(function(etkinlik) {
            const kart = document.createElement("div");
            kart.className = "card";
            kart.innerHTML = `
                <h3>🎉 ${etkinlik.ad}</h3>
                <p><strong>Tarih:</strong> ${etkinlik.tarih}</p>
                <p><strong>Açıklama:</strong> ${etkinlik.aciklama}</p>
            `;
            kartAlani.appendChild(kart);
        });
    }
}