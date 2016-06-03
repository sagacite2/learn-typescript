{
    function f131(x) {
        if (x) {
            return true;
        }
        else {
            return false;
        }

        x = 0; // 错误: 检测到不可及的代码.
    }


    function f132() {
        return            // 换行导致自动插入的分号
        {
            x: "string"   // 错误: 检测到不可及的代码.
        }
    }

    let x = 10;
    loop: while (x > 0) {  // 错误: 未使用的标签.
        x++;
    }


    function f133(x) { // 错误: 不是所有分支都返回了值.
        if (x) {
            return false;
        }

        // 隐式返回了 `undefined`
    }

    switch (x % 2) {
        case 0: // 错误: switch 中出现了贯穿的 case.
            console.log("even");

        case 1:
            console.log("odd");
            break;
    }

}
