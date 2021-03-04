import React, { useState } from "react";
import ReactDOM from "react-dom";

const App: React.FC = () => {
  const [list, setList] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);

  const add = () => {
    list.push(list.length + 1);
    setList([...list]);
  };

  const remove = () => {
    list.pop();
    setList([...list]);
  };

  return (
    <div>
      {/** @ts-ignore  */}
      <div key={item} x-for={item in list}>{item}</div>
      <button onClick={add}>增加</button>
      <button onClick={remove}>减少</button>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
