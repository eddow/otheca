import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'
import {store} from 'common/central'

@Model()
export class Book extends Record {
	@Property() title: string
	@Property() authors: string[]
	@Property() keywords: string[]
	@Required() files: string[]
}

export const bookMapper = store.defineMapper('Book', {
	schema: Book.schema,
	recordClass: Book
});

