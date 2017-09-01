<template>
	<div>
		<s-table
			:rows="unregistered"
			striped
			body-height="250"
			highlight-current-row
			v-model="selected"
			style="width: 100%">
			<s-column
				property="name"
				header="Name">
			</s-column>
			<s-column
				header="Files"
				width="180"
			>
				<template scope="scope">
					{{scope.row.files.map(x=>x.extension).join(', ')}}
				</template>
			</s-column>
		</s-table>
		<s-form :model="selected && selected.creating" label-width="120px" style="width: 100%">
			<template slot="input" scope="field">
				<keyworded :keywords="kws" />
			</template>
			<s-field label="Edition" property="edition"/>
			
			<s-tabs v-model="targetBook">
				<s-panel title="Existing" name="existing">
					<books-list v-model="existing" />
				</s-panel>
				<s-panel title="Create new" name="create">
					<s-field label="Title" property="title" />
					<s-field label="Language" property="language">
						<s-select>
							<s-option
								v-for="(txt, val) in languages" :key="val"
								:value="val"
								:text="txt"
							>
						</s-select>
					</s-field>
					<s-field label="Authors" property="authors">
						<kwd-list :keywords="kws" />
					</s-field>
					<s-field label="Tags" property="tags">
						<kwd-list :keywords="kws" />
					</s-field>
				</s-panel>
			</s-tabs>
			<s-button @click="register" icon="save">
				Register
			</s-button>
		</s-form>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book, {Languages} from 'models/book'
import unregistered from '../business/unregistered'

@Component
export default class Register1 extends Vue {
	unregistered: any[] = unregistered
	selected: any = null
	kws: string[]
	languages: any = Languages
	targetBook: string = 'existing'
	existing: Book = null
	register() {
		var info = this.selected,
			itm = new Book({
				...info.creating,
				files: info.files.map(x=> ({
					rel: x.rel,
					edition: info.creating.edition
				})),
				authors: info.creating.authors.filter(x=>!!x.trim()),
				tags: info.creating.tags.filter(x=>!!x.trim())
			});
		itm.save();
	}
	@Watch('selected')
	select(book) {
		if(book) {
			this.kws = book.files[0].rel
				.replace(/\%(\w{2})/g, (match, capture)=> String.fromCharCode(Number.parseInt(capture, 16)))
				/*.replace(/_/g, ' ')*/.split(/[\/\-\.\_]/g).map(v=> v.trim());
			this.kws.pop();	//removes extension
			if(!book.creating) book.creating = {
				language: 'en'/*,
				authors: [],
				tags: []*/
			};
		}
	}
}
</script>