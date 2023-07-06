import axios from "axios";
import _uniqBy from "lodash/uniqBy";

export default {
  // module
  namespaced: true,
  // data
  state: () => ({
    movies: [],
    message: 'Search for the movie title!',
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
      state.loading = false
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
      } catch(message) {
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

function _fetchMovies(payload) {
  const {title, type, year, page, id } = payload;
  const OMDB_API_KEY = '7035c60c';
  const url = id
  ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` // id가 있을 경우
  : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}` // id가 없을 경우

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((res) => {
        if(res.data.Error) {
          reject(res.data.Error)
        }
        resolve(res)
      })
      .catch((err) => {
        reject(err.message)
      })
  })
}