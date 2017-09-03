<template>
	<div class="screen">
		<route-menu style="background-color: white;" :routes="routes" tag="header" class="secondary pointing">
  		<div class="right menu">
				<div class="ui item">
					<s-checkbox label="Admin" v-model="$access.admin" />
				</div>
			</div>
		</route-menu>
		<section class="work-pane code ">
			<router-view></router-view>
		</section>
	</div>
</template>
<style>
.screen {
	width: 100%;
	padding-top: 42px;
}
header.ui.menu.pointing {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	height: 42px;
	min-width: 250px;
	background-color: #efefef;
	box-shadow: rgba(0,0,0,.4) 0 10px 80px 10px;
	z-index: 100;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Provide} from 'vue-property-decorator'
import routes from './routes'
import routeMenu from './components/route-menu.vue'

@Component({components:{
	routeMenu
}})
export default class App extends Vue {
	routes: any[] = routes
}
</script>