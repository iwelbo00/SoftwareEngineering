import axios from 'axios'

const USERS_API_BASE_URL = 'http://localhost:8080/api/users/'

class userService {
    async getUsers(username, password) {
        const tempUser = {
            username: username,
            passwordHash: password
        }
        var temp;
        await axios.post(USERS_API_BASE_URL + "login", tempUser)
            .then(data => {
                temp = data;
            }).catch(error => {
                console.error("Error:", error);
                return false;
            });
        return temp;
    }

    async registerAccount(user) {
        var parser = false;
        await axios.post(USERS_API_BASE_URL + "register", user)
            .then(data => {
                if (data.status >= 200 && data.status <= 300) {
                    parser = true;
                } else {
                    parser = false;
                }
            }).catch(error => {
                console.error("Error: ", error);
                parser = false;
            })
        if (parser == true) {
            return true;
        } else {
            return false;
        }

    }

}


export default new userService()