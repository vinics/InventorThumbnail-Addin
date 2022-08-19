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

![Application Structure](https://github.com/vinics/InventorThumbnail-Addin/blob/main/resources/readme/Publisher.png)

## Workflow
First we need the Inventor AddIn then we setup Forge for the application's needs. Finally, we will finish the application: logic and interface.
![Application Workflow](https://github.com/vinics/InventorThumbnail-Addin/blob/main/resources/readme/dev-workflow.png)

> IMPORTANT: This method of development and code are focus on educational purposes, therefore it does not concern about performance, security and scalability

---

## Run instructions

### Register App on forge platform
A working account of Forge is necessary to run this application. On Forge website use the "Create App" to register a new Forge API access.

![Forge Platform](https://github.com/vinics/InventorThumbnail-Addin/blob/main/resources/readme/forge-create-new-app.png)

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

![VS Code - Set as Startup project](https://github.com/vinics/InventorThumbnail-Addin/blob/main/resources/readme/set-as-startup-project.png)


After the build is complete a bundle file will be created at *@Solution/InventorThumbnailAddin/bin/Debug*:

![The compiled bundled project](https://github.com/vinics/InventorThumbnail-Addin/blob/main/resources/readme/solution-bundle.png)

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

![Forge Authentication Response](https://github.com/vinics/InventorThumbnail-Addin/blob/main/resources/readme/forge-authetication-response.png)

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

![Thumbnail application](https://github.com/vinics/InventorThumbnail-Addin/blob/main/resources/readme/thumbnail_app.png)
