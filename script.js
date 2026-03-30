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

const storageKey = 'todo-items';

const getTasks = () => {
	const raw = localStorage.getItem(storageKey);

	if (!raw) return [];

	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const saveTasks = (tasks) => {
	localStorage.setItem(storageKey, JSON.stringify(tasks));
};

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

const isTaskVisible = (task, filter) => {
	if (filter === 'active') return !task.done;
	if (filter === 'done') return task.done;
	return true;
};

const renderTasks = ({
	list,
	tasks,
	currentFilter,
	onToggleTask,
	onRemoveTask,
}) => {
	const filteredTasks = tasks
		.map((task, index) => ({ task, index }))
		.filter(({ task }) => isTaskVisible(task, currentFilter));

	list.innerHTML = '';

	filteredTasks.forEach(({ task, index }) => {
		const li = document.createElement('li');
		const leftSide = document.createElement('div');
		const text = document.createElement('span');
		const removeButton = document.createElement('button');
		const checkbox = document.createElement('input');

		checkbox.type = 'checkbox';
		checkbox.checked = task.done;
		text.textContent = task.text;
		text.classList.add('task-text');
		removeButton.textContent = 'Usuń';
		removeButton.type = 'button';

		if (task.done) {
			li.classList.add('done');
		}

		leftSide.append(checkbox, text);
		li.append(leftSide, removeButton);
		list.appendChild(li);

		checkbox.addEventListener('change', () => {
			onToggleTask(index, checkbox.checked);
		});

		removeButton.addEventListener('click', () => {
			onRemoveTask(index);
		});
	});
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
