import {
	Table, Model, Definitions,
	Property, Required, Defined, Default, Format, Enum,
	Integer,
	MinLength, MaxLength,
	Items
} from 'ts-json-schema-decorator'
import {Record} from 'js-data'

/// Classes used in models don't need to be a `Record` as
/// they are not db-entities, but they still need a
/// schema, hence they are decorated by `@Model()`
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
	@Property() authors: string
	@Property() tags: string
	@Items(Edition) files: Edition[]
}
