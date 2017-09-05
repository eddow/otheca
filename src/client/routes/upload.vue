<template>
	<div>
		<vue-clip :options="options">
			<template slot="clip-uploader-action" scope="params">
				<div :class="['dz-message', params.dragging && 'is-dragging']">
					<s-icon icon="huge cloud upload" class="dz-centered" />
				</div>
			</template>
	
			<template slot="clip-uploader-body" scope="props">
				<table class="dz-list">
					<tr v-for="file in props.files" :key="file.id">
						<td v-if="file.reaction">
							<s-input style="width: 600px;" v-model="file.name" />
						</td>
						<td v-else><div style="width: 600px;">{{file.name}}</div></td>
						
						<td v-if="file.reaction">
							<s-button icon="upload" positive @click="file.reaction(true)" />
							<s-button icon="trash" negative @click="file.reaction(false)" />
						</td>
						<td v-else-if="'success'=== file.status" class="ui success label"><s-icon icon="checkmark" /></td>
						<td v-else-if="'error'=== file.status" class="ui error label">{{file.errorMessage}}</td>
						<td v-else-if="'uploading'=== file._file.status">
							<s-progress style="width: 300px;" :value="file.bytesSent" :total="file.size" />
						</td>
						<td v-else><s-icon icon="loading circle notched" /></td>
						<!--td v-else><s-button @click="file.upload()" icon="upload" /></td-->
					</tr>
				</table>
				</div>
			</template>
		</vue-clip>
	</div>
</template>
<style>
.dz-message {
	position: fixed;
	width: 100%;
	padding: 70px;
	border: 1px blue dashed;
	background-color: white;
	z-index: 1;
	text-align: center;
}
/*.dz-centered {
  margin: auto;
  width: 100px;
  height: 100px;
	display: block;
}*/
.is-dragging {
	border-style: solid;
	background-color: lightblue;
}
.dz-list {
	padding-top: 200px;
}
</style>
<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import {extensions} from 'config'

@Component
export default class Upload extends Vue {
	files: any[] = []
	options = {
		url: '/lib',
		paramName: 'file'
		/*,	//Find a way to overwrite the upload-file's name : here, we edit Vue data that is a copy of the `file` object from vue-clip
		accept(file, done) {
			Vue.set(file, 'reaction', function(accept) {
				file.reaction = undefined;
				if(accept) done(); else done('canceled');
			});
		}*/
	}
	get extensions() {
		return extensions.join(',');
	}
}
</script>