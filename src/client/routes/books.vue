<template>
	<div>
		<books-list v-model="selected" @isEditing="x=> isEditing = x" />
		<s-table
			selectable
			v-if="selected"
			v-model="file"
			:rows="selected.files"
		>
			<s-column
				prop="edition"
				header="Edition"
				:edit="isEditing"
			/>
			<s-column header="Download">
				<template scope="scope">
					<form method="get" target="_blank" :action="`/lib/${scope.model.rel}`">
						<s-button compact native-type="submit" icon="download" />
					</form>
				</template>
			</s-column>
			<s-column prop="rel" header="File" />
			<template v-if="isEditing" slot="footer">
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
	isEditing: boolean = false
	file: any = null
	select(book) {
		this.selected = book;
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