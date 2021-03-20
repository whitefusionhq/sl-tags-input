import { LitElement, html } from "lit-element"
import { render } from "lit-html"
import { repeat } from "lit-html/directives/repeat.js"

/*
You'll need to make sure you've imported these Shoelace components:

import SlDropdown from "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js"
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon.js"
import SlIconButton from "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js"
import SlInput from "@shoelace-style/shoelace/dist/components/input/input.js"
import SlMenu from "@shoelace-style/shoelace/dist/components/menu/menu.js"
import SlMenuItem from "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js"
import SlTag from "@shoelace-style/shoelace/dist/components/tag/tag.js"
*/

class SlTagsInput extends LitElement {
  static get properties() {
    return { 
      tags: { type: Array, reflect: true }
    }
  }
  
  constructor() {
    super()
    this.tags = []
  }
  
  addTag(tagData) {
    if (this.tags.find(item => item.value == tagData.value)) return

    this.tags = this.tags.concat(tagData)
    this.querySelector("sl-input").value = ""
    this.shadowRoot.querySelector("sl-dropdown").hide()
  }
  
  connectedCallback() {
    super.connectedCallback()
    const inputEvent = new CustomEvent("sl-tags-search-input", { detail: {
      value: this.querySelector("sl-input").value
    }})
    this.dispatchEvent(inputEvent)
  }
  
  handleKeyUp = (event) => {
    if (document.activeElement.localName == "sl-input") {
      if (event.key == "Enter") {
        this.addTag({label: event.target.value, value: event.target.value})
        event.target.value = ""
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
        if (selectedItem?.localName == "sl-menu-item") this.addTag({label: selectedItem.textContent, value: selectedItem.value})
      }
    }
  }
  
  handleTagClear = (event) => {
    this.tags = this.tags.filter(item => item.value != event.target.dataset.value)
    this.requestUpdate()
  }
  
  handleMenuSelect = (event) => {
    const selectedItem = event.detail.item
    this.addTag({label: selectedItem.textContent, value: selectedItem.value})
  }
  
  handleMenuHide = (event) => {
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
          <sl-tag data-value="${tag.value}" clearable @sl-clear="${this.handleTagClear}">${tag.label}</sl-tag>
        `)}
      </div>
      <slot name="input" @keyup="${this.handleKeyUp}"></slot>
      <sl-dropdown @sl-after-hide="${this.handleMenuHide}" distance="-10">
        <slot name="menu" @sl-select="${this.handleMenuSelect}"></slot>
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
