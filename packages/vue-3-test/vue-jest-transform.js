const { compile } = require('@vue/compiler-dom');

module.exports = {
  process(src) {
    const templateMatch = src.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = src.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const template = templateMatch ? templateMatch[1].trim() : '';
    let script = scriptMatch ? scriptMatch[1].trim() : '';

    // Convert ES imports from vue to requires
    script = script.replace(/import\s+\{([^}]*)\}\s+from\s+'vue';?/g, (m, g1) => {
      return `const {${g1}} = require('vue');`;
    });

    // Collect variable and function names for return
    const names = [];
    const varRegex = /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)/g;
    const funcRegex = /function\s+([a-zA-Z_$][\w$]*)/g;
    let m;
    while ((m = varRegex.exec(script))) names.push(m[1]);
    while ((m = funcRegex.exec(script))) names.push(m[1]);

    const returnBlock = names.length ? `return { ${names.join(', ')} };` : '';

    let { code: render } = compile(template, { mode: 'function' });
    render = render.replace(/^return\s+/m, '');
    const output = `const { defineComponent } = require('vue');\n${script}\n${render}\nmodule.exports = defineComponent({ render, setup() {\n${returnBlock}\n} });`;

    return { code: output };
  },
};
