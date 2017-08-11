export function initStore(str) {
	store = str;
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

export function standardised(schema) {
	schema.properties._id = {
		type: 'string',
		enumerable: false,
		indexed: true	//used in Collection to create Index
	};
	return schema;
}

export function mapper(cls) {
	return store.defineMapper(cls.name, {
		schema: standardised(cls.schema),
		recordClass: cls
	});
}