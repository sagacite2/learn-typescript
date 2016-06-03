{//Generics泛型

    //声明一个使用泛型的函数，参数为T类型，返回值也是T类型：
    function identity<T>(arg: T): T {
        return arg;
    }
    //使用方法：
    let output = identity<string>("myString");
    //更简便的写法：
    let output2 = identity("myString");//typescript能推断T为string类型

    //泛型数组的写法
    function loggingIdentity<T>(arg: T[]): T[] {
        console.log(arg.length);  // Array has a .length, so no more error
        return arg;
    }
    //或
    function loggingIdentity2<T>(arg: Array<T>): Array<T> {
        console.log(arg.length);  // Array has a .length, so no more error
        return arg;
    }

    //作为类型的泛型
    let myIdentity: <T>(arg: T) => T = identity;//声明一个myIdentity变量，其类型是 <T>(arg: T) => T
    //用别的命名也可以：
    let myIdentity2: <U>(arg: U) => U = identity;
    //用对象字面量的形式来写也可以：
    let myIdentity3: { <T>(arg: T): T } = identity;
    //当然，为了让代码更好看，直接抽出来定义一个接口
    interface GenericIdentityFn {
        <T>(arg: T): T;
    }
    //那么myIdentity3就可以写成这个myIdentity4
    let myIdentity4: GenericIdentityFn = identity;

    //进一步，还可以这么定义接口
    interface GenericIdentityFn2<T> {
        (arg: T): T;
    }
    //于是就可以提前定义T为number类型了
    let myIdentity5: GenericIdentityFn2<number> = identity;



    //泛型类
    class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T;
    }

    let myGenericNumber = new GenericNumber<number>();//实例化时，再给定具体类型
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function (x, y) { return x + y; };


    //泛型约束

    interface Lengthwise {
        length: number;//定义一个接口，拥有length属性
    }

    function loggingIdentity3<T extends Lengthwise>(arg: T): T {
        console.log(arg.length);  // 因为T必须实现Lengthwise接口，因此T被约定为拥有length属性，所以在这里就可以直接使用arg.length了
        return arg;
    }

    loggingIdentity3(3); //报错，3没有length属性
    loggingIdentity3({ length: 10, value: 3 });//ok


    //可以声明一个类型参数去约束另一个类型参数
    function copyFields<T extends U, U>(target: T, source: U): T {//比较高级的技巧，T extends U 约束
        for (let id in source) {
            target[id] = source[id];//把source里的属性值拷贝到target中。T extends U约束保证了对于source的每一个属性，x必然有与之对应的属性
        }
        return target;
    }

    let x = { a: 1, b: 2, c: 3, d: 4 };

    copyFields(x, { b: 10, d: 20 }); // okay
    copyFields(x, { Q: 90 });  // 报错，x没有Q属性，因此不符合T extends U的约束

    //在泛型里使用类类型
    function create<T>(c: { new (): T; }): T {
        return new c();
    }//这是一个工厂方法，要求传入一个类c，这个类的构造函数的返回类型是T（也就是typeof c的结果）。

    //一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。
    class BeeKeeper {
        hasMask: boolean;
    }//蜜蜂饲养员

    class ZooKeeper {
        nametag: string;
    }//动物园管理员

    class Animal {
        numLegs: number;
    }

    class Bee extends Animal {
        keeper: BeeKeeper;
    }//蜜蜂的管理者是BeeKeeper

    class Lion extends Animal {
        keeper: ZooKeeper;
    }//狮子的管理者是ZooKeeper

    function findKeeper<A extends Animal, K>(a: {
        new (): A;//约定a是A的实例
        prototype: { keeper: K }//约定a的原型里有属性keeper，且其类型为K
    }): K {
        return a.prototype.keeper;
    }

    findKeeper(Lion).nametag;  // 观察一下编辑器的提示可知，typescript已经推断出findKeeper(Lion)的结果是ZooKeeper对象。这意味着a已经执行了实例化，成为ZooKeeper实例了。
    findKeeper(Bee).hasMask;
}