<template>
	<div>
		<el-menu :router="true" mode="horizontal">
			<template v-for="(route, ndx) in routes">
				<el-menu-item v-if="route.menu" :index="route.path" :key="ndx">{{route.menu}}</router-link>
			</template>
		</el-menu>
		<router-view ></router-view>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import routes from '~/client/routes'

@Component
export default class App extends Vue {
	routes: any[] = routes
}
</script>