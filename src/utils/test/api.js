import apisauce from 'apisauce'

const create = (baseURL = 'https://uptrend.tech/') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
    },
    timeout: 10000,
  })
  // const getRate = () => api.get('rate_limit')

  return {
    api,
    // getRate,
    axiosInstance: api.axiosInstance,
  }
}

export default {
  create,
}
