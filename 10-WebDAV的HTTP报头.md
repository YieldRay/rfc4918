# 10. WebDAV 的 HTTP 报头

所有 DAV headers 都遵循与 HTTP headers 相同的基本格式规则。比如行连续性以及如何使用逗号组合（或分离）同一标头的多个实例。

WebDAV 向 HTTP 定义的集合中添加了两个新的条件 header：If 和 Overwrite。

## 10.1 DAV Header

```text
DAV              = "DAV" ":" #( compliance-class )
compliance-class = ( "1" | "2" | "3" | extend )
extend           = Coded-URL | token
                   ; token 在 RFC 2616, Section 2.2 中定义
Coded-URL        = "<" absolute-URI ">"
                   ; 不允许线性空格（LWS）
                   ; absolute-URI 在 RFC 3986, Section 4.3 中定义
```

这个 header 出现在响应中表示该资源支持本规范所指定的 DAV 模式和协议。所有符合 DAV 标准的资源必须在所有 OPTIONS 响应上返回兼容级别为“1”的 DAV 标头。如果服务器仅有部分名称空间支持 WebDAV，则对非 WebDAV 资源（包括“/”）的 OPTIONS 请求都不应声明 WebDAV 支持。

它的值是资源支持的所有兼容级别的标识符（多个的话用逗号分隔）。兼容级别标识符可以是编码后的 URL 或 token（由[RFC2616]定义）。标识符可以以任何顺序出现。token 指的是经过了 IETF RFC 流程标准化的标识符，但是其他标识符应该使用 Coded-URLs，以鼓励唯一性。

如果资源支持 class-2 或者 class-3 的兼容性，那么也必须明确显示 class-1 的兼容性。通常，对一种兼容级别的支持并不意味着对其他兼容级别的支持，特别是，对 class-3 的支持不强求对 class-2 的支持。有关本规范中定义的兼容性级别更多详细信息，请参阅第 18 节。

请注意，许多 WebDAV 服务器在收到“OPTIONS \*”请求的时候不会声明对 WebDAV 的支持。

作为请求 header 时，此标头允许客户端（在服务器需要该信息时）提出自己对兼容级别的要求。除非标准跟踪规范要求，否则客户端不应主动发送此标头。任何使用它作为请求 header 的扩展都仔细考虑缓存意味着什么。

## 10.2 Depth Header

```text
Depth = "Depth" ":" ("0" | "1" | "infinity")
```

Depth header 一般与在（可能具有内部成员的）资源上执行的方法一起使用，以指示该方法是仅应用于资源自身（“Depth:0”），仅应用于资源自身及其直接内部成员（“Depth:1”）或资源自身以及其所有后代成员（“Depth:infinity”）。

仅当 method 的定义明确提供了这种支持时，才支持 Depth header。

以下规则是支持 Depth header 的所有 methods 的默认行为。一个 method 也可以通过定义不同的行为来覆盖这些默认设定。

支持 Depth header 的 method 可以选择不必支持 header 的所有值，并且可以在不存在 Depth header 的情况下根据情况定义 method 的行为。例如，MOVE 方法仅支持“Depth:infinity”，并且如果不存在 Depth header，它也将像拥有“Depth:infinity”header 一样工作。

客户端不能指望服务器以原子操作方式或者以任何特定的顺序来（在其后代成员上）执行 method 指令，除非该特定 method 明确提供了此类保证。

具有 Depth header 的 method 开始执行后，将尽可能多地落实其被分配的任务，然后返回一个响应，明确指出其已经完成的任务和未能完成的任务。

因此，例如你尝试 COPY 有层次结构的资源时可能会出现某些成员被复制而某些成员没有被复制的结果。

默认情况下，Depth header 不与其他 header 产生互动。也就是说，具有 Depth header 的请求上的每个标头必须仅应用于 Request-URI（如果有对应资源的话），除非该标头有特殊定义的 Depth header。

如果 Depth header 范围内的源或目标资源被锁定以阻止该方法的执行，那么必须通过使用一个 If header 将锁 token 与 request 一起提交。

