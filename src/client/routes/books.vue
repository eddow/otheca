<template>
	<div>
		<el-form class="filters" label-width="120px" style="width: 480px">
			<el-form-item label="Title">
				<el-input v-model="filters.title" icon="search" @input="filter"></el-input>
			</el-form-item>
			<el-form-item label="Author">
				<el-input v-model="filters.author" icon="search" @input="filter"></el-input>
			</el-form-item>
			<el-form-item label="Keywords">
				<el-input v-model="filters.keywords" icon="search" @input="filter"></el-input>
			</el-form-item>
			<el-form-item label="Language">
				<el-select v-model="filters.language">
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
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {Book, Languages} from 'models/book'
import 'models/book'
import {store} from 'common/central'
const books = store.getCollection('Book');
store.findAll('Book');
@Component
export default class Books extends Vue {
	books: Book[] = null
	selected: Book = null
	languages: any = Languages
	listener: any
	filters: any = {}
  created() {
		var receive = ()=> this.books = books.getAll();
		this.listener = books.on('all', receive);
		receive();
	}
	destroyed() { books.off(this.listener); }
	filter() {

	}
	select(book) {

	}
}
</script>