
import Parser from "./parser.mjs";
import DatabaseError from "./databaseError.mjs";
export default class Database {
    constructor() {
        this.tables = {};
        this.parser = new Parser();
    }
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
    }
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
    }
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
    }
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
    }
    execute(statement) {
        const {command, parsedStatement} = this.parser.parse(statement);
        if (command) {
            return this[command](parsedStatement);
        }
        const message = `Syntax error: "${statement}"`;
        throw new DatabaseError(statement, message);
    }
}