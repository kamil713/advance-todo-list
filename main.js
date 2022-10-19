/* MODAL */

/* TODO LOGIC */

class Modal {
	constructor() {
		this.tasks = [];
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

		this.tasks.push(newTask);
		console.log(this.tasks);
		this.closeTaskModal();
		this.toggleBackdrop();
		this.clearTaskInput();
		this.renderNewTaskElement(
			newTask.id,
			newTask.title,
			newTask.description,
			newTask.extraInfo
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

class App {
	static init() {
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
