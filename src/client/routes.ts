import Books from './routes/books.vue'
import Register1 from './routes/register1.vue'
import RegisterRex from './routes/registerRex.vue'

const MenuContainer = {
  template: `<router-view></router-view>`
}

export default [{
	path: '/books',
	menu: 'Book list',
	component: Books
}, {
	menu: 'Register',
	component: MenuContainer,
	path: '/register',
	children: [{
		menu: 'Each',
		component: Register1,
		path: 'each'
	}, {
		menu: 'Group',
		component: RegisterRex,
		path: 'rex'
	}]
}];