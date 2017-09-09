<template>
	<s-table
		celled
		:rows="books"
		striped
		body-height="200"
		selectable
		:current="selected"
		@row-click="select"
		style="width: 100%"
	>
		<book-mold />
		<s-column prop="title" :edit="$access.admin">
			<search-header slot="header" label="Title" v-model="filters.title" />
		</s-column>
		<s-column
			prop="tags"
			width="180"
			:edit="$access.admin"
		>
			<search-header slot="header" label="Tags" v-model="filters.tags" />
		</s-column>
		<s-column
			width="180"
			:edit="$access.admin"
			prop="language"
			type="languages"
		>
			<label slot="header">
				Language
				<s-select multiple fluid transparent v-model="filters.language" placeholder="All languages">
					<s-option
						v-for="(txt, val) in languages" :key="val"
						:value="val"
						:text="txt"
					>
					<s-icon slot="prepend" icon="search" />
				</s-select>
			</label>
		</s-column>
		<s-column
			prop="authors"
			width="180"
			:edit="$access.admin"
		>
			<search-header slot="header" label="Authors" v-model="filters.authors" />
		</s-column>
		<s-row-edit-column v-if="$access.admin"
			@save="book=> book.save()"
			@cancel="book=> book.revert()"
			@remove="delBook"
			:hasChanges="book => book.hasChanges()"
			save-icon="save"
			remove-icon="+database+large teal dont"
			prop="editing"
		/>
	</s-table>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book, {Languages} from 'models/book'
import 'models/book'
import {store} from 'common/central'
import {bindCollection} from 'biz/js-data'
import * as alertify from 'alertify'

const books = bindCollection('Book');
@Component
export default class BooksList extends Vue {
	books: Book[] = null
	
	@Model('input')
	selected: Book
	languages: any = Languages
	filters: any = {
		title: '',
		authors: '',
		tags: '',
		language: ''
	}
  created() { books.on('all', this.filter); }
	destroyed() { books.off('all', this.filter); }
	@Watch('filters', {deep: true, immediate: true})
	@Watch('$access', {deep: true})
	filter() {
		function test(filters, value, all) {
			if(!filters || !filters.length) return true;
			if(!value) return false;
			if(value instanceof Array) {
				for(let v of value) if(test(filters, v, all)) return true;
				return false;
			}
			console.assert('string'=== typeof value);
			value = value.comparable();
			for(let filter of filters)
				if(all === !~value.indexOf(filter))	//if we don't find one item of the filter in the value
					return !all;
			return all;
		}
		var filters = {}, unfiltered = books.getAll();
		this.books = [];
		for(let i in this.filters)
			filters[i] = this.filters[i].comparable().split(' ').filter(x=> !!x.trim());
		for(let book of unfiltered) {
			var kept = this.$access.admin || book.files.length;
			if(kept) for(let f in filters) {
				let filter = filters[f], excluded = false;
				//if filter is given "don bro", `filter` is here ['don', 'bro'] and we keep all that contains 'don' and 'bro'
				if(!test(filter, book[f], f!== 'language')) {
					kept = false;
					break;
				}
			}
			if(kept) this.books.push(book);
		}
	}
	select(book) {
		this.$emit('input', book);
	}
	delBook(book, doer, cancel) {
		alertify.confirm(`Unreference "${book.title}" ?`, ()=> {
			book.destroy();
		});
		cancel();
	}
}
</script>