//Informacion de pasatiempos
const pasatiempos = [
    {
        imagen: "assets/images/leer.jpg",
        titulo: "Lectura",
        descripcion: "Disfruto perderme en la lectura, sobre todo con textos emocionantes y textos que abren mi mente a nuevas ideas y conocimientos. La lectura me permite explorar diferentes perspectivas y aprender constantemente."
    },
    {
        imagen: "assets/images/videojuegos.jpg",
        titulo: "Videojuegos",
        descripcion: "Me gusta experimentar mundos emocionantes y entretenidas historias. Los videojuegos me permiten sumergirme en universos fascinantes y vivir experiencias únicas desde la comodidad de mi hogar."
    },
    {
        imagen: "assets/images/cinema_.jpg",
        titulo: "Cine",
        descripcion: "Me gusta ver películas, sobre todo películas que me dejen impactado. El cine es para mí una forma de arte que combina narrativa, imagen y sonido para crear experiencias emocionales poderosas."
    }
]
let indiceActual = 0;
const imagenCarrusel = document.querySelector('.carrusel-imagen img');
const tituloCarrusel = document.querySelector('.carrusel-descripcion h3');
const descripcionCarrusel = document.querySelector('.carrusel-descripcion p');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

//Funcion para actualizar el carrusel de imagenes
function actualizarCarrusel() {
    imagenCarrusel.src = pasatiempos[indiceActual].imagen;
    imagenCarrusel.alt = pasatiempos[indiceActual].titulo;
    tituloCarrusel.textContent = pasatiempos[indiceActual].titulo;
    descripcionCarrusel.textContent = pasatiempos[indiceActual].descripcion;
}

//Boton para ver pasatiempo previo
prevBtn.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + pasatiempos.length) % pasatiempos.length;
    actualizarCarrusel();
});

//Boton para ver el siguiente pasatiempo
nextBtn.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % pasatiempos.length;
    actualizarCarrusel();
});

// Inicializar carrusel
actualizarCarrusel();