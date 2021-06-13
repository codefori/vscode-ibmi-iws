
const vscode = require(`vscode`);

const {instance} = vscode.extensions.getExtension(`halcyontechltd.code-for-ibmi`).exports;

module.exports = class IWS {
  /**
   * @param {'listWebServicesServers'|'listWebServices'} command 
   * @param {*} paramaters 
   * @returns {Promise<{code: number, stdout: string, stderr: string}>}
   */
  static async run(command, paramaters) {
    const connection = instance.getConnection();
    const result = await connection.qshCommand(`/QIBM/ProdData/OS/WebServices/bin/${command}.sh ${paramaters ? paramaters : ``}`, undefined, 1);

    if (result.code === 0 || result.code === null) {
      return result.stdout;
    } else {
      //Even if these commands error.. they still write
      //to standard out. Probably dumb Java stuff.
      throw new Error({
        code: result.code,
        output: result.stdout
      })
    }
  }

  /**
   * @returns {Promise<{name: string, running: boolean}[]>|false}
   */
  static async getServers() {
    try {
      const result = await this.run(`listWebServicesServers`);
      const lines = result.split(`\n`);

      let servers = [];

      lines.forEach(line => {
        if (line === ``) return;

        let splitIndex = line.lastIndexOf(`(`);
        let name = line.substring(0, splitIndex).trim();

        servers.push({
          name,
          running: !line.includes(`Stopped`)
        });
      })

      return servers;

    } catch (e) {
      return false;
    }
  }

  /**
   * @returns {Promise<{name: string, running: boolean}[]>|false}
   */
  static async getServices(server) {
    try {
      const result = await this.run(`listWebServices`, `-server '${server}'`);
      const lines = result.split(`\n`);

      let services = [];

      lines.forEach(line => {
        if (line === ``) return;

        let splitIndex = line.lastIndexOf(`(`);
        let name = line.substring(0, splitIndex).trim();

        services.push({
          name,
          running: !line.includes(`Stopped`)
        });
      })

      return services;

    } catch (e) {
      return false;
    }
  }

  /**
   * Start a IWS server
   * @param {string} server 
   */
  static startServer(server) {
    return this.run(`startWebServicesServer`, `-server '${server}'`);
  }

  /**
   * Start a IWS server service
   * @param {string} server 
   * @param {string} service 
   */
  static startService(server, service) {
    return this.run(`startWebService`, `-server '${server}' -service '${service}'`)
  }

  /**
   * Stop a IWS server
   * @param {string} server 
   */
  static stopServer(server) {
    return this.run(`stopWebServicesServer`, `-server '${server}'`);
  }

  /**
   * Stop a IWS server service
   * @param {string} server 
   * @param {string} service 
   */
  static stopService(server, service) {
    return this.run(`stopWebService`, `-server '${server}' -service '${service}'`)
  }
}