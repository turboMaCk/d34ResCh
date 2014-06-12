D3 for Responsive Charts demo
==============
This project is a prototype of *advanced in-browser responsive charts* based on *D3.js* library.
Project demonstrate **responsive** and **OOP** solution in pure *java-script* with *D3.js*
It also came with basic *grunt.js* server and easy *bower* and *npm* installation.

![chart animation](http://data.marekrocks.it/charts.gif)

Run project
--------------
Git clone repository & cd to directory:

    $ git clone git@github.com:turboMaCk/d34ResCh.git
    $ cd d34ResCh

Install dependencies via *npm* and *bower*

    $ npm install
    $ bower install

Run grunt for taking care about tasks

    $ grunt


How to initialize charts
--------------
Simply create new instance of d34ResCh (pseudo) class with **selector of chart container** and **data** params:

    new d34ResCh('[container-id]', [data]];

Example code:

    var chart = d34ResCh('#chart', [
      {
        date: '01-01-2014',
        value: 5
      },
        date: '02-01-2014',
        value: 10
      }
    ]);

For redraw chart call *resize* method on instace:

    chart.resize();

There are also other useful methods.
Look inside of script/main.js file for more advanced example.
The only dependency is D3.js.

**Use source**

Licence
--------------
MIT

Copyright 2014 Marek Fajkus
