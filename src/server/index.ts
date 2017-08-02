import * as express from 'express';
import { mount, queryParser, Router } from 'js-data-express';
import { MongoDBAdapter } from 'js-data-mongodb';
import * as config from 'config'
import {store} from 'common/central'
import {join} from 'path'

// Create an instance of MongoDBAdapter
const adapter = new MongoDBAdapter(config.mongo);
store.registerAdapter('mongodb', adapter, { 'default': true });

const app = express();
app.use(express.static('dist/client'));
app.use(express.static('assets'));
require('~/common/models/*');
mount(app, store, '/api');
console.log('Listening...');
app.use(function(req, res) {
	res.sendFile('index.html', {root: join(__dirname, '../dist/client')});
});
export default app.listen(3482);
