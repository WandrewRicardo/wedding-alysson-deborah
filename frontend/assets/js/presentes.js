function menuHamburguer() {
    const btnMenu = document.querySelector('.btn-menu');
    const navItems = document.querySelector('.nav-items');
    const btnClose = document.querySelector('.btn-close');

    btnMenu.addEventListener('click', () => {
        navItems.classList.toggle('active')
    });

     btnClose.addEventListener('click', ()=>{
        navItems.classList.remove('active');
        btnClose.classList.remove('active');
    });
}

async function listarPresentes() {
    const numero_convite = sessionStorage.getItem("numero_convite")

    const response = await fetch(`/api/presentes?numero_convite=${numero_convite}`)

    const presentes = await response.json()

    const gridPresentes = document.querySelector('.grid-presentes')

    gridPresentes.innerHTML = ''
    
    presentes.forEach((presente) => {

        const disponiveis = presente.quantidade - presente.reservados
        const card = document.createElement('article')
        const actions = document.createElement('div')

        card.classList.add('card-presente')
        card.innerHTML = `
            <img src = "assets/img/presentes/${presente.imagem}" alt = "${presente.nome}">
            <h3>${presente.nome}</h3>
        `
        actions.classList.add('card-actions')
        actions.innerHTML = `
        <button class="btn-reservar" data-presentes-id="${presente.id}">RESERVAR ESTE</button>
        <span class="icone-coracao">♡</span>
        `
        card.appendChild(actions)
        const botao = actions.querySelector('.btn-reservar')

        if(presente.minhaReserva === true) {
            botao.classList.add('minha-reserva')
            botao.textContent = 'RESERVADO'
        }

        else if (disponiveis <= 0) {

            botao.classList.add('reservado')
            botao.textContent = 'ESGOTADO'
        }

        gridPresentes.appendChild(card)

    }); 
    reservaPresentes()
        
}

async function reservaPresentes () {

    const numero_convite = sessionStorage.getItem("numero_convite")

    const btnReservar = document.querySelectorAll('.btn-reservar')

    btnReservar.forEach((btn) => {
        btn.addEventListener('click', async (event) => {
           const presenteId = event.target.dataset.presentesId
            
           const objJson = {numero_convite, presenteId}
           const response = await fetch ("/api/presentes", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(objJson)
           })

           const dados = await response.json()
           console.log(dados)
           if(response.status === 409) {
                const confirmacao = await Swal.fire({
                    title: "Deseja Continuar?",
                    text: dados.mensagem,
                    icon: "question",
                    showCancelButton: true
                })

                if(!confirmacao.isConfirmed) {
                    return console.log('cancelado atualização ')
                }

                await fetch ("/api/presentes", {
                    method: "PUT",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(objJson)

                })
                return listarPresentes()
           }
           

           if (response.ok) {
                Swal.fire({
                    title: "Muito Obrigado",
                    text: dados.mensagem,
                    icon: 'success'
                })
                listarPresentes()

           }else {
                Swal.fire({
                    title: "Erro!",
                    text: dados.mensagem,
                    icon: 'error'
                })
           }
           
        })
    })
}

menuHamburguer();
listarPresentes();