Depth header 仅指定有关内部成员的方法的行为。如果资源没有内部成员（也就是说不是集合类型的资源），则必须忽略 Depth header。

## 10.3 Destination Header

Destination header 用于指定一个 URI，该 URI 为诸如 COPY 和 MOVE 之类的方法标识目标资源，这些方法将两个 URI 作为参数。

```text
Destination = "Destination" ":" Simple-ref
```

如果目标值是绝对 URI（[RFC3986]的 4.3 节），则它可以指定目标为其他服务器（或其他端口或协议）。如果源服务器无法尝试复制到这个被指定的非本地服务器，则它必须使请求失败。请注意，在本规范中并未对将资源复制和移动到远程服务器的行为进行完整定义（例如特定的错误条件定义）。
如果“Destination”的值太长或不可接受，则服务器应返回 400（错误请求），理想情况下，应在错误正文中提供有用的信息。

## 10.4 If Header

If header 旨在提供与[RFC2616]的 14.24 节中定义的 If-Match header 相似的功能。但是，If header 可处理任何状态 token 以及 ETag。状态 token 的典型示例是锁 token，并且锁 token 是本规范中定义的唯一状态令牌。

### 10.4.1 用途

If header 有两个不同的用法：

- 第一个是通过提供一系列 state list 来实现对特定资源的条件化请求，这些 state list 通过匹配 token 和 ETag 条件来实现对特定资源的定位。如果评估了此 header 并且所有 state list 均失败，则请求必须失败，并显示 412（失败的前提条件）状态。
- 另一个用途，仅当 header 所描述的 state list 之一成功时，请求才能成功。state list 和匹配成功的标准在 10.4.3 和 10.4.4 节中定义。

此外，state token 出现在 If header 中这一事实本身就意味着它已随请求被“提交”。通常这被用于表名客户端已经知晓了该状态令牌的相关信息。提交一个 state token 的语义取决于其类型（对于锁令牌，请参阅第 6 节）。

请注意，这两个目的需要加以区别对待：state token 的被提交和发挥作用，跟服务器是否实际评估了其所现身其中的 state list 无关，也与其所表示的条件是否为真无关。

### 10.4.2 语法

```text
If = "If" ":" ( 1*No-tag-list | 1*Tagged-list )

No-tag-list = List
Tagged-list = Resource-Tag 1*List

List = "(" 1*Condition ")"
Condition = ["Not"] (State-token | "[" entity-tag "]")
; entity-tag: see Section 3.11 of [RFC2616]
; No LWS allowed between "[", entity-tag and "]"

State-token = Coded-URL

Resource-Tag = "<" Simple-ref ">"
; Simple-ref: see Section 8.3
; No LWS allowed in Resource-Tag
```

语法分未标记列表（“No-tag-list”）和标记列表（“Tagged-list”）。未标记的列表适用于由 Request-URI 标识的资源，而标记列表适用于由 Resource-Tag 标识的资源。

Resource-Tag 适用于所有后续列表，直至出现下一个 Resource-Tag。

请注意，两种列表类型不能在一个 If header 中混用。这不是功能的限制，而是因为“No-tag-list”语法只是“Tagged-list”产生的快捷方式，其中“Resource-Tag”引用了“Request-URI”。

每个列表由一个或多个条件组成。每个条件都是根据 entity-tag 或 state-token 来定义的，可能会被前缀“Not”取反。

请注意，If header 语法不允许在单个请求中使用 If header 的多个实例。但是，HTTP header 语法允许通过在换行符后插入空格来扩展多行展示的单个标头值（请参见[RFC2616]，第 4.2 节）。

### 10.4.3 List 评估

如果资源与所描述的 state 相匹配（其中每个 state 的匹配功能在下面的第 10.4.4 节中定义），则由单个 entity-tag 或 state-token 组成的条件其评估结果为 true。给它加上“Not”前缀会反转评估结果（因此“Not”仅适用于后续的 entity-tag 或 state-token）。

