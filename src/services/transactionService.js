import axios from 'axios'

const TRANSACTIONS_API_BASE_URL = 'http://localhost:8080/api/transaction'

class transactionService {
    getTransaction() {
        return axios.get(TRANSACTIONS_API_BASE_URL + "/getTransaction")
    }
}
export default new transactionService()