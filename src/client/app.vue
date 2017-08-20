<template>
	<div>
		<el-menu :router="true" mode="horizontal">
			<route-menu v-for="(route, ndx) in routes" :route="route" :key="ndx" :index="ndx" />
			<el-checkbox v-model="access.admin">Admin</el-checkbox>
		</el-menu>
		<router-view ></router-view>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import routes from './routes'
import routeMenu from './components/routeMenu.vue'
import access from './business/access'

@Component({components:{
	routeMenu
}})
export default class App extends Vue {
	routes: any[] = routes
	access = access
}
</script>