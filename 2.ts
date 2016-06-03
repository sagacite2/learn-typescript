{//Variable Declarations

    //let声明

    //let只在包含它的代码块内有效（一般为大括号）
    function f(input: boolean) {
        let a = 100;

        if (input) {
            // 在这里能访问到a
            let b = a + 1;
            return b;
        }

        //在这里不能访问到b
        //return b;//报错。如果b是用var来定义的，在这里就可以访问到，这也是let和var的不同之处。以后书写typescript代码时一般不再用var
        //原因：JavaScript只有函数才算块级作用域，上面只是个if判断体，所以不算，因此var b的声明放在if体里面还是外面，是没有区别的。
        //但是若使用let，则大括号就是块级作用域，若let b声明在if体里，就意味着它和外层隔离开了。
    }


    try {
        throw "oh no!";
    }
    catch (e) {//这里的e是声明在catch块级作用域内的
        console.log(e);//可以访问到e
    }
    // 在这里不能访问到e
    //console.log(e);//报错


    //不可以在let c之前就使用c
    //c++;//报错。虽然这里还是处于声明c的块级作用域内，但是在let c声明之前，属于“时间死区”，不能访问c
    //但是用var则不同，JavaScript会默认把所有var声明前提，所以不存在时间死区的说法。
    let c = 1;


    function foo() {
        // 虽然在let d之前使用了d，但是不报错。（这是typescript做的权宜之计，以后还是会报错的）
        return d;
    }
    foo();
    let d;

    function ff(x) {//注意连这里也是x
        //用var，允许重复声明
        var x;
        var x;

        if (true) {
            var x;
        }
    }

    //用let不行
    function fff(y) {
        //let y;//报错
    }
    function ffff() {
        let y;
        //let y;//报错
    }

    function fffff(condition, x) {//这里的大括号是外层的块级作用域
        if (condition) {
            let x = 100;//不报错，因为大括号的存在（一个内层的块级作用域）
            return x;
        }
        return x;//这里还是从参数来的x，不会改变。可以看出大括号里的x和外面的x完全隔离。
    }

    fffff(false, 0); // returns 0
    fffff(true, 0);  // returns 100

    //循环嵌套时出现重复声明的变量名
    function sumMatrix(matrix: number[][]) {
        let sum = 0;
        for (let i = 0; i < matrix.length; i++) {
            var currentRow = matrix[i];
            for (let i = 0; i < currentRow.length; i++) {//虽然这里还是用i，但是不会有问题！因为上一个i和这个i是隔离的（这个i处于一个内层的块级作用域中）
                sum += currentRow[i];
            }
        }

        return sum;
    }
    //上面代码虽然没问题，但是实际书写时还是不要这么搞。
    //tsc编译后的js代码可以看出，实际上还是另用了一个变量名来解决的。x_1   i_1

    function theCityThatAlwaysSleeps() {
        let getCity;

        //下面代码是在一个内层的块级作用域里的，因此我们无法在外层使用city标识符来访问"Seattle"字符串
        //但是这并不意味着"Seattle"字符串就此消失，因为闭包的缘故，"Seattle"一直都在。
        if (true) {
            let city = "Seattle";
            getCity = function () {
                return city;//内层的块级作用域可以访问外层的city
            }
        }
        //return city;//报错
        return getCity();//可以
    }
    console.log(theCityThatAlwaysSleeps());//输出Seattle

    //以下代码能输出0到9，如果把let改成var，则全都输出10
    for (let i = 0; i < 10; i++) {
        setTimeout(
            function () {
                console.log(i);
            }, 100 * i);
    }//原因在于，JavaScript不认为for循环体是一个块级作用域（函数才是），因此在这个循环体里声明的var i是唯一的，在每一次循环都是使用当前的同一个i。
    //typescript则实现了这一点：若在循环体使用let，则每一次循环都会创建一个变量环境和块级作用域，因此setTimeout执行时，和对应的异步回调函数执行时用的是这个变量环境内的i的值。


    //const声明常量
    const numLivesForCat = 9;
    const kitty = {
        name: "Aurora",
        numLives: numLivesForCat,
    }

    // 不可以，kitty为常量，对象不能被改变
    // kitty = {
    //     name: "Danielle",
    //     numLives: numLivesForCat
    // };

    // 可以，改变的只是属性，而不是对象本身
    kitty.name = "Rory";
    kitty.name = "Kitty";
    kitty.name = "Cat";
    kitty.numLives--;


    //特殊声明方式：解构，是一种比较便利的书写方式
    let [first, second] = [1, 2];
    console.log(first); // outputs 1
    console.log(second); // outputs 2
    //实际上声明了两个变量，一个first，一个second，并赋值为1和2
    //互换两个变量的值可以这么简洁地书写：
    [first, second] = [second, first];

    //以下函数声明一个参数为数组，要求数组有两个类型为number的元素
    function f2([first, second]: [number, number]) {
        console.log(first);
        console.log(second);//这样就很方便地提取参数里的元素，不需要另写arr[0]、arr[1]，而且语义更易读
    }
    f2([3, 4]);

    //使用...语法，可以代替剩余的参数
    let [kk, ...rest] = [1, 2, 3, 4];
    //其实就是声明了两个变量，一个kk，一个rest
    console.log(kk); // 输出 1，不是数组
    console.log(rest); // 输出 [ 2, 3, 4 ]，注意是个数组

    let [kkk] = [1, 2, 3, 4];//就取第一个
    console.log(kkk); // outputs 1
    let [, k2, , k4] = [1, 2, 3, 4];//就取第二个和第四个

    //对象的解构
    let o = {
        a: "foo",
        b: 12,
        c: "bar"
    }
    let {a, b} = o;//相当于let a = o.a; let b = o.b;
    //注意{a,b}里的a和b必须和o里的属性名对应并一致，这要求有点坑，因此要使用改名语法：
    //改名
    let {a: newName1, b: newName2} = o;//相当于let newName1 = o.a, newName2 = o.b;

    let {a1, b1}: { a1: string, b1: number } = { a1: "baz", b1: 101 };//这样写当然也可以

    //默认值
    function keepWholeObject(wholeObject: { a: string, b?: number }) {//加个问号，表示在使用这个函数时，传参wholeObject可以没有属性b
        let {a, b = 1001} = wholeObject;//取得wholeObject中的a、b属性。如果没b属性，则默认取值1001
    }

    //在函数声明中使用对象解构，也就是对传进来的参数提出要求：必须是某种形式的对象
    //另外声明一个type（类型别名），其实跟直接写function f3({a2, b2}: { a2: string, b2?: number }): void {一个意思
    type C = { a2: string, b2?: number }
    function f3({a2, b2}: C): void {//要求传入一个对象，这个对象的形式是C
        // ...
    }

    function f4({a3, b3} = { a3: "", b3: 0 }): void {//给定默认值
        console.log(a3, b3);
    }
    f4();
    f4({ a3: 'wawa', b3: 10 });//传的参数必须是一个对象，且有a3属性和b3属性。

    function f5({a, b = 0} = { a: "" }): void {
        // ...
    }
    f5({ a: "yes" }); // ok, default b = 0
    f5(); // 可以，全取默认值
    //f5({}) //报错,对象必须有a属性

    //以上内容更详细的讲解可以参考http://es6.ruanyifeng.com/#docs/let

}