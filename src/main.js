import Vue from 'vue';
import App from './App.vue';
import './assets/styles/resize.css';
import './assets/styles/pivot.scss';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
