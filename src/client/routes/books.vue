<template>
	<div>
		<el-form class="filters" label-width="120px" style="width: 480px">
			<el-form-item label="Title">
				<el-input v-model="filters.title" icon="search" @input="filter"></el-input>
			</el-form-item>
			<el-form-item label="Author">
				<el-input v-model="filters.authors" icon="search" @input="filter"></el-input>
			</el-form-item>
			<el-form-item label="Keywords">
				<el-input v-model="filters.keywords" icon="search" @input="filter"></el-input>
			</el-form-item>
			<el-form-item label="Language">
				<el-select v-model="filters.language" @input="filter">
					<el-option
						v-for="(txt, val) in languages" :key="val"
						:value="val"
						:label="txt"
					>
				</el-select>
			</el-form-item>
		</el-form>
		<el-table
			:data="books"
			stripe
			height="250"
			highlight-current-row
			@current-change="select"
			style="width: 100%">
			<el-table-column
				prop="title"
				label="Title"
			></el-table-column>
			<el-table-column
				prop="keywords"
				label="Keywords"
				width="180"
			></el-table-column>
			<el-table-column
				label="Language"
				width="180"
			>
				<template scope="scope">
					{{languages[scope.row.language]}}
				</template>
			</el-table-column>
			<el-table-column
				prop="authors"
				label="Authors"
				width="180"
			></el-table-column>
		</el-table>
		<el-table
			v-if="selected"
			:data="selected.files"
		>
			<el-table-column
				prop="edition"
				label="Edition"
			></el-table-column>
			<el-table-column
				prop="rel"
				label="File"
			></el-table-column>
			<el-table-column>
				<template scope="scope">
					<form method="get" target="_blank" :action="`/lib/${scope.row.rel}`">
						<el-button native-type="submit" icon="document">Download</el-button>
						<el-button v-if="access.admin" icon="delete">Delete</el-button>
					</form>
				</template>
			</el-table-column>
		</el-table>
	</div>
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
export default class Books extends Vue {
	access = access
	books: Book[] = null
	selected: Book = null
	languages: any = Languages
	listener: any
	filters: any = {}
  created() {
		this.listener = books.on('all', this.filter);
		this.filter();
	}
	destroyed() { books.off(this.listener); }
	filter() {
		function test(filters, value) {
			if(!value) return !filters || !filters.length;
			if(value instanceof Array) {
				for(let v of value) if(test(filters, v)) return true;
				return false;
			}
			console.assert('string'=== typeof value);
			value = value.comparable();
			for(let filter of filters)
				if(!~value.indexOf(filter))	//if we don't find one item of the filter in the value
					return false;
			return true;
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
				if(!test(filter, book[f])) {
					kept = false;
					break;
				}
			}
			if(kept) this.books.push(book);
		}
	}
	select(book) {
		this.selected = book;
	}
}
</script>