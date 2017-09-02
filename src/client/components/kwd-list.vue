<template>
	<div>
		<keyworded
			v-for="(item, index) in ided" :key="item._id"
			v-model="item.str" :keywords="keywords"
			@input="itemChange(item, index)"
		>
			<s-button @click="delItem(item._id)" slot="prepend" icon="minus" dimmed-part="kwdctl" />
		</keyworded>
		<s-button icon="plus" @click="addItem" style="display: block;" />
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import keyworded from './keyworded.vue'
import * as alertify from 'alertify'
var aids = 0;

@Component
export default class kwdList extends Vue {
	@Prop()
	keywords: string[]
	@Model('input') values: string[]
	ided: any[] = []
	@Watch('values', {deep: true, immediate: true}) setIded(values) {
		if(!values) this.$emit('input', values = []);
		var ided = this.ided;
		ided.length = values.length;
		for(let i in values) {
			if(!ided[i])
				this.$set(ided, i, {
					_id: 'a'+(++aids),
					str: values[i]
				});
			else ided[i].str = values[i];
		}
	}
	addItem() {
		this.values.push('');
	}
	delItem(_id) {
		var ided = this.ided,
			ndx = ided.findIndex(x=> x._id === _id),
			splice = ()=> {
					ided.splice(ndx, 1);
					this.values.splice(ndx, 1);
				};
		if(~ndx) {
			if(!ided[ndx].str.trim())
				splice();
			else
				alertify.confirm(`Remove "${ided[ndx].str}" ?`, splice);
		}
	}
	itemChange(item, index) {
		this.$set(this.values, index, item.str);
	}
}
</script>