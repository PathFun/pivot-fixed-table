import Pivot from './components/Pivot.vue';
import './assets/styles/resize.css';
import './assets/styles/pivot.scss';

Pivot.install = function (Vue) {
  Vue.component(Pivot.name, Pivot);
};
export default Pivot;
