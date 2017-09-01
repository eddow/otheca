<template>
	<div>
		<keyworded
			v-for="(item, index) in ided" :key="item._id"
			v-model="item.str" :keywords="keywords"
			@input="itemChange(item, index)"
		>
			<s-button @click="delItem(item._id)" slot="append" icon="minus" />
		</keyworded>
		<s-button icon="plus" @click="addItem" style="display: block;" />
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import keyworded from './keyworded.vue'
import {Field} from 'v-semantic'
var aids = 0;

@Component({mixins: [Field.Input]})
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
				this.$confirm(ided[ndx].str, 'Remove value ?').then(splice, ()=>0);
		}
	}
	itemChange(item, index) {
		this.$set(this.values, index, item.str);
	}
}
</script>