document.addEventListener('DOMContentLoaded', () => {    
    const url = "/api/carts/66537daae5da13c6700a723a/product/";
    const forms = document.querySelectorAll('.item-form');

    forms.forEach(form => {  
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = form.getAttribute('data-id');
            
            try {
                const response = await fetch(`${url}${id}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                const responseData = await response.json();
                if(responseData.result == 'success')
                    alert('Producto agregado con éxito!');
                else
                    alert(responseData.error);
            } catch (error) {
                console.error('Hubo un error en la operacion fetch:', error);
                alert('Error al agregar el producto');
            }
        })
    })
})