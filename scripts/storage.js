/**
 * @typedef {Object} Task
 * @property {string} text
 * @property {boolean} done
 */

const storageKey = 'todo-items';

export const getTasks = () => {
	const raw = localStorage.getItem(storageKey);

	if (!raw) return [];

	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveTasks = (tasks) => {
	localStorage.setItem(storageKey, JSON.stringify(tasks));
};
