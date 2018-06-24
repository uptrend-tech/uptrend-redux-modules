import apisauce from 'apisauce'

const responseCheckStatus = response => {
  if (response.ok) {
    return response
  }

  const error = new Error(`${response.status} ${response.statusText}`)
  error.response = response
  throw error
}

const create = (baseURL = 'https://uptrend.tech/') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
    },
    timeout: 10000,
  })

  // response transforms
  api.addResponseTransform(responseCheckStatus)

  return {
    api,
    axiosInstance: api.axiosInstance,
  }
}

export default {
  create,
}
