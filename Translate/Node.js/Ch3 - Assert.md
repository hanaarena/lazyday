### 目录

-  Assert  `这个模块被用来为应用编写单元测试,通过require('assert')获取`
	- [assert.fail(actual,expected,message,operator)](#)
	- [assert(value,message),assert.ok(value,[message])](#)
	- [assert.equal(actual,expected,[message])](#)
	- [assert.notEqual(actual,expected,[message])](#)
	- [assert.deepEqual(actual,expected,[message])](#)
	- [assert.notDeepEqual(actual, expected, [message])](#)
	- [assert.strictEqual(actual,expected,[message])](#)
	- [assert.notStrictEqual(actual,expexted,[message])](#)
	- [assert.throws(block,[error],[message])](#)
	- [assert.doesNotThrow(block,[message])](#)
	- [assert.ifError(value)](#)

**assert.fail(actual,expected,message,operator)**

抛出一个异常，并显示用分隔符(`operator`)分割的`actual`和`expected`的值

**assert(value,message),assert.ok(value,[message])**

当`value`值为真时执行测试，等同于`assert.equal(true, !!value, message)`

**assert.equal(actual,expected,[message])**

浅测试，强制相等如相等操作符(`==`)

**assert.notEqual(actual,expected,[message])**

浅测试，强制不相等如非相等操作符(`!=`)

**assert.deepEqual(actual,expected,[message])**

深度相等测试

**assert.notDeepEqual(actual, expected, [message])**

深度非相等测试

**assert.strictEqual(actual,expected,[message])**

严格测试，如等同运算符(`===`)

**assert.notStrictEqual(actual,expected,[message])**

非严格测试，如非等同运算符(`!==`)

**assert.throws(block, [error], [message])**

期望`block`抛出一个错误.`error`可以是构造函数，正则表达式或者验证函数

验证实例构造函数

    assert.throws(
		function() {
			throw new Error("Wrong value");
		},
		Error
	);

使用正则表达式验证错误信息

    assert.throws(
		function() {
			throw new Error("Wrong value");
		},
		/value/
	);

自定义错误验证

    assert.throws(
		function() {
			throw new Error("Wrong value");
		},
		function(err) {
			if((err instanceof Error) && /value/.test(err)) {
				return true;
			}
		},
		"unecpected error"
	);

**assert.doesNotThrow(block, [message])**

期望`block`不抛出错误，详情查看`assert.throws

**assert.ifError(value)**

测试是否为false，为true时抛出.测试回调函数的第一个error参数时使用。