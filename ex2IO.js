const str = 'create table author (id number, name string, age number, city string, state string, country string)'
const table = str.split(' ')[2];
let columns = {}
str.slice(str.indexOf('(') + 1, str.indexOf(')')).split(', ').map( item => {
   columns[ item.split(' ')[0]] = item.split(' ')[1];
})
const database = {
    tables: {
        [table]: {
            columns
        },
        data: []
    }
}
console.log(JSON.stringify(database, null, 2));