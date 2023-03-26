## Endpoints

List of Available Endpoints:

- `POST /register`
- `POST /login`
- `POST /google-login`
- `GET /user`
- `GET /categories/`
- `POST /categories/`
- `DELETE /categories/:id`
- `GET /foods`
- `POST /foods`
- `GET /foods/:id`
- `DELETE /foods/:id`

### POST /register

#### Description

- register new user

#### Request

- Headers

    ```json
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
- Body

    ```json
    {
      "username": String,
      "email": String(required),
      "password": String(required),
      "phoneNumber": String,
      "address": String,
    }
    ```

#### Response

_200 - OK_

- Body

    ```json
    {
      "message": "User alamoo@mail.com successfully created",
      "createUser": {
          "id": 12,
          "username": "alammooo",
          "email": "alamoo@mail.com",
          "password": "$2a$08$BkQExktwERUg66v6DdZ/zOn2rbrsS.nu9Z5TL0rhTOWOhhUsjHAoG",
          "role": "Admin",
          "phoneNumber": "08276832628",
          "address": "Semarang, JT",
          "updatedAt": "2022-11-20T16:55:49.389Z",
          "createdAt": "2022-11-20T16:55:49.389Z"
      }
    }
    ```

_400 - Bad Request_

- Body

    ```json
    [
      "Email is required",
      "Password is required"
    ]
    ```

### POST /login

#### Description

- login into CRM

#### Request

- Headers

    ```json
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
- Body

    ```json
    {
      "email": String,
      "password": String,
    }
    ```

#### Response

_200 - OK_

- Body

    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTY2ODk2MzM5N30.HWK4cNn6NBSuwpLjXLvcfC6494rAcnwx2JcH76Yftxg"
    }
    ```

_403 - Unauthorized_

- Body

    ```json
    {
      "message": "Invalid Username / Password"
    }
    ```

### POST /google-login

#### Description

- login into CRM

#### Request

- Headers

    ```json
    {
      "Content-Type": "application/x-www-form-urlencoded"
    }
- Body

    ```json
    {
      "email": String,
    }
    ```

#### Response

_200 - OK_

- Body

    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTY2ODk2MzM5N30.HWK4cNn6NBSuwpLjXLvcfC6494rAcnwx2JcH76Yftxg"
    }
    ```

### GET /user

#### Description

- Get all the user data

Request:

- headers:

```json
{
  "access_token": "string"
}
```

#### Response

_200 - OK_

- Body

    ```json
    {
      "message": "find User : ",
      "findUser": {
          "id": 12,
          "username": "alammooo",
          "email": "alamoo@mail.com",
          "password": "$2a$08$BkQExktwERUg66v6DdZ/zOn2rbrsS.nu9Z5TL0rhTOWOhhUsjHAoG",
          "role": "Admin",
          "phoneNumber": "08276832628",
          "address": "Semarang, JT",
          "createdAt": "2022-11-20T16:55:49.389Z",
          "updatedAt": "2022-11-20T16:55:49.389Z"
      }
    }
    ```

### GET /categories

#### Description

- Get all the categories data

#### Request

- headers:

```json
{
  "access_token": "string"
}
```

#### Response

_200 - OK_

- Body

    ```json
  [
    {
        "id": 1,
        "name": "Appetizer",
        "createdAt": "2022-11-20T15:26:46.682Z",
        "updatedAt": "2022-11-20T15:26:46.682Z"
    },
    {
        "id": 2,
        "name": "Soup",
        "createdAt": "2022-11-20T15:26:46.682Z",
        "updatedAt": "2022-11-20T15:26:46.682Z"
    },
  ]
    ```

### POST /categories

#### Description

- Create a new category

#### Request

- Headers

    ```json
    {
      "access_token": "string",
      "Content-Type": "application/x-www-form-urlencoded"
    }
- Body

    ```json
    {
      "name": String(required),
    }
    ```

#### Response

_201 - Created_

- Body

    ```json
    {
      "message": "Category \"Eastern\" successfully created",
      "category": {
          "id": 6,
          "name": "Eastern",
          "updatedAt": "2022-11-20T19:49:57.691Z",
          "createdAt": "2022-11-20T19:49:57.691Z"
      }
    }
    ```

