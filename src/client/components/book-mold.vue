<template>
	<div style="display: none;">
		<s-data-mold select="languages">
			<template slot="input" scope="field">
				<s-select :name="field.name" v-model="field.value">
					<s-option
						v-for="(txt, val) in languages" :key="val"
						:value="val"
						:text="txt"
					>
				</s-select>
			</template>
			<template slot="display" scope="field">
				{{languages[field.value]}}
			</template>
		</s-data-mold>
		<s-data-mold>
			<template slot="input" scope="field">
				<keyworded :keywords="kws" :name="field.name" v-model="field.value" />
			</template>
		</s-data-mold>
	</div>
</template>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {Languages} from 'models/book'

@Component
export default class BookMold extends Vue {
	@Prop() kws: string[]
	languages: any = Languages
}
</script>