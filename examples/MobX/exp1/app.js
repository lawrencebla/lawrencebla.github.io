import {observable} from 'mobx';


class Todo {
    id = Math.random();
    @observable title = "";
    @observable finished = false;
}

const todoInst = new Todo();

console.log(todoInst.id);
console.log(todoInst.title);
console.log(todoInst.finished);

var appState = observable({
    timer: 0
});
console.log(appState.timer);