const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = message;
};
const Parser = function() {
    this.command = new Map(
        [
            ["createTable", /create table ([a-z]+) \((.+)\)/],
            ["insert",  /insert into ([a-z]+) \((.+)\) values \((.+)\)/],
            ["select", /select (.+) from ([a-z]+)(?: where (.+))?/],
            ["delete", /delete from ([a-z]+)(?: where (.+))?/]
        ]
    );
    this.parse = function (statement) {
        for(let [command, regexp] of this.command) {
            const parsedStatement = statement.match(regexp);
            if(parsedStatement) {
                return {
                    command,
                    parsedStatement
                };
            }
        }
    }
}
const database = {
    tables: {},
    parser: new Parser(),
    createTable(parsedStatement) {
        let [,tableName, columns] = parsedStatement;
        this.tables[tableName] = {
            columns: {},
            data: []
        };
        columns = columns.split(",");
        for (let column of columns) {
            column = column.trim().split(" ");
            const [name, type] = column;
            this.tables[tableName].columns[name] = type;
        }
    },
    insert(parsedStatement) {
        let [,tableName, columns, values] = parsedStatement;
        columns = columns.split(", ");
        values = values.split(", ");
        let row = {};
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const value = values[i];
            row[column] = value;
        }
        this.tables[tableName].data.push(row);
    },
    select(parsedStatement) {
        let [, columns, tableName, whereClause] = parsedStatement;
        columns = columns.split(", ");
        let rows = this.tables[tableName].data.filter(function (row) {
            if (!whereClause) return true;
            let [column, value] = whereClause.split(" = ");
            return row[column] === value;
        });
        rows = rows.map(function (row) {
            const selectedRow = {};
            columns.forEach(function (column) {
                selectedRow[column] = row[column];
            });
            return selectedRow;
        });
        return rows;
    },
    delete(parsedStatement) {
        let [, tableName, whereClause] = parsedStatement;
        if (!whereClause) {
            this.tables[tableName].data = [];
        } else {
            let [column, data] = whereClause.split(" = ");
            this.tables[tableName].data = this.tables[tableName].data.filter( (row) => {
                return row[column] !== data;
            });
        }
    },
    execute(statement) {
        const {command, parsedStatement} = this.parser.parse(statement);
        if (command) {
            return this[command](parsedStatement);
        }
        const message = `Syntax error: "${statement}"`;
        throw new DatabaseError(statement, message);
    }
};
try {
    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    database.execute("delete from author where id = 2");
    console.log(JSON.stringify(database.execute("select name, age from author"), undefined, "  "));
    //console.log(JSON.stringify(database.execute("select name, age from author where id = 1"), undefined, "  "));
} catch (e) {
    console.log(e.message);
}
