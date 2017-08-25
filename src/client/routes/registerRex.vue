<template>
	<div>
		<el-table
			:data="filtered"
			stripe
			class="rex"
			height="250"
			highlight-current-row
			style="width: 100%"
			@selection-change="exclude"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column
				prop="rel"
				label="Path">
			</el-table-column>
			<el-table-column label="Matches">
				<template scope="scope">
					<el-tag v-for="match in scope.row.matches" :key="match">{{match}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column
				prop="creating.title"
				label="Title"
			></el-table-column>
			<el-table-column
				prop="creating.edition"
				label="Edition"
			></el-table-column>
			<el-table-column
				prop="creating.authors"
				label="Authors"
				width="180"
			></el-table-column>
			<el-table-column
				prop="creating.tags"
				label="Tags"
				width="180"
			></el-table-column>
		</el-table>
		<el-form label-width="120px" :model="rex">
			<el-form-item label="RegExp" prop="string"
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
	.el-table.rex .el-checkbox__input.is-checked .el-checkbox__inner {
		background-color: #ff2820;
		border-color: #fe2401;
	}
	.el-table.rex .el-checkbox__inner:hover, .el-table.rex .el-checkbox__input.is-focus .el-checkbox__inner {
		border-color: #ff2820;
	}
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
		for(let info of this.filtered)
			if(!~this.exclusion.indexOf(info)) {
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
	exclude(exclusion) {
		this.exclusion = exclusion;
	}
}
</script>