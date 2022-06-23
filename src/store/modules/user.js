// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { resetRouter, anyRoute, asyncRoutes, constantRoutes } from '@/router'
// 引入 router
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比，最终需要展示的路由】
    resultAsyncRoutes: [],
    // 用户登录的最终路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 置空 state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 保存 token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 菜单权限的标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 用户头像信息
    state.avatar = userInfo.avatar
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // 保存当前用户的异步路由，注意，一个用户需要展示完成的路由：常量、异步、任意
    state.resultAsyncRoutes = asyncRoutes
    // 得到最终用户可以展示的路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoute)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // 注意：当前登陆请求现在使用 mock 数据，mock 数据 code 是 20000
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      /* 
        获取用户信息：返回的数据包含（
        用户名name、用户头像avater、返回的标识routes【不同的用户应该展示哪些菜单】、
        role（用户角色信息）、button【按钮的信息，按钮权限的标记】）
      */
      getInfo(state.token).then(response => {
        const { data } = response
        // 存储用户的全部的信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  async logout({ commit, state }) {
    let result = await logout(state.token)
    if (result.code == 20000) {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return new Promise.reject(new Error('fail'))
    }
  },

  async resetToken({ commit }) {
    try {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      return 'ok'
    } catch (error) {
      return new Promise.reject(new Error(error.message))
    }
  }
}

// 定义一个函数，两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

