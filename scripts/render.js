/**
 * @typedef {Object} Task
 * @property {string} text
 * @property {boolean} done
 */

const isTaskVisible = (task, filter) => {
	if (filter === 'active') return !task.done;
	if (filter === 'done') return task.done;
	return true;
};

export const renderTasks = ({
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
