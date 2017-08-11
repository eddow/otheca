<template>
	<div>
		<keyworded
			v-for="(item, index) in ided" :key="item._id"
			v-model="item.str" :keywords="keywords"
			@input="itemChange(item, index)"
		>
			<el-button @click="delItem(item._id)" slot="append">
				<i class="fa fa-minus" aria-hidden="true"></i>
			</el-button>
		</keyworded>
		<el-button @click="addItem">
			<i class="fa fa-plus" aria-hidden="true"></i>
		</el-button>
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import keyworded from './keyworded.vue'
var aids = 0;
@Component({
	components: {keyworded}
})
export default class kwdList extends Vue {
	@Prop()
	keywords: string[]
	@Prop()
	@Model('input')
	values: string[]
	ided: any[] = []
	@Watch('values')
	setIded(values) {
		var ided = this.ided;
		ided.length = values.length;
		for(let i in values)
			(ided[i] || (ided[i] = {_id: 'a'+(++aids)}))
				.str = values[i];
	}
	addItem() {
		this.ided.push({
			_id: 'a'+(++aids),
			str: ''
		});
		this.values.push('');
	}
	delItem(_id) {
		var ided = this.ided,
			ndx = ided.findIndex(x=> x._id === _id);
		if(~ndx) {
			if(!ided[ndx].str.trim())
				ided.splice(ndx, 1);
			else
				this.$confirm(ided[ndx].str, 'Remove value ?').then(()=> {
					ided.splice(ndx, 1);
					this.values.splice(ndx, 1);
				}, ()=>0);
		}
	}
	itemChange(item, index) {
		this.values[index] = item.str;
	}
}
</script>