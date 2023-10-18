# NOJ API REFERENCE

# /info

### REQUEST
```
Method: GET
```

### STATUS_CODE

```
200: 已登录
401: 没有登录
```

### JSON_RESPONSE

```json
{
    role:       1        |  2
                普通用户     管理员 

    status:     block | normal | inactive
                封禁    正常      未激活
    handler:    用户名
    id:         用户ID
    email:      用户注册手机号/邮箱
}
```

# /user

## /user/login

#### REQUEST

```json
Method: POST
Body: {
    account: 
    password:
}
```
#### STATUS_CODE
```
200: 成功
```

#### JSON_RESPONSE
