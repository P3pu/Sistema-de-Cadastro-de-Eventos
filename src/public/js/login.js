const URL_LOGIN = "http://localhost:4000"
const API_URL = process.env.NODE_ENV === 'production' ? 'https://sistema-de-cadastro-de-eventos.onrender.com' : URL_LOGIN;

const sendData = async (url,obj) => {
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

        if(response.ok && data.success){
            localStorage.setItem('user',JSON.stringify(data))
            console.log('redirecionamento para pagina de eventos')
            window.location.href = '/eventos'
        } else{
            alert('ERROR AO LOGAR!')
        }
        return data;
    } catch (error) {
        console.error('Rota login!')
        throw new Error(`Error: ${error.status | error.message}`); 
    }
}


const formLogin = document.querySelector('#formLogin')
formLogin.addEventListener('submit', async (e)=>{
    e.preventDefault()

    const formData = new FormData(formLogin)
    const obj = Object.fromEntries(formData)
    console.log(obj)
    await sendData(API_URL,obj)
    formLogin.reset()
})