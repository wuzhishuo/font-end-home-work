import { compileToRenderFunction } from './compiler/index.js';
import { createElement, createTextNode } from './vdom/vnode.js';

let html = `<div class="newslist" style="color: #000;font-size: 14px;">
<div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
<div class="date" v-if="info.showDate">{{info.name}}</div>
<div class="img">{{info.name}}</div>
</div>`;

function Vue() {
  this.image = '';
  this.info = {
    name: '吴志烁'
  };
}

Vue.prototype._c = function() {
  console.log(arguments);
  return createElement(...arguments);
};

Vue.prototype._s = function(value) {
  if (value == null) return;
  return typeof value == 'object' ? JSON.stringify(value) : value;
};

Vue.prototype._v = function(text) {
  return createTextNode(text);
};

const render = compileToRenderFunction(html);
let vm = new Vue();
const vnode = render.call(vm);
console.log(vnode);
