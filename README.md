# InventorThumbnail-Addin
A simple application to introduce the use of Forge Automation API.

## Application
Solution to generate thumbnail images from Inventor part files (.ipt) without needing to have Autodesk Inventor installed locally.

## Requirements
- Visual Studio
- Visual Studio Code
- Frontend (HTML/CSS/JS)
- Backend (NodeJs)
- Inventor API

## Application Structure
It communicates with the Forge API through HTTP requests.

We will use Forge Design Automation API that has the capabilities to communicate with an Autodesk Cloud where it is maintained:

- Inventor Core (Version of Inventor that runs in the cloud);
- Inventor AddIn (Code that executes actions in Inventor Core);
- Bucket (Storage available for upload/download). 

![Application Structure](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/17c22ecd-8866-4d7f-a527-19b959cd720a/Publisher.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220112T194302Z&X-Amz-Expires=86400&X-Amz-Signature=0a0c9b7b8921f8bc78b254cd5c932dd61e259124b9156ba780f446d4820c3be2&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Publisher.png%22&x-id=GetObject)

## Workflow
First we need the Inventor AddIn then we setup Forge for the application's needs. Finally, we will finish the application: logic and interface.
![Workflow](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e43c0577-668e-4f7b-9df0-61a1390868c5/Publisher%281%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220112T194812Z&X-Amz-Expires=86400&X-Amz-Signature=76392980888caa01eb177595c1fd054dd2317e936c7e3c6171e097d9e1f88a88&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Publisher%281%29.png%22&x-id=GetObject)

> IMPORTANT: This method of development and code are focus on educational purposes, therefore it does not concern about performance, security and scalability

---

## Run instructions

### Register App on forge platform
A working account of Forge is necessary to run this application. On Forge website use the "Create App" to register a new Forge API access.

