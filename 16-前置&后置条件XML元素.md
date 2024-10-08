# 16. 前置条件/后置条件 XML 元素

如第 8.7 节所述，许多状态响应的 body 正文中都可以包含有关错误条件的额外信息。本节对错误 body 消息机制的使用提出了要求，并介绍了一些前提条件和后置条件代码。

方法的“precondition”描述了要执行该方法的服务器的一个状态，此状态必须是 true 才能继续执行。方法的“postcondition”描述了该方法执行完成后服务器的一个状态，此状态也必须为 true 才算执行成功。

每个前置条件和后置条件都有一个与其对应的 XML 元素。在 207 多状态响应中，这两种 XML 元素必须出现在适当的“propstat”或“response”下的“error”内，具体取决于条件是应用于一个或多个属性还是整个资源。在所有使用了此规范“error”body 的其他错误响应中，前提条件/后置条件 XML 元素都必须作为 response body 中顶级“error”元素的子元素（同时带有一个适当的响应状态）返回，除非 request 另有约定。如果不希望一个请求被重复提交，那么最常见的响应状态代码为 403（禁止），因为它会一直失败下去。如果期望用户有可能解决冲突并重新提交请求，则最常见的响应状态代码为 409（冲突）。“error”元素可以包含具有特定错误信息的子元素，并且可以使用任何自定义子元素进行扩展。

此机制不能代替此规范在 HTTP 中定义的状态码来使用，因为客户端必须始终能够仅基于状态码就采取合理的措施。但是，它确实消除了需要定义新状态码的需求。用于此目的的新的“机器可读代码”正是被分类为前提条件和后置条件的这俩 XML 元素。自然，定义新条件代码的任何组都可以使用其自己的名称空间。与往常一样，“DAV:”命名空间保留供 IETF 特许的 WebDAV 工作组使用。

每当请求违反了本文档中定义的前置条件或后置条件时，支持该规范的服务器就应使用 XML error。对于本文档中未指定的错误情况，服务器可以简单地选择返回一个适当的数字状态码并将响应 body 留空。但是，服务器也可能使用自定义条件代码和其他描述文本，因为即使客户端不能自动识别这些条件代码，但它们在互操作性测试和调试中是非常有用的。

示例 - 带有前提条件代码的响应：

```xml
HTTP/1.1 423 Locked
Content-Type: application/xml; charset="utf-8"
Content-Length: xxxx
<?xml version="1.0" encoding="utf-8" ?>
<D:error xmlns:D="DAV:">
    <D:lock-token-submitted>
        <D:href>/workspace/webdav/</D:href>
    </D:lock-token-submitted>
</D:error>
```

在此示例中，客户端不知道父集合“/workspace/webdav/”上的无限深度锁，而试图修改集合成员“/workspace/webdav/proposal.doc”。

在扩展 WebDAV 的其他规范中定义了另外一些有用的先决条件和后置条件，例如[RFC3744]（特别是参见第 7.1.1 节），[RFC3253]和[RFC3648]。

如果没有另外指定的话，所有这些元素都在“DAV:”命名空间中，且其内容为空。

## Name: lock-token-matches-request-uri (precondition)

Use with: 409 Conflict

Purpose: 请求可能包含 Lock-Token 标头，以标识 UNLOCK 方法的锁。但是如果 Request-URI 不在令牌标识的锁定范围内，则服务器应使用此错误。有以下几种情况：锁的范围可能不包含 Request-URI，或者锁可能已消失，或者令牌可能无效。

## Name: lock-token-submitted (precondition)

Use with: 423 Locked

Purpose: 该请求无法成功，因为本应该提交了锁令牌。此元素（如果存在）必须包含至少一个阻止了该请求的锁定资源的 URL。在涉及集合锁定的 MOVE，COPY 和 DELETE 场景下，客户端可能很难定位出导致请求失败的锁定资源，但是服务器需要负责返回其中的一个。如果服务器知道所有锁定资源，则它也可能返回所有的锁定资源。

<!ELEMENT lock-token-submitted (href+) >

## Name: no-conflicting-lock (precondition)

Use with: 通常是 423 Locked

Purpose: 由于存在已存在的冲突锁，因此 LOCK 请求失败。请注意，尽管请求定向到的资源只是间接锁定，但是锁定仍可能会发生冲突。在这种情况下，前提条件代码可用于通知客户端有关冲突的锁根，从而避免对“lockdiscovery”属性的单独查找。

<!ELEMENT no-conflicting-lock (href)* >

## Name: no-external-entities (precondition)

Use with: 403 Forbidden

Purpose: 如果服务器由于请求主体包含外部实体而拒绝了客户端请求，则服务器应使用此错误。

## Name: preserved-live-properties (postcondition)

Use with: 409 Conflict

Purpose: 服务器收到了其他有效的 MOVE 或 COPY 请求，但无法在目标位置维护具有相同行为的活属性。可能是服务器仅在存储库的某些部分中支持某些活属性，或者只是存在内部错误。

## Name: propfind-finite-depth (precondition)

Use with: 403 Forbidden

Purpose: 此服务器不允许对集合进行无限深度的 PROPFIND 请求。

## Name: cannot-modify-protected-property (precondition)

Use with: 403 Forbidden

Purpose: 客户端尝试在 PROPPATCH 中设置受保护的属性（例如 DAV:getetag）。另请参阅[RFC3253]第 3.12 节。
