(function(){
  // Logical Or
  const lat = /*document.querySelector('#lat').value || */41.6756304;
  const lng = /*document.querySelector('#lng').value || */2.7820144;
  const mapa = L.map('mapa-inicio').setView([lat, lng ], 14);
  
  let markers = new L.FeatureGroup().addTo(mapa)
    //console.log(markers);

  let propiedades = [];

  //Filtros
  const filtros = {
    categoria: '',
    precio: ''
    }

  const categoriasSelect = document.querySelector('#categorias')
  const preciosSelect = document.querySelector('#precios')

 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(mapa)

    //Filtrado de Categorias y Precios
    categoriasSelect.addEventListener('change', e => {
        //console.log(+e.target.value)
        filtros.categoria = +e.target.value
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        //console.log(+e.target.value)
        filtros.precio = +e.target.value
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () => {
        try{
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {

        // Limpiar los markers previos
        markers.clearLayers();
        
        propiedades.forEach(propiedad => {
            //Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng ], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-400 font-bold my-2-important">${propiedad.categoria.nombre}</p>
                <h1 class="text-lg font-extrabold uppercase mb-2">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase rounded-sm">Ver Propiedad</a>
            `)
            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        //console.log('Filtrando...')
        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )
        mostrarPropiedades(resultado)
        //console.log(resultado)
    }

 
    const filtrarCategoria = (propiedad) => {
        //console.log(propiedad.categoriaId)
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    }

    const filtrarPrecio = (propiedad) => {
        //console.log(propiedad.categoriaId)
        return filtros.precio ? propiedad.precioId === filtros.precio : propiedad
    }

    obtenerPropiedades()

})()