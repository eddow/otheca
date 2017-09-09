import axios from 'axios'
import {store} from 'common/central'
import {socket} from './js-data'

const unregisteredList = [];
export default unregisteredList;

function analyseName(name) {
	let analysis = /([^\\\/]*)\.([^\.]{2,4})/.exec(name);
	return {
		name: analysis[1],
		key: analysis[1].comparable(),
		ext: analysis[2]
	}
}

import {bindCollection} from 'biz/js-data'
const books = bindCollection('Book');
var lib = null;
Promise.all([
	axios('/lib').then(response=> {
		var raw = response.data || {};
		lib = {};
		for(let rel in raw) {
			let analysis = analyseName(raw[rel].name);
			(lib[analysis.key] || (lib[analysis.key] = {files: [], name: analysis.name, rel}))
				.files.push({rel, extension: analysis.ext, ...raw[rel]});
		}
	}),
	store.findAll('Book')
]).then(()=> {
	compute();
	books.on('all', compute);
});

function compute() {
	var files = {},
		unregistered = Object.values(lib).map(x=>({
			creating: {
				title: '',
				edition: '',
				language: 'en',
				authors: '',
				tags: ''
			},
			...x
		}));
	books.forEach(element => {
		for(let file of element.files) files[file.rel] = true;
	});
	for(let i = 0; i<unregistered.length;) {
		let libu = unregistered[i];
		libu.files = libu.files.filter(f=> !files[f.rel]);
		if(libu.files.length) ++i;
		else unregistered.splice(i, 1);
	}
	unregisteredList.length = 0;
	unregisteredList.push(...unregistered);
}

export function delFile(rel) {
	axios.delete('/lib/'+rel).then(response=> {
		if(204=== response.status) {
			//done in socket.io
		}
	});
}

socket.on('dlib', function(event, rel, raw?) {
	let analysis = analyseName(rel);
	switch(event) {
		case 'add':
			(lib[analysis.key] || (lib[analysis.key] = {files: [], name: analysis.name, rel}))
				.files.push({rel, extension: analysis.ext, ...raw[rel]});
			compute();
			break;
		case 'del':
			let files = lib[analysis.key] && lib[analysis.key].files;
			if(files) {
				files = lib[analysis.key].files = files.filter(x=> x.rel !== rel);
				if(!files.length) delete lib[analysis.key];
				compute();
			}
			break;
	}
})
