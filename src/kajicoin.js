import axios from 'axios'

export default {
  getKajicoin(address) {
    return axios.get(`/kajicoins?address=${address}`)
  },
  putKajicoin(address, ammount) {
    return axios.put(`/kajicoins`, {
        address: address,
        ammount: ammount
      })      
    }
}