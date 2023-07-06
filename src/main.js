// import Vue from 'vue'
import { createApp } from 'vue'
import App from './App'
import router from './routes/index.js'
import store from './store/index.js'
import loadImage from './plugins/loadImage.js'

// Vue.createApp(App).mount('#App');
createApp(App)
  .use(router)
  .use(store)
  .use(loadImage)
  .mount('#app');