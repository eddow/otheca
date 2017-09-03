<template>
	<component :is="tag" class="ui menu">
		<item v-for="(route, ndx) in routes" :key="ndx"
			v-if="$access.can(route.admin)"
			:route="route"
			:class="{active: isActive(route)}" :root="root"
		/>
		<slot />
	</component>
</template>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import item from './route-menu/item.vue'
@Component({components:{item}})
export default class RouteMenu extends Vue {
	@Prop({default: 'div'}) tag: string
	@Prop() routes: any[]
	@Prop({default: ''}) root: string
	@Prop() index: number
	isActive(route) {
		return this.$route.path.startsWith(('/'=== route.path.substr(0, 1) ?
			route.path :
			`${this.root}/${route.path}`
		));
	}
}
</script>