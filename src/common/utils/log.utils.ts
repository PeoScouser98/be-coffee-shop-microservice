const __console__ = {
	success: (...args) => console.log('\x1b[1;42m Success \x1b[0m', ...args),
	error: (...args) => console.log('\x1b[1;31m Error \x1b[0m', ...args),
	info: (...args) => console.log('\x1b[1;106m Info \x1b[0m', ...args)
};

export default __console__;
