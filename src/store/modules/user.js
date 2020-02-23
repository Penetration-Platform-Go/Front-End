import { login, getInfo, register, update } from '@/api/user'
import { setToken, removeToken, getToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    name: '',
    avatar: '',
    email: '',
    role: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_USER: (state, username) => {
    state.username = username
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username, password: password }).then(response => {
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        resolve()
      }).catch(error => {
        Message({
          message: 'Username or password wrong',
          type: 'error',
          duration: 5 * 1000
        })
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        if (data.username === 'admin') {
          commit('SET_ROLE', ['admin'])
        } else {
          commit('SET_ROLE', ['editor'])
        }
        commit('SET_USER', data.username)
        commit('SET_EMAIL', data.email)
        commit('SET_NAME', data.nickname)
        commit('SET_AVATAR', data.photo)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },
  register({ commit }, userInfo) {
    const { username, nickname, password, email } = userInfo
    return new Promise((resolve, reject) => {
      register({ username: username, password: password, nickname: nickname, email: email }).then(response => {
        Message({
          message: 'Register Successfully!',
          type: 'succuess',
          duration: 5 * 1000
        })
        resolve()
      }).catch(error => {
        Message({
          message: 'Username repeat.',
          type: 'error',
          duration: 5 * 1000
        })
        reject(error)
      })
    })
  },
  update({ commit }, userInfo) {
    const { username, nickname, email, avatar } = userInfo
    return new Promise((resolve, reject) => {
      update({ username: username, nickname: nickname, email: email, photo: avatar }).then(response => {
        Message({
          message: 'Update Information Successfully!',
          type: 'succuess',
          duration: 5 * 1000
        })
        commit('SET_USER', username)
        commit('SET_EMAIL', email)
        commit('SET_NAME', nickname)
        commit('SET_AVATAR', avatar)
        resolve()
      }).catch(error => {
        Message({
          message: 'Error!',
          type: 'error',
          duration: 5 * 1000
        })
        reject(error)
      })
    })
  },
  avatar({ commit }, path) {
    commit('SET_AVATAR', path)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

