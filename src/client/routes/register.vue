<template>
	<div>
		<el-table
			:data="unregistered"
			stripe
			height="250"
			highlight-current-row
			@current-change="select"
			style="width: 100%">
			<el-table-column
				prop="name"
				label="Name">
			</el-table-column>
			<el-table-column
				label="Files"
				width="180"
			>
				<template scope="scope">
					{{scope.row.files.map(x=>x.extension).join(', ')}}
				</template>
			</el-table-column>
		</el-table>
		<form v-if="selected">
			<label for="title">Title</label>
			
			<el-autocomplete
				class="inline-input"
				v-model="creating.title"
				:fetch-suggestions="kwSearch"
				placeholder="Please Input"
			></el-autocomplete>
		</form>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {Book} from 'models/book'
import 'models/book'
import axios from 'axios'
import {store} from 'common/central'
const books = store.getCollection('Book');
var lib = null;
var loading = Promise.all([
	axios('/lib').then(response=> {
		var raw = response.data;
		lib = {};
		for(let rel in raw) {
			var anl = /^(.*)\.([^\.]{2,4})/.exec(raw[rel].name),
				name = anl[1], key = name.comparable();
			(lib[key] || (lib[key] = {files: [], name})).files.push({rel, extension: anl[2], ...raw[rel]});
		}
	}),
	store.findAll('Book')
]);
@Component
export default class Books extends Vue {
	unregistered: any[] = null
	selected: any = null
	creating: any = null
	listener: any
	kws: string[]
	compute() {
		this.unregistered = [];
		for(let rel in lib)
			this.unregistered.push(lib[rel]);
	}
  created() {
		this.listener = books.on('all', this.compute);
		loading.then(this.compute);
	}
	destroyed() { books.off(this.listener); }
	select(book) {
		this.selected = book;
		this.kws = book.name
			.replace(/\%(\w{2})/g, (match, capture)=> String.fromCharCode(Number.parseInt(capture, 16)))
			.replace('_', ' ').split(/[\/\-]/g).map(v=> ({value: v.trim()}));
		this.creating = {
			title: this.kws[this.kws.length-1].value
		};
	}
	kwSearch(queryString, callback) {
		callback(this.kws);
	}
	insertText(item,a,b,c) {
		debugger;
	}
}
</script>