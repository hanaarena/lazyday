### 目录

-  [Buffer](#)
	- [Class: Buffer](#)
		- [new Buffer(size)](#)
		- [new Buffer(array)](#)
		- [new Buffer(str[,encoding])](#)
		- [Class Method: Buffer.isEncoding(encoding)](#)
		- [buf.write(string[,offset][,length][,encoding])](#)
		- [buf.toString([encoding][,start][,end])](#)
		- [buf.toJSON()](#)
		- [buf[index]](#)
		- [Class Method: Buffer.isBuffer(obj)](#)
		- [Class Method: Buffer.byteLength(string[,encoding])](#)
		- [Class Method: Buffer.concat(list[,totalLength])](#)
		- [buf.length](#)
		- [buf.copy(targetBuffer[,targetStart][,sourceStart][,sourceEnd])](#)
		- [buf.slice([start][,end])](#)
		- [buf.redUInt8(offset[,noAssert])](#)
		- [buf.readUInt16LE(offset[,noAssert])](#)
		- [buf.readUInt16BE(offset[,noAssert])](#)
		- [buf.readUInt32LE(offset[,noAssert])](#)
		- [buf.readUInt32BE(offset[,noAssert])](#)
		- [buf.readInt8(offset[,noAssert])](#)
		- [buf.readInt16LE(offset[,noAssert])](#)
		- [buf.readInt16BE(offset[,noAssert])](#)
		- [buf.readInt32LE(offset[,noAssert])](#)
		- [buf.readInt32BE(offset[,noAssert])](#)
		- [buf.readFloatLE(offset[,noAssert])](#)
		- [buf.readFloatBE(offset[,noAssert])](#)
		- [buf.readDoubleLE(offset[,noAssert])](#)
		- [buf.readDoubleBE(offset[,noAssert])](#)
		- [buf.writeUInt8(value, offset[,noAssert])](#)
		- [buf.writeUInt16LE(value, offset[,noAssert])](#)
		- [buf.writeUInt16BE(value, offset[,noAssert])](#)
		- [buf.writeUInt32LE(value, offset[,noAssert])](#)
		- [buf.writeUInt32BE(value, offset[,noAssert])](#)
		- [buf.writeInt8(value, offset[,noAssert])](#)
		- [buf.writeInt16LE(value, offset[,noAssert])](#)
		- [buf.writeInt16BE(value, offset[,noAssert])](#)
		- [buf.writeInt32LE(value, offset[,noAssert])](#)
		- [buf.writeInt32BE(value, offset[,noAssert])](#)
		- [buf.writeFloatLE(value, offset[,noAssert])](#)
		- [buf.writeFloatBE(value, offset[,noAssert])](#)
		- [buf.writeDoubleLE(value, offset[,noAssert])](#)
		- [buf.writeDoubleBE(value, offset[,noAssert])](#)
		- [buf.fill(value[,offset][,end])](#)
	- [buffer.INSPECT_MAX_BYTES](#)
	- [Class: SlowBuffer](#)


### Buffer

原生的javascript对Unicode友好，但是对二进制数据并不友好.当处理TCP流或者文件系统的时候，必须去处理八位数流.Node对多种针对操作，创建和处理八位数流的策略.

原始数据存储在Buffer类的实例中.Buffer和整数数组有点相似，但是对应外部V8堆的原始内存分配.Buffer不能够重新分配大小.

Buffer类是一个全局类，让它非常罕见的调用时不需要`require('buffer')`.

在Buffer和javascript的string对象间转换需要一个特定的编码方式.以下是一些不同的string编码：

-  `'ascii'` - 只适用7bit的ASCII数据.这种编码方式非常快，可以剥离觉高的bit.注意当将buffer转换为string时，这种编码方式会将null(`'\0'`或者`'\u0000'`)转换为`0x20`(空格字符编码).如果你想要把null转换为`0x00`，应使用`'utf-8'`.
-  `'utf-8'` - 多种类型编码Unicode字符.许多web页面和其他文档格式使用UTF-8.
-  `'utf16le'` - 2或者4字节(byte)，Little Endian(小型字节存储次序)编码Unicode字符.支持代理项对(U+10000 到U+10FFFF).
-  `'ucs2'` - `'utf16le'`别称
-  `'base64'` - Base64 string编码
-  `'binary'` - 一种仅使用每个字符前8bit的把原始二进制数据转换为string的方法.这种编码方式已被弃用应该避免使用，尽可能使用`Buffer`.未来的Node版本中将会去除这种编码方式.
-  `'hex'` - 把每个字节转换成两个十六进制字符.

创建`Buffer`类型的数组时需注意以下几点：

1. buffer内存不共享，只复制
2. buffer内存被解析成一个数组，而不是一个字节数组(byte array).这是因为`new Uint32Array(new Buffer([1,2,3,4]))`将创建一个有4个元素(`[1,2,3,4]`)的`Uint32Array`，而不是一个只有一个元素(`[0x1020304]`或者`[0x4030201]`)的`Uint32Array`.

注意：Node.js v0.8简单的保留一个buffer对Array.buffer的引用，来代替克隆它.

While more efficient, it introduces subtle incompatibilities with the typed arrays specification. `ArrayBuffer#slice()` makes a copy of the slice while `Buffer#slice()` creates a view.

### Class: Buffer
Buffer类是一个全局类型，所以它可以直接处理二进制数据.同时可以用多种方法来构建它.

**new Buffer(size)**

-  `size` Number

分配新的buffer 8位字节`size` .

**new Buffer(array)**

-  array Array

分配新的buffer使用8位字节`array`

**new Buffer(str[, encoding])**

-  `str` String - 要编码的字符串
-  encoding String - 可选，编码方式

分配新的buffer包含`str`参数.默认为`utf-8`编码



 **Class Method: Buffer.isEncoding(encoding)**

-  `encoding` String -  需验证的编码字符串

当`encoding`是一个有效地编码参数返回true,否则返回false

**buf.write(string[, offset][, length][, encoding]**

-  string String - 被编写成buffer的数据
-  offset Number - 可选，默认：`0`
-  length Number - 可选，默认：`buffer.length - offset`
-  encoding String - 可选，默认：`utf-8`

使用指定的编码方式在`offset`位置把`string`写入buffer.`offset`默认为`0`,`encoding`默认为`utf-8`.`length`是要写入的字节大小.返回被写入的8为字节流大小.如果`buffer`没有足够的控件去容纳整个字符串，将只会写入部分字符串.`length`默认为`buffer.length - offset`.这个方法将不会写入部分字符.

    buf = new Buffer(256);
    len = buf.write('\u00bd + \u00bc = \u00be', 0);
	console.log(len + " bytes: " + buf.toString('utf8', 0, len));

被写入的字符大小(可能与被写入的byte大小不一样)保存在`Buffer._CharsWritten`，当下一次`buf.write()`时将会被重新写入.

**buf.toString([encoding][, start][, end])**
