import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api-dashboard.maot.dev/api'
})

const api2 = axios.create({
    baseURL: 'https://api-dashboard.maot.dev/'
})



export {api, api2};

