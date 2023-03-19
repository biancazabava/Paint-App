const paintApp = () => {
    const canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    //instrumente - figurile geometrice si pensula
    instrumente = document.querySelectorAll(".instrument"),
    culoroareUmplere = document.querySelector("#culoare"),
    grosimeLinie = document.querySelector("#grosime-linie"),
    culoriButoane = document.querySelectorAll(".culori .optiune"),
    fundal=document.querySelector(".fundal"),
    stergere=document.querySelector(".stergere"),
    salvare=document.querySelector(".salvare");

    let mouseX, mouseY, dimFixa,
    seDeseneaza = false,
    instrumentSelectat = "pensula",
    grosimePensula=5,
    culoareSelectata = "#fff";

    const imagineFundal = () => {
        context.fillStyle = "#fff";
        context.fillRect(0,0,canvas.width,canvas.height);
        imagineFundal();
    };

    window.addEventListener("load", () => {//reglarea dimensiunilor spatiului de desen
        canvas.width=canvas.offsetWidth;
        canvas.height=canvas.offsetHeight;
        imagineFundal();
    });

    const deseneazaDreptunghi = (e) => {
        if(!culoroareUmplere.checked){
            return context.strokeRect(e.offsetX, e.offsetY, mouseX - e.offsetX, mouseY - e.offsetY);
        }
        context.fillRect(e.offsetX, e.offsetY, mouseX - e.offsetX, mouseY - e.offsetY);
    }

    const deseneazaCerc = (e) => {
        context.beginPath();
        let raza=Math.sqrt(Math.pow((mouseX - e.offsetX), 2) + Math.pow((mouseY - e.offsetY), 2));
        context.arc(mouseX, mouseY, raza, 0, 2 * Math.PI);
        if(culoroareUmplere.checked){
            context.fill();
        }
        context.stroke();
    }

    const deseneazaTriunghi = (e) => {
        context.beginPath();
        context.moveTo(mouseX,mouseY);
        context.lineTo(e.offsetX,e.offsetY);
        context.lineTo(mouseX*2 - e.offsetX, e.offsetY);
        context.closePath();
        if(culoroareUmplere.checked){
            context.fill();
        }else
        context.stroke();
    }

    const deseneaza = (e)=> {
        seDeseneaza=true;
        mouseX = e.offsetX;//retinerea coordonatei curente a mouse-ului
        mouseY = e.offsetY;
        context.beginPath();
        context.lineWidth= grosimePensula;
        context.strokeStyle = culoareSelectata;
        context.fillStyle = culoareSelectata;
        dimFixa= context.getImageData(0,0,canvas.width,canvas.height);//evitarea deformarii dreptunghiului
    }

    const incepeDesen = (e) => {
        if(!seDeseneaza) return;
        context.putImageData(dimFixa, 0, 0);

        if(instrumentSelectat === "pensula"){
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        } else if(instrumentSelectat === "dreptunghi"){
            deseneazaDreptunghi(e);
        } else if(instrumentSelectat === "cerc"){
            deseneazaCerc(e);
        } else {
            deseneazaTriunghi(e);
        }
    }

    instrumente.forEach(element => {
        element.addEventListener("click", () => {
            document.querySelector(".optiuni .activ").classList.remove("activ");//mutarea atributului activ de la optiunea initiala la cea actuala pentru selectarea instrumentului dorit
            element.classList.add("activ");
            instrumentSelectat = element.id;
            console.log(instrumentSelectat);
        })

    });

    grosimeLinie.addEventListener("change", () => grosimePensula = grosimeLinie.value);

    culoriButoane.forEach(element => {
        element.addEventListener("click", ()=>{
            document.querySelector(".optiuni .selectata").classList.remove("selectata");
            element.classList.add("selectata");
            culoareSelectata = window.getComputedStyle(element).getPropertyValue("background-color");
        });
    });

    fundal.addEventListener("click", () => {
        const fundalNou = () => {
            context.fillStyle = culoareSelectata;
            context.fillRect(0,0,canvas.width,canvas.height);
            fundalNou();
        }
        fundalNou();
    })

    stergere.addEventListener("click", () => {
        context.clearRect(0,0,canvas.width,canvas.height);
        imagineFundal();
    });

    salvare.addEventListener("click", () => {
        const link=document.createElement("a");
        link.download = `desen.jpg`;
        link.href=canvas.toDataURL();
        link.click();
    });

    canvas.addEventListener("mousedown", deseneaza)
    canvas.addEventListener("mousemove", incepeDesen);
    canvas.addEventListener("mouseup", ()=> seDeseneaza=false);
};

document.addEventListener("DOMContentLoaded", paintApp);
