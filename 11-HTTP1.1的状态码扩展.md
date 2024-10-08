# 11. HTTP/1.1 的状态码扩展

WebDAV 将使用以下状态码来扩展 HTTP/1.1[RFC2616]中所定义的状态码。

## 11.1 207 - 多状态

207（多状态）状态代码提供了多个独立操作的状态（更多信息，请参见第 13 节）。

## 11.2 422 - 不可处理的实体

422（不可处理的实体）状态代码表示服务器理解请求实体的内容类型（因此 415（不支持的媒体类型）状态代码不合适），并且请求实体的语法正确（因此 400（错误请求）状态代码也不合适），但无法处理其中的指示。例如，请求 body 包含格式正确（即语法正确）但语义上错误的 XML 指令，就可能发生此错误情况。

## 11.3 423 - 锁定

423（锁定）状态码表示 method 的源或目标资源已锁定。此响应应包含适当的前提条件或后置条件代码，例如“lock-to”或“no-conflicting-lock”。

## 11.4 424 - 依赖失败

424（依赖失败）状态码表示由于请求的操作依赖于另一个操作但它失败了，所以无法在资源上执行该方法。例如 PROPPATCH 方法中的命令失败，那么至少，其余命令也将失败，并显示 424（依赖失败），因为 PROPPATCH 是一个全部操作都成功才视作成功的原子操作。

## 11.5 507 - 存储不足

507（存储空间不足）状态码表示无法在资源上执行该方法，因为服务器无法提供成功完成请求所需的存储空间。这种情况被认为是暂时的。如果接收到此状态码的请求是用户操作，那么在被另一个独立的用户行为请求之前，不能再次重复请求。
