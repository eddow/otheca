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
			<el-form-item label="Language">
				<el-select v-model="selected.creating.language">
					<el-option
						v-for="(txt, val) in languages" :key="val"
						:value="val"
						:label="txt"
					>
				</el-select>
			</el-form-item>
			<el-form-item label="Authors">
				<kwd-list :values="selected.creating.authors" :keywords="kws" />
			</el-form-item>
			<el-form-item label="Tags">
				<kwd-list :values="selected.creating.tags" :keywords="kws" />
			</el-form-item>
			<el-button @click="register">
				<i class="fa fa-save" aria-hidden="true"></i>
				Register
			</el-button>
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
import kwdList from '../components/kwdList.vue'
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
const languages = {
	fr: 'French',
	en: 'English',
	ro: 'Romanian',
	hu: 'Hungarian'
}

//function hasFile()

@Component({
	components: {keyworded, kwdList}
})
export default class Register extends Vue {
	unregistered: any[] = null
	selected: any = null
	listener: any
	kws: string[]
	languages: any = languages
	books: any = books
	compute() {
		var files = {},
			unregistered = Object.values(lib).map(x=>({creating: null, ...x}));
		books.forEach(element => {
			for(let file of element.files) files[file] = true;
		});
		for(let i = 0; i<unregistered.length;) {
			let libu = unregistered[i];
			libu.files = libu.files.filter(f=> !files[f.rel]);
			if(libu.files.length) ++i;
			else unregistered.splice(i, 1);
		}
		this.unregistered = unregistered;
	}
  created() {
		this.listener = books.on('all', this.compute);
		loading.then(this.compute);
	}
	destroyed() { books.off(this.listener); }
	register() {
		var info = this.selected,
			itm = new Book({
				files: info.files.map(x=> x.rel),
				...info.creating,
				authors: info.creating.authors.filter(x=>!!x.trim()),
				tags: info.creating.tags.filter(x=>!!x.trim())
			});
		itm.save().then(()=> {
			this.unregistered.splice(
				this.unregistered.findIndex(x=> x.name === info.name),
				1);
		});
	}
	select(book) {
		this.selected = book;
		if(book) {
			this.kws = book.files[0].rel
				.replace(/\%(\w{2})/g, (match, capture)=> String.fromCharCode(Number.parseInt(capture, 16)))
				/*.replace(/_/g, ' ')*/.split(/[\/\-\.\_]/g).map(v=> v.trim());
			this.kws.pop();	//removes extension
			if(!this.selected.creating)
				this.selected.creating = {
					title: this.kws[this.kws.length-1],
					language: 'en',
					authors: [],
					tags: []
				};
		}
	}
}
</script>