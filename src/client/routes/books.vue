<template>
	<div>
		<books-list v-model="selected" />
		<s-form v-if="$access.admin" :model="selected">
			<book-mold />
			<s-field label="Title" prop="title" />
			<s-field label="Language" prop="language" type="languages" inline />
			<s-field label="Authors" prop="authors" />
			<s-field label="Tags" prop="tags" />
			<s-button v-if="selected" icon="save" positive :disabled="!selected.hasChanges()" @click="selected.save()" />
			<s-button
				negative icon="+database+large teal dont"
				@click="bdel()"
			>Delete book</s-button>
		</s-form>
		<s-table
			selectable
			v-if="selected"
			v-model="file"
			:rows="selected.files"
		>
			<s-column
				prop="edition"
				header="Edition"
			></s-column>
			<s-column header="Download">
				<template scope="scope">
					<form method="get" target="_blank" :action="`/lib/${scope.row.rel}`">
						<s-button compact native-type="submit" icon="download" />
					</form>
				</template>
			</s-column>
			<s-column
				prop="rel"
				header="File"
			></s-column>
			<template v-if="$access.admin" slot="footer">
				<s-form :model="file">
					<s-field inline prop="edition" label="Edition" />
				</s-form>
				<s-button
					negative icon="+database+large teal dont"
					@click="unref(file)"
					:disabled="!file"
				>Unreference file</s-button>
			</template>
		</s-table>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book from 'models/book'
import 'models/book'

@Component
export default class Books extends Vue {
	selected: Book = null
	file: any = null
	select(book) {
		this.selected = book;
	}
	bdel() {
		this.selected.destroy();
	}
	unref(edition) {
		/*var index = this.selected.files.indexOf(edition);
		console.assert(!!~index, 'Removed edition in the files list');
		this.selected.files.splice(index, 1);*/
		this.selected.files = this.selected.files.filter(x=> x!== edition);
		this.selected.save();//.then(filter)
	}
}
</script>