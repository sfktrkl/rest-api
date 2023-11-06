## MongoDB

### Installation [Linux](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

- Import the public key used by the package management system

```bash
sudo apt-get install gnupg
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor
```

- Create a list file for MongoDB

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

- Reload local package database

```bash
sudo apt-get update
```

- Install the MongoDB packages

```bash
sudo apt-get install -y mongodb-org
```

### Running

- Start MongoDB

```bash
sudo systemctl start mongod
```

- Verify that MongoDB has started successfully

```bash
sudo systemctl status mongod
```

- Stop MongoDB

```bash
sudo systemctl stop mongod
```

- Restart MongoDB

```bash
sudo systemctl restart mongod
```

- Begin using MongoDB

```bash
mongosh
```

### Time to Get Started

- To see existing databases

```bash
show dbs
```

- Create and connect to a new database

```bash
use test
```

- Create a collection on the fly and insert

```bash
db.coll.insertOne({ "name": "test" })
```

- Look at the data

```bash
db.coll.find().pretty()
```

- Delete the database

```bash
db.dropDatabase()
```
