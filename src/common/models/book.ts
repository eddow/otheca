import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'
import {mapper} from 'common/central'

@Model()
export class Book extends Record {
	@Property() title: string
	@Enum('fr', 'en', 'ro', 'hu') language: string
	@Items(String) authors: string[]
	@Items(String) tags: string[]
	@Items(String) files: string[]
}

export const bookMapper = mapper(Book);

