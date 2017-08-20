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
			<el-form-item label="Edition">
				<keyworded v-model="selected.creating.edition" :keywords="kws"></keyworded>
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
import Book, {Languages} from 'models/book'
import unregistered from '../business/unregistered'

@Component
export default class Register1 extends Vue {
	unregistered: any[] = unregistered
	selected: any = null
	kws: string[]
	languages: any = Languages
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
	select(book) {
		this.selected = book;
		if(book) {
			this.kws = book.files[0].rel
				.replace(/\%(\w{2})/g, (match, capture)=> String.fromCharCode(Number.parseInt(capture, 16)))
				/*.replace(/_/g, ' ')*/.split(/[\/\-\.\_]/g).map(v=> v.trim());
			this.kws.pop();	//removes extension
		}
	}
}
</script>