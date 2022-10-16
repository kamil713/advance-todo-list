




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