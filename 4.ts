{//Classes
    //类的声明写法如下
    class Greeter {
        greeting: string;//类的成员,如果不写修饰符，则默认为public属性。
        constructor(message: string) {//类的构造函数
            this.greeting = message;
        }
        greet() {//类的方法，注意省略了function字眼
            return "Hello, " + this.greeting;
        }
    }

    let greeter = new Greeter("world");//使用构造函数创建实例。

    //类的继承
    class Animal {
        name: string;
        constructor(theName: string) { this.name = theName; }
        move(distanceInMeters: number = 0) {//默认值为0
            console.log(`${this.name} moved ${distanceInMeters}m.`);
        }
    }

    class Snake extends Animal {//使用extends关键字，跟Java一致
        constructor(name: string) { super(name); }
        move(distanceInMeters = 5) {//改变默认值为5
            console.log("Slithering...");
            super.move(distanceInMeters);//调用父类的move方法（也就会执行console.log(`${this.name} moved ${distanceInMeters}m.`);）
        }
    }

    class Horse extends Animal {
        constructor(name: string) { super(name); }
        move(distanceInMeters = 45) {
            console.log("Galloping...");
            super.move(distanceInMeters);
        }
    }

    let sam = new Snake("Sammy the Python");
    let tom: Animal = new Horse("Tommy the Palomino");

    sam.move();
    tom.move(34);

    //私有成员的可访问性
    class Animal2 {
        private name: string;
        constructor(theName: string) { this.name = theName; }
    }

    //new Animal2("Cat").name; // 报错，name只能在父类内部访问。
    class Cat extends Animal2 {
        ff() {
            //this.name = 'cat';//报错，name是父类的私有成员，只能在父类内部使用，即便是子类内也不能用。若想使用，需要改成protected
        }
    }



    //以下代码如果会Java或C#则非常容易理解。
    class Animal3 {
        private name: string;
        constructor(theName: string) { this.name = theName; }
    }

    class Rhino extends Animal3 {//Rhino继承自Animal3，但是它并没有私有成员name
        constructor() { super("Rhino"); }
    }

    class Employee {//并没有继承
        private name: string;//虽然它也有私有成员name，但是它跟Animal3没有继承或被继承关系，所以不能互相匹配。
        constructor(theName: string) { this.name = theName; }
    }

    let animal = new Animal3("Goat");
    let rhino = new Rhino();
    let employee = new Employee("Bob");

    animal = rhino;//可以
    //animal = employee; //报错，类型不匹配。

    //以下代码演示了protected修饰符的作用
    class Person {
        protected name: string;//声明了一个保护成员name
        constructor(name: string) { this.name = name; }
    }

    class Employee2 extends Person {
        private department: string;

        constructor(name: string, department: string) {
            super(name);
            this.department = department;
        }

        public getElevatorPitch() {//增加了一个方法，在方法中使用了保护成员this.name
            return `Hello, my name is ${this.name} and I work in ${this.department}.`;
        }
    }

    let howard = new Employee2("Howard", "Sales");
    console.log(howard.getElevatorPitch());
    //console.log(howard.name); // 报错。保护成员必须在父类及其子类的内部使用，不能在外面使用。

    //简便写法
    class Animal4 {
        constructor(private name: string) { }//在参数里增加private声明，这就为Animal4增加了私有成员name，且其值为从构造函数传进来的值。public和protected同理。
        move(distanceInMeters: number) {
            console.log(`${this.name} moved ${distanceInMeters}m.`);
        }
    }

    //get set 访问器
    //下面是一个没有写访问器的类
    class Employee3 {
        fullName: string;
    }

    let employee3 = new Employee3();
    employee3.fullName = "Bob Smith";//这是可能会有问题的，员工的名字是比较重要的值，不能随便就在外部被修改
    if (employee3.fullName) {
        console.log(employee3.fullName);
    }
    //程序改造为
    let passcode = "secret passcode";

    class Employee4 {
        private _fullName: string;

        get fullName(): string {
            return this._fullName;
        }

        set fullName(newName: string) {
            //改造为必须使用正确的密码才能修改名字。当然这里只是伪代码，用来说明set的作用而已。
            if (passcode && passcode == "secret passcode") {
                this._fullName = newName;
            }
            else {
                console.log("Error: Unauthorized update of employee!");
            }
        }
    }

    let employee4 = new Employee4();
    employee4.fullName = "Bob Smith";//修改名字时，仍然是这样的写法，但是实际上已经执行了set访问器。
    if (employee4.fullName) {
        console.log(employee4.fullName);
    }

    //静态成员
    class Grid {//一个网格
        static origin = { x: 0, y: 0 };//原点坐标，也就是左上角坐标。注意使用了static关键字，因此它是类的成员，而不是实例成员
        calculateDistanceFromOrigin(point: { x: number; y: number; }) {//一个方法，计算离左上角的距离
            let xDist = (point.x - Grid.origin.x);//在访问origin属性时，直接用Grid.origin，而不需要初始化一个Grid实例。
            let yDist = (point.y - Grid.origin.y);
            return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
        }
        constructor(public scale: number) { }
    }
    console.log(Grid.origin);//在外面也是可以访问的。
    let grid1 = new Grid(1.0);  // 1x scale
    let grid2 = new Grid(5.0);  // 5x scale

    console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }));
    console.log(grid2.calculateDistanceFromOrigin({ x: 10, y: 10 }));


    //抽象类
    //抽象类的声明方式如下：
    abstract class Animal5 {
        abstract makeSound(): void;
        move(): void {
            console.log('roaming the earth...');
        }
    }
    //注意，上面的声明中，makeSound被声明为抽象方法。move则不是。抽象类可以不声明构造函数。
    //不能直接从抽象类实例化一个对象：
    //var animal55 = new Animal5();//报错。因此，要使用抽象类，就必须声明一个子类，继承这个抽象类。

    //抽象类和接口有相似之处，但是用途不一样
    abstract class Department {

        constructor(public name: string) {
        }

        printName(): void {
            console.log('Department name: ' + this.name);
        }

        abstract printMeeting(): void; // 如果抽象类声明了抽象方法，则子类必须实现这个方法（在C#中，子类可以不实现父类的抽象方法，但是这么一来子类仍然属于抽象类，还是不能使用）。
    }

    class AccountingDepartment extends Department {

        constructor() {
            super('Accounting and Auditing'); // 必须调用父类的构造函数super，否则报错
        }

        printMeeting(): void {//并不需要显式地注明实现了抽象方法printMeeting（没有extends之类的关键字）
            console.log('The Accounting Department meets each Monday at 10am.');
        }

        generateReports(): void {
            console.log('Generating accounting reports...');
        }
    }

    let department: Department; // 可以，虽然Department为抽象类，但是声明变量为抽象类类型是没问题的，而且有“多态”的用处。
    department = new AccountingDepartment(); // ok，实例化的不是抽象类。
    department.printName();
    department.printMeeting();
    //department.generateReports(); // 报错，因为department被声明为Department类型，而后者并没有generateReports方法。
    (department as AccountingDepartment).generateReports();//ok

    //类是有多重含义的，例如new A();A在这里有构造函数的意思。而let a:A 这样的写法，A则有作为类型的意思。下面代码演示了一些细微之处
    class Greeter2 {
        static standardGreeting = "Hello, there";
        greeting: string;
        greet() {
            if (this.greeting) {
                return "Hello, " + this.greeting;
            }
            else {
                return Greeter2.standardGreeting;
            }
        }
    }
    //一般写法
    let greeter2: Greeter;//greeter2是Greeter的实例，也可以说greeter2的类型是Greeter
    greeter2 = new Greeter2();
    console.log(greeter2.greet());

    //greeterMaker的类型就是Greeter2的类型
    //之所以说举这个例子，是因为typescript非常重视“强类型”
    let greeterMaker: typeof Greeter2 = Greeter2;//这个在JavaScript中其实就是简单地var greeterMaker = Greeter2;把一个函数赋给另一个变量
    //let greeterMaker2: Greeter2 = Greeter2;//报错，Greeter2类的实例和Greeter2类是两回事。
    greeterMaker.standardGreeting = "Hey there!";

    let greeter3: Greeter2 = new greeterMaker();
    console.log(greeter3.greet());
    console.log(Greeter2.standardGreeting);//输出Hey there!

    //用接口来继承类，在3.ts已有涉及
    class Point {
        x: number;
        y: number;
    }

    interface Point3d extends Point {
        z: number;
    }

    let point3d: Point3d = { x: 1, y: 2, z: 3 };
}