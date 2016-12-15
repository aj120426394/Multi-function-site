

*Content to come.*

## Contributors

* [Jeff Teng](mailto:j.teng@griffith.edu.au)

## Dependencies

* [Git](https://git-scm.com)
* [Node (v6)](https://nodejs.org)
* [NPM (v3)](https://www.npmjs.com)
* [EditorConfig](http://editorconfig.org)

## Getting Started

1\. Ensure all [Dependencies](#dependencies) have been resolved.

2\. Install application dependencies.

```bash
npm install
```

3\. Run build.

```bash
npm run build
```

> If you have issues when running the build, you may need to manually install the history module, `npm install history`.

## Testing

Testing provided by [Karma JS](https://karma-runner.github.io).


## Setting up server on the Ubuntu 16.04 server

After uploading the project to your hosting server. Run the command with ssh to your server.

```powershell

#Testing before setup
nohup /multi-function-site/bin/start.sh &

#Run setup command
/multi-function-site/bin/setup.sh

#Start the server 
sudo systemctl start multi-function-site.service

#Stop the server
sudo systemctl stop multi-function-site.service

```

