const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

export function parseHtmlToAst(html) {
  let root;
  let currentParent;
  let stack = [];
  while (html) {
    let tagStart = html.indexOf('<');

    if (tagStart == 0) {
      const startMatch = parseStartTag();
      if (startMatch) {
        start(startMatch.tagName, startMatch.attrs);
        continue;
      }

      const endMatch = html.match(endTag);

      if (endMatch) {
        end(endMatch[1]);
        advance(endMatch[0].length);
      }
    }
    let text;
    if (tagStart > 0) {
      text = html.substring(0, tagStart);
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    let end;
    let attr;

    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      };

      advance(start[0].length);

      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }

      if (end) {
        advance(end[0].length);
        return match;
      }
    }
  }

  function advance(n) {
    html = html.substring(n);
  }

  function start(tagName, attrs) {
    let element = createAstElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    currentParent = element;
    stack.push(element);
  }

  function end() {
    let element = stack.pop();
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function chars(text) {
    text = text.trim();
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      });
    }
  }

  function createAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      attrs,
      children: [],
      parent
    };
  }

  return root;
}
