
import {observeDeeply} from 'biz/js-data'
import './libs'

import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
Vue.use(VueRouter);
import access from 'biz/access'
Vue.prototype.$access = observeDeeply(access);

import * as components from './components/*.vue'
for(let c in components) {
	let component = components[c].default;
	Vue.component(component.options.name, component);
}

import App from './app.vue'
import routes from './routes'

var router = new VueRouter({
	mode: window.history && window.history.pushState?'history':'hash',
	routes
}),
root = new Vue({
	router,
	el: 'app',
	components: {App}
});
