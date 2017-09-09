const access = {
	admin: false,
	can(req) {
		return req?this.admin:true;
	}
}
export default access;
