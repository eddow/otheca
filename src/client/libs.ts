import 'axios'
//import 'models/book'
import * as S from 'string'
S.extendPrototype();
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.css'

//import manually as fuse-box doesn't import when referenced only in .vue
import 'vue-property-decorator'
import './components/kwdList.vue'
import './components/keyworded.vue'
import './components/routeMenu.vue'
import './business/unregistered'
import './business/access'