<template>
	<div>
		<books-list v-model="selected" />
		<s-table
			selectable
			v-if="selected"
			v-model="file"
			:rows="selected.files"
		>
			<s-column>
				<template scope="scope">
					<form method="get" target="_blank" :action="`/lib/${scope.model.rel}`" class="edition-action">
						<s-button v-if="selected.editing"
							compact negative
							icon="+database+large teal dont"
							@click="unref(scope.model)"
						>Unreference file</s-button>
						<s-button compact native-type="submit" icon="download" />
					</form>
				</template>
			</s-column>
			<s-column
				prop="edition"
				header="Edition"
				:edit="selected.editing"
			>
		</s-table>
	</div>
</template>
<style>
.edition-action {
	text-align: right;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book from 'models/book'
import 'models/book'
import * as alertify from 'alertify'

@Component
export default class Books extends Vue {
	selected: Book = null
	file: any = null
	select(book) {
		this.selected = book;
	}
	unref(edition) {
		alertify.confirm(`Unreference "${edition.rel}" ?`, ()=> {
			this.selected.files = this.selected.files.filter(x=> x!== edition);
			this.selected.save();//.then(filter)
		});
	}
}
</script>