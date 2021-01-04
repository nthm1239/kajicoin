import axios from 'axios'

export default {
  getKajicoin(address) {
    return axios.get(`${process.env.VUE_APP_KAJICOIN_API_BASE_URL}/kajicoins?address=${address}`)
  },
  putKajicoin(address, ammount) {
    return axios.put(`${process.env.VUE_APP_KAJICOIN_API_BASE_URL}/kajicoins`, {
        address: address,
        ammount: ammount
      })      
    }
}