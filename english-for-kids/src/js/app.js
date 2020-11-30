import { MenuComponents } from './components/menu.components';

export class App {
  constructor(name) {
    this.name = name;
    this.menu = new MenuComponents();
  }

  render(container, template, place = 'beforeend') {
    container.insertAdjacentHTML(place, template);
  }

  initApp() {
    this.menu.init();
  }
}
