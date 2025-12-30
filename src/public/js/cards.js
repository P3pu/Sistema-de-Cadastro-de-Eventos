const createCards = async (eventName)=>{
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
}