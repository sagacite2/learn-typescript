{//Type Inference类型推论
    let x1 = 3;//查看鼠标提示可知typescript已经推断x为number类型

    let x2 = [0, 1, null];//被推断为number数组

    class Animal { };
    class Rhino extends Animal { };
    class Elephant extends Animal { };
    class Snake extends Animal { };
    let zoo = [new Rhino(), new Elephant(), new Snake()];//这个数组里有3种动物，我们期望zoo是动物类数组Animal[]，但是typescript只能推断为Rhino[]
    //在这种情况下还是直接声明最好
    let zoo2: Animal[] = [new Rhino(), new Elephant(), new Snake()];

    window.onmousedown = function (mouseEvent) {
        console.log(mouseEvent.button);  //number类型，因为typescript根据window.onmousedown推断mouseEvent为MouseEvent类型。
    };
    //只能改为
    window.onmousedown = function (mouseEvent: any) {//不让typescript通过上下文推断mouseEvent的类型，直接告诉typescript这是个any类型。
        console.log(mouseEvent.button); //button也成为any类型了
    };

    function createZoo(): Animal[] {
        return [new Rhino(), new Elephant(), new Snake()];
    }
    let animals = createZoo();
    let a = animals[0];//从鼠标提示可以看到typescript把a推断为Animal类型，而不是Rhino类型。因为animals为Animal[] 类型



    //类型兼容性
    interface Named {
        name: string;
    }

    class Person {
        name: string;
    }

    let p: Named;//p是一个要求实现Named接口的对象
    p = new Person();//这么赋值是允许的，因为Person已经隐式地实现了Named接口。
    //在Java和C#中这是不行的，必须在定义类时写明class Person implements Named或class Person : Named才行

    //可靠性的问题
    let x6: Named;
    // y's inferred type is { name: string; location: string; }
    let y6 = { name: 'Alice', location: 'Seattle' };
    x6 = y6;//可以。因为x的每个属性，都能在y中找到对应的属性来赋值。
    y6 = x6;//不行。y有location属性而x没。因此location无法在x中取得赋值，typescript拒绝这种兼容。
    //意义就在于，使得继承接口的是更复杂的对象（或接口），而不是更简单的接口去继承复杂的对象（或接口），导致丢失属性、方法。
    //因此凡是使用接口的地方，都可以替换为实现此接口的对象。因为使用接口的地方，其所用到属性和方法不会超出接口所定义的范围，在实现此接口的对象中，这些属性和方法肯定能找到。
    function greet(n: Named) {
        alert('Hello, ' + n.name);
    }
    greet(y6); // 可以，因为n要求的属性name，对y来说肯定有。

    //函数的兼容，则跟上面的思路有所不同。上面的思路是不希望丢失信息，但是函数不同，允许丢失参数：
    let x3 = (a: number) => 0;
    let y3 = (b: number, s: string) => 0;

    y3 = x3; // 可以，x3的所有参数都能在y3的参数列表中找到（但是这么一来y3的第二个string参数丢失了，这是没问题的。其实第二个参数被认为是undefined了）
    x3 = y3; // 不行，y3有一个字符串类型的参数，在x3中没。（在这里我们期望不能丢失等号右边的函数的所有信息）
    //允许函数丢失参数，是因为这是JavaScript的一种常见做法，例如
    let items = [1, 2, 3];
    //这是把参数全写出来的写法，虽然参数没有被用到：
    items.forEach((item, index, array) => console.log(item));
    //这是省掉没用到的参数的写法，很常见：
    items.forEach((item) => console.log(item));

    //对于返回值不同的函数的兼容则跟上面接口和对象的兼容的思路是一致的：
    let x4 = () => ({ name: 'Alice' });
    let y4 = () => ({ name: 'Alice', location: 'Seattle' });

    x4 = y4; // 可以，允许忽略等号右边的函数的返回值中的一些信息。
    y4 = x4; // 不行。类型系统强制源函数的返回值类型必须是目标函数返回值类型的子类型。

    //Function Parameter Bivariance的一个例子
    enum EventType { Mouse, Keyboard }

    interface Event { timestamp: number; }//一般事件
    interface MouseEvent extends Event { x2: number; y2: number }//鼠标事件，需要知道鼠标当前的坐标
    interface KeyEvent extends Event { keyCode: number }//键盘事件，需要知道什么键被按下

    //事件监听，第一个参数是鼠标事件的枚举，第二个参数是监听到事件后要执行的处理函数
    //注意这个处理函数的参数n的类型是Event接口
    function listenEvent(eventType: EventType, handler: (n: Event) => void) {
        /* ... */
    }
    //虽然listenEvent接受的是带Event类型的参数的处理函数handler，但是我们实际上会传一个更确定的函数进去（譬如说使用MouseEvent作为参数类型的handler）
    //直接把Event确定为MouseEvent，那么自然就能使用其x2和y2属性：
    listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x2 + ',' + e.y2));//允许，因为MouseEvent类型的e是更复杂的对象，不会丢失信息。

    // 还是用Event，然后通过<MouseEvent>的写法人工认定e是MouseEvent类型（在传进来的事件不能肯定是MouseEvent时，这样写很有必要。当然，需要做typeof之类的类型判断，下面代码略掉了）
    listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x2 + ',' + (<MouseEvent>e).y2));
    //这写法也可以，但是难看（因为既然已经很确定e就是MouseEvent类型的，那么用上面的第一种写法不就得了）：
    listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x2 + ',' + e.y2)));

    // 报错，因为不兼容。当比较函数参数类型时，只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功。 
    listenEvent(EventType.Mouse, (e: number) => console.log(e));

    //可选参数和必须参数可以对应兼容，而把剩余参数看做无限多个可选参数来处理兼容。
    //下面这个函数的第二个参数是一个callback函数，callback的参数是个剩余参数args
    function invokeLater(args: any[], callback: (...args: any[]) => void) {
        callback.apply(null, args);
    }

    // 兼容，(x,y)能替换(...args: any[])
    invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

    // 这么写也是可以通过tsc编译的，只是有点奇怪（因为x和y已经在console.log中实际使用了，没有可选的意思）
    invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));

    //函数重载
    //对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数签名
    function fun81(x: string): number;
    function fun81(x: number): string;
    function fun81(x): any {

    }
    function fun82(x: string, y: string): number;
    function fun82(x: number, y: number): string;
    function fun82(x): any {

    }
    let f1 = fun81;
    let f2 = fun82;
    f2 = f1;//可以
    f1 = f2;//不兼容

    //不同枚举之间的值无法兼容（虽然它们都是数字）
    enum Status { Ready, Waiting };
    enum Color { Red, Blue, Green };

    let status2 = Status.Ready;
    status2 = Color.Green;  //报错，Status枚举和Color枚举不兼容

    //类的兼容（忽略静态部分，包括构造函数，只考察实例部分是否兼容）
    class Animal2 {
        feet: number;
        static a = 'wawa';
        constructor(name: string, numFeet: number) { }
    }

    class Size2 {
        feet: number;
        private b = 'ss';
        constructor(numFeet: number) { }
    }
    let n: Animal2;
    let s: Size2;

    n = s;  //兼容。因为实例部分只有feet，能在s中找到对应的属性。而静态部分static a和构造函数，都是挂在Animal2类上的，无须从s对象中寻觅。
    s = n;  //报错，s具有私有成员private b，而n没有。因此这么赋值的话，这个私有成员只能undefined，这是危险的，所以typescript拒绝了这样的兼容。


    //泛型的兼容
    interface Empty<T> {
    }
    let x11: Empty<number>;
    let y11: Empty<string>;

    x11 = y11;  // 不报错，因为Enpty<T>接口里什么都没有，typescript在判断兼容时是要找里面的属性来对比分析的，既然没有属性，所以就不用判断了，直接通过。

    interface NotEmpty<T> {
        data: T;
    }
    let x22: NotEmpty<number>;
    let y22: NotEmpty<string>;

    x22 = y22;  //报错，因为typescript发现两个接口分别有不同类型的属性data，一个是number类型的data，一个是string类型的data，所以认为二者无法兼容。


    let identity = function <T>(x: T): T {
        return x;
    }

    let reverse = function <U>(y: U): U {
        return y;
    }

    identity = reverse; //兼容，这里typescript会认为T和U都是any


}



