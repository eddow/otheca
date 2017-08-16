export function initStore(str) {
	store = str;
	for(let m in models)
		mapper(models[m].default);
}
export var store;
const punctuation = /[\t\.\,\-\_\'\"\!\?\>\<\(\)\&]/g;
__assign(String.prototype, {
	comparable() {
		var dups = 0, rv = this.replace(punctuation, ' ').latinise().toLowerCase().split(' ');
		rv.sort();
		while(dups<rv.length-1)
			if(rv[dups]===rv[dups+1]) rv.splice(dups, 1);
			else ++dups;
		return (rv[0]?rv:rv.slice(1)).join(' ');
	}
});

export function mapper(cls) {
	cls.schema.properties._id = {
		type: 'string',
		enumerable: false,
		indexed: true	//used in Collection to create Index
	};
	return store.defineMapper(cls.name, {
		schema: cls.schema,
		recordClass: cls
	});
}


import * as models from './models/*'
