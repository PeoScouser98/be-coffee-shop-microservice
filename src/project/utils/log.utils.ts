import { Exclude } from 'class-transformer'

/** @constant */
export const LOG_COLOURS = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',

	fg: {
		black: '\x1b[30m',
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		white: '\x1b[37m',
		gray: '\x1b[90m',
		crimson: '\x1b[38m' // Scarlet
	},
	bg: {
		black: '\x1b[40m',
		red: '\x1b[41m',
		green: '\x1b[42m',
		yellow: '\x1b[43m',
		blue: '\x1b[44m',
		magenta: '\x1b[45m',
		cyan: '\x1b[46m',
		white: '\x1b[47m',
		gray: '\x1b[100m',
		crimson: '\x1b[48m'
	}
}

export default class Log {
	static print = ({
		message,
		foreground,
		transform
	}: {
		foreground?: keyof (typeof LOG_COLOURS)['fg']
		transform?: keyof Exclude<typeof LOG_COLOURS, 'fg' | 'bg'>
		message: string
	}) =>
		`${LOG_COLOURS.fg?.[foreground] || ''}${LOG_COLOURS?.[transform] || ''}${message}${
			LOG_COLOURS.reset
		}`
	static success = (...args) =>
		console.log(
			`${LOG_COLOURS.bg.green}${LOG_COLOURS.blink}${LOG_COLOURS.bold}${LOG_COLOURS.fg.black} Success ${LOG_COLOURS.reset}`,
			...args
		)
	static error = (...args) =>
		console.log(
			`${LOG_COLOURS.bg.red}${LOG_COLOURS.blink}${LOG_COLOURS.bold}${LOG_COLOURS.fg.black} Error ${LOG_COLOURS.reset}`,
			...args
		)
	static info = (...args) =>
		console.log(
			`${LOG_COLOURS.bg.cyan}${LOG_COLOURS.blink}${LOG_COLOURS.bold}${LOG_COLOURS.fg.black} Info ${LOG_COLOURS.reset}`,
			...args
		)
}
