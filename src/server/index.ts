
import 'ts-json-schema-decorator'
import * as express from 'express';
import {MongoDBAdapter} from 'js-data-mongodb';
import * as config from 'config'
import {store, initStore} from 'common/central'
import {Container} from 'js-data'
import * as routes from './routes'
import {unwatchDlib} from './controllers/dlib'
import * as io from 'socket.io'

initStore(new Container({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));
// Create an instance of MongoDBAdapter : change this line to use another adapter
store.registerAdapter('mongodb', new MongoDBAdapter(config.mongo), { 'default': true });

const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
routes.statics(app, io.sockets);
import jsData from './controllers/js-data'
jsData(app, io.sockets, store);
routes.controllers(app, io.sockets);
console.log(`Listening on port ${config.server.port}`);
var listener = server.listen(config.server.port);
export default {
	close() {
		listener.close();
		unwatchDlib();
	}
};
