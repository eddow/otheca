<template>
	<el-input
		ref="input"
		:placeholder="placeholder"
		:value="value"
		@input="input"
	>
		<div slot="append" v-if="$slots.append">
			<slot name="append"></slot>
		</div>
		<el-dropdown @command="insert" slot="prepend" :hide-on-click="false">
			<span class="el-dropdown-link">
				<i class="fa fa-arrow-right" aria-hidden="true"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item v-for="(keyword, index) in keywords" :key="index" :command="keyword">
					{{keyword}}
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</el-input>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'

@Component
export default class Keyworded extends Vue {
	@Model('input')
	@Prop() value: string
	@Prop() label: string
	@Prop() keywords: string[]
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