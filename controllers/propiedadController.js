import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js'
import { esVendedor, formatearFecha } from '../helpers/index.js'


const admin = async (req,res) => {

    //leer QueryString


    const { pagina: paginaActual } = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try{
        const {id} = req.usuario

        //Limites y Offset para el paginador

        const limit = 10;
        const offset = ((paginaActual * limit) - limit)

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit: limit,
                offset: offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { 
                        model: Categoria, 
                        as: 'categoria'
                    },
                    { 
                        model: Precio, 
                        as: 'precio'
                    },
                    { 
                        model: Mensaje, 
                        as: 'mensajes'
                    }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId : id
                }
            })
        ])


        res.render('propiedades/admin',{
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })
    }catch(error){
        console.log(error)
    }

}

//Formulario para crear una neuva propiedad
const crear = async (req,res) => {
    // Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear',{
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req,res) => {

    //Validación
    let resultado = validationResult(req)
    
    if(!resultado.isEmpty()) {

        // Consultar modelo de precio y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

            return res.render('propiedades/crear',{
                pagina: 'Crear Propiedad',
                csrfToken: req.csrfToken(),
                categorias,
                precios,
                errores: resultado.array(),
                datos: req.body
            })
    }

    // Crear un Registro

    const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body

    //console.log(req.usuario.id)
    const { id: usuarioId } = req.usuario

    try{
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        });

        const { id }= propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)
        //console.log('Propiedad creada exitosamente:', propiedadGuardada);
    } catch (error){
        console.log(error)
    }
}

const agregarImagen = async (req,res) => {

    const {id} = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad .findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    // Validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad pertence a quien visita esta página
    
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }
        //console.log(req.usuario.id)

        //console.log(propiedad.usuarioId)
    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imágenes: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req, res, next) => {

    const {id} = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad .findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    // Validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad pertence a quien visita esta página
    
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }
    
    try{
        console.log(req.file);
        //Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save();

        next();

    } catch(error){
        console.log(error)
    }
}

const editar = async (req,res) => {
    
    const { id } = req.params

    //validar que la propeidad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URL, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }
    
    // Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar',{
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req, res, ) =>{
    
    // Verificar la validación
    let resultado = validationResult(req)
    
    if(!resultado.isEmpty()) {
   
        // Consultar modelo de precio y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        
        return res.render('propiedades/editar',{
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }
    
    const { id } = req.params

    //validar que la propeidad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URL, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    // Reescribir el objeto y actualizarlo
    try{
        // Crear un Registro

        const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedad.save();

        res.redirect('/mis-propiedades')
        
    } catch(error){
        console.log(error)
    }
}

const eliminar = async (req,res) => {

    const {id} = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    // Revisar que quien visita la URL, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }
    //Eliminar una imágen
    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log(`Se eliminó la imagen ${propiedad.imagen}`)

    //Eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propidades')
        
}

//Modifica el estado de la propiedad
const cambiarEstado = async (req,res) => {
            //console.log('cambiando de estado...')
    const {id} = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    // Revisar que quien visita la URL, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    //Actualizar
            //console.log(propiedad)
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

                                            /*if(propiedad.publicado){
                                            propiedad.publicado = 0
                                        }else{
                                            propiedad.publicado = 1
                                        }*/

    res.json({
        resultado: true
    })

}

//Muestra una propiedad
const mostrarPropiedad = async (req,res) =>{

    const {id} = req.params

    // PARA MOSTRAR EL NULL POR CONSOLA Y VER CÓMO ASIGNAMOS QUE SALGA UN AVISO O NO, DE REGISTRARSE console.log(req.usuario)

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Precio,
                as: 'precio' 
            }
        ]
    });

    if(!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }

    //console.log( esVendedor(req.usuario?.id, propiedad.usuarioId))

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })


    /*const propiedades = await Propiedad.findAll({
        where: {
            usuarioId: id
        },
        include: [
            { 
                model: Categoria, 
                as: 'categoria'
            },
            { 
                model: Precio, 
                as: 'precio'
            }
        ]
    });*/

    
}

const enviarMensaje = async (req,res) =>{
    const {id} = req.params

    // PARA MOSTRAR EL NULL POR CONSOLA Y VER CÓMO ASIGNAMOS QUE SALGA UN AVISO O NO, DE REGISTRARSE console.log(req.usuario)

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Precio,
                as: 'precio' 
            }
        ]
    });

    if(!propiedad) {
        return res.redirect('/404')
    }

    // Renderizar los errores

    //Validación
    let resultado = validationResult(req)
    
    if(!resultado.isEmpty()) {
        return res.render('propiedades/mostrar', {
                propiedad,
                pagina: propiedad.titulo,
                csrfToken: req.csrfToken(),
                usuario: req.usuario,
                esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
                errores: resultado.array()
        })
    }
            //console.log( esVendedor(req.usuario?.id, propiedad.usuarioId))

            //console.log(req.body)
            //console.log(propiedad.categoriaId)
            //console.log(req.usuario)

    const { mensaje } = req.body
    const { id: propiedadId } = req.params
    const { id: usuarioId } = req.usuario
    //const { categoriaPast } = propiedad
    
    // Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId,
        //categoriaPast
    })

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        enviado: true
    })

    //setTimeout(() => {
        //res.redirect(`/categorias/${propiedad.categoriaId}`);
    //}, 2000);

}

//Leer los mensajes recibidos

const verMensajes = async (req, res) => {

    const {id} = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Mensaje, as: 'mensajes', 
                include: [
                    { model: Usuario.scope('eliminarPassword'), as: 'usuario' }
                ]
             }
        ]
    })

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    // Revisar que quien visita la URL, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}