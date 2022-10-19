/* MODAL */
class Modal {
	constructor() {
		this.addTaskModal = document.getElementById('add-modal');
		this.addTaskButton =
			document.getElementById('main-header').lastElementChild;
		this.backdrop = document.getElementById('backdrop');
		this.cancelAddTaskButton = this.addTaskModal.querySelector('.btn--passive');
		this.confirmAddTaskButton = this.cancelAddTaskButton.nextElementSibling;
		this.userInputs = this.addTaskModal.querySelectorAll('input');
	}

	toggleBackdrop() {
		this.backdrop.classList.toggle('visible');
	}

	renderNewTaskElement(id, title, desc, extraInfo) {
		const newTaskElement = document.createElement('li');
		newTaskElement.id = id;
		newTaskElement.dataset.extraInfo = extraInfo;
		newTaskElement.className = 'task';
		newTaskElement.innerHTML = `
			<h2>${title}</h2>
			<p>${desc}</p>
			<button class="alt">More Info</button>
			<button>Finish</button>
		`;
		const listRoot = document.querySelector(`#active-tasks ul`);
		listRoot.append(newTaskElement);
		newTaskElement.scrollIntoView({ behavior: 'smooth' });
	}

	closeTaskModal() {
		this.addTaskModal.classList.remove('visible');
	}

	showTaskModal() {
		this.addTaskModal.classList.add('visible');
		this.toggleBackdrop();
	}

	clearTaskInput() {
		for (const usrInput of this.userInputs) {
			usrInput.value = '';
		}
	}

	cancelAddTaskHandler() {
		this.closeTaskModal();
		this.toggleBackdrop();
		this.clearTaskInput();
	}

	addTaskHandler() {
		const titleValue = this.userInputs[0].value;
		const descriptionValue = this.userInputs[1].value;
		const extraValue = this.userInputs[2].value;

		if (
			titleValue.trim() === '' ||
			descriptionValue.trim() === '' ||
			extraValue.trim() === ''
		) {
			alert('Please enter valid values.');
			return;
		}

		const totalTasks = document.getElementsByTagName('li').length;

		const newTask = {
			id: `t${totalTasks + 1}`,
			title: titleValue,
			description: descriptionValue,
			extraInfo: extraValue,
		};

		this.closeTaskModal();
		this.toggleBackdrop();
		this.clearTaskInput();
		this.renderNewTaskElement(
			newTask.id,
			newTask.title,
			newTask.description,
			newTask.extraInfo
		);

		const activeTasksList = new TaskList('active');
		const finishedTasksList = new TaskList('finished');
		activeTasksList.setSwitchHandlerFunction(
			finishedTasksList.addTask.bind(finishedTasksList)
		);
		finishedTasksList.setSwitchHandlerFunction(
			activeTasksList.addTask.bind(activeTasksList)
		);
	}

	backdropClickHandler() {
		this.closeTaskModal();
		this.toggleBackdrop();
		this.clearTaskInput();
	}

	init() {
		this.addTaskButton.addEventListener('click', this.showTaskModal.bind(this));
		this.backdrop.addEventListener(
			'click',
			this.backdropClickHandler.bind(this)
		);
		this.cancelAddTaskButton.addEventListener(
			'click',
			this.cancelAddTaskHandler.bind(this)
		);
		this.confirmAddTaskButton.addEventListener(
			'click',
			this.addTaskHandler.bind(this)
		);
	}
}


/* TODO LOGIC */
class DOMHelper {
	static clearEventListeners(element) {
		const clonedElement = element.cloneNode(true);
		element.replaceWith(clonedElement);
		return clonedElement;
	}

	static moveElement(elementId, newDestinationSelector) {
		const element = document.getElementById(elementId);
		const destinationElement = document.querySelector(newDestinationSelector);
		destinationElement.append(element);
		element.scrollIntoView({ behavior: 'smooth' });
	}
}

class Component {
	constructor(hostElementId, insertBefore = false) {
		if (hostElementId) {
			this.hostElement = document.getElementById(hostElementId);
		} else {
			this.hostElement = document.body;
		}
		this.insertBefore = insertBefore;
	}

	detach() {
		if (this.element) {
			this.element.remove();
		}
	}

	attach() {
		this.hostElement.insertAdjacentElement(
			this.insertBefore ? 'afterbegin' : 'beforeend',
			this.element
		);
	}
}

class Tooltip extends Component {
	constructor(closeNotifierFunction, text, hostElementId) {
		super(hostElementId);
		this.closeNotifier = closeNotifierFunction;
		this.text = text;
		this.create();
	}

	closeTooltip = () => {
		this.detach();
		this.closeNotifier();
	};

