import chalk from 'chalk'

export class Log {
	static success(...args: any[]) {
		console.log(chalk.bold.green('Success: '), ...args)
	}
	static error(...args: any[]) {
		console.log(chalk.bold.red('Error: '), ...args)
	}
	static info(...args: any[]) {
		console.log(chalk.bold('Info: '), ...args)
	}
	static highlight(...args: any[]) {
		return chalk.bold.cyanBright(...args)
	}
}
