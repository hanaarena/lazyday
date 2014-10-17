### 目录

-  Assert  `这个模块被用来为应用编写单元测试,通过require('assert')获取`
	- [assert.fail(actual,expected,message,operator)](#assert.fail)
	- [assert(value,message),assert.ok(value,[message])](#assert.ok)
	- [assert.equal(actual,expected,[message])](#assert.equal)
	- [assert.notEqual(actual,expected,[message])](#assert.notequal)
	- [assert.deepEqual(actual,expected,[message])](#assert.deepequal)
	- [assert.notDeepEqual(actual, expected, [message])](#assert.notdeepequal)
	- [assert.strictEqual(actual,expected,[message])](#assert.strictequal)
	- [assert.notStrictEqual(actual,expexted,[message])](#assert.notstrictequal)
	- [assert.throws(block,[error],[message])](#assert.throws)
	- [assert.doesNotThrow(block,[message])](#assert.doesnotthrow)
	- [assert.ifError(value)](#assert.iferror)

<a name="assert.fail"></a>
**assert.fail(actual,expected,message,operator)**

抛出一个异常，并显示用分隔符(`operator`)分割的`actual`和`expected`的值

<a name="assert.ok"></a>
**assert(value,message),assert.ok(value,[message])**

当`value`值为真时执行测试，等同于`assert.equal(true, !!value, message)`

<a name="assert.equal"></a>
**assert.equal(actual,expected,[message])**

浅测试，强制相等如相等操作符(`==`)

<a name="assert.notequal"></a>
**assert.notEqual(actual,expected,[message])**

浅测试，强制不相等如非相等操作符(`!=`)

<a name="assert.deepequal"></a>
**assert.deepEqual(actual,expected,[message])**

深度相等测试

<a name="assert.notdeepequal"></a>
**assert.notDeepEqual(actual, expected, [message])**

深度非相等测试

<a name="assert.strictequal"></a>
**assert.strictEqual(actual,expected,[message])**

严格测试，如等同运算符(`===`)

<a name="assert.notstrictequal"></a>
**assert.notStrictEqual(actual,expected,[message])**

非严格测试，如非等同运算符(`!==`)

<a name="assert.throws"></a>
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

<a name="assert.doesnotthrow"></a>
**assert.doesNotThrow(block, [message])**

期望`block`不抛出错误，详情查看`assert.throws

<a name="assert.iferror"></a>
**assert.ifError(value)**

测试是否为false，为true时抛出.测试回调函数的第一个error参数时使用。