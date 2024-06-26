document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.item-form');
    const formsDelete = document.querySelectorAll('.item-form-delete'); //="http://localhost:8080/api/carts/{{../user.cart}}/products/{{pid._id}}"

    forms.forEach(form => {  
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = form.getAttribute('data-id');
            const cart = form.getAttribute('data-cart');
            console.log(cart)
            try {
                const response = await fetch(`/api/carts/${cart}/product/${id}`, {
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

    formsDelete.forEach(form => {  
        form.addEventListener('submit', async (e) => {
            const pid = form.getAttribute('data-pid');
            const cart = form.getAttribute('data-cart');
            try {
                const response = await fetch(`/api/carts/${cart}/products/${pid}`, {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

            } catch (error) {
                console.error('Hubo un error en la operacion fetch:', error);
                alert('Error al eliminar el producto');
            }
        })
    })
})