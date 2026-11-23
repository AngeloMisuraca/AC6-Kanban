let state = [
  { id: '101', title: 'Dissenyar base de dades', description: 'Crear esquema ERD', status: 'todo' },
  { id: '102', title: 'Configurar servidor Node', description: 'Express i CORS', status: 'in-progress' }
];

const board = document.getElementById('board');
const form = document.getElementById('new-task-form');
const template = document.getElementById('task-card-template');

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderAllTasks();
  setupEventListeners();
  updateTaskCount();
}

// MÒDUL 1 & 2
function createTaskCard(task) {
  // TODO M1.1: Clonar el template (.content.cloneNode(true))
  const clone = template.content.cloneNode(true);
  // TODO M2.1: Assignar l'ID a l'atribut data-task-id de la targeta
  const tarjeta = clone.querySelector('.task-card');
  tarjeta.dataset.taskId = task.id;
  // TODO M1.2: Omplir el títol (.task-title) i descripció (.task-desc)
  clone.querySelector('.task-title').textContent = task.title;
  clone.querySelector('.task-desc').textContent = task.description;

  // TODO M2.2: Assignar el valor del select (.task-status-select) segons task.status
  clone.querySelector('.task-status-select').value = task.status;

  // TODO M2.3: Si task.status === 'done', afegir la classe 'completed'
  if (task.status === 'done') {
    tarjeta.classList.add('completed');
  }
  // TODO M1.3: Retornar el node clonat
  return clone;
}

function renderAllTasks() {
  // TODO M1.4: Netejar els contenidors i renderitzar les tasques de 'state' al seu contenidor corresponent
  document.getElementById('todo-list').innerHTML = '';
  document.getElementById('in-progress-list').innerHTML = '';
  document.getElementById('done-list').innerHTML = '';

  state.forEach(task => {
    const tarjeta = createTaskCard(task);

    if (task.status === 'todo') {
      document.getElementById('todo-list').appendChild(tarjeta);
    } else if (task.status === 'in-progress') {
      document.getElementById('in-progress-list').appendChild(tarjeta);
    } else if (task.status === 'done') {
      document.getElementById('done-list').appendChild(tarjeta);
    }
  });
}


function setupEventListeners() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO M2.4: Afegir nova tasca a 'state' i renderitzar-la al DOM
    const title = document.getElementById('task-title-input').value;
    const description = document.getElementById('task-desc-input').value;
    const status = document.getElementById('task-status-select').value;

    const newTask = {
      id: Date.now().toString(),
      title: title,
      description: description,
      status: status
    };

    state.push(newTask);

    renderAllTasks();
    updateTaskCount();

    form.reset();
  });

  // TODO M2.5: Escoltar l'esdeveniment 'change' al board per quan es canvia l'estat del select:
  // - Trobar la targeta amb closest('.task-card')
  // - Llegir el nou estat i moure la targeta al seu contenidor (#todo-list, #in-progress-list, #done-list) amb appendChild
  // - Actualitzar l'estat a 'state' i la classe '.completed'

  board.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-status-select')) {
      const card = e.target.closest('.task-card');
      const taskId = card.dataset.taskId;
      const newStatus = e.target.value;

      let container;

      if (newStatus === 'todo') {
        container = document.getElementById('todo-list');
      } else if (newStatus === 'in-progress') {
        container = document.getElementById('in-progress-list');
      } else if (newStatus === 'done') {
        container = document.getElementById('done-list');
      }

      container.appendChild(card);

      const task = state.find(task => task.id === taskId);

      if (task) {
        task.status = newStatus;
      }

      if (newStatus === 'done') {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }

      updateTaskCount();
    }
  });

  board.addEventListener('click', (e) => {
    const target = e.target;

    // TODO M4: Acordió (closest + nextElementSibling + .collapsed)

    const accordionButton = target.closest('.column-header');

    if (accordionButton) {
      const content = accordionButton.nextElementSibling;
      content.classList.toggle('collapsed');
    }

    // TODO M2: Botó eliminar (closest + dataset.taskId + .remove())

    const deleteButton = target.closest('.btn-delete');

    if (deleteButton) {
      const card = deleteButton.closest('.task-card');
      const taskId = card.dataset.taskId;

      state = state.filter(task => task.id !== taskId);

      card.remove();

      updateTaskCount();
    }

    // TODO M3: Botons pujar/baixar (previousElementSibling / nextElementSibling + insertBefore)

    const upButton = target.closest('.btn-up');
    const downButton = target.closest('.btn-down');

    if (upButton) {
      const card = upButton.closest('.task-card');
      const previous = card.previousElementSibling;

      if (previous) {
        card.parentNode.insertBefore(card, previous);
      }
    }

    if (downButton) {
      const card = downButton.closest('.task-card');
      const next = card.nextElementSibling;

      if (next) {
        card.parentNode.insertBefore(next, card);
      }
    }
  });
}

// MÒDUL 5: WEB COMPONENT
class TaskBadge extends HTMLElement {
  constructor() {
    super();

    // TODO M5.1: Attach shadow root
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }

  static get observedAttributes() { return ['count']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    // TODO M5.2: Renderització de l'etiqueta

    const count = this.getAttribute('count') || '0';

    this.shadowRoot.innerHTML = `
      <style>
        span {
          display: inline-block;
          padding: 5px 10px;
          background-color: #333;
          color: white;
          border-radius: 15px;
          font-size: 14px;
          font-weight: bold;
        }
      </style>

      <span>${count}</span>
    `;
  }
}

customElements.define('task-badge', TaskBadge);

function updateTaskCount() {
  // TODO M5.3: Actualitzar l'atribut count de #global-badge

  const badge = document.getElementById('global-badge');

  const count = state.length;

  badge.setAttribute('count', count);
}