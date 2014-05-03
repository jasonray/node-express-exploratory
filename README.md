Purpose
=======
This project is simply to experiment with building a web service using node.js.  Don't look to get any value by viewing this.  None.

The project uses:
- `express` for handling the http listener and routing
- `bunyan` for logging
- `morgan` for auto-logging the HTTP request

I've done a few of these:
- Node/Express: https://github.com/jasonray/node-express-exploratory
- Node/Restify: https://github.com/jasonray/node-restify-exploratory
- Node/Connect: https://github.com/jasonray/node-connect-exploratory
- JVM/Dropwizard: https://github.com/jasonray/dropwizard-starterkit
- JVM/Jersey: https://github.com/jasonray/jersey-starterkit


Quick intro into node.js for java developers
============================================
Node.js is a javascript runtime engine.  It is based google's javascript engine called [v8](https://code.google.com/p/v8/), which is used not only in node but also in the Google Chrome browser.

Not to oversimplify how node can be used, but its big applicable usage is in server-side javascript for implementation of http listeners.  This can be used as the server side implementation of so-called restful web services or in server side controllers for web applications.

So why the excitement?  We have been doing this in java with a L O N G time.  We have raw TCP listeners and various semantic sugar abstractions for HTTP listeners, servlets, atleast 3 JAX-WS implementations, JAX-RS implementations, and various web frameworks to serve web pages ranging from JSP's to server side MVC.  Why does a different platform make a difference?

Node.js is one solution to overcome two issues that we fundamentally have with developing web application in java and web services on the JVM.

Scalability and Concurrency
---------------------------
Node.js approaches "how to serve multiple requests at a time" very differently than traditional JVM based apps.  Consider that on app servers, as new requests come in, each request gets its own thread.  Threads are expensive, in the consumption of memory and in the OS switching time from one thread to another, limiting the scalability of the app.  Further, it allows for the sharing of memory (variables), creating issues related to concurrency.  Not a flaw of the JVM, but more that this feature is often misused leading to defects or performance issues.

node.js on the other hand uses a single thread during execution.  At first, this seems counterintuitive, this cannot possibly be a good thing, could it??  However, consider that most of the apps that we build generally do little CPU related activities.  Our server side logic generally acts as a fancy aggregator and enforces some rules.  Most of the time that it is processing is generally idle / blocked waiting for response for some other system like the database to respond to a request.

node.js, and really javascript, encourage the use of a event-driven programming paradigm that maximizes this idle/blocked period of a stack's execution.  The convention of using callbacks allows for the single thread of the node engine to do something else while waiting for that database to respond.

I'm not smart enough to describe it well, but consider that many requests are received by node / your application.  The first request is processed, and when it gets to a "call remote system and provide callbacks for what to do when complete" construct, node switches to the next request.  Although it is hard to accept, in systems where you are not doing expensive processing within your code execution stack, this can be much more scalable versus trying to do many things in parallel via threads, each with its overhead of memory and thread switching.

Side note: I get the idea that this paradigm different is similiar to two common web / proxy servers nginx and apache.  Apache is extermelly feature rich, and thus is very commonly used.  Its scales by utilizing a distinct process (not thread) for each request.  Nginx uses an event-driven paradigm like node.js.  For static files and low complexity scripts, nginx outperforms apache.  (I really want to find one particular study I read a few years back as node gained popularity that really showed the comparison of nginx vs apache that drove home this point.  But cannot find it.  So here are some others (http://www.thegeekstuff.com/2013/11/nginx-vs-apache/) and (http://blog.erratasec.com/2012/10/scalability-is-systemic-anomaly.html#.U2TiCV5vmG4) ).

The other benefit is that concurrency is much easier.  You do not have to worry about expensive constructs like semephors to prevent race conditions.  A block of code is exectuded as an automic unit.

A statement like the following would be indeterminent in the JVM - you would be advised to "lock" the check for and loading of the object to force an automic behavior).  With javascript, this is an automic behavior by it fundamental behavior:

```
private static Data data;

public Data getData() {
  if (data==null)
    data = reallyExpensiveLoadingOfData();

  return data;
}
```

Developer efficiency related to context switching
-------------------------------------------------
<snide>The real joy from the hipsters on node.js is that a generation of javascript hackers can now write server side code without the pain of that ugly, so year 2000, java language.</snide>

I say that as an overstatement, but the ability to write server side code in javascript adds a big advantage in certain scneraios.

Specifically, starting with the acceptance of the web application trend over the last few years has been a migration from "logic on the server" to "logic on the client", the eventual conclusion is that web apps do and will continue to have a tremendous amount of logic processed on the browser written in Javascript.

Writing server side logic in tradiitonal server side languages (PHP/.net/Java) forces an inefficiency for development: different coding styles for client and server side logic; different IDE's; different devops practices; different compliation techniques; and in many larger teams, division of labor.

The usage of the same platform on the client and the server is a step toward reducing the inefficiency.


Install
=======
Install `node` either [manually](http://nodejs.org/download/), or if on a mac and have [homebrew](http://brew.sh), run the following command:
```
brew install node
```

After cloning this project, from the root of the project folder, run the following command to install project-specific dependencies.  Consider `npm` to be the `node` equivalent of java `maven` for dependency management. 
```
npm install 
```

Usage
=====
To run, run `node` with app.js:
```
node app.js
```

Logging
-------
This application formats logging using `bunyan` with json formatted output.  To pretty print the output, use the `bunyan` CLI:
```
node app.js | node_modules/.bin/bunyan
```

Shortcut, run `./run.sh` (you may have to `chmod a+x run.sh` to give exectuable rights to the script).

Hello
-----
The `hello` service returns a simple hello world phrase.

A simple usage of it would be:
```
> curl -i http://127.0.0.1:8888/hello?q=q
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 13
Date: Tue, 15 Apr 2014 11:52:09 GMT
Connection: keep-alive

"hello world"
```

The `hello` service implements content-negotiation, and returns different format based upon the negotatied format.

```
jayray> curl -i -H 'Accept: application/json' http://127.0.0.1:8888/hello?q=q
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 48
Date: Tue, 15 Apr 2014 11:57:03 GMT
Connection: keep-alive

{"message":"hello world","h2":"default","q":"q"}
```

To see the implementation of content-negotiation, look in `helloworld.js` for:
```
var negotiator = new Negotiator(request);
var negotiatedMediaType = negotiator.mediaType(availableMediaTypes);
```

Pause
-----
The `pause` service waits for a specified amount of time, then returns an `HTTP 200`.  Useful for performance testing to see the effect of having lots of calls that seem to take a period of time to return.

```
curl -i http://127.0.0.1:8888/pause?duration=3000
```

Express Reference
=================

Links to Express API

Concept of middleware

How to register a handler

How to get request data:
- path params
- get params
- headers

Return a response

Other reference
===============
Log HTTP requests
-----------------
[Morgan](https://github.com/expressjs/morgan) is an middleware component that logs the HTTP requests.

It is initialized through the following.  The literal 'dev' is used a reference to the [formatting](https://github.com/expressjs/morgan#predefined-formats) to use.
```
var morgan = require('morgan')('dev');
app.use(morgan);
```

Below is an example of the output (although the pretty colors will not show up in this markup)
```
GET /api/fetch/light   200 1001ms
GET /public/index.html 200  11ms
```

Command line arguments

Make http request

Fork / multi-process








