import {mount} from 'js-data-express';

export default function jsData(app, sockets, store) {
	mount(app, store, '/api');
	store.on('all', function(event, collection, id, data, ...args) {
		if(!/^before/.test(event)) {
			event = /^(?:after)?(.*)$/.exec(event)[1].toLowerCase();
			switch(event) {
				case 'update' :
					sockets.emit('js-data', event, collection, id, data);
					break;
				default:
					sockets.emit('js-data', event, collection, id, data, ...args);
					break;
			}
		}
	});
}