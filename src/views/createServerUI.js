
const vscode = require(`vscode`);

const {Field, CustomUI} = vscode.extensions.getExtension(`halcyontechltd.code-for-ibmi`).exports;

module.exports = async () => {

  let wizard = new CustomUI();
  let field;

  field = new Field(`input`, `server`, `Server name`);
  field.description = `The name of the web services server to be created.`;
  wizard.addField(field);

  field = new Field(`input`, `startingPort`, `Starting port`);
  field.description = `The starting port number for generating ports required by the web services server.`;
  wizard.addField(field);

  field = new Field(`input`, `userid`, `User ID`);
  field.description = 
      `The profile the web services server will run under. ` + 
      `If paramter is not specified, QWSERVICE will be used, ` + 
      `unless you do not not have authority to use the profile, ` +
      `in which case the caller's (you) profile will be used.`;
  wizard.addField(field);

  field = new Field(`input`, `locationDirectory`, `Location directory`);
  field.description = 
      `The absolute path to the directory in which the web services server will be created. ` + 
      `If parameter is not specified, the server will be created in the <code>/www</code> directory.`;
  wizard.addField(field);

  field = new Field(`checkbox`, `noHttp`, `No HTTP`);
  field.description = 
      `A flag indicating whether or not an associated HTTP server ` + 
      `instance should be created. The default is to create an HTTP server.`;
  wizard.addField(field);

  field = new Field(`input`, `defaultKeystore`, `Default Keystore`);
  field.description = 
      `the path to the default keystore for the server. ` + 
      `If specified, the value MUST be the path to the SYSTEM keyStore path, ` +
      `<code>/QIBM/USERDATA/ICSS/CERT/SERVER/DEFAULT.KDB</code> and the parameter ` +
      `Default Keystore Password must be specified.`;
  wizard.addField(field);

  field = new Field(`password`, `defaultKeystorePassword`, `Default Keystore Password`);
  field.description = 
      `The password to the keystore. If this parameter ` + 
      `is specified, the parameter Default Keystore must also be specified.`;
  wizard.addField(field);

  wizard.addField(new Field(`submit`, `submitButton`, `Create`));

  const {panel, data} = await wizard.loadPage(`IWS: Create Server`);

  if (data) {
    panel.dispose();

    return data;
  } else {
    return undefined;
  }
}