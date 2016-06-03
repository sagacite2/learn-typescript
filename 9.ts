{//类型的更多高级用法

    //联合类型
    //下面函数的第二个参数，就是联合类型，表示padding可以传string也可以传number
    function padLeft(value: string, padding: string | number) {
        if (typeof padding === "number") {//通过typeof判断padding究竟具体是什么类型
            return Array(padding + 1).join(" ") + value;//通过鼠标提示可以看出此时padding被认定为number类型
        }
        if (typeof padding === "string") {
            return padding + value;//通过鼠标提示可以看出此时padding被认定为string类型
        }
        throw new Error(`Expected string or number, got '${padding}'.`);
    }
    let indentedString = padLeft("Hello world", 4);
    let indentedString2 = padLeft("Hello world", true);//报错，传的布尔类型，既不是string也不是number

    //如果一个值是联合类型，我们只能访问此联合类型中每个类型的共有的成员。
    interface Bird {
        fly();
        layEggs();
    }

    interface Fish {
        swim();
        layEggs();
    }
    //下面函数返回一个对象，这个对象的类型是<Fish | Bird> （注意联合类型也是一种类型，要把它当做整体看待）
    function getSmallPet(): Fish | Bird {
        return null;//伪代码，不用管
    }

    let pet = getSmallPet();
    pet.layEggs(); // 可以，这个方法是共有的
    pet.swim();    // 不可以
    //但是我们可以使用断言来处理这个问题：
    if ((<Fish>pet).swim) {//判断swin方法是否存在
        (<Fish>pet).swim();//ok
    }
    else {
        (<Bird>pet).fly();//ok
    }
    //不得不说上面的写法很繁琐，多次使用(<Fish>pet)和(<Bird>pet)，代码也难看。typescript允许这么搞：

    //创建一个类型判断函数
    function isFish(pet: Fish | Bird): pet is Fish {//注意返回值是pet is Fish
        return (<Fish>pet).swim !== undefined;//通过判断是否存在swim成员来分析是不是Fish类型
    }
    if (isFish(pet)) {
        pet.swim();//查看鼠标提示可知，在这里pet被认为是Fish类型
    }
    else {
        pet.fly();//这里则被推断为Bird类型
    }
    //注意，官方文档中后面提及了用instanceof来判断具体类型，上面是不可以用instanceof的，因为Fish和Bird都是接口。


    //交叉类型
    //交叉类型和联合类型不同，联合类型是|（或）关系，交叉类型是&（与）关系。
    //其实这类似于C#里常见的一个类实现多个接口。
    //下面这个函数实现了JavaScript里不时出现的extend一个对象的需求（lodash里就有_.extend函数，参考https://lodash.com/docs#assignIn)
    //返回一个对象，该对象既要有first对象的所有属性，也要有second对象的额外属性：
    function extend<T, U>(first: T, second: U): T & U {//注意写法，是&
        let result = <T & U>{};
        for (let id in first) {
            (<any>result)[id] = (<any>first)[id];
        }
        for (let id in second) {
            if (!result.hasOwnProperty(id)) {//如果first和second对象有重复的属性，则保留first的
                (<any>result)[id] = (<any>second)[id];
            }
        }
        return result;
    }

    class Person {
        constructor(public name: string) { }
    }
    interface Loggable {
        log(): void;
    }
    class ConsoleLogger implements Loggable {
        log() {
            // ...
        }
    }
    var jim = extend(new Person("Jim"), new ConsoleLogger());
    var n = jim.name;
    jim.log();//jim既有Person类的name属性，也有Loggable接口的log方法。



    //类型别名
    //用type开头，可以给类型取另一个名字，就是为了代码更好读和书写方便
    type Name = string;//给基本类型string起一个别名Name（实际上意义不大，这里只是为了演示）
    type NameResolver = () => string;//给类型() => string（一个函数，无参数，返回值为string类型）起一个别名NameResolver
    type NameOrResolver = Name | NameResolver;//联合类型（这时候已经把类型别名当做好像真的类型一样地使用了）
    function getName(n: NameOrResolver): Name {
        if (typeof n === 'string') {
            return n;
        }
        else {
            return n();//查看鼠标提示可知此时n为() => string类型
        }
    }

    //类型别名也可以是泛型:
    type Container<T> = { value: T };

    //也可以使用类型别名来在属性里引用自己：
    type Tree<T> = {
        value: T;
        left: Tree<T>;//注意是属性里，而不是自身
        right: Tree<T>;
    }

    //结合交叉类型的玩法：
    type LinkedList<T> = T & { next: LinkedList<T> };

    interface Person2 {
        name: string;
    }

    var people: LinkedList<Person2>;
    var s = people.name;
    var s = people.next.name;
    var s = people.next.next.name;
    var s = people.next.next.next.name;

    //但是这样不行，循环定义自身了：
    type Yikes = Array<Yikes>;//报错

    //其实如Tree<T>这样的类型别名，它跟接口非常像：
    interface Tree2<T> {
        value: T;
        left: Tree2<T>;
        right: Tree2<T>;
    }
    let t1: Tree<number>;
    t1.value;
    let t2: Tree2<number>;
    t2.value;
    //但是文档中也说了，类型别名不能被extends和implements也不能去extends和implements其它类型，而接口可以。
    //该用接口的时候就应该用接口，不要用类型别名来图书写方便。原因：需求增加或发生变化时，完全可以书写另外的代码（实现原接口的类，或扩展原接口的接口）来处理之，而不是去修改类型别名的大括号里的代码。

    //什么时候使用类型别名，文档说：如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名。


    //字符串字面量类型
    //字符串字面量可以被看做是一种类型
    //结合类型别名+联合类型的一个特殊的、有用的玩法就是
    type Easing = "ease-in" | "ease-out" | "ease-in-out";
    //上面这个Easing类型，只能是字符串，而且只能是这3种字符串中的一个，像枚举（但是枚举的值是数字，有时候不好用）
    //例子：
    class UIElement {
        animate(dx: number, dy: number, easing: Easing) {
            if (easing === "ease-in") {
                // ...
            }
            else if (easing === "ease-out") {
            }
            else if (easing === "ease-in-out") {
            }
            else {
                // error! should not pass null or undefined.
            }
        }
    }

    let button = new UIElement();
    button.animate(0, 0, "ease-in");//ok
    button.animate(0, 0, "uneasy"); // 报错，第三个参数是Easing类型，而Easing类型必须是上面的三个字符串之一，这里传得不对。




    //this类型
    //JavaScript常见的写法，就是在函数最后return this，那么typescript就认为这个函数的返回值类型是this类型。

    //一个计算器
    class BasicCalculator {
        public constructor(protected value: number = 0) { }
        public currentValue(): number {
            return this.value;
        }
        public add(operand: number): this {//加法，注意最后冒号后的是this，声明返回值为this类型
            this.value += operand;
            return this;//通过返回this，可以重复利用该对象的value属性。
        }
        public multiply(operand: number): this {//乘法
            this.value *= operand;
            return this;
        }
    }

    //使用时书写十分方便：
    let v = new BasicCalculator(2)
        .multiply(5)
        .add(1)
        .currentValue();

    //由于这个类使用了this类型，你可以继承它，新的类可以直接使用之前的方法，不需要做任何的改变
    class ScientificCalculator extends BasicCalculator {
        public constructor(value = 0) {
            super(value);
        }
        public sin() {//计算正弦值
            this.value = Math.sin(this.value);
            return this;
        }
    }

    let v2 = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();

    //基于 this 的类型收窄
    class FileSystemObject {
        isFile(): this is File { return this instanceof File; }
        isDirectory(): this is Directory { return this instanceof Directory; }
        isNetworked(): this is (Networked & this) { return this.networked; }
        constructor(public path: string, private networked: boolean) { }
    }

    class File extends FileSystemObject {
        constructor(path: string, public content: string) { super(path, false); }
    }
    class Directory extends FileSystemObject {
        children: FileSystemObject[];
    }
    interface Networked {
        host: string;
    }

    let fso: FileSystemObject = new File("foo/bar.txt", "foo");
    if (fso.isFile()) {
        fso.content; // fso 是 File
    }
    else if (fso.isDirectory()) {
        fso.children; // fso 是 Directory
    }
    else if (fso.isNetworked()) {
        fso.host; // fso 是 networked
    }
}