每个 List 都描述了一系列条件。当且仅当每个条件的评估结果都为 true 时，整个列表的评估结果才为 true（也就是说，如果有多于一个的条件，该 list 意味着对多个条件进行“and”逻辑运算）。

每个“No-tag-list”和“Tagged-list”都可以包含一个或多个 lists。当且仅当包含的任何一个或多个 list 的评估结果为 true 时，它们的评估结果才为 true（也就是说，如果存在多个 List，则该 Lists 的结果就是对每个 list 结果进行“or”逻辑运算）。

最后，当且仅当 No-tag-list 或 Tagged-list 中的至少一个评估为 true 时，整个 If header 的评估结果才为 true。如果 header 评估为 false，则服务器必须以 412（前提条件失败）状态拒绝请求。否则，可以像不存在 header 一样继续执行请求。

### 10.4.4 匹配 state-token 和 ETag

在执行 If header 处理时，匹配 state-token 或 entity-tag 的定义如下：

- 标识一个资源：在 Tagged-list 中，资源由 URI 与令牌一起标识，在 No-tag-list 中，由 Request-URI 标识。
- 匹配一个 entity-tag：实体标签与所标识资源相关联的实体标签相匹配。服务器必须使用[RFC2616]的 13.3.3 节中定义的弱或强比较功能来进行匹配。
- 匹配 state-token：If header 中的状态令牌与所标识资源上的任何状态令牌之间存在完全匹配。只要资源在锁范围内的任何位置，就可以认为锁状态令牌是匹配的。
- 处理未映射的 URL：对于 ETag 和 state-token，都应视为这个 URL 标识的资源存在但不具有指定 state。

### 10.4.5 If header 和 Non-DAV-Aware 代理

不能识别 DAV 的代理将不接受 If header，因为它们将无法理解 If 头，并且 HTTP 要求忽略不可理解的头。与 HTTP/1.1 代理进行通信时，客户端必须使用“Cache-Control:no-cache”header，以防止代理在不知情的情况下尝试为其提供缓存服务。处理 HTTP/1.0 代理时，出于相同的原因，必须使用“Pragma:no-cache”request header。

因为通常客户端无法可靠地检测代理中间人是否支持 DAV，所以建议他们始终使用上述方式来指令防止缓存。

### 10.4.6 实例 - No-tag

请求内容：

```text
If: (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2>
  ["I am an ETag"])
  (["I am another ETag"])
```

这个 If header 要求从使用 Request-URI 中标识的资源中识别以下两种情况：

- 由指定的锁定令牌锁定，且拥有“I am an ETag”ETag，或者
- 只需要拥有“I am another ETag”ETag。

满足上述情况之一即可视作符合 If header 所提出的要求。

简而言之，可以把这个 If header 的要求表示成以下伪判断语句：

```text
(
    is-locked-with(urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2) AND
    matches-etag("I am an ETag")
)
OR
(
    matches-etag("I am another ETag")
)
```

### 10.4.7 实例 - No-tag 跟 Not 一起使用

请求内容：

```text
If: (Not <urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2>
    <urn:uuid:58f202ac-22cf-11d1-b12d-002035b29092>)
```

该 If header 要求资源不得被 urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2 锁进行锁定，并且必须被 urn:uuid:58f202ac-22cf-11d1-b12d-002035b29092 锁进行锁定。

### 10.4.8 实例 - 一直为 True 的条件

在某些情况下，客户端希望提交状态令牌，但不希望仅因为状态令牌不再有效而导致请求失败。一种简单的方法是包括一个始终为 true 的条件，例如：

```text
If: (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2>)
    (Not <DAV:no-lock>)
```

众所周知，“DAV:no-lock”从不代表当前的锁定令牌。锁定令牌是由服务器根据第 6.5 节中所述的唯一性要求分配的，因此永远不可能能使用“DAV:”作为开头。因此，通过对这个已知不是当前状态的 state-token 应用“Not”，条件就会始终评估为 true 了，这样整个 If header 也将始终为 true，并且无论如何请求指令都将提交一个锁定令牌 urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2。

