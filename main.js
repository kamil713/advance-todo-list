/* MODAL */
const addTaskModal = document.getElementById('add-modal')
const addTaskButton = document.getElementById('main-header').lastElementChild;
const backdrop = document.getElementById('backdrop') 
const cancelAddTaskButton = addTaskModal.querySelector('.btn--passive');
const confirmAddTaskButton = cancelAddTaskButton.nextElementSibling
const userInputs = addTaskModal.querySelectorAll('input')

const tasks = []

const toggleBackdrop = () => {
  backdrop.classList.toggle('visible')
}

const closeTaskModal = () => {
  addTaskModal.classList.remove('visible')
}

const showTaskModal = () => {
  addTaskModal.classList.add('visible')
  toggleBackdrop()
}

const clearTaskInput = () => {
  for (const usrInput of userInputs) {
    usrInput.value = '';
  }
};

const cancelAddTaskHandler = () => {
  closeTaskModal()
  toggleBackdrop()
  clearTaskInput()
}

const addTaskHandler = () => {
  const titleValue = userInputs[0].value;
  const descriptionValue = userInputs[1].value;
  const extraValue = userInputs[2].value;

  if (
    titleValue.trim() === '' ||
    descriptionValue.trim() === '' ||
    extraValue.trim() === ''
  ) {
    alert('Please enter valid values.');
    return;
  }

  const newTask = {
    title: titleValue,
    description: descriptionValue,
    extraInfo: extraValue
  }

  tasks.push(newTask)
  console.log(tasks);
  closeTaskModal()
  toggleBackdrop()
  clearTaskInput()
};

const backdropClickHandler = () => {
  closeTaskModal()
  toggleBackdrop()
  clearTaskInput()
}

addTaskButton.addEventListener('click', showTaskModal)
backdrop.addEventListener('click', backdropClickHandler)
cancelAddTaskButton.addEventListener('click', cancelAddTaskHandler)
confirmAddTaskButton.addEventListener('click', addTaskHandler)


/* EASTEREGG */
const footerEmoji = document.querySelector('footer p')

const createEGTooltip = (e) => {
  const tooltipParent = e.target;
  const tooltipText = e.target.dataset.easterEgg

  const newTooltip = document.createElement('span');
  newTooltip.innerHTML = tooltipText;
  newTooltip.className = 'easteregg'

  tooltipParent.appendChild(newTooltip)
}

const removeEasteregg = (e) => {
  const easteregg = e.target.querySelector('.easteregg')
  if (easteregg) {
    easteregg.remove()
  }
}

footerEmoji.addEventListener('mouseover', createEGTooltip)
footerEmoji.addEventListener('mouseleave', removeEasteregg)
footerEmoji.addEventListener('click', () => {
  window.open("https://github.com/kamil713/advance-todo-list")
})