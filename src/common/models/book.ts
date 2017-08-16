import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

@Model()
export class Edition {
	@Property() rel: string
	@Property() edition: string
}

export const Languages = {
	fr: 'French',
	en: 'English',
	ro: 'Romanian',
	hu: 'Hungarian'
};

@Model()
export default class Book extends Record {
	@Property() title: string
	@Enum(...Object.keys(Languages)) language: string
	@Items(String) authors: string[]
	@Items(String) tags: string[]
	@Items(Edition) files: Edition[]
}
