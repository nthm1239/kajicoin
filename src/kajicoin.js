import axios from 'axios'
import jwt from 'jsonwebtoken'

function getAuthorizeHeader(uid) {
  return jwt.sign({'uid' : uid}, process.env.VUE_APP_KAJICOIN_API_JWT_PVT_KEY);
}

export default {
  getKajicoin(uid, address) {
    return axios.get(`${process.env.VUE_APP_KAJICOIN_API_BASE_URL}/kajicoins?address=${address}`,
    {
      headers: {
        'x-access-token' : `Bearer ${getAuthorizeHeader(uid)}`
      }
    })
  },
  putKajicoin(uid, address, ammount) {
    return axios.put(`${process.env.VUE_APP_KAJICOIN_API_BASE_URL}/kajicoins`,
    {
      address: address,
      ammount: ammount
    },
    {
      headers: {
        'x-access-token' : `Bearer ${getAuthorizeHeader(uid)}`
      }
    })      
  }
}