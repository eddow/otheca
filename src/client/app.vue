<template>
	<div class="screen ui grid">
		<div class="ui inverted vertical menu two wide column">
			<div class="item">
				<label for="ss">Admin</label>
				<s-checkbox name="ss" toggle v-model="access.admin" />
			</div>
			<route-menu v-for="(route, ndx) in routes" :route="route" :key="ndx" :index="ndx" />
		</div>
		<div class="work-pane code fourteen wide column">
			<router-view></router-view>
		</div>
	</div>
</template>
<style>
.screen {
	width: 100vw;
	height: 100vh;
}
.work {
	height: calc(100% - 80px);
}
.work-pane {
	height: 100%;
	overflow: auto;
}
div.CodeMirror {
	height: 100%;
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