<template>
	<div v-if="route.children" class="item ribbon">
		<div class="header">{{route.menu}}</div>
		<route-menu :routes="route.children" :root="path" />
	</div>
	<router-link v-else class="item" :to="path">
		{{route.menu}}
	</router-link>
</template>
<style>
.ui.pointing.menu .item.ribbon {
	padding-top: 0;
	padding-bottom: 0;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'

@Component
export default class MenuItem extends Vue {
	@Prop() route: any
	@Prop({default: ''}) root: string
	@Prop() index: number
	get path() {
		return '/'=== this.route.path.substr(0, 1) ?
			this.route.path :
			`${this.root}/${this.route.path}`;
	}
}
</script>