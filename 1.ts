{//Basic Types

    //布尔类型
    let isDone: boolean = false;

    //数字类型
    let decimal: number = 6;
    let hex: number = 0xf00d;
    let binary: number = 0b1010;
    let octal: number = 0o744;

    //字符串类型
    let color: string = "blue";

    let fullName: string = `Bob Bobbington`;
    let age: number = 37;

    //用反单引号来处理含参数表达式的字符串
    let sentence: string = `Hello, my name is ${fullName}.//注意有两个换行符

I'll be ${ age + 1} years old next month.`
    //相当于：
    let sentence2: string = "Hello, my name is " + fullName + ".\n\n" +
        "I'll be " + (age + 1) + " years old next month."

    //number数组
    let list: number[] = [1, 2, 3];
    //使用泛型形式来声明，其实是一样的
    let list2: Array<number> = [1, 2, 3];

    // 元组（tuple）
    let x: [string, number];
    // 初始化
    x = ['hello', 10]; // 第一个元素必须是字符串，第二个必须是数字，这样才符合声明的要求。
    //访问元组
    console.log(x[0], x[1]);
    //赋值
    x[2] = 'haha';//这是可以的，因为这个值属于string或number之一
    x[3] = 4;
    //x[4] = true;//不可以，布尔类型不在要求的范围内
    //console.log(x[4].toString());//可以编译，但是执行时，会报Cannot read property 'toString' of undefined的错误。
    //可见，元组的意义在于限定了JavaScript的一个数组里的元素类型不能超出元组声明的范围。因此let x: [string, number]的意思不是说要求x必须只能有2个元素的数组，也不是说要求字符串元素后面必须是number元素。

    //枚举
    enum Color { Red, Green, Blue };//自动使得Color.Red = 0, Color.Green = 1, Color.Blue = 2
    let c: Color = Color.Green;//声明c为枚举Color类型，且值为Green
    console.log(typeof c, c === 1);//number true 可见Color.Green其实就是一个number
    

    enum Color2 { Red = 1, Green, Blue };//改变编号，令开始编号为1，后面为2/3/4……
    let c2: Color2 = Color2.Green;
    //c2 = c;//报错。虽然c2实际上是个number，c也是个number，但是不能互相赋值，这是typescript特意限制的，就是想区分不同的枚举。

    enum Color3 { Red = 1, Green = 2, Blue = 4 };//这里索性手工写编号，有时候是必要的
    let c3: Color = Color.Green;
    //通过编号来反查枚举名
    let colorName: string = Color[2];//查出编号为2的枚举名，得'Blue'。
    console.log(colorName);//'Blue'
    //查看编译之后的js代码，可以看到其做法是 Color[Color["Red"] = 0] = "Red";这语句其实就是Color["Red"]=0 和 Color[0]="Red"，也就是实现了"Red"字符串和数字0的一一对应关系
    //于是就很容易理解为什么反查枚举名直接用Color[2]这样的写法。

    //any类型，指类型未定，运行时决定
    let notSure: any = 4;
    notSure = "可能是字符串";//注意鼠标提示，在给了确定值后，仍然认为它是any类型，而不直接认定为string类型
    notSure = false; // 也可能是布尔类型
    notSure.ifItExists();//能通过编译，但是要保证运行时有这个方法
    notSure.toFixed(); //能通过编译，但是要保证运行时有这个方法
    //实际书写代码时，除非非常必要，一般不要用any类型。（后面会提到函数重载，用到any类型，那是特例）

    let prettySure: Object = 4;//不是any类型
    //prettySure.toFixed(); //不能通过编译


    //void类型，用于声明没有返回值的函数（其实返回值为undefined）
    function warnUser(): void {
        alert("This is my warning message");
    }
    //声明一个类型为void的变量其实是没意义的，因为必须赋值为undefined或者null，否则会报错
    let unusable: void = undefined;


    //类型断言
    //当其时十分清楚变量的类型肯定是什么，可以用以下断言语法来告诉编译器：
    let someValue: any = "this is a string";
    let strLength: number = (<string>someValue).length;//someValue本来是any类型，并不能确定它有否length属性。
    //但是如果在这里已经很确定它是字符串类型，则用这个语法能帮助我们得到编辑器的方法提示。
    //用下面的写法也可以，而且写JSX时必须用下面的写法才行：
    let someValue2: any = "this is a string";
    let strLength2: number = (someValue2 as string).length;

}
