const DatabaseError = function (statement, message) {
    this.statement = statement;
    this.message = message;
}
const database = {
    tables: {},
    createTable(statement) {
        const regexp = /create table ([a-z]+) \((.+)\)/;
        const parsedStatement = statement.match(regexp);
        let [,tableName, columns] = parsedStatement;
        this.tables[tableName] = {
            columns: {},
            data: []
        }
        columns = columns.split(",");
        for (let column of columns) {
            column = column.trim().split(" ");
            const [name, type] = column;
            this.tables[tableName].columns[name] = type;
        }
    },
    insert(statement) {
        const regexp = /insert into ([a-z]+) \((.+)\) values \((.+)\)/;
        const parsedStatement = statement.match(regexp);
        let [,tableName, columns, values] = parsedStatement;
        columns = columns.split(', ');
        values = values.split(", ");
        let row = {};
        for (let index = 0; index < columns.length; index++) {
            const column = columns[index];
            const value = values[index];
            row[column] = value;
        }
        this.tables[tableName].data.push(row);

    },
    select(statement) {
        const regexp = /select (.+) from ([a-z]+)/
        const parsedStatement = statement.match(regexp);
        console.log(parsedStatement);
        let [, columns, tableName] = parsedStatement;
        columns = columns.split(", ");
        let table = [];
        this.tables[tableName].data.map(item =>{
            let parsedItem = {}
            columns.map(
                column => {
                    parsedItem[column] = item[column];
                }
            )
            table.push(parsedItem)
        })
        console.log(table);
    },
    execute(statement){
        if (statement.startsWith("create table")) {
            return this.createTable(statement)
        }
        if (statement.startsWith("insert into")) {
            return this.insert(statement)
        }
        if(statement.startsWith("select")) {
            return this.select(statement)
        }
        const message = `Syntax error: '${statement}'`
        throw new DatabaseError(statement, message);
    },
};


try {
    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    database.execute("select name, age from author");
    database.execute("select name, age from author where id = 1");
    //console.log(JSON.stringify(database, undefined, "  "));
    //database.execute("select id, name from author");

} catch (error) {
     console.log(error);
}
