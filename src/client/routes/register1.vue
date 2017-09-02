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
					<template v-for="(file, index) in scope.row.files">
						<template v-if="0<index">, </template>
						<a :key="index" target="_blank" :href="'/lib/'+file.rel">{{file.extension}}</a>
					</template>
				</template>
			</s-column>
		</s-table>
		<s-form :model="selected && selected.creating" label-width="120px" style="width: 100%">
			<s-data-mold>
				<template slot="input" scope="field">
					<keyworded :keywords="kws" :name="field.name" v-model="field.value" />
				</template>
			</s-data-mold>
			<s-data-mold select="list">
				<template slot="input" scope="field">
					<kwd-list :keywords="kws" :name="field.name" v-model="field.value" />
				</template>
			</s-data-mold>
			<s-data-mold select="languages">
				<template slot="input" scope="field">
					<s-select :name="field.name" v-model="field.value">
						<s-option
							v-for="(txt, val) in languages" :key="val"
							:value="val"
							:text="txt"
						>
					</s-select>
				</template>
			</s-data-mold>
			
			<s-field label="Edition" property="edition"/>
			
			<s-tabs v-model="targetBook">
				<s-panel title="Existing" name="existing">
					<books-list v-model="existing" />
					<s-button
						@click="addEdition"
						icon="plus"
						:disabled="!existing"
					>
						Add
					</s-button>
				</s-panel>
				<s-panel title="Create new" name="create">
					<s-field label="Title" property="title" />
					<s-field label="Language" property="language" type="languages" />
					<s-field label="Authors" property="authors" type="list" />
					<s-field label="Tags" property="tags" type="list" />
					<s-button @click="register" icon="save">
						Register
					</s-button>
				</s-panel>
			</s-tabs>
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
	get files() {
		var info = this.selected;
		return info.files.map(x=> ({
			rel: x.rel,
			edition: info.creating.edition
		}));
	}
	addEdition() {
		this.existing.files.push(...this.files);
		this.existing.save();
	}
	register() {
		var info = this.selected,
			itm = new Book({
				...info.creating,
				files: this.files,
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
				language: 'en'
			};
		}
	}
}
</script>