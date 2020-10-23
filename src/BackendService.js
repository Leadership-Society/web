import axios from "axios";
const API = "https://leadership-library.herokuapp.com/api"; //+ books
var _ = require('lodash');
import { Loading } from 'quasar';

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

    async submitDetails(details) {
        Loading.show();
        return axios.post(`${API}/reservations`, details)
            .then((res) => {
                if (res) {
                    Loading.hide();
                    return { success: true };
                }
            })
            .catch((err) => {
                if (err) {
                    Loading.hide();
                    return { success: false, message: err.message }
                }
            })
    }
}