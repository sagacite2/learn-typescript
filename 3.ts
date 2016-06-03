{//Interfaces

    //玩法一：限定对象形式
    //不使用接口时，用下面的声明，要求传入的参数必须是一个带有label属性的对象，且该属性类型为string
    function printLabel(labelledObj: { label: string }) {
        console.log(labelledObj.label);
    }

    let myObj = { size: 10, label: "Size 10 Object" };
    printLabel(myObj);//ok，myObj有label属性，且为string

    //以下代码则是用接口
    interface LabelledValue {
        label: string;
    }

    function printLabel2(labelledObj: LabelledValue) {//要求传入的对象必须实现LabelledValue接口。而接口要求这个对象必须有类型为string的label属性
        console.log(labelledObj.label);
    }

    let myObj2 = { size: 10, label: "Size 10 Object" };
    printLabel(myObj2);
    //使用接口的写法，代码更清晰

    //可选属性
    interface SquareConfig {
        color?: string;//加上问号，表示该属性可以没有
        width?: number;
    }

    function createSquare(config: SquareConfig): { color: string; area: number } {
        let newSquare = { color: "white", area: 100 };
        if (config.color) {
            newSquare.color = config.color;//这里有一大好处，也就是如果我们写错了属性名，如使用了config.collor,则编译器能识别出来，报错。如果使用原生JavaScript，则不会报错，给你一个undefined值。
        }
        if (config.width) {
            newSquare.area = config.width * config.width;
        }
        return newSquare;
    }

    //调用时，也有防写错的能力，例如下面代码如果color写成collor，也会报错
    let mySquare = createSquare({ color: "black" });//传的对象有color属性但是没有width属性，因此width属性就使用默认的100*100了。
    //如果不希望编译器太严格，则可以这么写
    let mySquare2 = createSquare({ width: 100, collor: 0.5 } as SquareConfig);//用as语法，写出collor也不会报错。
    //也也可以这么写
    let squareOptions = { collor: "red", width: 100 };
    let mySquare3 = createSquare(squareOptions);//把对象声明到一个变量squareOptions后传进来，即便写错了color，编译器也不会报错。

    //当然，如果本来就期望传入的参数允许有要求之外的其他属性，完全可以在接口定义时声明
    interface SquareConfig2 {
        color?: string;
        width?: number;
        [propName: string]: any;//允许其他属性
    }

    //玩法二，限定函数形式，用下面的写法
    interface SearchFunc {
        (source: string, subString: string): boolean;//注意写法和上面的有所不同。
    }

    let mySearch: SearchFunc;//要求mySearch函数必须实现SearchFunc接口
    mySearch = function (source: string, subString: string) {//要求传进的是两个string参数，source和subString的命名可以不一致，但是类型必须一致
        let result = source.search(subString);
        if (result == -1) {
            return false;//必须返回布尔类型
        }
        else {
            return true;
        }
    }
    //也可以不写类型，编译器会自动识别，十分方便。推荐这么写
    let mySearch2: SearchFunc = function (src, sub) {
        let result = src.search(sub);
        if (result == -1) {
            return false;
        }
        else {
            return true;
        }
    }

    //玩法三，可索引的类型
    interface StringArray {
        [index: number]: string;
    }

    let myArray: StringArray;//要求myArray实现接口StringArray
    myArray = ["Bob", "Fred"];//ok，因为这里myArray被确定为一个元素全是字符串的数组，它确实有[index: number]: string形式。
    let myStr: string = myArray[0];//限定了每个元素都必须是字符串。

    //索引值可以是number也可以是string，但是这里有个问题：
    class Animal {
        name: string;
    }
    class Dog extends Animal {
        breed: string;
    }

    // 以下写法会报错，因为在JavaScript里number类型的索引值实际上是会转换为string的，因此[x: string]: Dog优先
    interface NotOkay {
        [x: number]: Animal;
        [x: string]: Dog;
    }
    //不过，很少会这么写索引接口，知道有这么一回事就行了。

    interface animals {
        [x: number]: Animal;
        dog: Dog;//ok,Dog是Animal的子类
    }
    interface NumberDictionary {
        [index: string]: number;
        length: number;    // ok
        name: string;      // 报错，string类型不是number类型的子类
    }

    //玩法四，用类实现接口
    interface ClockInterface {
        currentTime: Date;
    }
    //声明一个类，要求类实现某个接口，也就意味着这个类遵循了某个“协定”
    class Clock implements ClockInterface {//注意implements关键字
        currentTime: Date;//必须有，否则报错
        constructor(h: number, m: number) { }
    }

    interface ClockInterface2 {
        currentTime: Date;
        setTime(d: Date);//在接口中协定了一个方法
    }

    class Clock2 implements ClockInterface2 {
        currentTime: Date;
        setTime(d: Date) {//必须有setTime方法，且参数必须一致，不然报错
            this.currentTime = d;
        }
        constructor(h: number, m: number) { }
    }
    //在接口中要求构造函数的形式，以下代码有问题：
    interface ClockConstructor {
        new (hour: number, minute: number);
    }

    class Clock3 implements ClockConstructor {
        currentTime: Date;
        constructor(h: number, m: number) { }
    }
    //上面代码报错，因为构造函数属于静态方法，不是实例方法，不能用Clock3中的静态方法constructor来实现接口中的new
    //解决办法如下
    interface ClockConstructor2 {
        new (hour: number, minute: number): ClockInterface3;
    }
    interface ClockInterface3 {
        tick();
    }

    function createClock(ctor: ClockConstructor2, hour: number, minute: number): ClockInterface3 {
        return new ctor(hour, minute);
    }

    class DigitalClock implements ClockInterface3 {
        constructor(h: number, m: number) { }
        tick() {
            console.log("beep beep");
        }
    }
    class AnalogClock implements ClockInterface3 {
        constructor(h: number, m: number) { }
        tick() {
            console.log("tick tock");
        }
    }

    let digital = createClock(DigitalClock, 12, 17);
    let analog = createClock(AnalogClock, 7, 32);
    //虽然说解决了，但是意义不大。


    //玩法五，用接口实现接口（对接口扩展）
    interface Shape {
        color: string;
    }

    interface Square extends Shape {//使用了extends关键字
        sideLength: number;
    }

    let square = <Square>{};//用泛型的写法来创建一个实现Square接口的对象
    square.color = "blue";
    square.sideLength = 10;

    //用一个接口一口气实现多个接口
    interface Shape2 {
        color: string;
    }

    interface PenStroke2 {
        penWidth: number;
    }

    interface Square2 extends Shape2, PenStroke2 {
        sideLength: number;
    }

    let square2 = <Square2>{};
    square2.color = "blue";
    square2.sideLength = 10;
    square2.penWidth = 5.0;

    //玩法六，混合类型
    interface Counter {
        (start: number): string;//一个函数
        interval: number;//这个函数还有interval属性
        reset(): void;//这个函数还挂接有reset方法
    }

    function getCounter(): Counter {
        let counter = <Counter>function (start: number) { };
        counter.interval = 123;
        counter.reset = function () { };
        return counter;
    }

    let c = getCounter();
    c(10);
    c.reset();
    c.interval = 5.0;
    //一般用不到混合类型的接口。但是如果某个第三方库定义了一些古怪的对象，可能就需要用到了。

    //玩法七，用类来扩展接口
    class Control {
        private state: any;
    }

    interface SelectableControl extends Control {//注意extends的是一个类
        select(): void;
    }//有什么用呢？由于SelectableControl接口扩展自Control类，于是实现此接口的类就必须有私有属性state，这就限定了必须是Control类的子类才能实现此接口

    class Button extends Control {
        select() { }
    }

    class TextBox extends Control {
        select() { }
    }
    //上面Button类和TextBox类都是Control的子类，且有select方法，因此它们自动实现了SelectableControl接口
    class Image2 extends Control {
    }

    class Location2 {
        select() { }
    }
    //上面Image2和Location2则并没有实现SelectableControl接口。

}