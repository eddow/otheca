import {libFiles, sendFile, delFile, uplFiles} from './controllers/dlib'
import {join} from 'path'
import * as express from 'express';

export function statics(app) {
	app.use(express.static('dist/client'));
	app.use(express.static('assets'));

	app.get('/themes/*', (req, res)=> {
		res.sendFile(req.params[0].split('?')[0], {
			root: join(__dirname, '../node_modules/semantic-ui/dist/themes/')
		});
	});
}

export function controllers(app) {	
	app.get('/lib', (req, res)=> {
		res.send(libFiles);
	});
	app.get('/lib/*', (req, res)=> {
		sendFile(res, req.params[0]);
	});
	app.delete('/lib/*', (req, res)=> {
		delFile(res, req.params[0]);
	});
	app.post('/lib', uplFiles);
	
	//SPA: in last resort, just send `index.html` as the path is a client-side path
	app.use(function(req, res) {
		res.sendFile('index.html', {root: join(__dirname, '../dist/client')});
	});
}