### 10.4.9 实例 - 在 COPY 中使用 Tagged-list If header

请求内容：

```text
COPY /resource1 HTTP/1.1
Host: www.example.com
Destination: /resource2
If: </resource1>
    (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2>
    [W/"A weak ETag"]) (["strong ETag"])
```

在此示例中，http://www.example.com/resource1 被复制到 http://www.example.com/resource2。当该方法首次应用于 http://www.example.com/resource1 时，resource1 必须处于由 ((<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2> [W/"A weak ETag"]) (["strong ETag"])) 锁指定的状态下。也就是说，它必须使用“urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2”的锁定令牌进行锁定，并且具有弱实体标签 W/“A weak ETag”，或者必须具有强实体标签“strong ETag”。

### 10.4.10 实例 - 匹配带有集合锁的锁令牌

```text
DELETE /specs/rfc2518.txt HTTP/1.1
Host: www.example.com
If: <http://www.example.com/specs/>
    (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2>)
```

对于此示例，锁令牌必须与指定资源（也就是 If header 中的 url 所标识的/specs/集合）的锁进行比较。如果这个集合没有被指定的锁所锁定，则请求必须失败。否则，此请求可能会成功，因为 If 头的评估结果为 true，并且已经提交了影响受影响资源的锁的锁令牌。

### 10.4.11 实例 - 匹配未映射 url 的 ETags

假定一个集合/specs 不包含成员/specs/rfc2518.doc，这种情况下，下面这个 If header

```text
If: </specs/rfc2518.doc> (["4217"])
```

将被评估为 false（URI 没有被映射，所以也就不具备匹配“4217”的 ETag），但是下面这个 If header

```text
If: </specs/rfc2518.doc> (Not ["4217"])
```

就能总是评估为 true。

注意，使用这一模式时应当与 10.4.4 章节中对 state-tokens 的匹配有一样的考量。

## 10.5 Lock-Token Header

```text
Lock-Token = "Lock-Token" ":" Coded-URL
```

Lock-Token 作为请求 header 时与 UNLOCK 方法一起使用，以标识要删除的锁。Lock-Token 请求标头中的锁令牌必须标识一个锁，该锁包含由 Request-URI 标识的资源作为成员。

Lock-Token 作为响应 header 时与 LOCK 方法一起使用，以指明因成功执行 LOCK 请求而创建的新锁令牌。

## 10.6 Overwrite Header

```text
Overwrite = "Overwrite" ":" ("T" | "F")
```

Overwrite header 指定在 COPY 或 MOVE 期间服务器是否应覆盖映射到目标 URL 的资源。值“F”表示如果目标 URL 已经被映射到资源，则服务器不得执行 COPY 或 MOVE 操作。如果 Overwrite header 未包含在 COPY 或 MOVE 请求中，则资源必须将其值视为“T”。尽管“Overwrite”标头似乎重复了“If-Match:\*”header 的功能（请参阅[RFC2616]），但是 If-Match 仅适用于 Request-URI，不适用于 COPY 或 MOVE 的目标。

如果由于 Overwrite head 的值而未执行 COPY 或 MOVE 操作，则该方法必须失败，并返回 412（失败的前提条件）状态码。服务器必须先进行鉴权，然后再检查这个或其它任何条件 header。

所有符合 DAV 标准的资源都必须支持 Overwrite header。

## 10.7 请求中的 Timeout Header

```text
TimeOut = "Timeout" ":" 1#TimeType
TimeType = ("Second-" DAVTimeOutVal | "Infinite")
           ; No LWS allowed within TimeType
DAVTimeOutVal = 1*DIGIT
```

客户端可以在其 LOCK 请求中包括 Timeout header。但是不强求服务器去满足甚至考虑这些请求。客户端不得使用 LOCK 方法以外的任何其他 method 提交 Timeout header。

“Second”这一 TimeType 指定的是希望在服务器上授予锁与自动删除锁之间所经过的秒数。TimeType“Second”的超时值不得大于 232-1。

有关锁超时行为的说明，请参见第 6.6 节。
