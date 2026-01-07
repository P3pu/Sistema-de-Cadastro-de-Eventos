const URL_CADASTRO = 'http://localhost:4000/cadastro'
const API_URL = process.env.NODE_ENV === 'production' ? 'https://sistema-de-cadastro-de-eventos.onrender.com' : URL_CADASTRO;


const sendData = async (url, obj) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })

        if (!response.ok) {
                throw new Error(`Error: ${response.status}`); 
        }

        const data = await response.json()
        return data
    } catch (error) {
 throw new Error(`Error: ${error}`); 
    }
}

const formCadastro = document.querySelector('#formCadastro')

formCadastro.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const formData = new FormData(formCadastro)
    const obj = Object.fromEntries(formData)
    console.log(obj)

    await sendData(API_URL,obj)
    formCadastro.reset()
    window.location.href = '/eventos'
})

