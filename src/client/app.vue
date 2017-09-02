<template>
	<div class="screen">
		<header class="ui menu ">
			<route-menu v-for="(route, ndx) in routes" :route="route" :key="ndx" :index="ndx" />
  		<div class="right menu">
				<div class="ui item">
					<s-checkbox label="Admin" v-model="access.admin" />
				</div>
			<div>
		</header>
		<section class="work-pane code ">
			<router-view></router-view>
		</section>
	</div>
</template>
<style>
.screen {
	width: 100%;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import routes from './routes'
import routeMenu from './components/route-menu.vue'
import access from './business/access'

@Component({components:{
	routeMenu
}})
export default class App extends Vue {
	routes: any[] = routes
	access = access
}
</script>