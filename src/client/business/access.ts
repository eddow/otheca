const access = {
	admin: true,
	can(req) {
		return req?this.admin:true;
	}
}
export default access;