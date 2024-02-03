## npm 方式安装及使用

### 安装

```bash
npm i guide-anime
```

### 使用

#### Vue

```javascript
import Guide from "guide-anime";
onMounted(() => {
  const guider = Guide();
  guider.setOptions({
    steps: [
      {
        element: "#vite",
      },
      {
        element: "#vue",
      },
    ],
  });
  guider.start();
});
```

#### React

```javascript
import Guide from "guide-anime";
componentDidMount() {
    const guider = Guide();
    guider.setOptions({
        steps: [
        {
            element: "#vite",
        },
        {
            element: "#vue",
        },
        ],
    });
    guider.start();
}
```

## CDN 方式

```html
<script src="https://cdn.jsdelivr.net/npm/guide-anime@1.0.1-test5/dist/guide-anime.umd.min.js"></script>
```
