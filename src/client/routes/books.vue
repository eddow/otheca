<template>
	<div>
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
				width="180">
			</el-table-column>
			<el-table-column
				prop="keywords"
				label="Keywords"
				width="180">
			</el-table-column>
			<el-table-column
				prop="authors"
				label="Authors"
				width="180">
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {Book} from 'models/book'
import 'models/book'
import {store} from 'common/central'
const books = store.getCollection('Book');
store.findAll('Book');
const emptyBook = {fileName: 'none yet', title: ''};
@Component
export default class Books extends Vue {
	books: Book[] = null
	creating: any = {...emptyBook}
	selected: Book = null
	listener: any
  created() { this.listener = books.on('all', ()=> this.books = books.getAll()); }
	destroyed() { books.off(this.listener); }
	add() {
		try {
			books.add(this.creating).save();
			this.creating = {...emptyBook};
		} catch(x) {
			//x.errors = [{"expected":"a value","actual":"undefined","path":"fileName"}]
		}
	}
	select(book) {
		debugger;
	}
}
</script>