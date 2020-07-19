const Axios = require('axios')
const baseUrl = 'http://localhost:3001/api/games/'

const create = async () => {
  const response = await Axios.post(baseUrl)
  return response.data
}

const get = async (id) => {
  const response = await Axios.get(baseUrl + id)
  return response.data
}

export default { create, get }