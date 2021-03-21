# sl-tags-input

A web component based on Shoelace + LitElement to provide an autocomplete input featuring selected tags and dropdown choices.

_under construction_

**[DEMO on CodePen](https://codepen.io/jaredcwhite/pen/LYbmwgz)**

## Usage

Make sure you've imported all necessary Shoelace components used by sl-tags-input:

```js
import SlDropdown from "@shoelace-style/shoelace/dist/components/dropdown/dropdown"
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon"
import SlIconButton from "@shoelace-style/shoelace/dist/components/icon-button/icon-button"
import SlInput from "@shoelace-style/shoelace/dist/components/input/input"
import SlMenu from "@shoelace-style/shoelace/dist/components/menu/menu"
import SlMenuItem from "@shoelace-style/shoelace/dist/components/menu-item/menu-item"
import SlTag from "@shoelace-style/shoelace/dist/components/tag/tag"
```

Then import sl-tags-input:

```js
import SlTagsInput from "sl-tags-input"
```

In your HTML, add the component marktup with its necessary slot dependencies:

```html
<sl-tags-input>
  <sl-input slot="input" placeholder="Start typing…"></sl-input>
  <sl-menu slot="menu">
  </sl-menu>
</sl-tags-input>
```

To populate the dropdown menu based on user input, listen for the `sl-tags-search-input` event (debouced so it only fires a few times a second). Then use the `updateMenu` method with `value`/`label` keys:

```js
document.querySelector("sl-tags-input").addEventListener("sl-tags-search-input", (event) => {
  const value = event.detail.value // what the user typed so far
  // examples:
  event.target.updateMenu([
    {value: "item1", label: event.detail.value + (Math.random() * 300).toFixed()},
    {value: "item2", label: event.detail.value.toUpperCase()}
  ])
})
```

You can listen for the `sl-tags-update` event every time a tag is added or cleared.

Finally, the `tags` method is available on the element directly for retrieving the current list of tags. Use that for saving as JSON:

```js
// get an array of value/label objects:
const tagsJSON = JSON.stringify(document.querySelector("sl-tags-input").tags)
// or just an array of values:
const valuesJSON = JSON.stringify(document.querySelector("sl-tags-input").tags.map(item => item.value))
```

You can also include a JSON string of tag objcts in the `tags` attribute of `sl-tags-input` to populate the component with tags on startup:

```html
<sl-tags-input tags='[{"label": "Tag Here", "value": "tag-123"}]'>...</sl-tags-input>
```

## License

MIT
