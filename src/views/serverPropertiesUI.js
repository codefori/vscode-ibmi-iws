
const vscode = require(`vscode`);

const {Field, CustomUI} = vscode.extensions.getExtension(`halcyontechltd.code-for-ibmi`).exports;

module.exports = async (props) => {

  let wizard = new CustomUI();
  let field;

  props.forEach((prop, index) => {
    field = new Field(`input`, `prop${index}`, prop.name);
    field.default = prop.value;
    field.readonly = true;
    wizard.addField(field);
  });

  wizard.addField(new Field(`submit`, `submitButton`, `Close`));

  const {panel, data} = await wizard.loadPage(`IWS: Properties`);

  if (data) {
    panel.dispose();
  }
}