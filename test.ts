function invokeLater(args: any[], callback: (...args: any[]) => void) {
    callback.apply(null,args);
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1], (x, y) => console.log(x + ', ' + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1], (x?, y?) => console.log(x + ', ' + y));