function greeter(person: string) {//类型声明
    return "Hello, " + person;//在此处敲入person.就会出现string类型才有的方法提示，好处大大的
}
let user = "Jane User";
document.body.innerHTML = greeter(user); //传的参数确实是string类型，因此在执行命令 tsc greeting.ts 时就不会报错。


//声明一个接口，规定Person有两个属性
interface Person {
    firstName: string;
    lastName: string;
}

function greeter2(person: Person) {//要求传入的参数为实现Person接口的对象
    return "Hello, " + person.firstName + " " + person.lastName;//这就保证了person对象必定有这两个属性，让函数执行时更加安全。
}

let user2 = { firstName: "Jane", lastName: "User" };//只要在形式上达到了接口的要求，那它就自动实现了该接口的，不需要写extends

document.body.innerHTML = greeter2(user2);//这里user2符合参数的类型要求，因此tsc时不会报错。

//声明一个类
class Student {
    fullName: string;//一个属性
    //构造函数
    //注意有两个public参数，这个声明会为类自动声明两个属性，是一个简便写法。查看一下tsc后生成的js代码就明白了。
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;//初始化该类的一个对象，给对象的属性赋值
    }
}

let user3 = new Student("Jane", "M.", "User");
//因为user3拥有firstName和lastName属性，它自动实现了Person接口，因此传进greeter2函数不会报错。
document.body.innerHTML = greeter2(user3);