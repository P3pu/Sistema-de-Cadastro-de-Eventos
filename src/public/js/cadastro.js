const sendData = async (URL, jsonData) => {
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    
    if (!response.ok) {
        throw new Error(`Erro ao enviar dados: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
}

const cleanInput = async() =>{
    // limpar input
}

document.querySelector('#form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target); // ✅ Mudança aqui
    const jsonData = Object.fromEntries(formData.entries());

    try {
        await sendData('http://localhost:4000/cadastro', jsonData);
    } catch (error) {
        console.error('Falha no cadastro:', error);
    }
});
