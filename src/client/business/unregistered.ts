import axios from 'axios'
import {store} from 'common/central'

const unregisteredList = [];
export default unregisteredList;

const books = store.getCollection('Book');
var lib = null;
Promise.all([
	axios('/lib').then(response=> {
		var raw = response.data;
		lib = {};
		for(let rel in raw) {
			let analysis = /^(.*)\.([^\.]{2,4})/.exec(raw[rel].name),
				name = analysis[1], key = name.comparable();
			(lib[key] || (lib[key] = {files: [], name, rel})).files.push({rel, extension: analysis[2], ...raw[rel]});
		}
	}),
	store.findAll('Book')
]).then(compute);
books.on('all', compute);

function compute() {
	var files = {},
		unregistered = Object.values(lib).map(x=>({
			creating: {
				title: '',
				edition: '',
				language: 'en',
				authors: [],
				tags: []
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
