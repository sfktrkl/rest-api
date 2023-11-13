## REST API

### Install Node.js

```bash
sudo apt update
sudo apt install nodejs
```

### Install Postman

```bash
sudo snap install postman
```

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Run in production mode

```bash
npm run prod
```

### Generate documentation

- Export from postman

- Create documentation using docgen, https://github.com/thedevsaddam/docgen

```bash
curl https://raw.githubusercontent.com/thedevsaddam/docgen/v3/uninstall.sh -o uninstall.sh \
&& sudo chmod +x uninstall.sh \
&& sudo ./uninstall.sh \
&& rm uninstall.sh
```

```bash
docgen build -i collection.json -o index.html
```
