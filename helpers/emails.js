import nodemailer from 'nodemailer'


const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    // Enviar el mail
    await transport.sendMail({
        from: 'somos@ellab.digital',
        to: email,
        subject: 'Confirma tu Cuenta en BienesRaices.com',
        text: 'Confirma tu Cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlance: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

            <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
    
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    // Enviar el mail
    await transport.sendMail({
        from: 'somos@ellab.digital',
        to: email,
        subject: 'Restablece tu Password en BienesRaices.com',
        text: 'Restablece tu Password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, has solicitado restablecer tu password en BienesRaices.com</p>

            <p>Sigue el siguiente enlance para generar un password nuevo: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer password</a></p>

            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `
    })
    
}

export {
    emailRegistro,
    emailOlvidePassword
}