#!/bin/bash

mongod <<EOF
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "mongodb-primary:27017",
            "priority": 3
        },
        {
            "_id": 2,
            "host": "mongodb-secondary:27017",
            "priority": 2
        },
        {
            "_id": 3,
            "host": "mongodb-arbiter:27017",
            "priority": 1
        }
    ]
};
rs.initiate(config, { force: true });
rs.status();
EOF