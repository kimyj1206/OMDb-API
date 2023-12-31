import axios from "axios";
import _uniqBy from "lodash/uniqBy";

const _defaultMessage = 'Search for the movie title!'

export default {
  // module
  namespaced: true,
  // data
  state: () => ({
    movies: [],
    message: _defaultMessage,
    loading: false,
    theMovie: {}
  }),
  // computed
  getters: {},
  // methods
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = [],
      state.loading = false,
      state.message = _defaultMessage
    }
  },
  // 비동기
  actions: {
    async searchMovies({ state, commit }, payload) {
      if(state.loading) {
        return

      }
      commit('updateState', {
        message: '',
        loading: true
      })

      try {
        const res = await _fetchMovies({
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          // 고유화된 새로운 배열을 movies에 반환
          movies: _uniqBy(Search, 'imdbID')
        })
        console.log(totalResults);
        console.log(typeof totalResults);
  
        const total = parseInt(totalResults, 10);
        const pageLength = Math.ceil(total / 10);
  
        // 추가 요청
        if(pageLength > 1) {
          for(let page = 2; page <= pageLength; page++) {
            if(page > (payload.number / 10)) { break }
            const res = await _fetchMovies({
              ...payload,
              page
            })
            const { Search } = res.data
            commit('updateState', {
              movies: [
                ...state.movies,
                ..._uniqBy(Search, 'imdbID')
              ]
            })
          }
        }
      } catch({ message }) {
        commit('updateState', {
          movies: [],
          message
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    },
    async searchMovieWithId({ state, commit }, payload) {
      if(state.loading) {
        return
      }
      commit('updateState', {
        theMovie: {},
        loading: true
      })

      const { id } = payload
      try {
        const res = await _fetchMovies({ id })
        commit('updateState', {
          theMovie: res.data
        })
      } catch(error) {
        commit('updateState', {
          theMovie: {}
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  }
}

async function _fetchMovies(payload) {
  return await axios.post('/.netlify/functions/movie', payload)
}