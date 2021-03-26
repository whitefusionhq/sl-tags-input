import { LitElement, html } from "lit-element"
import { render } from "lit-html"
import { repeat } from "lit-html/directives/repeat.js"

export default class SlTagsInput extends LitElement {
  static get properties() {
    return { 
      tags: { type: Array, reflect: true },
      single: { type: Boolean }
    }
  }

  constructor() {
    super()
    this.tags = []
    this.single = false
  }

  addTag(tagData) {
    if (this.tags.find(item => item.value == tagData.value)) return

    this.single ? this.tags = [tagData] : this.tags = this.tags.concat(tagData)
    this.querySelector("sl-input").value = ""
    this.shadowRoot.querySelector("sl-dropdown").hide()

    const tagsUpdateEvent = new CustomEvent("sl-tags-update", { detail: {
      tags: this.tags
    }})
    this.dispatchEvent(tagsUpdateEvent)
  }

  firstUpdated() {
    setTimeout(() => this.updateMenu([]), 0)
  }

  _handleKeyUp(event) {
    if (document.activeElement.localName == "sl-input") {
      if (event.key == "Enter") {
        if (event.target.value.length > 0) {
          this.addTag({label: event.target.value, value: event.target.value})
          event.target.value = ""
        }
      } else if (event.key == "ArrowDown") {
        this.shadowRoot.querySelector("sl-dropdown").show()
        this.querySelector("sl-menu-item").setFocus()
      } else if (event.target.value.length > 1) {
        clearTimeout(this.inputTimeout)
        this.inputTimeout = setTimeout(() => {
          const inputEvent = new CustomEvent("sl-tags-search-input", { detail: {
            value: event.target.value
          }})
          this.dispatchEvent(inputEvent)
        }, 250)
      } else {
        this.shadowRoot.querySelector("sl-dropdown").hide()
      }
    } else {
      if (event.key == "Enter") {
        const selectedItem = document.activeElement
        this.shadowRoot.querySelector("sl-dropdown").hide()
        if (selectedItem && selectedItem.localName == "sl-menu-item") this.addTag({label: selectedItem.textContent, value: selectedItem.value})
      }
    }
  }

  _handleTagClear(event) {
    this.tags = this.tags.filter(item => item.value != event.target.dataset.value)

    const tagsUpdateEvent = new CustomEvent("sl-tags-update", { detail: {
      tags: this.tags
    }})
    this.dispatchEvent(tagsUpdateEvent)
  }

  _handleMenuSelect(event) {
    const selectedItem = event.detail.item
    this.addTag({label: selectedItem.textContent, value: selectedItem.value})
  }

  _handleMenuHide(event) {
    this.querySelector("sl-input").setFocus()
  }

  render() {
    return html`
      <style>
        :host { display: block; }
        sl-tag { margin-right: var(--sl-spacing-x-small); }
      </style>
      <div style="margin-bottom:var(--sl-spacing-medium)">
        ${repeat(this.tags, (tag) => tag.value, (tag, index) => html`
          <sl-tag data-value="${tag.value}" clearable @sl-clear="${this._handleTagClear}">${tag.label}</sl-tag>
        `)}
      </div>
      <slot name="input" @keyup="${this._handleKeyUp}"></slot>
      <sl-dropdown @sl-after-hide="${this._handleMenuHide}" distance="-10">
        <slot name="menu" @sl-select="${this._handleMenuSelect}"></slot>
      </sl-dropdown>
    `;
  }

  updateMenu(items) {
    if (items.length == 0) {
      items.push({placeholder: true, label: this.querySelector("[slot=menu]").getAttribute("placeholder") || "No results found"})
    }
    setTimeout(() => {
      const menuTmpl = html`
        ${repeat(items, (item) => item.value, (item, index) => html`
          <sl-menu-item .value="${item.value}" ?disabled="${item.placeholder}">${item.label}</sl-menu-item>
        `)}
      `
      render(menuTmpl, this.querySelector("[slot=menu]"))
      if (this.querySelector("sl-input").value.length > 1) {
        this.shadowRoot.querySelector("sl-dropdown").show()
      }
    }, 0)
  }
}

customElements.define("sl-tags-input", SlTagsInput)
