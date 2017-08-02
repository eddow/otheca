import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {store} from 'common/central'

@Model()
export class Book {
	@Property()
	title: string
	@Required()
	fileName: string
}

export const bookService = store.defineMapper('book');