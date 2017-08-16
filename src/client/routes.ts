import Books from './routes/books.vue'
import Register from './routes/register.vue'

export default [{
	path: '/books',
	menu: 'Book list',
	component: Books
}, {
	path: '/register',
	menu: 'Register',
	component: Register
}];