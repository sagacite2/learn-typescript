{//Functions
    // 有名字的函数
    function add(x, y) {
        return x + y;
    }

    // 匿名函数
    let myAdd = function (x, y) { return x + y; };

    //函数内部使用外部的变量
    let z = 100;

    function addToZ(x, y) {
        return x + y + z;//使用到z。但是查看鼠标提示可知，返回值还是被推断为any类型
    }

    //上面是JavaScript的写法，下面引入类型声明
    //完整写法
    let myAdd3: (x: number, y: number) => number = function (x: number, y: number): number {
        return x + y;
    };

    //不一定非要用x和y，下面改用baseValue和increment，没问题
    let myAdd4: (baseValue: number, increment: number) => number = function (x: number, y: number): number {
        return x + y;
    };

    //类型推断，左边声明的myAdd5虽然没有声明类型，但是typescript通过等式右边推断出myAdd5为函数类型。
    //对比一下上面的完整写法，可知它省掉了冒号和后面的(x: number, y: number) => number，也就是省掉了对myAdd5的类型的显式声明
    let myAdd5 = function (x: number, y: number): number {
        return x + y;
    };

    // 等式左边显式声明了myAdd6的类型，因此typescript能推断等式右边的函数的x、y参数是number类型，返回值也是number类型。
    let myAdd6: (baseValue: number, increment: number) => number = function (x, y) {
        return x + y;
    };
    //在实际书写代码时，往往要么省掉等式左边的类型声明，要么省掉右边的，这样就省事很多。


    //typescript的要求比JavaScript严格，必须保证函数的形参都有值（无论是传进来的，还是默认值），且传递参数列表的形式要匹配，否则报错
    function buildName(firstName: string, lastName: string) {
        return firstName + " " + lastName;
    }
    let result1 = buildName("Bob");                  // 报错，少了一个参数
    let result2 = buildName("Bob", "Adams", "Sr.");  // 报错，多了一个参数
    let result3 = buildName("Bob", "Adams");         // ok

    //可选参数
    function buildName2(firstName: string, lastName?: string) {
        if (lastName)
            return firstName + " " + lastName;
        else
            return firstName;
    }

    let result12 = buildName2("Bob");  // ok，因为lastName有个问号，意味着它是可选的，可以不传
    let result22 = buildName2("Bob", "Adams", "Sr.");  // 报错，多了一个参数
    let result32 = buildName2("Bob", "Adams");  // ok

    //直接提供默认值
    function buildName3(firstName: string, lastName = "Smith") {//设置lastName默认值为"Smith"，typescript能推断lastName的类型为string
        return firstName + " " + lastName;
    }

    let result13 = buildName3("Bob");                  // ok，得到结果为"Bob Smith"
    let result23 = buildName3("Bob", undefined);       // ok, 得到结果还是"Bob Smith"
    let result33 = buildName3("Bob", "Adams", "Sr.");  // 报错，多了一个参数
    let result43 = buildName3("Bob", "Adams");         // ok

    //如果提供默认值的参数不是在最后，而是在前面呢
    function buildName4(firstName = "Will", lastName: string) {
        return firstName + " " + lastName;
    }

    let result14 = buildName4("Bob");                  // 报错，第二个参数不是可选参数，不能省
    let result24 = buildName4("Bob", "Adams", "Sr.");  // 报错，多了一个参数
    let result34 = buildName4("Bob", "Adams");         // ok
    let result44 = buildName4(undefined, "Adams");     // ok，因为传的是undefined，自动取默认值，返回 "Will Adams"


    //一个方便的写法，剩余参数
    //剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。
    function buildName5(firstName: string, ...restOfName: string[]) {//注意: string[]限定了restOfName是个字符串数组
        return firstName + " " + restOfName.join(" ");
    }

    let employeeName = buildName5("Joseph", "Samuel", "Lucas", "MacKinzie");

    //写在函数的类型声明里（参看上面的myAdd3函数）
    let buildNameFun: (fname: string, ...rest: string[]) => string = buildName5;


    //lambda表达式（ () => {} ）
    //这种写法会在函数声明时就绑定this，而不是动态绑定。注意，需要动态绑定this时，别用这种写法，还是用function
    let o1 = {
        a: 1,
        method: function () {
            return () => {
                console.log(this.a);
            }
        }
    }
    let method = o1.method();
    method();//输出1

    //JavaScript不支持函数重载，typescript可以
    function fun1(x: string): number;
    function fun1(x: number): string;//先声明若干重载形式
    //还可以用联合类型
    function fun1(x: string | number): string | number;
    function fun1(x): any {//用这个来统一处理
        if (typeof x === 'string') {
            return x.length;
        } else if (typeof x === 'number') {
            return x.toString();
        }
    }
    fun1([1]);//传进去的是个数组，不符合上面的重载声明形式，报错。
    fun1(1);//ok
    fun1('1');//ok


    let suits = ["hearts", "spades", "clubs", "diamonds"];

    function pickCard(x: { suit: string; card: number; }[]): number;
    function pickCard(x: number): { suit: string; card: number; };
    function pickCard(x): any {
        // Check to see if we're working with an object/array
        // if so, they gave us the deck and we'll pick the card
        if (typeof x == "object") {
            let pickedCard = Math.floor(Math.random() * x.length);
            return pickedCard;
        }
        // Otherwise just let them pick the card
        else if (typeof x == "number") {
            let pickedSuit = Math.floor(x / 13);
            return { suit: suits[pickedSuit], card: x % 13 };
        }
    }

    let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
    let pickedCard1 = myDeck[pickCard(myDeck)];
    alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

    let pickedCard2 = pickCard(15);
    alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
}