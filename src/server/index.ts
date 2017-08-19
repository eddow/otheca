
import 'ts-json-schema-decorator'
import * as express from 'express';
import {mount, queryParser, Router} from 'js-data-express';
import {MongoDBAdapter} from 'js-data-mongodb';
import * as config from 'config'
import {store, initStore} from 'common/central'
import {Container} from 'js-data'
import {join} from 'path'
import {libFiles, sendFile} from './dlib'

initStore(new Container({
	mapperDefaults: {
		idAttribute: '_id'
	}
}));
// Create an instance of MongoDBAdapter
const adapter = new MongoDBAdapter(config.mongo);
store.registerAdapter('mongodb', adapter, { 'default': true });
const app = express();
app.use(express.static('dist/client'));
app.use(express.static('assets'));

app.get('/lib', (req, res)=> {
	res.send(libFiles);
});
app.get('/lib/*', (req, res)=> {
	sendFile(res, req.params[0]);
});
app.get('/fonts/*', (req, res)=> {
	res.sendFile(req.params[0].split('?')[0], {
		root: join(__dirname, '../node_modules/font-awesome/fonts/')
	}, (err)=> {
		if(err) res.sendFile(req.params[0].split('?')[0], {
			root: join(__dirname, '../node_modules/element-ui/lib/theme-default/fonts/')
		});
	});
});

mount(app, store, '/api');
console.log('Listening...');
app.use(function(req, res) {	//SPA
	res.sendFile('index.html', {root: join(__dirname, '../dist/client')});
});
export default app.listen(config.server.port);
