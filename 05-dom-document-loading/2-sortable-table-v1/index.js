export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data
    this.render()
  }

  createHeaderTemplate() {
    return `    
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map((elem) => `    
            <div class="sortable-table__cell" data-id="${elem.id}" data-sortable="${elem.sortable}" data-order="">
              <span>${elem.title}</span>
            </div>      
          `).join('')}  
      </div>`
  }

  createTableTemplate() {
    return `
      ${this.data.map((item) =>
        `<a href="/products/${item.id}" class="sortable-table__row">
        ${this.headerConfig.map((elem) => {
          if (elem['template']) {
            return elem['template'](item[elem['id']])
          }
          return `<div class="sortable-table__cell">${item[elem['id']]}</div>`
          }).join('')
        } </a>`).join('')
      }`
  }

  createElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }

  render() {
    const elem = this.createElement(`
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.createHeaderTemplate()}
          <div data-element="body" class="sortable-table__body">
            ${this.createTableTemplate()}
          </div>
        </div>
      </div>`).firstElementChild;
    this.element = elem;
    this.subElements = this.getSubElements()
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]')
    let result = {}
    for (const i of Array.from(elements)) {
      result[i.dataset.element] = i
    }

    return result
  }

  sort(fieldValue, param = 'asc') {
    let order = param === 'asc' ? 1 : -1
    
    this.data = [...this.data].sort((a, b) => {
      if (typeof a[fieldValue] === 'number' && typeof b[fieldValue] === 'number') {
        return order * (a[fieldValue] - b[fieldValue])
      }
      else if (typeof a[fieldValue] === 'string' && typeof b[fieldValue] === 'string') {
        return order * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], { caseFirst: 'upper' })
      }
      return 0
    })
    this.subElements.body.innerHTML = this.createTableTemplate()
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    this.remove()
  }

}
