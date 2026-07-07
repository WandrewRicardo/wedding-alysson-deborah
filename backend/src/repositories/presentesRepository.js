const pool = require('../db/index.js')

async function listarPresentes () {

    const presentes = await pool.query (`
        SELECT 
            presentes.id,
            presentes.nome,
            presentes.imagem,
            presentes.quantidade,
            COUNT(reservas.id) AS reservados
        FROM presentes
        LEFT JOIN reservas
        ON presentes.id = reservas.presente_id
        GROUP BY
            presentes.id,
            presentes.nome,
            presentes.imagem,
            presentes.quantidade;
    `)

    return presentes.rows;
}

async function buscarPresente(presenteId) {

    const presente = await pool.query (
        'SELECT * FROM presentes WHERE id = $1', [presenteId]
    )

    return presente.rows[0]
}

async function buscarConfirmacao(numero_convite) {
    console.log(numero_convite)
    const convite = await pool.query (
        'SELECT * FROM convites WHERE numero_convite = $1',
        [numero_convite]
    )
    console.log(convite.rows)
    const confirmacao = await pool.query(
        'SELECT * FROM confirmacoes WHERE convite_id = $1', [convite.rows[0].id]
    )

    return confirmacao.rows[0]
}

async function buscarReserva(confirmacao) {

    const reserva = await pool.query(
        'SELECT * FROM reservas WHERE confirmacao_id = $1',
        [confirmacao.id]
    )

    return reserva.rows[0]
}

async function adicionarReserva (confirmacaoId, presenteId) {

    const reserva = await pool.query(
        'INSERT INTO reservas (confirmacao_id, presente_id) VALUES ($1, $2)',[confirmacaoId, presenteId]
    )
}

async function atualizarPresente(numero_convite, presenteId) {

    const convite = await pool.query(
        'SELECT * FROM convites WHERE numero_convite = $1',[numero_convite]
    )

    const confirmacao = await pool.query(
        'SELECT * FROM confirmacoes WHERE convite_id = $1', [convite.rows[0].id]
    )

    const reserva = await pool.query(
        'UPDATE reservas SET presente_id = $1 WHERE confirmacao_id = $2',
        [presenteId, confirmacao.rows[0].id]
    )

}

module.exports = {
    listarPresentes, buscarPresente, buscarConfirmacao, buscarReserva, adicionarReserva, atualizarPresente
}