import axios from "axios";
const API = "https://leadership-library.herokuapp.com/api"; //+ books
var _ = require('lodash');

export default class BackendService {


    async getAllBooks() {
        return axios.get(`${API}/books`)
            .then((res) => {
                if (res) {
                    return res.data;
                }
            })
            .catch((err) => {
                if (err) {
                    return err.message;
                }
            })
    }
}