<template>
	<div class="item" v-if="route.children">
		<div class="header">{{route.menu}}</div>
    <div class="ui  menu">
			<route-menu
				v-for="(child, ndx) in route.children"
				:route="child"
				:key="ndx"
				:index="ndx"
				:root="path"
			/>
		</div>
	</div>
	<!--a v-else class="item" :href="path">{{route.menu}}</a-->
	<router-link v-else class="item" :to="path">
		{{route.menu}}
	</router-link>
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