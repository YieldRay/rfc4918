# 附录 C.“opaquelocktoken”方案和 URI

[opaquelocktoken] URI 方案在[RFC2518]中定义（并由 IANA 注册），目的是从 UUID 中创建语法正确且易于生成的 URI，旨在用作锁定令牌，并且在所有资源上一直都具有唯一性。

opaquelocktoken URI 是通过将 opaquelocktoken 方案与 UUID 以及可选的扩展名一起合成的。服务器可以为每个新的锁定令牌创建新的 UUID。如果服务器希望重用 UUID，则服务器必须添加一个扩展，并且生成该扩展的算法必须保证同一扩展不会与关联的 UUID 一起被重复两次。

```text
OpaqueLockToken-URI = "opaquelocktoken:" UUID [Extension]
    ; UUID is defined in Section 3 of [RFC4122].  Note that LWS
    ; is not allowed between elements of
    ; this production.
Extension = path
    ; path is defined in Section 3.3 of [RFC3986]
```
