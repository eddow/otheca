import './extensions/*'

function mapper(cls) {
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

// Both client use this to register the store (http or mongo)
export function initStore(str) {
	store = str;
	for(let m in models)
		mapper(models[m].default);
}
export var store;
