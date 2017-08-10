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
		<el-form v-if="selected" label-width="120px" style="width: 480px">
			<el-form-item label="Title">
				<keyworded v-model="selected.creating.title" :keywords="kws"></keyworded>
			</el-form-item>
			<el-form-item label="Authors">
				<table>
					<tr v-for="author in selected.creating.authors" :key="author._id">
						<th>
							<el-button @click="delAuthor(author._id)">
								<i class="fa fa-minus" aria-hidden="true"></i>
							</el-button>
						</th>
						<td>
							<keyworded v-model="author.name" :keywords="kws"></keyworded>
						</td>
					</tr>
					<tr>
						<th>
							<el-button @click="addAuthor">
								<i class="fa fa-plus" aria-hidden="true"></i>
							</el-button>
						</th>
					</tr>
				</table>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {Book} from 'models/book'
import axios from 'axios'
import {store} from 'common/central'
import keyworded from '../components/keyworded.vue'
const books = store.getCollection('Book');
var lib = null, aids = 0;
var loading = Promise.all([
	axios('/lib').then(response=> {
		var raw = response.data;
		lib = {};
		for(let rel in raw) {
			let analysis = /^(.*)\.([^\.]{2,4})/.exec(raw[rel].name),
				name = analysis[1], key = name.comparable();
			(lib[key] || (lib[key] = {files: [], name})).files.push({rel, extension: analysis[2], ...raw[rel]});
		}
	}),
	store.findAll('Book')
]);
@Component({
	components: {keyworded}
})
export default class Register extends Vue {
	unregistered: any[] = null
	selected: any = null
	listener: any
	kws: string[]
	compute() {
		this.unregistered = [];
		for(let rel in lib)
			this.unregistered.push(__assign({creating: null}, lib[rel]));
	}
  created() {
		this.listener = books.on('all', this.compute);
		loading.then(this.compute);
	}
	destroyed() { books.off(this.listener); }
	addAuthor() {
		this.selected.creating.authors.push({
			_id: 'a'+(++aids),
			name: ''
		});
	}
	delAuthor(_id) {
		var authors = this.selected.creating.authors,
			ndx = authors.findIndex(x=> x._id === _id);
		if(~ndx) authors.splice(ndx, 1);
	}
	select(book) {
		this.selected = book;
		this.kws = book.files[0].rel
			.replace(/\%(\w{2})/g, (match, capture)=> String.fromCharCode(Number.parseInt(capture, 16)))
			.replace(/_/g, ' ').split(/[\/\-\.]/g).map(v=> v.trim());
		this.kws.pop();	//removes extension
		if(!this.selected.creating)
			this.selected.creating = {
				title: this.kws[this.kws.length-1],
				authors: []
			};
	}
}
</script>