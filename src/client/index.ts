import {HttpAdapter} from 'js-data-http'
import * as config from 'config'
import {store, initStore} from 'common/central'
import {DataStore} from 'js-data'

initStore(new DataStore({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));
store.on('all', console.log);
// pass options to the constructor
const httpAdapter = new HttpAdapter(config.http);
store.registerAdapter('http', httpAdapter, { 'default': true });
import './libs'

import * as Vue from 'vue'
import * as ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, {locale})
import VueRouter = require('vue-router')
Vue.use(VueRouter);

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
