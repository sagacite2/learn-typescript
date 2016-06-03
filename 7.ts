{//Enums枚举

    enum Direction {
        Up = 1,
        Down,
        Left,
        Right
    }//可以用鼠标移到上面的标识符，看提示就明白了


    enum FileAccess {
        // constant members
        None,
        Read = 1 << 1,
        Write = 1 << 2,
        ReadWrite = Read | Write,
        // computed member
        G = "123".length
    }//枚举在tsc编译时会自动计算，实际执行JavaScript代码时就不用计算了。这样能提高性能


    //用名字查值，也可以用值查名字
    enum Enum {
        A
    }
    let a = Enum.A;
    let nameOfA = Enum[Enum.A]; // "A"

    //提高性能可以使用常数枚举，在编译为JavaScript后，实际上根本没用到变量，就是常量数字。
    const enum Enum2 {
        A = 1,
        B = A * 2
    }

    const enum Directions {
        Up,
        Down,
        Left,
        Right
    }

    let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]


}
//外部枚举
declare enum Enum3 {
    A = 1,
    B,
    C = 2
}