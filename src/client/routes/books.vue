<template>
	<div>
		<books-list v-model="selected" />
		<s-table
			selectable
			v-if="selected"
			v-model="file"
			:rows="selected.files"
		>
			<s-column
				property="edition"
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
				property="rel"
				header="File"
			></s-column>
			<template v-if="$access.admin" slot="footer">
				<s-button
					negative icon="+id card+big black dont"
					@click="unref(file)"
					:disabled="!file"
				>Unreference</s-button>
			</template>
		</s-table>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import Book, {Languages} from 'models/book'
import 'models/book'

@Component
export default class Books extends Vue {
	selected: Book = null
	file: any = null
	languages: any = Languages
	select(book) {
		this.selected = book;
	}
	unref(edition) {
		/*var index = this.selected.files.indexOf(edition);
		console.assert(!!~index, 'Removed edition in the files list');
		this.selected.files.splice(index, 1);*/
		this.selected.files = this.selected.files.filter(x=> x!== edition);
		this.selected.save();
	}
}
</script>