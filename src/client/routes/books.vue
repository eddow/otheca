<template>
	<div>
		<p v-for="book in books" :key="book._id">{{ book.title }}</p>
		<input type="text" v-model="msg" />
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {Book, bookService} from 'models/book'

@Component
export default class Books extends Vue {
	books: Book[] = null
  mounted() {
		var me= this;
		(async function() {
			me.books = await bookService.findAll();
		})();
	}
}
</script>