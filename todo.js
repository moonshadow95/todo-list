const toDoForm = document.querySelector(".js-toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  toDoList = document.querySelector(".js-toDoList"),
  finishedList = document.querySelector(".js-finishedList");

const TODOS_LS = "toDos";
const FINISH_LS = "finished";

let toDos = [];
let finished = [];

function backToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  toDoList.appendChild(li);
  btn.innerText = "✅";
  btn.removeEventListener("click", backToDo);
  btn.addEventListener("click", goFinished);
  const cleanF = finished.filter(function (toDo) {
    return toDo.id === parseInt(li.id);
  });
  const removeF = finished.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  finished = removeF;
  toDos.push(cleanF[0]);
  saveFinished();
  saveToDos();
}

function goFinished(event) {
  const btn = event.target;
  const li = btn.parentNode;
  finishedList.appendChild(li);
  btn.innerText = "⏪";
  btn.removeEventListener("click", goFinished);
  btn.addEventListener("click", backToDo);
  const cleanP = toDos.filter(function (toDo) {
    return toDo.id === parseInt(li.id);
  });
  const removeP = toDos.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  toDos = removeP;
  finished.push(cleanP[0]);
  saveFinished();
  saveToDos();
}

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  if (li.parentNode === toDoList) {
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function (toDo) {
      return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
  } else {
    finishedList.removeChild(li);
    const cleanF = finished.filter(function (toDo) {
      return toDo.id !== parseInt(li.id);
    });
    finished = cleanF;
    saveFinished();
  }
}

function saveToDos() {
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}
function saveFinished() {
  localStorage.setItem(FINISH_LS, JSON.stringify(finished));
}

function paintFinished(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const undoBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = finished.length + 1;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteToDo);
  undoBtn.innerText = "⏪";
  undoBtn.addEventListener("click", backToDo);
  span.innerHTML = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(undoBtn);
  li.id = newId;
  finishedList.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  finished.push(toDoObj);
  saveFinished();
}

function paintToDo(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const finBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = toDos.length + 1;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteToDo);
  finBtn.innerText = "✅";
  finBtn.addEventListener("click", goFinished);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(finBtn);
  li.id = newId;
  toDoList.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  toDos.push(toDoObj);
  saveToDos();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintToDo(currentValue);
  toDoInput.value = "";
}

function loadFinished() {
  const loadedFinished = localStorage.getItem(FINISH_LS);
  if (loadedFinished !== null) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach(function (toDo) {
      paintFinished(toDo.text);
    });
  }
}

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODOS_LS);
  if (loadedToDos !== null) {
    const parsedToDos = JSON.parse(loadedToDos);
    parsedToDos.forEach(function (toDo) {
      paintToDo(toDo.text);
    });
  }
}

function init() {
  loadToDos();
  loadFinished();
  toDoForm.addEventListener("submit", handleSubmit);
}
init();
