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
class BookFile {
	@Property() rel: string/*
	@Property() size: number
	@Property() mime: string*/
}
@Model()
export class Book extends Record {
	@Property()
	title: string
	@Property()
	authors: string[]
	@Property()
	keywords: string[]
	@Required()
	fileName: string
}

export const bookMapper = store.defineMapper('Book', {
	schema: Book.schema,
	recordClass: Book
});

