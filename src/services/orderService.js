import axios from 'axios'

const ORDERS_API_BASE_URL = 'http://localhost:8080/api/orders/'

class orderServce {
    getOrders(username) {
        const user = {
            username: username
        }
        console.log(user);
        return axios.post(ORDERS_API_BASE_URL + "findByUsername", user);
    }

    placeOrder(username, items) {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        items.forEach(element => {
            const order = {
                user: {
                    username: username
                },
                quantity: element.minimumCreation,
                orderDate: `${month}/${day}/${year}`,
                cost: element.cost,
                inventory: {
                    itemId: element.itemId,
                    recipe: {
                        recipeId: element.recipeId.recipeId
                    }
                }
            }
            axios.post(ORDERS_API_BASE_URL + "makeOrder", order).then(
                data => {
                    return data;
                }
            ).catch(error =>{
                console.log(error);
                return error;
            })
        });
    }

}

export default new orderServce()