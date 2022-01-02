> Most JavaScript engine encodes a string in UTF-16 encoding. Hence, each character is saved in 1 or 2 16-bit blocks. The maximum size of the 16-bit binary number is 65535. 

> If a character represented in just one code-unit, charCodeAt returns an integer less than 65536.When dealing with every big characters, the charcodeAt may be more efficient than codePointAt.

> But if a character takes two code-units, the value of the first code-unit is returned. Hence charCodeAt always returns value less than 65536. In this case, endianess of the system matters. There is a much better codePointAt prototype method that always returns the real code-point of a character but is not supported in IE.

> **Should Keep code in Unicode-BPM(UCS) Scope.**




