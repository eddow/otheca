import {libFiles, sendFile} from './controllers/dlib'
import {join} from 'path'
import * as express from 'express';

export function statics(app) {
	app.use(express.static('dist/client'));
	app.use(express.static('assets'));
	
	app.get('/fonts/*', (req, res)=> {
		res.sendFile(req.params[0].split('?')[0], {
			root: join(__dirname, '../node_modules/font-awesome/fonts/')
		}, (err)=> {
			if(err) res.sendFile(req.params[0].split('?')[0], {
				root: join(__dirname, '../node_modules/element-ui/lib/theme-default/fonts/')
			});
		});
	});

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
	
	//SPA: in last resort, just send `index.html` as the path is a client-side path
	app.use(function(req, res) {
		res.sendFile('index.html', {root: join(__dirname, '../dist/client')});
	});
}
