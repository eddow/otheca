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
//import manually as fuse-box doesn't import when referenced only in .vue
import 'vue-property-decorator'
import 'axios'

import * as Vue from 'vue'
import * as ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
import VueRouter = require('vue-router')
Vue.use(VueRouter);
import * as App from './app.vue'
import routes from '~/client/routes'
var router = new VueRouter({
	mode: window.history && window.history.pushState?'history':'hash',
	routes
}),
root = new Vue({
	router,
	//template: '<app></app>',
	el: 'app',
	components: {App}
});