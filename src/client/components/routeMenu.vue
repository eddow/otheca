<template>
	<el-submenu v-if="route.children" :index="''+index">
		<template slot="title">{{route.menu}}</template>
		<route-menu
			v-for="(child, ndx) in route.children"
			:route="child"
			:key="ndx"
			:index="ndx"
			:root="path"
		/>
	</el-submenu>
	<el-menu-item v-else :index="path">{{route.menu}}</el-menu-item>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'

@Component
export default class RouteMenu extends Vue {
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