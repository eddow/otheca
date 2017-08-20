
const punctuation = /[\t\.\,\-\_\'\"\!\?\>\<\(\)\&]/g;
__assign(String.prototype, {
	comparable() {
		var dups = 0, rv = this.replace(punctuation, ' ').latinise().toLowerCase().split(' ');
		rv.sort();
		while(dups<rv.length-1)
			if(rv[dups]===rv[dups+1]) rv.splice(dups, 1);
			else ++dups;
		return (rv[0]?rv:rv.slice(1)).join(' ');
	}
});