_400 - Bad Request_

- Body

    ```json
  [
    "Category name is required"
  ] 
    ```

### DELETE /category/:id

#### Description

- Remove a category based on given id

#### Request

- headers:

```json
{
  "access_token": "string"
}
```

#### Response

_200 - OK_

- Body

    ```json
    {
      "statusCode": 200,
      "message": "Food {name} deleted successfully"
    }
    ```

_403 - Forbidden_

- Body

    ```json
    {
      "statusCode": 403,
      "error": {
        "message": "Not Allowed!"
      }
    }
    ```

_404 - Not Found_

- Body

    ```json
    {
      "statusCode": 404,
      "error": {
        "message": "is not found"
      }
    }
    ```

### GET /foods

#### Description

- Get all the foods data

#### Request

- headers:

```json
{
  "access_token": "string"
}
```

#### Response

_200 - OK_

- Body

    ```json
  "message": "List of Food : ",
  "foodLists": 
  [
    {
      "id": 34,
      "name": "cream",
      "description": "vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit",
      "price": 42,
      "imgUrl": "http://dummyimage.com/178x100.png/5fa2dd/ffffff",
      "authorId": 3,
      "categoryId": 1,
      "createdAt": "2022-11-15T05:49:18.711Z",
      "updatedAt": "2022-11-15T05:49:18.711Z",
      "User": {
        "username": "mbullimore2",
        "email": "bhassewell2@about.com"
      },
      "Category": {
        "name": "Appetizer"
      }
    },
    {
      "id": 33,
      "name": "Ice",
      "description": "et tempus semper est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante",
      "price": 20,
      "imgUrl": "http://dummyimage.com/207x100.png/5fa2dd/ffffff",
      "authorId": 3,
      "categoryId": 1,
      "createdAt": "2022-11-15T05:49:18.711Z",
      "updatedAt": "2022-11-15T05:49:18.711Z",
      "User": {
        "username": "mbullimore2",
        "email": "bhassewell2@about.com"
      },
      "Category": {
        "name": "Appetizer"
      }
    },
  ] 
    ```

### POST /foods

#### Description

- Create a new foods data

#### Request

- Headers

    ```json
    {
      "access_token": "string",
      "Content-Type": "application/x-www-form-urlencoded"
    }
- Body

    ```json
    {
      "name": String(required),
      "description": String(required),
      "price": Integer(required),
      "imgUrl": String(required),
      "authorId": Integer(required),
      "categoryId": Integer(required),
    }
    ```

#### Response

_201 - Created_

- Body

    ```json
    {
      "message": "Food created",
      "foods": {
      "id": 41,
      "name": "Rendang Sumatra",
      "description": "Rendang dengan bumbu khas ditambah rempah yang beragam",
      "price": 30,
      "imgUrl": "https://cdf.orami.co.id/unsafe/cdn-cas.orami.co.id/parenting/images/resep-rendang-daging-sapi-.width-800.jpegquality-80.jpg",
      "authorId": 27,
      "categoryId": 4,
      "updatedAt": "2022-11-16T06:11:59.901Z",
      "createdAt": "2022-11-16T06:11:59.901Z"
      }
    }
    ```

_400 - Bad Request_

- Body

    ```json
  [
    "Food name is required",
    "Description is required",
    "Price is required",
    "Description is required",
    "Minimum price is 5€"
  ]
    ```

### DELETE /foods/:id

#### Description

- Remove a food data based on given id

#### Request

- headers:

```json
{
  "access_token": "string"
}
```

#### Response

_200 - OK_

- Body

    ```json
    {
      "statusCode": 200,
      "message": "Food {name} deleted successfully"
    }
    ```

_403 - Forbidden_

- Body

    ```json
    {
      "statusCode": 403,
      "error": {
        "message": "Not Allowed!"
      }
    }
    ```

_404 - Not Found_

- Body

    ```json
    {
      "statusCode": 404,
      "error": {
        "message": "is not found"
      }
    }
    ```

### Global Error

#### Response

_500 - Internal Server Error_

- Body

    ```json
    {
      "statusCode": 500,
      "error": {
        "message": "Internal Server Error"
      }
    }
    ```
