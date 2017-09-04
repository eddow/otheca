<template>
	<div>
		<s-table
			:rows="filtered"
			striped
			class="rex"
			body-height="250"
			highlight-current-row
			style="width: 100%"
			:row-class="row=> !row.selected && 'unselected'"
		>
			<s-checkbox-column width="55" v-model="selection">
				<template scope="scope">
					<s-icon
						:icon="scope.checked?'checkmark':'remove'"
						:class="scope.checked?'grey':'red'"
						@click="scope.toggle(scope.row)" />
				</template>
			</s-checkbox-column>
			<s-column
				property="rel"
				header="Path"
			/>
			<s-column header="Matches" property="matches">
				<template scope="scope">
					<span class="ui label" v-for="item in scope.value" :key="item">{{item}}</el-tag>
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
			>
				<template scope="scope">
					<span class="ui label" v-for="item in scope.value" :key="item">{{item}}</el-tag>
				</template>
			</s-column>
			<s-column
				property="creating.tags"
				header="Tags"
				width="180"
			>
				<template scope="scope">
					<span class="ui label" v-for="item in scope.value" :key="item">{{item}}</el-tag>
				</template>
			</s-column>
			<s-input slot="footer" fluid v-model="rex.string" :error="!!rex.error">
				<s-icon icon="search" slot="prepend" />
				<div slot="append" class="ui label">
					{{filtered.length}} book(s)
				</div>
			</s-input>
		</s-table>

		<s-form inline :model="patterns" label-width="120px" style="width: 480px">
			<s-field label="Title" property="title" @change="compute('title')" />
			<s-field label="Edition" property="edition" @change="compute('edition')" />
			<s-field label="Language" property="language" inline>
					<s-select name="language" v-model="patterns.language">
					<s-option
						v-for="(txt, val) in languages" :key="val"
						:value="val"
						:text="txt"
					/>
				</s-select>
			</s-field>
			<s-field label="Authors" property="authors" />
			<s-field label="Tags" property="tags" />
			<s-button icon="save" @click="register">
				Register
			</s-button>
		</s-form>
	</div>
</template>
<style>
tr.unselected td {
	color: #aaa;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book, {Languages} from 'models/book'
import unregistered from '../business/unregistered'
import * as alertify from 'alertify'

@Component
export default class RegisterRex extends Vue {
	filtered: any[] = []
	exclusion: any[] = []
	languages: any = Languages
	rex: any = {
		string: '',
		error: ''
	}
	selection: boolean | any[] = true
	patterns: any = {
		title: '',
		language: 'en',
		edition: '',
		authors: '',
		tags: ''
	}
	@Watch('rex.string')
	filter(value) {
		var rex;
		if(!value) {
			this.filtered = unregistered;
			return;
		}
		try {
			rex = new RegExp(value);
			this.rex.error = false;
		} catch(x) {
			this.rex.error = x.message;
			return;
		}
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
		
		alertify.confirm(`Create ${this.selection.length} books ?`, ()=> {
			for(let info of this.selection) {
				var itm = new Book({
						...info.creating,
						files: info.files.map(x=> ({
							rel: x.rel,
							edition: info.creating.edition
						}))
					});
				itm.save();
			}
		});
	}
}
</script>