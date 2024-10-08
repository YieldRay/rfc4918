# 附录 A. 处理 XML 元素的注意事项

## A.1 空 XML 元素说明

XML 支持两种机制，用于指示 XML 元素不包含任何内容。第一种是声明<A></A>格式的 XML 元素。第二个是声明 `<A/>` 形式的 XML 元素。这两个 XML 元素在语义上是相同的。

## A.2 关于非法 XML 处理的说明

XML 是一种灵活的数据格式，可以轻松提交看起来合法但实际上不合法的数据。“在接受的内容上保持灵活性，在发送的内容上严格”这一理念仍然适用，但一定不能将其不适当地应用。XML 在处理空白，元素排序，插入新元素等方面非常灵活。这种灵活性不需要扩展，尤其是在元素含义方面。

接受 XML 元素的非法组合是没有任何好处的。最好的情况下，它也会导致非预期的结果，而糟糕的话，它会导致实际的损失。

## A.3 示例-XML 语法错误

以下针对 PROPFIND 方法的请求正文是非法的。

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:">
    <D:allprop/>
    <D:propname/>
</D:propfind>
```

propfind 元素的定义仅允许使用 allprop 或 propname 元素，而不能同时使用两者。因此，以上内容是错误，必须使用 400（错误请求）进行响应。

但是，想象一下，一个服务器想表现的“友善”，并决定选择 allprop 元素作为真正的元素并做出响应。此时在带宽受限条件下运行并打算执行 propname 的客户端将大吃一惊。

此外，如果服务器表示宽容并决定答复此请求，则不同服务器给出的响应结果会随机变化，其中一些服务器执行 allprop 指令，而其他服务器执行 propname 指令。这反而会降低互操作性，而不是增加互操作性。

## A.4 示例 - 非预期的 XML 元素

前面的示例是非法的，因为它包含两个元素，这些元素被明确禁止在 propfind 元素中一起出现。但是，XML 是一种可扩展的语言，因此可以想象要为 propfind 使用定义新的元素。下面是 PROPFIND 的请求正文，并且与前面的示例一样，不了解 expired-props 元素的服务器必须使用 400（错误请求）将其拒绝。

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:" xmlns:E="http://www.example.com/standards/props/">
    <E:expired-props/>
</D:propfind>
```

要了解为什么返回 400（错误请求）的原因，让我们看一下在不熟悉 expire-props 的服务器眼中请求正文是怎样的：

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:"
            xmlns:E="http://www.example.com/standards/props/">
</D:propfind>
```

由于服务器不理解'expired-props'元素，因此，根据第 17 节中指定的 WebDAV 特定的 XML 处理规则，它必须忽略该元素。于是服务器看到了一个空的 propfind，根据 propfind 元素的定义，这是非法的。

请注意，如果扩展名是附加的（意味着还有其他内容），则不一定会导致 400（错误请求）。例如，想象以下针对 PROPFIND 的请求正文：

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:"
            xmlns:E="http://www.example.com/standards/props/">
    <D:propname/>
    <E:leave-out>*boss*</E:leave-out>
</D:propfind>
```

前面的示例包含了一个虚构的元素'leave-out'。其本意是防止返回名称与提交的模式匹配的任何属性。如果将前面的示例提交给不熟悉“leave-out”的服务器，则唯一的结果就是将忽略“leave-out”元素，并执行 propname。
