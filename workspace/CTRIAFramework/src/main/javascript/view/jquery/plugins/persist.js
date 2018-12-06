//
// Copyright (c) 2008 Paul Duncan (paul@pablotron.org)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

/**
 * Persist - top-level namespace for Persist library.
 */
Persist = (function() {
  var VERSION = '0.1.0', P, B, esc, init, empty, ec;

 /*
 * EasyCookie - Simple Javascript cookie library.
 *
 * License
 * =======
 * Copyright (C) 2007 Paul Duncan <pabs@pablotron.org>
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * 
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * The names of contributors may not be used to endorse or promote
 *     products derived from this software without specific prior written
 *     permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Usaging EasyCookie
 * ==================
 * Get a cookie:
 * 
 *   val = EasyCookie.get('some_key');
 * 
 * Set a cookie:
 * 
 *   val = 'this is a test string';
 *   EasyCookie.get('some_key', val);
 * 
 * Remove a cookie:
 * 
 *   old_val = EasyCookie.remove('some_key');
 * 
 * Check to see if cookies are enabled:
 * 
 *   status = EasyCookie.enabled ? 'enabled' : 'not enabled';
 *   alert('Cookies are ' + status);
 * 
 * Set also has several optional parameters, which can be passed like so:
 * 
 *   val = 'this is a test string';
 *   EasyCookie.set('some_key', val, {
 *     // expires in 10 days
 *     expires: 10,
 * 
 *     // limit cookie to domain 'foo.example.com'
 *     domain: 'foo.example.com',
 * 
 *     // limit cookie to path '/some/path'
 *     path: '/some/path',
 * 
 *     // restrict cookie to secure pages only
 *     secure: true
 *   });
 * 
 * You can also get a list of existing cookies like so:
 * 
 *   // get an array of cookie names
 *   keys = EasyCookie.keys();
 * 
 * See test/test.js for examples of all methods.
 *
 */
ec = (function() {
  var EPOCH = 'Thu, 01-Jan-1970 00:00:01 GMT',
      // milliseconds per day
      RATIO = 1000 * 60 * 60 * 24,
      // keys to encode 
      KEYS = ['expires', 'path', 'domain'],
      // wrappers for common globals
      esc = escape, un = unescape, doc = document,
      me; 

  // private methods

  /*
   * Get the current time.
   *
   * This method is private.
   */
  var get_now = function() {
    var r = new Date();
    r.setTime(r.getTime());
    return r;
  }

  /*
   * Convert the given key/value pair to a cookie.
   *
   * This method is private.
   */
  var cookify = function(c_key, c_val /*, opt */) {
     var i, key, val, r = [],
         opt = (arguments.length > 2) ? arguments[2] : {};

    // add key and value
    r.push(esc(c_key) + '=' + esc(c_val));

    // iterate over option keys and check each one
    for (i = 0; i < KEYS.length; i++) {
      key = KEYS[i];
      if (val = opt[key])
        r.push(key + '=' + val);
    }

    // append secure (if specified)
    if (opt.secure)
      r.push('secure');

    // build and return result string
    return r.join('; ');
  }

  /*
   * Check to see if cookies are enabled.
   *
   * This method is private.
   */
  var alive = function() {
    var k = '__EC_TEST__', 
        v = new Date();

    // generate test value
    v = v.toGMTString();

    // set test value
    this.set(k, v);

    // return cookie test
    this.enabled = (this.remove(k) == v);
    return this.enabled;
  }

  // public methods

  // build return object
  me = {
    /*
     * Set a cookie value.
     *
     * Examples:
     *
     *   // simplest-case
     *   EasyCookie.set('test_cookie', 'test_value');
     *
     *   // more complex example
     *   EasyCookie.set('test_cookie', 'test_value', {
     *     // expires in 13 days
     *     expires: 13,
     *
     *     // restrict to given domain
     *     domain: 'foo.example.com',
     *
     *     // restrict to given path
     *     path: '/some/path',
     *
     *     // secure cookie only
     *     secure: true
     *   });
     *
     */
    set: function(key, val /*, opt */) {
      var opt = (arguments.length > 2) ? arguments[2] : {}, 
          now = get_now(),
          expire_at,
          cfg = {},
		  expires;
		  

      // if expires is set, convert it from days to milliseconds
      if (opt.expires) {
        expires=opt.expires * RATIO;

        // set cookie expiration date
        cfg.expires = new Date(now.getTime() + expires);
        cfg.expires = cfg.expires.toGMTString();
      }

      // set remaining keys
      var keys = ['path', 'domain', 'secure'];
      for (i = 0; i < keys.length; i++)
        if (opt[keys[i]])
          cfg[keys[i]] = opt[keys[i]];

      var r = cookify(key, val, cfg);
	  doc.cookie = r;

      return val;
    },

    /*
     * Check to see if the given cookie exists.
     *
     * Example:
     *
     *   val = EasyCookie.get('test_cookie');
     *
     */
    has: function(key) {
      key = esc(key);

      var c = doc.cookie,
          ofs = c.indexOf(key + '='),
          len = ofs + key.length + 1,
          sub = c.substring(0, key.length);

      // check to see if key exists
      return ((!ofs && key != sub) || ofs < 0) ? false : true;
    },

    /*
     * Get a cookie value.
     *
     * Example:
     *
     *   val = EasyCookie.get('test_cookie');
     *
     */
    get: function(key) {
      key = esc(key);

      var c = doc.cookie, 
          ofs = c.indexOf(key + '='),
          len = ofs + key.length + 1,
          sub = c.substring(0, key.length),
          end;

      // check to see if key exists
      if ((!ofs && key != sub) || ofs < 0)
        return null;

      // grab end of value
      end = c.indexOf(';', len);
      if (end < 0) 
        end = c.length;

      // return unescaped value
      return un(c.substring(len, end));
    },

    /*
     * Remove a preset cookie.  If the cookie is already set, then
     * return the value of the cookie.
     *
     * Example:
     *
     *   old_val = EasyCookie.remove('test_cookie');
     *
     */
    remove: function(k) {
      var r = me.get(k), 
          opt = { expires: EPOCH };

      // delete cookie
      doc.cookie = cookify(k, '', opt);

      // return value
      return r;
    },

    /*
     * Get a list of cookie names.
     *
     * Example:
     *
     *   // get all cookie names
     *   cookie_keys = EasyCookie.keys();
     *
     */
    keys: function() {
      var c = doc.cookie, 
          ps = c.split('; '),
          i, p, r = [];

      // iterate over each key=val pair and grab the key
      for (i = 0; i < ps.length; i++) {
        p = ps[i].split('=');
        r.push(un(p[0]));
      }

      // return results
      return r;
    },
  
    /*
     * Get an array of all cookie key/value pairs.
     *
     * Example:
     *
     *   // get all cookies
     *   all_cookies = EasyCookie.all();
     *
     */
    all: function() {
      var c = doc.cookie, 
          ps = c.split('; '),
          i, p, r = [];

      // iterate over each key=val pair and grab the key
      for (i = 0; i < ps.length; i++) {
        p = ps[i].split('=');
        r.push([un(p[0]), un(p[1])]);
      }

      // return results
      return r;
    },

    /* 
     * Version of EasyCookie
     */
    version: '0.2.1',

    /*
     * Are cookies enabled?
     *
     * Example:
     *
     *   have_cookies = EasyCookie.enabled
     *
     */
    enabled: false
  };

  // set enabled attribute
  me.enabled = alive.call(me);

  // return self
  return me;
}());


  // empty function
  empty = function() { };

  // escape spaces in name
  esc = function(str) {
    return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s');
  };



  C = {
    /* 
     * Backend search order.
     * 
     * Note that the search order is significant; the backends are
     * listed in order of capacity, and many browsers
     * support multiple backends, so changing the search order could
     * result in a browser choosing a less capable backend.
     * 
     */ 
    search_order: [
      // TODO: air
      //'gears',
      'localstorage',
      'whatwg_db', 
      'globalstorage', 
      'flash',
      'ie', 
      'cookie'
    ],

    // valid name regular expression
    name_re: /^[a-z][a-z0-9_ -]+$/i,

    // list of backend methods
    methods: [
      'init', 
      'get', 
      'set', 
      'remove', 
      'load', 
      'save'
      // TODO: clear method?
    ],

    // sql for db backends (gears and db)
    sql: {
      version:  '1', // db schema version

      create:   "CREATE TABLE IF NOT EXISTS persist_data (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)",
      get:      "SELECT v FROM persist_data WHERE k = ?",
      set:      "INSERT INTO persist_data(k, v) VALUES (?, ?)",
      remove:   "DELETE FROM persist_data WHERE k = ?" 
    }
  };

  // built-in backends
  B = {
    // whatwg db backend (webkit, Safari 3.1+)
    // (src: whatwg and http://webkit.org/misc/DatabaseExample.html)
    whatwg_db: {
      size:   200 * 1024,

      test: function() {
        var name = 'PersistJS Test', 
            desc = 'Persistent database test.';

        // test for openDatabase
        if (!window.openDatabase)
          return false;

        // make sure openDatabase works
        // XXX: will this leak a db handle and/or waste space?
        if (!window.openDatabase(name, C.sql.version, desc, B.whatwg_db.size))
          return false;

        return true;
      },

      methods: {
        transaction: function(fn) {
          if (!this.db_created) {
            var sql = C.sql.create;

            this.db.transaction(function(t) {
              // create table
              t.executeSql(sql, [], function() {
                this.db_created = true;
              });
            }, empty); // trap exception
          } 

          this.db.transaction(fn);
        },

        init: function() {
          var desc, size; 
          
          // init description and size
          desc = this.o.about || "Persistent storage for " + this.name;
          size = this.o.size || B.whatwg_db.size;

          // create database handle
          this.db = openDatabase(this.name, C.sql.version, desc, size);
        },

        get: function(key, fn, scope) {
          var sql = C.sql.get;

          // if callback isn't defined, then return
          if (!fn)
            return;

          // get callback scope
          scope = scope || this;

          // begin transaction
          this.transaction(function (t) {
            t.executeSql(sql, [key], function(t, r) {
              if (r.rows.length > 0)
                fn.call(scope, true, r.rows.item(0)['v']);
              else
                fn.call(scope, false, null);
            });
          });
        },

        set: function(key, val, fn, scope) {
          var rm_sql = C.sql.remove,
              sql    = C.sql.set;

          // begin set transaction
          this.transaction(function(t) {
            // exec remove query
            t.executeSql(rm_sql, [key], function() {
              // exec set query
              t.executeSql(sql, [key, val], function(t, r) {
                // run callback
                if (fn)
                  fn.call(scope || this, true, val);
              });
            });
          });

          return val;
        },

        // begin remove transaction
        remove: function(key, fn, scope) {
          var get_sql = C.sql.get;
              sql = C.sql.remove;

          this.transaction(function(t) {
            // if a callback was defined, then get the old
            // value before removing it
            if (fn) {
              // exec get query
              t.executeSql(get_sql, [key], function(t, r) {
                if (r.rows.length > 0) {
                  // key exists, get value 
                  var val = r.rows.item(0)['v'];

                  // exec remove query
                  t.executeSql(sql, [key], function(t, r) {
                    // exec callback
                    fn.call(scope || this, true, val);
                  });
                } else {
                  // key does not exist, exec callback
                  fn.call(scope || this, false, null);
                }
              });
            } else {
              // no callback was defined, so just remove the
              // data without checking the old value

              // exec remove query
              t.executeSql(sql, [key]);
            }
          });
        } 
      }
    }, 
    
    // globalstorage backend (globalStorage, FF2+, IE8+)
    // (src: http://developer.mozilla.org/en/docs/DOM:Storage#globalStorage)
    //
    // TODO: test to see if IE8 uses object literal semantics or
    // getItem/setItem/removeItem semantics
    globalstorage: {
      // (5 meg limit, src: http://ejohn.org/blog/dom-storage-answers/)
      size: 5 * 1024 * 1024,

      test: function() {
        return window.globalStorage ? true : false;
      },

      methods: {
        key: function(key) {
          return esc(this.name) + esc(key);
        },

        init: function() {
          this.store = globalStorage[this.o.domain];
        },

        get: function(key, fn, scope) {
          // expand key
          key = this.key(key);

          if (fn){
            fn.call(scope || this, true, this.store.getItem(key));
          }else{
        	  this.store.getItem(key);
          }
        },

        set: function(key, val, fn, scope) {
          // expand key
          key = this.key(key);

          // set value
          this.store.setItem(key, val);

          if (fn)
            fn.call(scope || this, true, val);
        },

        remove: function(key, fn, scope) {
          var val;

          // expand key
          key = this.key(key);

          // get value
          val = this.store[key];

          // delete value
          this.store.removeItem(key);

          if (fn)
            fn.call(scope || this, (val !== null), val);
        } 
      }
    }, 
    
    // localstorage backend (globalStorage, FF2+, IE8+)
    // (src: http://www.whatwg.org/specs/web-apps/current-work/#the-localstorage)
    localstorage: {
      // (unknown?)
      size: -1,

      test: function() {
        return window.localStorage ? true : false;
      },

      methods: {
        key: function(key) {
          return esc(this.name) + esc(key);
        },

        init: function() {
          this.store = localStorage;
        },

        get: function(key, fn, scope) {
          // expand key
          key = this.key(key);

          if (fn){
            fn.call(scope || this, true, this.store.getItem(key));
          }else{
        	  return this.store.getItem(key);
          }
        },

        set: function(key, val, fn, scope) {
          // expand key
          key = this.key(key);

          // set value
          this.store.setItem(key, val);

          if (fn)
            fn.call(scope || this, true, val);
        },

        remove: function(key, fn, scope) {
          var val;

          // expand key
          key = this.key(key);

          // get value
          val = this.getItem(key);

          // delete value
          this.store.removeItem(key);

          if (fn)
            fn.call(scope || this, (val !== null), val);
        } 
      }
    }, 
    
    // IE backend
    ie: {
      prefix:   '_persist_data-',
      // style:    'display:none; behavior:url(#default#userdata);',

      // 64k limit
      size:     64 * 1024,

      test: function() {
        // make sure we're dealing with IE
        // (src: http://javariet.dk/shared/browser_dom.htm)
        return window.ActiveXObject ? true : false;
      },

      make_userdata: function(id) {
        var el = document.createElement('div');

        // set element properties
        el.id = id;
        el.style.display = 'none';
        el.addBehavior('#default#userData');

        // append element to body
        document.body.appendChild(el);

        // return element
        return el;
      },

      methods: {
        init: function() {
          var id = B.ie.prefix + esc(this.name);

          // save element
          this.el = B.ie.make_userdata(id);

          // load data
          if (this.o.defer)
            this.load();
        },

        get: function(key, fn, scope) {
          var val;

          // expand key
          key = esc(key);

          // load data
          if (!this.o.defer)
            this.load();

          // get value
          val = this.el.getAttribute(key);

          // call fn
          if (fn){
            fn.call(scope || this, val ? true : false, val);
          }else{
        	  return val;
          }
        },

        set: function(key, val, fn, scope) {
          // expand key
          key = esc(key);
          
          // set attribute
          this.el.setAttribute(key, val);

          // save data
          if (!this.o.defer)
            this.save();

          // call fn
          if (fn)
            fn.call(scope || this, true, val);
        },

        load: function() {
          this.el.load(esc(this.name));
        },

        save: function() {
          this.el.save(esc(this.name));
        }
      }
    },

    // cookie backend
    // uses easycookie: http://pablotron.org/software/easy_cookie/
    cookie: {
      delim: '-',

      // 4k limit (low-ball this limit to handle browser weirdness, and 
      // so we don't hose session cookies)
      size: 4000,

      test: function() {
        // XXX: use easycookie to test if cookies are enabled
        return P.Cookie.enabled ? true : false;
      },

      methods: {
        key: function(key) {
          return this.name + B.cookie.delim + key;
        },

        get: function(key, fn, scope) {
          // expand key 
          key = this.key(key);

          // get value
          var val = ec.get(key);

          // call fn
          if (fn){
            fn.call(scope || this, val != null, val);
          }else{
        	  return val;
          }
        },

        set: function(key, val, fn, scope) {
          // expand key 
          key = this.key(key);

          // save value
          ec.set(key, val, this.o);

          // call fn
          if (fn)
            fn.call(scope || this, true, val);
        },

        remove: function(key, val, fn, scope) {
          var val;

          // expand key 
          key = this.key(key);

          // remove cookie
          val = ec.remove(key)

          // call fn
          if (fn)
            fn.call(scope || this, val != null, val);
        } 
      }
    }
  };

  // init function
  var init = function() {
    var i, l, b, key, fns = C.methods, keys = C.search_order;

    // set all functions to the empty function
    for (i = 0, l = fns.length; i < l; i++) 
      P.Store.prototype[fns[i]] = empty;

    // clear type and size
    P.type = null;
    P.size = -1;

    // loop over all backends and test for each one
    for (i = 0, l = keys.length; !P.type && i < l; i++) {
      b = B[keys[i]];

      // test for backend
      if (b.test()) {
        // found backend, save type and size
        P.type = keys[i];
        P.size = b.size;

        // extend store prototype with backend methods
        for (key in b.methods)
          P.Store.prototype[key] = b.methods[key];
      }
    }

    // mark library as initialized
    P._init = true;
  };

  // create top-level namespace
  P = {
    // version of persist library
    VERSION: VERSION,

    // backend type and size limit
    type: null,
    size: 0,

    // expose init function
    // init: init,

    add: function(o) {
      // add to backend hash
      B[o.id] = o;

      // add backend to front of search order
      C.search_order = [o.id].concat(C.search_order);

      // re-initialize library
      init();
    },

    remove: function(id) {
      var ofs = C.search_order.indexOf(id);
      if (ofs < 0)
        return;

      // remove from search order
      C.search_order.splice(ofs, 1);

      // delete from lut
      delete B[id];

      // re-initialize library
      init();
    },

    // expose easycookie API
    Cookie: ec,

    // store API
    Store: function(name, o) {
      // verify name
      if (!C.name_re.exec(name))
        throw new Error("Invalid name");

      // XXX: should we lazy-load type?
      // if (!P._init)
      //   init();

      if (!P.type)
        throw new Error("No suitable storage found");

      o = o || {};
      this.name = name;

      // get domain (XXX: does this localdomain fix work?)
    //  o.domain = o.domain || location.hostname || 'localhost.localdomain';

      this.o = o;

      // expires in 1years
      o.expires = o.expires || 365;

      // set path to root
     // o.path = o.path || '/';

      // call init function
      this.init();
    } 
  };

  // init persist
  init();

  // return top-level namespace
  return P;
})();
