# js youtube api plugin

_take an `element` and transform into a `youtube` iframe_

## installation

> add right before closing body tag

```html
<body>
  <script src="/path/to/plugin/youtube-api.min.js"></script>
</body>
```

## usage

> plugin will automatically be called on
>
> `document.querySelectorAll('[data-yt-cli="true"])`

each `element` must also have the `[data-yt-videoid]`
with a valid `youtube` video id

### html

```html
<div class="some-class" data-yt-videoid="[VIDEO_ID]"></div>
```

### javascript

```javascript
const elems = document.querySelectorAll('.some-class');
window.youtubeClient(elems);
```

## options

| option          | description                                 | default       |
| --------------- | ------------------------------------------- | ------------- |
| `onAPIReady`    | _called once on `youtube api` ready         | `() => {}`    |
| `onStateChange` | _called on every `youtube api` state change | `() => {}`    |
| `playerVars`    | `playerVars` to pass into  `youtube api`    | _(see below)_ |

### full default options

```javascript
const defaults = {
  onAPIReady: () => {},
  onStateChange: () => {},
  playerVars: {
    autoplay: 0,
    controls: 0,
    loop: 1,
    modestbranding: 1,
    showinfo: 0,
    wmode: 'opaque'
  }
};
```
