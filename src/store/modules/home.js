import mockRequest from '@/utils/mockRequest'
export default {
  namespaced: true,
  actions: {
    // 发请求获取首页的 mock 数据
    async getData({ commit }) {
      const result = await mockRequest.get('/home/list')
      if (result.code == 200) {
        commit('GETDATA', result.data)
      }
    }
  },
  mutations: {
    GETDATA(state, list) {
      state.list = list
    }
  },
  state: {
    list: {}
  }
}