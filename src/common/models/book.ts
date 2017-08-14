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
export class Edition {
	@Property() rel: string
	@Property() edition: string
}

@Model()
export class Book extends Record {
	@Property() title: string
	@Enum('fr', 'en', 'ro', 'hu') language: string
	@Items(String) authors: string[]
	@Items(String) tags: string[]
	@Items(Edition) files: Edition[]
}

mapper(Book);

export const Languages = {
	fr: 'French',
	en: 'English',
	ro: 'Romanian',
	hu: 'Hungarian'
};
