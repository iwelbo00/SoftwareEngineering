import axios from 'axios'

const INVENTORY_API_BASE_URL = 'http://localhost:8080/api/inventory'

class inventoryService{
    getInventory(){
        return axios.get(INVENTORY_API_BASE_URL + "/getInventory");
    }
    

}

export default new inventoryService()