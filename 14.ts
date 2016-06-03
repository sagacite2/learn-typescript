//装饰器
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {
        console.log('method called');
    }
}
console.log('before new c..');
let c = new C();
console.log('before method called..');
c.method();

//执行结果：
// f(): evaluated
// g(): evaluated
// g(): called
// f(): called
// before new c..
// before method called..
// method called
//可见method方法的装饰器是在定义method方法时执行的，而不是等到对象被new出来，或者method方法被调用时再执行。
//而且f和g的执行和调用次序是有讲究的


//类装饰器
@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
//参数是要装饰的类的构造函数。可见类装饰器的用处是对constructor进行某些限制或处理
//注意这里没有写成@sealed()，是因为下面对该装饰器的定义中并不是返回一个函数。装饰器就是sealed函数本身。
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}



//方法装饰器
class Greeter2 {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }
}

function enumerable(value: boolean) {
    //target:对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
    //propertyKey:成员的名字。
    //descriptor:成员的属性描述符。
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}



//get/set访问符装饰器

class Point {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }
}

function configurable(value: boolean) {
    //target:对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
    //propertyKey:成员的名字。
    //descriptor:成员的属性描述符。
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}



//属性装饰器

class Greeter3 {
    @format("Hello, %s")//元数据，也就是描述数据的数据。
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        let formatString = getFormat(this, "greeting");
        return formatString.replace("%s", this.greeting);
    }
}

import "reflect-metadata";//https://github.com/rbuckton/ReflectDecorators

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}



//参数装饰器

class Greeter4 {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    //注意required才是参数装饰器
    @validate
    greet(@required name: string) {
        return "Hello " + name + ", " + this.greeting;
    }
}

import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

// target:对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
// propertyKey: 成员的名字。
// parameterIndex:参数在函数参数列表中的索引。
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value;
    descriptor.value = function () {
        let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error("Missing required argument.");
                }
            }
        }

        return method.apply(this, arguments);
    }
}