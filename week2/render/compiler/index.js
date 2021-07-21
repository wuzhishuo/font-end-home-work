import { parseHtmlToAst } from './ast-parser.js';
import { generate } from './generate.js';
export function compileToRenderFunction(html) {
  const ast = parseHtmlToAst(html);
  const code = generate(ast);
  return new Function(`with(this){return ${code}}`);
}
