import Books from './routes/books.vue'
import Register1 from './routes/register1.vue'
import RegisterRex from './routes/registerRex.vue'
import Upload from './routes/upload.vue'

const MenuContainer = {
  template: `<router-view></router-view>`
}

export default [{
	path: '/books',
	menu: 'Book list',
	name: 'books',
	component: Books
}, {
	admin: true,
	menu: 'Register',
	component: MenuContainer,
	path: '/register',
	children: [{
		menu: 'Each',
		component: Register1,
		name: 'reg1',
		path: 'each'
	}, {
		menu: 'Group',
		component: RegisterRex,
		name: 'regRex',
		path: 'rex'
	}]
}, {
	menu: 'Upload',
	component: Upload,
	path: '/upload',
}];