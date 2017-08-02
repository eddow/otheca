import {HttpAdapter} from 'js-data-http'
import * as config from 'config'
import {store} from 'common/central'

// pass options to the constructor
const httpAdapter = new HttpAdapter(config.http);
store.registerAdapter('http', httpAdapter, { 'default': true });
import 'vue-property-decorator'

import * as Vue from 'vue'
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