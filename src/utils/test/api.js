import apisauce from 'apisauce'

const create = (baseURL = 'https://uptrend.tech/') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
    },
    timeout: 10000,
  })

  return {
    api,
    axiosInstance: api.axiosInstance,
  }
}

export default {
  create,
}
