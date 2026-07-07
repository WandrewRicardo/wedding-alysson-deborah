const presentesRepository = require('../repositories/presentesRepository.js')

async function listarPresentes () {
    try {
        const presentes = await presentesRepository.listarPresentes()
        return presentes;
    }
    catch (error) {
        return {
        status: 500,
        mensagem: "Erro ao acessar banco de dados"
        }
    }
}

async function reservarPresente(numero_convite, presenteId) {

    let presente
    let confirmacao
    let reserva

    try {

        presente = await presentesRepository.buscarPresente(presenteId)
        if (!presente) {
            return {
                status: 404,
                mensagem: "Presente não encontrado"
            }
        }

        confirmacao = await presentesRepository.buscarConfirmacao(numero_convite)
        if(!confirmacao) {
            return {
                status: 401,
                mensagem: "Você tem que confirmar a presença para reservar presente"
            }
        }

        reserva = await presentesRepository.buscarReserva(confirmacao)
        if(reserva) {
            return {
                status: 409,
                mensagem: "Você ja Reservou um presente, deseja reservar outro?",
            }
        }

        console.log("Antes de inserir reserva")
        await presentesRepository.adicionarReserva(confirmacao.id, presenteId)
        console.log("Reserva inserida")
    }catch(erro) {

        console.error(erro)

        return {
            status: 500,
            mensagem: "Erro ao acessar Banco de Dados"
        }
    }

    return{
        status: 200,
        mensagem: "Reserva Concluída!\nObrigado por contribuir no nosso sonho!"
    }

}

async function atualizarPresente(numero_convite, presenteId){

    await presentesRepository.atualizarPresente(numero_convite, presenteId)
    
    return  {
        status: 200,
        mensagem: "Reserva Atualizada!\nObrigado por Contribuir com nosso sonho!"
    }
}

module.exports = {
    listarPresentes, reservarPresente, atualizarPresente
}