![Forge Platform](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/005b832e-af90-4591-9734-f9c9617d6986/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220112T200420Z&X-Amz-Expires=86400&X-Amz-Signature=408abe3e748efb9d19cfe40aa50e6d90e5b6082ab18c40cb4c8682948a500d83&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

### Add Forge credentials
After the application register on Forge platform and before running this application a forge credential file must be provided. To do that create a file at *./server/src/config/forgeCredentials.js* with the credential data:

```javascript
module.exports = {
  "client_id": "<YOUR_CLIENT_ID>",
  "client_secret": "<YOUR_CLIENT_ID>",
  "grant_type": "client_credentials",
  "scope": "code:all data:write data:read bucket:create bucket:delete"
};
```

### Build the Inventor AddIn
On VsCode, open the solution file and set the "InventorThumbnailAddinPlugin" project as the startup project:

![VS Code - Set as Startup project](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8d285639-d59e-4225-a112-c732f043b4fa/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220112T200834Z&X-Amz-Expires=86400&X-Amz-Signature=6b0e93a0eacf80d16a96947fb124367a3e58f811f26d5b7aeab963f0010659e8&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

After the build is complete a bundle file will be created at *@Solution/InventorThumbnailAddin/bin/Debug*:

![The compiled bundled project](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/692c37ef-5274-4819-8dca-19cad27453ec/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220112T201022Z&X-Amz-Expires=86400&X-Amz-Signature=4b515798e9b32fea7e4b315c263476c57ce66a7a7634da539532d81fbe50d97e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

### Forge authentication
***REQUEST***

| Verbo | POST |
| --- | --- |
| URL | https://developer.api.autodesk.com/authentication/v1/authenticate |

***HEADER***

| Content-Type | application/x-www-form-urlencoded |
| --- | --- |

***BODY***

| client_id | “Obtido no passo anterior” |
| --- | --- |
| client_secret | “Obtido no passo anterior” |
| grant_type | client_credentials |
| scope | bucket%3Acreate%20bucket%3Aread%20data%3Acreate%20data%3Aread%20data%3Awrite%20code%3Aall |

The result of the request will be an object with three properties (containing the TOKEN we need for the next steps):

![Forge Authentication Response](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1891eeb4-64b5-4da2-8eac-f87f3a488782/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220112T201439Z&X-Amz-Expires=86400&X-Amz-Signature=64920dce643537100b90e59186b14d921548914f2ceb5575a10443aa77cc501f&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

>IMPORTANT: The received token expires with time, if in the next steps an authentication error occurs, it may be expired. If this occurs authenticate again through the request of this step and replace the new token in the affected request.

### Register an AppBundle
***REQUEST***

| Verbo | POST |
| --- | --- |
| URL | https://developer.api.autodesk.com/da/us-east/v3/appbundles |

***AUTHORIZATION - Bearer token***

| TOKEN | TOKEN  |
| --- | --- |

***HEADER***

| Content-Type | application/json |
| --- | --- |

***BODY***

```json
{
	"id": "ThumbnailBundle",
	"description": "Inventor plugin for generating thumbnails from IPT files.",
	"engine": "Autodesk.Inventor+23"
}
```

### Upload AppBundle

***REQUEST***

| Verbo | POST |
| --- | --- |
| URL | https://dasprod-store.s3.amazonaws.com |

***HEADER***

| Content-Type | multipart/form-data |
| --- | --- |

***BODY***

| key | "Received from Register Appbundle request” |
| --- | --- |
| content-type | “Received from Register Appbundle request” |
| policy | “Received from Register Appbundle request” |
| success_action_status | “Received from Register Appbundle request” |
| success_action_redirect |  |
| x-amz-signature | “Received from Register Appbundle request” |
| x-amz-credential | “Received from Register Appbundle request” |
| x-amz-algorithm | “Received from Register Appbundle request” |
| x-amz-date | “Received from Register Appbundle request” |
| x-amz-server-side-encryption | “Received from Register Appbundle request” |
| x-amz-security-token | “Received from Register Appbundle request” |
| file | “Selecione o arquivo .zip resultado da compilação no capítulo anterior” |

### AppBundle alias
***REQUEST***

| Verbo | POST |
| --- | --- |
| URL | https://developer.api.autodesk.com/da/us-east/v3/appbundles/ThumbnailBundle/aliases |

***AUTHORIZATION - Bearer token***

| TOKEN | TOKEN  |
| --- | --- |

***HEADER***

| Content-Type | application/json |
| --- | --- |

***BODY***

```json
{
	"id": "prod",
	"version": 1
}
```

### Create an Activity
***REQUEST***

| Verbo | POST |
| --- | --- |
| URL | https://developer.api.autodesk.com/da/us-east/v3/appbundles/ThumbnailBundle/aliases |

***AUTHORIZATION - Bearer token***

| TOKEN | TOKEN  |
| --- | --- |

***HEADER***

| Content-Type | application/json |
| --- | --- |

***BODY***

```json
{
    "commandLine": [
        "$(engine.path)\\InventorCoreConsole.exe /i \"$(args[PartFile].path)\" /al \"$(appbundles[ThumbnailBundle].path)\""
    ],
    "parameters": {
        "PartFile": {
            "verb": "get",
            "description": "IPT file to process"
        },
        "OutputBmp": {
            "zip": false,
            "ondemand": false,
            "optional": true,
            "verb": "put",
            "description": "Generated thumbnail",
            "localName": "thumbnail.bmp"
        }
    },
    "engine": "Autodesk.Inventor+2022",
    "appbundles": ["webiApp.ThumbnailBundle+prod"],
    "description": "Generate thumbnails for IPT files.",
    "id": "GenerateThumbnail"
  }
```

### Activity alias
***REQUEST***

| Verbo | POST |
| --- | --- |
| URL | https://developer.api.autodesk.com/da/us-east/v3/activities/GenerateThumbnail/aliases |

***AUTHORIZATION - Bearer token***

| TOKEN | TOKEN  |
| --- | --- |

***HEADER***

| Content-Type | application/json |
| --- | --- |

***BODY***

```json
{
	"id": "prod",
	"version": 1
}
```

### Run the server
At *./server* run the server and drag and drop a ipt file on the aplication:

```shell
npm start
```

![Thumbnail application](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/055a4f31-93bd-452e-9bb7-a685fc2f7fb4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220112%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220112T202340Z&X-Amz-Expires=86400&X-Amz-Signature=0ac8db6154f073dd3e8fc87461c6a439d1eaccb00bf628f42969b525017f9d13&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)
