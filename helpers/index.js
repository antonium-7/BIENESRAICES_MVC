const esVendedor = (usuarioId, propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId
}

const formatearFecha = fecha =>{
    
    //console.log(fecha.toString())
    //console.log(/*typeof*/ new Date(fecha).toISOString().slice(0,10) )
    const nuevaFecha = new Date(fecha).toISOString().slice(0,10)

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)

}

export {
    esVendedor,
    formatearFecha
}