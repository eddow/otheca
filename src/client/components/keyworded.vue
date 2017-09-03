<template>
	<s-input
		ref="input"
		:placeholder="placeholder"
		:value="value"
		:name="internalName"
		@input="input"
	>
		<template slot="append">
			<slot name="append"></slot>
		</template>
		<template slot="input" v-if="$slots.input">
			<slot name="input" />
		</template>
		<template slot="prepend">
			<slot name="prepend"></slot>
			<s-select
				action="command"
				:text="false"
				class="label"
				v-if= "keywords && keywords.length"
				@command="insert"
				on="hover"
			>
				<s-option v-for="(keyword, index) in keywords" :key="index" :value="keyword">
					{{keyword}}
				</s-option>
			</s-select>
		</template>
	</s-input>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'

@Component
export default class Keyworded extends Vue {
	@Model('input') value: string
	@Prop() label: string
	@Prop({default: null}) keywords: string[]
	@Prop() placeholder: string
	input(value) { this.$emit('input', value); }
	insert(kw) {
		let elm = this.$refs.input.$el.children[1];
		this.input(
			this.value.substr(0, elm.selectionStart)+
			kw+
			this.value.substr(elm.selectionEnd));
		elm.focus();
		let forcePos = elm.selectionStart + kw.length;
		setTimeout(()=> {	//wait for input value to be updated
			elm.selectionStart = elm.selectionEnd = forcePos;
		});
	}
}
</script>