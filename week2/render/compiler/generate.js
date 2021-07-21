export function generate(el) {
  let code = `_c('${el.tag}',${
    el.attrs.length > 0 ? `${formatProps(el.attrs)}` : 'undefined'
  },${getChildren(el)})`;
  return code;
}

function formatProps(attrs) {
  let attrStr = '';

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    let styleAttr = {};
    if (attr.name == 'style') {
      attr.value.split(';').forEach(style => {
        let [key, value] = style.split(':');
        styleAttr[key] = value;
      });
      attr.value = styleAttr;
    }

    attrStr += `'${attr.name}':${JSON.stringify(attr.value)},`;
  }

  return `{${attrStr.slice(0, -1)}}`;
}

function getChildren(el) {
  const children = el.children;
  if (children) {
    return children.map(c => generateChild(c)).join(',');
  }
}

function generateChild(node) {
  if (node.type === 1) {
    return generate(node);
  } else if (node.type === 3) {
    const reg = /\{\{(.*?)\}\}/g;
    let text = node.text;
    if (!reg.test(text)) {
      return `_v(${JSON.stringify(node.text)})`;
    }

    let match;
    let lastIndex = (reg.lastIndex = 0);
    let textAttr = [];

    while ((match = reg.exec(text))) {
      let index = match.index;
      if (index > lastIndex) {
        textAttr.push(`${text.slice(lastIndex, index)}`);
      }
      textAttr.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      textAttr.push(`${text.slice(lastIndex)}`);
    }

    return textAttr.join('+');
  }
}
