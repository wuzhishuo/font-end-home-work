import { compileToRenderFunction } from './compiler/index.js';
import { createElementNode, createTextNode } from './vdom/vnode.js';

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
  return createElementNode(...arguments);
};

Vue.prototype._s = function(value) {
  if (value == null) return;
  return typeof value == 'object' ? JSON.stringify(value) : value;
};

Vue.prototype._v = function(text) {
  return createTextNode(text);
};

function createElement(vnode) {
  const { tag, props, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProps(vnode);
    children.forEach(child => {
      vnode.el.appendChild(createElement(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function updateProps(vnode) {
  const el = vnode.el;
  const props = vnode.props || {};

  for (let key in props) {
    if (key === 'style') {
      for (let sKey in props.style) {
        el.style[sKey] = props.style[sKey];
      }
    } else if (key == 'class') {
      el.className = props[key];
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}

const renderVnode = compileToRenderFunction(html);
let vm = new Vue();
const vnode = renderVnode.call(vm);
document.body.appendChild(createElement(vnode));
console.log(vnode);