	create() {
		const tooltipElement = document.createElement('div');
		tooltipElement.className = 'task';
		const tooltipTemplate = document.getElementById('tooltip');
		const tooltipBody = document.importNode(tooltipTemplate.content, true);
		tooltipBody.querySelector('p').textContent = this.text;
		tooltipElement.append(tooltipBody);

		const hostElPosLeft = this.hostElement.offsetLeft;
		const hostElPosTop = this.hostElement.offsetTop;
		const hostElHeight = this.hostElement.clientHeight;
		const parentElementScrolling = this.hostElement.parentElement.scrollTop;

		const x = hostElPosLeft + 20;
		const y = hostElPosTop + hostElHeight - parentElementScrolling - 10;

		tooltipElement.style.position = 'absolute';
		tooltipElement.style.left = x + 'px'; // 500px
		tooltipElement.style.top = y + 'px';

		tooltipElement.addEventListener('click', this.closeTooltip);
		this.element = tooltipElement;
	}
}

class TaskItem {
	hasActiveTooltip = false;

	constructor(id, updateTaskListsFunction, type) {
		this.id = id;
		this.updateTaskListsHandler = updateTaskListsFunction;
		this.connectMoreInfoButton();
		this.connectSwitchButton(type);
	}

	showMoreInfoHandler() {
		if (this.hasActiveTooltip) {
			return;
		}
		const taskElement = document.getElementById(this.id);
		const tooltipText = taskElement.dataset.extraInfo;
		const tooltip = new Tooltip(
			() => {
				this.hasActiveTooltip = false;
			},
			tooltipText,
			this.id
		);
		tooltip.attach();
		this.hasActiveTooltip = true;
	}

	connectMoreInfoButton() {
		const taskItemElement = document.getElementById(this.id);
		const moreInfoBtn = taskItemElement.querySelector('button:first-of-type');
		if (moreInfoBtn.getAttribute('listener') !== 'true') {
			moreInfoBtn.addEventListener('click', () => {
				this.showMoreInfoHandler();
				moreInfoBtn.setAttribute('listener', 'true');
			});
		}
	}

	connectSwitchButton(type) {
		const taskItemElement = document.getElementById(this.id);
		let switchBtn = taskItemElement.querySelector('button:last-of-type');
		switchBtn = DOMHelper.clearEventListeners(switchBtn);
		switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
		switchBtn.addEventListener(
			'click',
			this.updateTaskListsHandler.bind(null, this.id)
		);
	}

	update(updateTaskListsFn, type) {
		this.updateTaskListsHandler = updateTaskListsFn;
		this.connectSwitchButton(type);
	}
}

class TaskList {
	tasks = [];

	constructor(type) {
		this.type = type;
		const taskItems = document.querySelectorAll(`#${type}-tasks li`);
		for (const taskItem of taskItems) {
			this.tasks.push(
				new TaskItem(taskItem.id, this.switchTask.bind(this), this.type)
			);
		}
		console.log(this.tasks);
	}

	setSwitchHandlerFunction(switchHandlerFunction) {
		this.switchHandler = switchHandlerFunction;
	}

	addTask(task) {
		this.tasks.push(task);
		DOMHelper.moveElement(task.id, `#${this.type}-tasks ul`);
		task.update(this.switchTask.bind(this), this.type);
	}

	switchTask(taskId) {
		this.switchHandler(this.tasks.find((t) => t.id === taskId));
		this.tasks = this.tasks.filter((t) => t.id !== taskId);
	}
}

class App {
	static init() {
		const activeTasksList = new TaskList('active');
		const finishedTasksList = new TaskList('finished');
		activeTasksList.setSwitchHandlerFunction(
			finishedTasksList.addTask.bind(finishedTasksList)
		);
		finishedTasksList.setSwitchHandlerFunction(
			activeTasksList.addTask.bind(activeTasksList)
		);

		const modal = new Modal();
		modal.init();
	}
}

App.init();

/* EASTEREGG */
const footerEmoji = document.querySelector('footer p');

const createEGTooltip = (e) => {
	const tooltipParent = e.target;
	const tooltipText = e.target.dataset.easterEgg;

	const newTooltip = document.createElement('span');
	newTooltip.innerHTML = tooltipText;
	newTooltip.className = 'easteregg';

	tooltipParent.appendChild(newTooltip);
};

const removeEasteregg = (e) => {
	const easteregg = e.target.querySelector('.easteregg');
	if (easteregg) {
		easteregg.remove();
	}
};

footerEmoji.addEventListener('mouseover', createEGTooltip);
footerEmoji.addEventListener('mouseleave', removeEasteregg);
footerEmoji.addEventListener('click', () => {
	window.open('https://github.com/kamil713/advance-todo-list');
});
