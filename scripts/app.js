import { getTasks, saveTasks } from './storage.js';
import { renderTasks } from './render.js';

const form = document.querySelector('form');
const input = document.querySelector('input');
const list = document.querySelector('ul');
const filterButtons = document.querySelectorAll('.filter-button');

/**
 * @typedef {Object} Task
 * @property {string} text
 * @property {boolean} done
 */

/**
 * @typedef {Object} AppState
 * @property {Task[]} tasks
 * @property {'all' | 'active' | 'done'} currentFilter
 */

const state = {
	tasks: getTasks(),
	currentFilter: 'all',
};

const setFilter = (filter) => {
	state.currentFilter = filter;

	filterButtons.forEach((button) => {
		button.classList.toggle('active', button.dataset.filter === filter);
	});

	render();
};

const render = () => {
	renderTasks({
		list,
		tasks: state.tasks,
		currentFilter: state.currentFilter,
		onToggleTask: (index, checked) => {
			state.tasks[index].done = checked;
			saveTasks(state.tasks);
			render();
		},
		onRemoveTask: (index) => {
			state.tasks = state.tasks.filter((_, taskIndex) => taskIndex !== index);
			saveTasks(state.tasks);
			render();
		},
	});
};

const handleSubmit = (event) => {
	event.preventDefault();

	const value = input.value.trim();
	if (!value) return;

	state.tasks.unshift({ text: value, done: false });
	saveTasks(state.tasks);

	input.value = '';
	render();
};

form.addEventListener('submit', handleSubmit);

filterButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const filter = button.dataset.filter;
		if (filter === 'all' || filter === 'active' || filter === 'done') {
			setFilter(filter);
		}
	});
});

render();
