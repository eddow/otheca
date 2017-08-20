Minimal boilerplate
* express
* js-data
* vue
* fuse-box
* element-ui

# Otheca
The application can be used for itself but it also provides a minimal functionning boiler-plate that can quickly be transformed into any kind of application.
## Application
The idea is to manage a Xotheca (discotheca/bibliotheca/...) for those who have hundreds/thousands of files locally (in a folder and its sub-folders) with no programmatic naming convention - to be able to encode formally the informations about each piece - therefore indexing the easiest way possible the "library", search in detail through the "library" and get the needed file through the application.

The screen `Book list` simply search through the indexed files, the screens `Register` help indexing the files.

The `Register` screen will deal with the list of files that exist in the library folder but are not indexed.
- `Register each` will allow to encode pieces one by one
- `Register group` will allow to use regular expressions to encode a chunk of the library - this can be useful if you have an archive of X00 files with a constant naming convention to extract details about the files.

## Boiler plate
The whole application is written in typescript. One can of course still use some pure javascript if needed, but there is no direct need for it.
### Libraries and use
#### [`js-data`](http://www.js-data.io/docs/home)
This library allows us to use the same conventions server-side and client-side. It also provides all the interfaces for communication. In this example, the server is configured to use mongo, but js-data has many [other adapters](# "cloud-datastore
documentdb
firebase
mongodb
redis
rethinkdb
sql
rethinkdb 
").

Both on server and client-side, one just has to do this to add a book into the database :
```typescript
	(new Book(initialValues)).save();
```
Note: This works on server-side but also on client-side, all the chain is managed. This on the client-side will trigger a `POST` request, and that request will be treated server-side resulting in the creation of the item in the DB then the return of the newly-created object with its ID that will be injected in the client-side object.

To define model, these have to be given as a class extending `Record` (to have some watches, functions like `Save`, etc.) and be decorated by the `@Model()` decorator that will generate a json schema out of the class reflection and decoration for validation (validation occuring all along the chain : db, express, http-request)
#### [`vue.js`](https://vuejs.org/)
This manages the MVC part of the application that makes basically the job of `angular`, `react` or `knockout`.
Only two parts are used here : the rendering part and the routing part.

Vue has been chosen over other engines for several reasons :
- Vue has plugins to manage other parts of the application, like a state engine, a routing engine, etc. but these are not imbeded we don't have to use them.
- [Single-file components](https://vuejs.org/v2/guide/single-file-components.html) is a really nice-to-have feature, knowing that one can still have separate files for separate aspects of a component.
#### [`fuse-box`](http://fuse-box.org/)
Really promising (but some might find unfinished) bundler.

The main advantages are the bundling time-efficiency that makes it a fitting tool for development more than for publication.

Also, it integrates quite efficiently with Vue and Typescript.

The bundler will generate 3 files :
- `server/app.js` that contains all the server code to be executed by `node.js`.
- `client/vendor.js` that is used by the browser and that contains all the `npm` libraries used by the application
- `client/app.js` is the source-code from `src/client` and `src/common`

#### [`element-ui`](http://element.eleme.io/#/en-US/component/installation)
This is a workstation web-application UI that is simply used here without implication on the global structure
### Structure
#### `assets`
Static files available directly through the url.
`assets/robots.txt` is available through `http://localhost:port/robots.txt`

#### `config`
Configuration files that will be managed by [bundle-config](https://github.com/eddow/bundle-config).
For example, one can locally have a file `config/local.server.yaml` containing
```
lib: c:/books
```

This will configure the server to look in this folder to find the library and will be ignored by `git`.

#### `src/common`

This code is executed by **both** the client and the server.

The `extensions` are executed automatically (they are referenced by wildcards so files don't need to be referenced, just present there)

The `models` are also imported by wildcards and are available in the client and the server with `import Book from 'models/Book'`

To have the file present is enough for the API to be set up, the controller is implemented automatically (note: there is no customisation yet for the security management etc.)

#### `src/server`

Specific controllers are referenced each (no wildcards) by `routes.ts`.
Here, `dlib` controller is used to access the files in the library.

#### `src/client`

All the global libraries (mainly CSS to import, etc.) are specified in `libs.ts`.

The folder `routes` contain all the Vue files intended to be a screen, they are referenced in `routes.ts`.

The folder `components` contain all the custom components. They are all automatically registered globally with Vue.

The folder `business` contains all the business-layer of the client : computations, data manipulation, etc.
### Evolution and temporaries
I still have to add some screens for library management (book-merge, uploads, ...) and to find a neat library user-management.

For now, the fact vue single-file-component `fuse-box` are under development means that :
- The `style` part of single-file-component is not used, style have to be written in `index.html`. We could find a better temporary solution, though I think this is quite really temporary.
- Imports from single-file-component are not bundled by default - all these imports have to be reported in `client/libs.ts` for now.