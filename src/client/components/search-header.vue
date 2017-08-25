<template>
	<label>
		{{label}}
		<s-input fluid transparent @input="input" :value="value">
			<s-icon slot="prepend" icon="search" />
		</s-input>
	</label>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator'
@Component
export default class SearchHeader extends Vue {
	@Prop() label: string
	@Model('input') value: string
	@Emit() input(nv) {}
}
</script>