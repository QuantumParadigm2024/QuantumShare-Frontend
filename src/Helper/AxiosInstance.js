import axios from "axios";

let axiosInstance = axios.create({
    // baseURL: "https://qs.quantumparadigm.in:1222/" // qsapptest for app
    baseURL:"https://qs.quantumparadigm.in:7532/"
    // baseURL: "http://localhost:7532",
})

export default axiosInstance;