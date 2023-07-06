import { createRouter, createWebHashHistory } from "vue-router";
import Home from './Home'
import Movie from './Movie'
import About from './About'

export default createRouter({
  // Hash
  // https://google.com/#/about
  history: createWebHashHistory(),
  // pages
  // https://google.com/
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/movie/:id',
      component: Movie
    },
    {
      path: '/about',
      component: About
    }
  ]
})