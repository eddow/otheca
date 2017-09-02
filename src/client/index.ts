import {HttpAdapter} from 'js-data-http'
import * as config from 'config'
import {store, initStore} from 'common/central'
import {Record, DataStore} from 'js-data'

initStore(new DataStore({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));
//TODO: make a generic observe based on schema
function observeDeeply(obj) {
	for(let i in obj) {
		if(obj[i] && 'object'=== typeof obj[i])
			observeDeeply(obj[i]);
		Vue.util.defineReactive(obj, i, obj[i]);
	}
}

store.on('all', function(event, name, param) {
	console.log.apply(console, arguments);
	//Records are here observed by Vue. Without this, their properties are never observed
	if('add'=== event && param && param.length)
		observeDeeply(param);
});
// patch js-data to have `changesOnly: true` by default.
const RecordSave = Record.prototype.save;
Record.prototype.save = function(opts?) {
	return RecordSave.call(this, {changesOnly: true, ...(opts||{})});
}

// pass options to the constructor
const httpAdapter = new HttpAdapter({
	...config.http/*,
	afterUpdate(mapper, id, changes, opts, response) {
		if(opts.changesOnly) {
					//todo: find record from id and update it from returned info
			var record = cruds[mapper.endpoint].get(id);
			record.set(response);
			record.commit();
			return record;
		}
	}*/
});
store.registerAdapter('http', httpAdapter, { 'default': true });
import './libs'

import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
Vue.use(VueRouter);
import semanticVue from 'v-semantic'
Vue.use(semanticVue);

import * as alertify from 'alertify'
semanticVue.alertify(alertify);
import 'alertify.js/dist/css/alertify.css'

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
