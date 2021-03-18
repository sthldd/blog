import axios from 'axios'
import _ from 'lodash'
const pathToRegexp = require('path-to-regexp');
import { message} from 'antd'

// 添加一个请求拦截器
axios.interceptors.request.use(
    function (config) {
        let token = localStorage.getItem('token')
        if (token) {
            config.headers.common['token'] = token
        }
        let marketToken = localStorage.getItem('marketToken')
        if (marketToken) {
            config.headers.common['marketToken'] = marketToken
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// 添加一个响应拦截器
axios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        return Promise.reject(error)
    }
)
//@ts-ignore
const fetch = options => {
    let { method = 'get', data, fetchType, responseType, url } = options
    const cloneData = _.cloneDeep(data)

    try {
        let domin = ''
        if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
            domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
            url = url.slice(domin.length)
        }
        const match = pathToRegexp.parse(url)
        url = pathToRegexp.compile(url)(data)
        for (let item of match) {
            if (item instanceof Object && item.name in cloneData) {
                delete cloneData[item.name]
            }
        }
        url = domin + url
    } catch (e) {
        message.error(e.message)
    }

    switch (method.toLowerCase()) {
        case 'get':
            return axios.get(url, {
              params: cloneData
            })
        case 'delete':
            return axios.delete(url, {
                data: cloneData
            })
        case 'post':
            return axios.post(url, cloneData, { responseType })
        case 'put':
            return axios.put(url, cloneData)
        case 'patch':
            return axios.patch(url, cloneData)
        default:
            return axios(options)
    }
}
    //@ts-ignore
    export default function request (options) {
      return fetch(options)
        .then(response => {
            const { statusText, status } = response
            let data = response.data
            return data
        })
        .catch(error => {
          const { response } = error
          let msg
          let statusCode
          if (response && response instanceof Object) {
              const { data, statusText } = response
              statusCode = response.status
              if (statusCode === 401) {
                window.location.href = '/sign_in'
              } else if (statusCode === 403) {
                  msg = data.message || '无权限'
              } else {
                  msg = data.message || statusText
              }
          } else {
              statusCode = 600
              msg = error.message || 'Network Error'
          }

          throw { success: false, statusCode, message: msg }
      })
    }
