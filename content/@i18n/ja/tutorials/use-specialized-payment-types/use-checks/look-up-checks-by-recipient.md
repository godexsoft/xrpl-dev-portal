---
html: look-up-checks-by-recipient.html
parent: use-checks.html
blurb: 特定のアドレスで受信されるすべてのCheckのリストを取得する。
labels:
  - Checks
---
# 受取人に基づくCheckの検索

_[Checks Amendment][]により追加されました。_

このチュートリアルでは、[Check](checks.html)をその受取人で検索する方法を説明します。[Checkを送金元で検索する](look-up-checks-by-sender.html)こともできます。

## 1. 特定のアドレスのすべてのCheckの検索

特定のアドレスで受信および送信されるすべてのCheckのリストを取得するには、受取人アカウントのアドレスを指定した`account_objects`コマンドを実行し、リクエストの`type` フィールドを`checks`に設定します。

**注記:**`account_objects`コマンドのコマンドラインインターフェイスでは`type`フィールドは受け入れられません。代わりに[jsonメソッド][]を使用してコマンドラインからJSON-RPCフォーマットのリクエストを送信できます。


### リクエストの例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/getChecks.js' %}
```

*JSON-RPC*

```json
{% include '_code-samples/checks/json-rpc/account_objects-req.json' %}
```

<!-- MULTICODE_BLOCK_END -->

### レスポンスの例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/get-checks-resp.txt' %}
```

*JSON-RPC*

```json
200 OK

{% include '_code-samples/checks/json-rpc/account_objects-resp.json' %}
```

<!-- MULTICODE_BLOCK_END -->


## 2. 受取人に基づくレスポンスの絞り込み

レスポンスには、リクエストのアカウントが送金元であるCheckと、アカウントが受取人であるCheckが含まれていることがあります。レスポンスの`account_objects`配列の各メンバーは1つのCheckを表します。これらの各Checkオブジェクトでは、`Destination`のアドレスはそのCheckの受取人のアドレスです。

以下の疑似コードに、受取人でレスポンスを絞り込む方法を示します。

```js
recipient_address = "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za"
account_objects_response = get_account_objects({
   account: recipient_address,
   ledger_index: "validated",
   type: "check"
})

for (i=0; i < account_objects_response.account_objects.length; i++) {
 check_object = account_objects_response.account_objects[i]
 if (check_object.Destination == recipient_address) {
   log("Check to recipient:", check_object)
 }
}
```

<!--{# common links #}-->
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled-api-links.md' %}
