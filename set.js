const charsets = new Set();
charsets.add('ASCII')
charsets.add('ISO-8859-1');
charsets.add('UTF-8');
charsets.forEach(function(charset) {
    console.log(charset);
});
console.log(charsets.size);
charsets.clear();
console.log(charsets.size);

