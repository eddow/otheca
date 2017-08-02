import * as Books from './routes/books.vue'
import 'models/book'
import 'ts-json-schema-decorator'
export default [{
	path: '/books',
	component: Books
}];