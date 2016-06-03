{//async和await

    async function main() {
        await ping();
    }

    async function ping() {
        for (var i = 0; i < 5; i++) {
            await delay(200);
            console.log('ping');
        }
    }

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    main();

    var a = function (callback) {
        setTimeout(function () {
            callback('a ended');
        }, 500);
    }
    var b = function (callback) {
        setTimeout(function () {
            callback('b ended');
        }, 500);
    }
    var c = function (callback) {
        setTimeout(function () {
            callback('c ended');
        }, 500);
    }
    //逐个执行上面的异步函数，一般写法
    a((words1) => {
        console.log(words1);
        b((words2) => {
            console.log(words2);
            c((words3) => {
                console.log(words3);
            });
        });
    });

    //promise写法
    let promise = new Promise((resolve, reject) => {
        a(resolve);
    });
    promise.then((words1) => {
        console.log(words1);
        return new Promise((resolve, reject) => {
            b(resolve);
        });
    }).then((words2) => {
        console.log(words2);
        return new Promise((resolve, reject) => {
            c(resolve);
        });
    }).then((words3) => {
        console.log(words3);
    })
    // //上面的写法还是不太简洁的

    //async/await写法
    let a1 = () => new Promise((resolve, reject) => {
        a(resolve);
    });
    let a2 = () => new Promise((resolve, reject) => {
        b(resolve);
    });
    let a3 = () => new Promise((resolve, reject) => {
        c(resolve);
    });
    async function test() {
        let words1 = await a1();//程序执行到这会暂停后面的代码执行，等待a1函数返回结果到words1上，然后再继续
        //500毫秒过后，继续执行下面代码
        console.log(words1);

        let words2 = await a2();
        //500毫秒过后，继续执行下面代码
        console.log(words2);

        let words3 = await a3();
        //500毫秒过后，继续执行下面代码
        console.log(words3);

    }
    test();

}