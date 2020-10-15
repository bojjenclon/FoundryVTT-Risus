export const preloadTemplates = async function () {
	const templatePaths = [
		"systems/risus/templates/actor/character-sheet.html",

		"systems/risus/templates/actor/item-sheet.html",
	];

	return loadTemplates(templatePaths);
}
