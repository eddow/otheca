
import 'ts-json-schema-decorator'
import * as express from 'express';
import {MongoDBAdapter} from 'js-data-mongodb';
import * as config from 'config'
import {store, initStore} from 'common/central'
import {mount} from 'js-data-express';
import {Container} from 'js-data'
import * as routes from './routes'

initStore(new Container({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));
// Create an instance of MongoDBAdapter : change this line to use another adapter
store.registerAdapter('mongodb', new MongoDBAdapter(config.mongo), { 'default': true });

const app = express();
routes.statics(app);
mount(app, store, '/api');
routes.controllers(app);

console.log(`Listening on port ${config.server.port}`);
export default app.listen(config.server.port);
