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
import {store} from 'common/central'

const books = store.getCollection('Book');
store.findAll('Book');
@Component
export default class Books extends Vue {
	books: Book[] = null
	selected: Book = null
	file: any = null
	languages: any = Languages
	listener: any
	filters: any = {}
  created() {
		this.listener = books.on('all', this.filter);
		this.filter();
	}
	destroyed() { books.off(this.listener); }
	filter() {
		function test(filters, value) {
			if(!value) return !filters || !filters.length;
			if(value instanceof Array) {
				for(let v of value) if(test(filters, v)) return true;
				return false;
			}
			console.assert('string'=== typeof value);
			value = value.comparable();
			for(let filter of filters)
				if(!~value.indexOf(filter))	//if we don't find one item of the filter in the value
					return false;
			return true;
		}
		var filters = {}, unfiltered = books.getAll();
		this.books = [];
		for(let i in this.filters)
			filters[i] = this.filters[i].comparable().split(' ').filter(x=> !!x.trim());
		for(let book of unfiltered) {
			var kept = true;
			for(let f in filters) {
				let filter = filters[f], excluded = false;
				//if filter is given "don bro", `filter` is here ['don', 'bro'] and we keep all that contains 'don' and 'bro'
				if(!test(filter, book[f])) {
					kept = false;
					break;
				}
			}
			if(kept) this.books.push(book);
		}
	}
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