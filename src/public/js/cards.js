const createCards = async (eventName) => {
    const container = document.querySelector('.container-section')
    const card = document.createElement('div')
    const icons = document.createElement('div')

    const iconEdit = document.createElement('div')
    const iconTrash = document.createElement('div')
    const imgEdit = document.createElement('img')
    const imgTrash = document.createElement('img')
    const title = document.createElement('h1')

    card.classList.add('card')
    icons.classList.add('icons')
    iconEdit.classList.add('icon')
    iconTrash.classList.add('icon')

    imgEdit.src = 'img/edit.svg'
    imgTrash.src = 'img/trash.svg'
    title.textContent = eventName

    iconEdit.appendChild(imgEdit)
    iconTrash.appendChild(imgTrash)
    icons.appendChild(iconEdit)
    icons.appendChild(iconTrash)
    card.appendChild(title)
    card.appendChild(icons)
    container.appendChild(card)
}

async function buscarEventos() {
    try {
        const response = await fetch('http://localhost:4000/dados/eventos', {
            method: 'GET',
            credentials: 'include'
        })

        if (!response.ok) {
            console.error('Error ao buscar dados ')
        }

        const results = await response.json()
        console.log(`${results.Data.length} Eventos recebidos`)
        console.log('Dados recebidos:', results.Data[0].eventInfo.eventName);

        return results.Data

    } catch (error) {
        console.error(error.message)
    }
}

async function eventos() {
    const eventos = await buscarEventos()
    for (let index = 0; index < eventos.length; index++) {
        console.log(eventos[index].eventInfo.eventName)
        const card = await createCards(eventos[index].eventInfo.eventName)
    }
}
 eventos()

