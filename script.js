const kaydetButonu = document.querySelector(".btn-primary");
if(kaydetButonu){
    kaydetButonu.addEventListener("click", function(event){
        event.preventDefault();
        alert("Etkinlik bilgileri başarıyla kaydedildi");

    });
}