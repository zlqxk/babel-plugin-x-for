### 将babel-plugin-x-if配置到babelrc下
```js
  {
    "plugins": [
      ["babel-plugin-x-for"],
    ]
  }
```
### 这样你就可以在react中使用x-for模板语法
```js
  <div key={item} x-for={item in arr}>
    hello world
  </div>
```

### 他会帮你装换成下面的格式，并且自动帮你做了数组的判断
```js
  {
    Array.isArray(arr) && arr.map(item => {
      return <div key={item}> hello world</div>
    })
  }
```

### 也支持使用index
```js
  <div key={index} x-for={(item, index) in arr}>
    hello world
  </div>
```
```js
  {
    Array.isArray(arr) && arr.map((item, index) => {
      return <div key={index}> hello world</div>
    })
  }
```
