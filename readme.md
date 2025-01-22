HTTP methods : Basic set of operations that can be used to interact with server

GET: "retrieve a resource"
DELETE: "delete a resource"
PUT: "replace a resource"
PATCH: "change part of resource"
POST: "interat with resource" (mostly add karta hain)


HTTP status code

1xx : Informational (information pass karni hain user ko)
2xx : Success (joh operation karna chahte the successfully complete hogaya)
3xx : Redirection (resource dekhna chah rahe the woh move hogaya ya url etc)
4xx : Client error (mobile ya user)
5xx : Server error (backend)


100 : continue
102 : processing
200 : ok
201 : created
202 : accepted
307 : temperory redirect
308 : permanent redirect
400 : Bad request client-side passing wrong information to server
401 : Unauthorized
402 : Payment Required
404 : Not Found
500 : Internal Server Error
501 : Gateway time out


Header : meta-data key value ke form mein di jaati hain

Most Common Header

Accept : "application/json"
User_Agent : "konsa browser user chala raha hain safari, chrome, mozill etc user related cheeze"
Example: Mobile browser se data aa raha hain toh user ko suggest karte hain ki hamari app bhi hain
Authorization : "Bearer      jwt token authorization token"
Content-type : "Image,pdf kya bhej rahe ho"
Cookie : "cookie itne time tak login rakhenge"
Cache-Control : "Data kab tak rakhu phir uske baad remove kardu"


CORS Header : Origin wagera isme hote hain  // jyada padhna hain http chai aur code dekh sakte ho

Security Header : policy wagera hoti hain // jyada padhna hain http chai aur code dekh sakte ho
