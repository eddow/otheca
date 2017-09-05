import 'axios'
//import 'models/book'
import * as S from 'string'
S.extendPrototype();
import 'semantic-ui/dist/semantic.min.css'

import * as Vue from 'vue'
import semanticVue from 'v-semantic'
Vue.use(semanticVue);
import * as alertify from 'alertify'
semanticVue.alertify(alertify);
import 'alertify.js/dist/css/alertify.css'

import vueClip from 'vue-clip'
Vue.use(vueClip);

// https://github.com/fuse-box/fuse-box/issues/542
//import 'vue-property-decorator' //This is not needed, I don't know why
import './business/unregistered'
import './components/route-menu/item.vue'
