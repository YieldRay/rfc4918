# 21. IANA 注意事项

## 21.1 新的 URI schemes

该规范定义了两个 URI schemes：

- 附录 C 中定义的“opaquelocktoken”方案，以及
- “DAV”URI 方案，该方案过去曾在[RFC2518]中使用，以消除 WebDAV 属性和 XML 元素名称的歧义，并且在本规范和扩展 WebDAV 的其他规范中继续用于该目的。在“DAV:”命名空间中标识符的创建由 IETF 控制。

请注意，现在不建议为 XML 名称空间定义新的 URI 方案。在标准最佳实践出现之前就定义了“DAV:”。

## 21.2 XML 命名空间

XML 名称空间可消除 WebDAV 属性名称和 XML 元素的歧义。任何 WebDAV 用户或应用程序都可以定义新的名称空间，以创建自定义属性或扩展 WebDAV XML 语法。IANA 不需要管理此类名称空间，属性名称或元素名称。

## 21.3 Message Header 字段

下面的消息头字段应添加到永久注册表中（请参阅[RFC3864]）。

### 21.3.1 DAV

标头字段名称：DAV

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第 10.1 节）

### 21.3.2 Depth

标头字段名称：Depth

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第 10.2 节）

### 21.3.3 Destination

标头字段名称：Destination

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第 10.3 节）

### 21.3.4 If

标头字段名称：If

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第 10.4 节）

### 21.3.5 Lock-Token

标头字段名称：Lock-Token

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第 10.5 节）

### 21.3.6 Overwrite

标头字段名称：Overwrite

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第 10.6 节）

### 21.3.7 Timeout

标头字段名称：Timeout

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第 10.7 节）

## 21.4 HTTP 状态码

本规范定义的 HTTP 状态代码

- 207 多状态（第 11.1 节）
- 422 无法处理的实体（第 11.2 节），
- 423 已锁定（第 11.3 节），
- 424 依存关系失败（第 11.4 节）和
- 507 储存空间不足（第 11.5 节），

会在 <http://www.iana.org/assignments/http-status-codes> 的注册表中进行更新。

注意：在本规范中，HTTP 状态代码 102（正在处理）已被删除；其 IANA 注册应继续参考 RFC 2518。
