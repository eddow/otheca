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
		<s-column property="title">
			<search-header slot="header" label="Title" v-model="filters.title" />
		</s-column>
		<s-column
			property="keywords"
			width="180"
		>
			<search-header slot="header" label="Keywords" v-model="filters.keywords" />
		</s-column>
		<s-column
			width="180"
		>
			<label slot="header">
				Language
				<s-select multiple fluid transparent v-model="filters.language" placeholder="All languages">
					<s-option
						v-for="(txt, val) in languages" :key="val"
						:value="val"
						:text="txt"
					>
					<!--s-icon slot="prepend" icon="search" /-->
				</s-select>
			</label>
			<template scope="scope">
				{{languages[scope.row.language]}}
			</template>
		</s-column>
		<s-column
			property="authors"
			width="180"
			:render="x=> x.join(', ')"
		>
			<search-header slot="header" label="Authors" v-model="filters.authors" />
		</s-column>
	</s-table>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book, {Languages} from 'models/book'
import 'models/book'
import {store} from 'common/central'
import access from '../business/access'

const books = store.getCollection('Book');
store.findAll('Book');
@Component
export default class BooksList extends Vue {
	access = access
	books: Book[] = null
	@Model('input')
	selected: Book
	languages: any = Languages
	listener: any
	filters: any = {
		title: '',
		authors: '',
		keywords: '',
		language: ''
	}
  created() {
		this.listener = books.on('all', this.filter);
	}
	destroyed() { books.off(this.listener); }
	@Watch('filters', {deep: true, immediate: true})
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
			var kept = true;
			for(let f in filters) {
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
}
</script>