export const isJSON = (value: any) => {
	try {
		return !!JSON.parse(value)
	} catch (error) {
		return false
	}
}
