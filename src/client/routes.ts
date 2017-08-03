import * as Books from './routes/books.vue'
import * as Register from './routes/register.vue'
import 'models/book'
import 'ts-json-schema-decorator'
export default [{
	path: '/books',
	component: Books
}, {
	path: '/register',
	component: Register
}];