<template>
	<div>
		<s-table
			:rows="filtered"
			striped
			class="rex"
			body-height="250"
			highlight-current-row
			style="width: 100%"
		>
			<s-checkbox-column width="55" v-model="selection" />
			<s-column
				property="rel"
				header="Path">
			</s-column>
			<s-column header="Matches">
				<template scope="scope">
					<el-tag v-for="match in scope.row.matches" :key="match">{{match}}</el-tag>
				</template>
			</s-column>
			<s-column
				property="creating.title"
				header="Title"
			></s-column>
			<s-column
				property="creating.edition"
				header="Edition"
			></s-column>
			<s-column
				property="creating.authors"
				header="Authors"
				width="180"
			></s-column>
			<s-column
				property="creating.tags"
				header="Tags"
				width="180"
			></s-column>
		</s-table>
		<el-form label-width="120px" :model="rex">
			<el-form-item label="RegExp" property="string"
				:rules="[{validator: filter, trigger: 'change'}]">
				<el-input v-model="rex.string" />
			</el-form-item>
		</el-form>
		<el-form label-width="120px" style="width: 480px">
			<el-form-item label="Title">
				<keyworded v-model="patterns.title" @input="compute('title')" />
			</el-form-item>
			<el-form-item label="Edition">
				<keyworded v-model="patterns.edition" @input="compute('edition')" />
			</el-form-item>
			<el-form-item label="Language">
				<el-select v-model="patterns.language">
					<el-option
						v-for="(txt, val) in languages" :key="val"
						:value="val"
						:label="txt"
					>
				</el-select>
			</el-form-item>
			<el-form-item label="Authors">
				<kwd-list :values="patterns.authors" @input="compute('authors')" />
			</el-form-item>
			<el-form-item label="Tags">
				<kwd-list :values="patterns.tags" @input="compute('tags')" />
			</el-form-item>
			<s-button icon="save" @click="register">
				Register
			</s-button>
		</el-form>
	</div>
</template>
<style>
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book, {Languages} from 'models/book'
import unregistered from '../business/unregistered'

@Component
export default class RegisterRex extends Vue {
	filtered: any[] = []
	exclusion: any[] = []
	languages: any = Languages
	rex: any = {string: ''}
	selection = true
	patterns: any = {
		title: '',
		language: 'en',
		edition: '',
		authors: [],
		tags: []
	}
	filter(rule, value, callback) {
		var rex;
		if(!value) {
			this.filtered = unregistered;
			return callback();
		}
		try { rex = new RegExp(value); }
		catch(x) {
			return callback(new Error(x.message));
		}
		callback();
		this.filtered = unregistered.filter(x=> {
			var match = rex.exec(x.rel);
			return x.matches = match && match.slice(1);
		});
		this.compute();
	}
	compute(itm?) {
		for(let x of this.filtered) {
			function replaceMatches(str) {
				if(str instanceof Array) return str.map(replaceMatches);
				if(x.matches) for(let i=0; i<x.matches.length; ++i)
					str = str.replace('$'+(i+1), x.matches[i]||'');
				return str;
			}
			if(itm)
				x.creating[itm] = replaceMatches(this.patterns[itm]);
			else for(let itm in this.patterns) 
				x.creating[itm] = replaceMatches(this.patterns[itm]);
		}
	}
	created() {
		this.$watch(()=> unregistered, ()=> this.filter(null, this.rex.string, ()=> void 0));
		this.filtered = unregistered;
	}
	register() {
		for(let info of this.selection) {
			var itm = new Book({
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
	}
}
</script>