/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

/**
 * Cross Browser Client-Side Persistent Storage Without Cookies
 * <ul>
 * <li>Standalone: Does not need any additional browser plugins or JavaScript libraries to work on the vast majority of
 * current browsers.</li>
 * <li>Consistent: Provides a consistent, opaque API, regardless of the browser.</li>
 * <li>Extensible: Custom backends can be added easily.</li>
 * <li>Backwards Compatible: Can fall back to flash or cookies if no client-side storage solution for the given browser
 * is available.</li>
 * <li>Forwards Compatible: Supports the upcoming versions of Internet Explorer, Firefox, and Safari (Opera too, if you
 * have Flash).</li>
 * <li>Unobtrusive: Capability testing rather than browser detection, so newer standards-compliant browsers will
 * automatically be supported.</li>
 * </ul>
 * <p>
 * Why use PersistJS? What's the problem with using cookies directly
 * </p>
 * <p>
 * Currently the only reliable cross-platform and cross-browser mechanism for storing data on the client side are
 * cookies. Unfortunately, using cookies to store persistent data has several problems:
 * </p>
 * <ul>
 * <li>Size: Cookies are limited to about 4 kilobytes in size.</li>
 * <li>Bandwidth: Cookies are sent along with every HTTP transaction.</li>
 * <li>Complexity: Cookies are difficult to manipulate correctly.</li>
 * </ul>
 * <p>
 * Modern web browsers have addressed these issues by adding non-Cookie mechanisms for saving client-side persistent
 * data. Each of these solutions are simpler to use than cookies, can store far more data, and are not transmitted along
 * with HTTP requests. Unfortunately, each browser has addressed the problem in a different and incompatible way. There
 * are currently 3 different client side persistent data solutions:
 * </p>
 * <ul>
 * <li>globalStorage: Firefox 2.0+, Internet Explorer 8</li>
 * <li>localStorage: development WebKit</li>
 * <li>openDatabase: Safari 3.1+</li>
 * </ul>
 */

/**
 * Persist - top-level namespace for Persist library.
 */
Persist = (function ()
{
	var VERSION = '0.1.0', P, B, esc, init, empty, ec;

	// easycookie 0.2.1 (pre-minified)
	// (see http://pablotron.org/software/easy_cookie/)
	ec = (function ()
	{
		var EPOCH = 'Thu, 01-Jan-1970 00:00:01 GMT', RATIO = 1000 * 60 * 60 * 24, KEYS = [ 'expires', 'path', 'domain' ], esc = escape, un = unescape, doc = document, me;
		var get_now = function ()
		{
			var r = new Date();
			r.setTime(r.getTime());
			return r;
		}
		var cookify = function (c_key, c_val)
		{
			var i, key, val, r = [], opt = (arguments.length > 2) ? arguments[2] : {};
			r.push(esc(c_key) + '=' + esc(c_val));
			for (i = 0; i < KEYS.length; i++)
			{
				key = KEYS[i];
				if (val = opt[key])
					r.push(key + '=' + val);
			}
			if (opt.secure)
				r.push('secure');
			return r.join('; ');
		}
		var alive = function ()
		{
			var k = '__EC_TEST__', v = new Date();
			v = v.toGMTString();
			this.set(k, v);
			this.enabled = (this.remove(k) == v);
			return this.enabled;
		}
		me = {
			set : function (key, val)
			{
				var opt = (arguments.length > 2) ? arguments[2] : {}, now = get_now(), expire_at, cfg = {};
				if (opt.expires)
				{
					opt.expires *= RATIO;
					cfg.expires = new Date(now.getTime() + opt.expires);
					cfg.expires = cfg.expires.toGMTString();
				}
				var keys = [ 'path', 'domain', 'secure' ];
				for (i = 0; i < keys.length; i++)
					if (opt[keys[i]])
						cfg[keys[i]] = opt[keys[i]];
				var r = cookify(key, val, cfg);
				doc.cookie = r;
				return val;
			},
			has : function (key)
			{
				key = esc(key);
				var c = doc.cookie, ofs = c.indexOf(key + '='), len = ofs + key.length + 1, sub = c.substring(0,
							key.length);
				return ((!ofs && key != sub) || ofs < 0) ? false : true;
			},
			get : function (key)
			{
				key = esc(key);
				var c = doc.cookie, ofs = c.indexOf(key + '='), len = ofs + key.length + 1, sub = c.substring(0,
							key.length), end;
				if ((!ofs && key != sub) || ofs < 0)
					return null;
				end = c.indexOf(';', len);
				if (end < 0)
					end = c.length;
				return un(c.substring(len, end));
			},
			remove : function (k)
			{
				var r = me.get(k), opt = {
					expires : EPOCH
				};
				doc.cookie = cookify(k, '', opt);
				return r;
			},
			keys : function ()
			{
				var c = doc.cookie, ps = c.split('; '), i, p, r = [];
				for (i = 0; i < ps.length; i++)
				{
					p = ps[i].split('=');
					r.push(un(p[0]));
				}
				return r;
			},
			all : function ()
			{
				var c = doc.cookie, ps = c.split('; '), i, p, r = [];
				for (i = 0; i < ps.length; i++)
				{
					p = ps[i].split('=');
					r.push([ un(p[0]), un(p[1]) ]);
				}
				return r;
			},
			removeAll : function (k)
			{
				var pathBits = location.pathname.split('/');
				var pathCurrent = ' path=';

				// do a simple pathless delete first.
				doc.cookie = this.o.version + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

				for (var i = 0; i < pathBits.length; i++)
				{
					pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
					document.cookie = this.o.version + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
				}
			},
			version : '0.2.1',
			enabled : false
		};
		me.enabled = alive.call(me);
		return me;
	}());

	// empty function
	empty = function ()
	{
	};

	// escape spaces in name
	esc = function (str)
	{
		// return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s');
		return str;
	};

	C = {
		/*
		 * Backend search order.
		 * 
		 * Note that the search order is significant; the backends are listed in order of capacity, and many browsers
		 * support multiple backends, so changing the search order could result in a browser choosing a less capable
		 * backend.
		 * 
		 */

		search_order :  [
		 'whatwg_db',
		'localstorage', 'globalstorage','sessionstorage'

		],

		// valid name regular expression
		name_re : /^[a-z][a-z0-9_ -]+$/i,

		// list of backend methods
		methods : [ 'init', 'get', 'set', 'remove', 'load', 'save', 'removeAll'
		// TODO: clear method?
		],

		// sql for db backends ( SQL-Lite db)
		sql : {
			version : '1', // db schema version

			createmeta : "CREATE TABLE IF NOT EXISTS CANVAS_METADATA (type TEXT NOT NULL,id TEXT UNIQUE NOT NULL PRIMARY KEY, metadataid TEXT,value TEXT,version TEXT,serverdate TEXT,createddate datetime);",
			createmetasynctracker : "CREATE TABLE IF NOT EXISTS CANVAS_METADATA_SYNCTRACK (type TEXT NOT NULL PRIMARY KEY,serverdate TEXT);",
			getmeta : "SELECT value FROM CANVAS_METADATA WHERE type=? AND id = ?;",
			setmeta : "INSERT OR REPLACE INTO CANVAS_METADATA(type, id, metadataid, value, version ,serverdate,createddate) VALUES (?, ?, ?, ?, ?, ?,datetime());",
			removemeta : "DELETE FROM CANVAS_METADATA WHERE id = ?;",
			removeAllMetaData : "DELETE FROM CANVAS_METADATA;",
			removeAllMetaDataTracker : "DELETE FROM CANVAS_METADATA_SYNCTRACK;",
			setmetatracker : "INSERT OR IGNORE INTO CANVAS_METADATA_SYNCTRACK(type,serverdate) VALUES (?,?);",
			getListByGroup : "SELECT st.serverdate synctime,type,group_concat(DISTINCT metadataid) metadatagrp FROM CANVAS_METADATA,(SELECT DISTINCT serverdate  FROM CANVAS_METADATA_SYNCTRACK) st GROUP BY type ORDER BY type ASC;",
			getsynctime : "SELECT serverdate FROM CANVAS_METADATA_SYNCTRACK WHERE type=?;",
			updatesynctime : "INSERT OR REPLACE INTO CANVAS_METADATA_SYNCTRACK(type,serverdate) VALUES (?, ?);",
			metaDataCount : "SELECT count(*) rowcount FROM CANVAS_METADATA;"

		}
	};

	// built-in backends
	B = {

		// whatwg db backend (webkit, Safari 3.1+)
		// (src: whatwg and http://webkit.org/misc/DatabaseExample.html)
		whatwg_db : {
			size : -1,

			test : function ()
			{

				// test for openDatabase
				// make sure openDatabase works
				// XXX: will this leak a db handle and/or waste space?
				if (window.sqlitePlugin && window.sqlitePlugin.openDatabase)
				return true;
				/*if (window.openDatabase)
					return true;*/

				return false;

			},

			methods : {
				transaction : function (fn)
				{
					var self = this;
					if (!self.db_created)
					{
						var metasql = C.sql.createmeta;
						var metatrackersql = C.sql.createmetasynctracker;

						this.db.transaction(function (t)
						{
							// create table
							t.executeSql(metatrackersql, [], function ()
							{

								t.executeSql(metasql, [], function ()
								{
									this.db_created = self.db_created = true;
								}

								, function (t1, r1)
								{
									LOGGER.error('Error on ', [ metasql, t1, r1 ]);
								});

							},

							function (t2, r2)
							{
								LOGGER.error('Error on ', [ metatrackersql, t2, r2 ]);
							});
						}, function (t3, r3)
						{
							LOGGER.error('Transaction Failure ', [ t3, r3 ]);
						}, function (t4, r4)
						{
							LOGGER.info('Transaction success ');
						});
					}

					this.db.transaction(fn);
				},

				init : function ()
				{
					var desc, size;

					// init description and size
					desc = this.o.about || "Persistent storage for " + this.name;
					size = 5*1024*1024;

					// create database handle
					//this.db = window.openDatabase(this.name, C.sql.version, desc, size);
                    this.db = window.sqlitePlugin.openDatabase({name: this.name, location: 1,androidDatabaseImplementation: 2, androidLockWorkaround: 1}, cbx.emptyFn, cbx.emptyFn);
					this.transaction(empty);

				},

				getSyncTime : function (fn, scope)
				{
					var sql = C.sql.getsynctime;

					// if callback isn't defined, then return
					if (!fn)
						return;

					// get callback scope
					scope = scope || this;

					var syncKeyDelim = '$synctime$'; // synctime naming constant
					this.transaction(function (t)
					{
						t.executeSql(sql, [ syncKeyDelim ], function (t, r)
						{
							// success callback
							// run callback
							LOGGER.debug('Success While executing ', [ sql, t, r ]);
							if (r.rows.length > 0)
								fn.call(scope, true, r.rows.item(0)['serverdate']);
							else
								fn.call(scope, false, undefined);
						},

						// error callback
						function (t1, r1)
						{
							// run callback
							LOGGER.error('Error While executing ', [ sql, t1, r1 ]);
							fn.call(scope, false, undefined);
						});
					});

				},

				getSyncList : function (fn, scope)
				{
					var sql = C.sql.getListByGroup;

					// if callback isn't defined, then return
					if (!fn)
						return;

					// get callback scope
					scope = scope || this;

					this.transaction(function (t)
					{
						t.executeSql(sql, [], function (t, r)
						{
							// success callback
							// run callback
							LOGGER.debug('Success While executing ', [ sql, t, r ]);
							if (r.rows.length > 0)
								fn.call(scope, true, r.rows);
							else
								fn.call(scope, false, null);
						},

						// error callback
						function (t1, r1)
						{
							// run callback
							LOGGER.error('Error While executing ', [ sql, t1, r1 ]);
							fn.call(scope, false, null);
						});
					});

				},

				get : function (type, key, fn, scope)
				{
					var sql = C.sql.getmeta;

					// if callback isn't defined, then return
					if (!fn)
						return;

					// get callback scope
					scope = scope || this;

					// begin transaction
					this.transaction(function (t)
					{
						t.executeSql(sql, [ type, key ], function (t, r)
						{
							LOGGER.debug('Success While executing ', [ sql, t, r ]);

							if (r.rows.length > 0)
								fn.call(scope, true, r.rows.item(0)['value']);
							else
								fn.call(scope, false, null);
						},

						// error callback
						function (t1, r1)
						{
							// run callback
							LOGGER.error('Error While executing ', [ sql, t1, r1 ]);
							fn.call(scope, false, null);
						});
					});
				},

				updateSyncTime : function (serverdatetime)
				{
					var sqltracker = C.sql.updatesynctime;

					var syncKeyDelim = '$synctime$';
					this.transaction(function (t)
					{
						t.executeSql(sqltracker, [ syncKeyDelim, serverdatetime ], function (t, r)
						{
							// success callback
							// run callback
							LOGGER.debug('Success While executing ', [ sqltracker, t, r ]);
						},

						// error callback
						function (t1, r1)
						{
							// run callback
							LOGGER.error('Error While executing ', [ sqltracker, t1, r1 ]);
						});
					});
				},

				set : function (id, type, value, serverdatetime, metadataid, fn, scope,syncTimeUpdate)
				{
					var sql = C.sql.setmeta, ver = this.o.version, sqltracker = C.sql.setmetatracker;

					// begin set transaction
					this.transaction(function (t)
					{
						// exec remove query

						t.executeSql(sql, [ type, id, metadataid, value, ver, serverdatetime ], function (t, r)
						{
							// success callback
							// run callback
							LOGGER.debug('Success While executing ', [ sql, t, r ]);
							if (fn)
								fn.call(scope || this, true, value);
						},

						// error callback
						function (t1, r1)
						{
							// run callback
							LOGGER.error('Error While executing ', [ sql, t1, r1 ]);
							if (fn)
								fn.call(scope || this, false, "");
						});

						/*
						 * t.executeSql(sqltracker, [type,serverdatetime], function(t, r) { // success callback // run
						 * callback LOGGER.debug('Success While executing ',[sqltracker,t,r]); },
						 * 
						 * //error callback function(t1, r1) { // run callback LOGGER.error('Error While executing
						 * ',[sqltracker,t1,r1]); });
						 */
						if(cbx.isEmpty(syncTimeUpdate)){
						var syncKeyDelim = '$synctime$';
						t.executeSql(sqltracker, [ syncKeyDelim, serverdatetime ], function (t, r)
						{
							// success callback
							// run callback
							LOGGER.debug('Success While executing ', [ sqltracker, t, r ]);
						},

						// error callback
						function (t1, r1)
						{
							// run callback
							LOGGER.error('Error While executing ', [ sqltracker, t1, r1 ]);
						});
					}

					});

				},

				removeAll : function (fn, scope)
				{
					var sql = C.sql.removeAllMetaData, sqltrack = C.sql.removeAllMetaDataTracker;
					this.transaction(function (t)
					{
						// if a callback was defined, then get the old
						// value before removing it
						if (fn)
						{
							// exec get query
							t.executeSql(sqltrack, [], function (t, r)
							{
								LOGGER.debug('Success While executing ', [ sqltrack, t, r ]);
								t.executeSql(sql, [], function (t1, r1)
								{
									// exec callback
									LOGGER.debug('Success While executing ', [ sql, t1, r1 ]);
									fn.call(scope || this, true);
								}, function (t2, r2)
								{
									// exec callback
									LOGGER.error('Success While executing ', [ sql, t1, r1 ]);
									fn.call(scope || this, false);
								});
							}, function (t3, r3)
							{
								// exec callback
								LOGGER.error('Success While executing ', [ sqltrack, t3, r3 ]);
								fn.call(scope || this, false);
							});
						} else
						{
							// no callback was defined, so just remove the
							// data without checking the old value

							// exec remove query
							t.executeSql(sqltrack, [], function (t, r)
							{
								LOGGER.debug('Success While executing ', [ sqltrack, t, r ]);
							}, function (t3, r3)
							{
								// exec callback
								LOGGER.error('Success While executing ', [ sqltrack, t3, r3 ]);
							});
							t.executeSql(sql, [], function (t, r)
							{
								LOGGER.debug('Success While executing ', [ sql, t, r ]);
							}, function (t3, r3)
							{
								// exec callback
								LOGGER.error('Success While executing ', [ sql, t3, r3 ]);
							});
						}
					});
				},

				// begin remove transaction
				remove : function (key, fn, scope)
				{
					var sql = C.sql.removemeta, sqlCount = C.sql.metaDataCount, self = this;

					this.transaction(function (t)
					{
						// if a callback was defined, then get the old
						// value before removing it
						if (fn)
						{
							// exec get query

							t.executeSql(sql, [ key ], function (t1, r1)
							{
								// exec callback
								LOGGER.debug('Success While executing ', [ sql, t1, r1 ]);
								fn.call(scope || this, true);
								t.executeSql(sqlCount, [], function (t, r)
								{
									LOGGER.debug('Success While executing ', [ sqlCount, t, r ]);
									if (r.rows.item(0)['rowcount'] == 0)
									{
										self.removeAll();
									}

								}, function (t3, r3)
								{
									// exec callback
									LOGGER.error('Success While executing ', [ sqlCount, t3, r3 ]);
								});
							}, function (t2, r2)
							{
								// exec callback
								LOGGER.error('Success While executing ', [ sql, t2, r2 ]);
								fn.call(scope || this, true);
							});

						} else
						{
							t.executeSql(sql, [ key ], function (t1, r1)
							{
								// exec callback
								LOGGER.debug('Success While executing ', [ sql, t1, r1 ]);
								t.executeSql(sqlCount, [], function (t, r)
								{
									LOGGER.debug('Success While executing ', [ sqlCount, t, r ]);
									if (r.rows.item(0)['rowcount'] == 0)
									{
										self.removeAll();
									}

								}, function (t3, r3)
								{
									// exec callback
									LOGGER.error('Success While executing ', [ sqlCount, t3, r3 ]);
								});
							}, function (t2, r2)
							{
								// exec callback
								LOGGER.error('Success While executing ', [ sql, t2, r2 ]);
							});

						}
					});
				}
			}
		},

		// globalstorage backend (globalStorage, FF2+, IE8+,Chrome 20+)
		// (src: http://developer.mozilla.org/en/docs/DOM:Storage#globalStorage)
		//
		// TODO: test to see if IE8 uses object literal semantics or
		// getItem/setItem/removeItem semantics
		globalstorage : {
			// (5 meg limit, src: http://ejohn.org/blog/dom-storage-answers/)
			size : 5 * 1024 * 1024,

			test : function ()
			{
				return window.globalStorage ? true : false;
			},

			methods : {
				key : function (key)
				{
					return esc(this.name) + esc(key);
				},

				init : function ()
				{
					this.store = globalStorage[this.o.domain];
				},

				get : function (type, key, fn, scope)
				{
					// expand key
					key = this.key(key);

					if (fn)
					{
						fn.call(scope || this, true, this.store.getItem(key));
					} else
					{
						return this.store.getItem(key);
					}
				},
				set : function (key, type, val, serverdatetime, metadataid, fn, scope,syncTimeUpdate)
				{
					// expand key
					key = this.key(key);

					// set value
					this.store.setItem(key, val);

					if (fn)
						fn.call(scope || this, true, val);
				},

				remove : function (key, fn, scope)
				{
					var val;

					// expand key
					key = this.key(key);

					// get value
					val = this.store[key];

					// delete value
					this.store.removeItem(key);

					if (fn)
						fn.call(scope || this, (val !== null), val);
				},

				removeAll : function (key, fn, scope)
				{
					try
					{
						window.globalStorage.clear();
						if (fn)
							fn.call(scope || this, (val !== null), val);
					} catch (err)
					{
					}
				}
			}
		},

		// localstorage backend (localstorage FF2+, IE8+,,Chrome 20+)
		// (src:
		// http://www.whatwg.org/specs/web-apps/current-work/#the-localstorage)
		localstorage : {
			// (unknown?)
			size : -1,

			test : function ()
			{
				return window.localStorage ? true : false;
			},

			methods : {
				key : function (key)
				{
					return esc(this.name) + esc(key);
				},

				init : function ()
				{
					this.store = localStorage;
				},

				get : function (type, key, fn, scope)
				{
					// expand key
					key = this.key(key);

					if (fn)
					{
						fn.call(scope || this, true, this.store.getItem(key));
					} else
					{
						return this.store.getItem(key);
					}
				},

				set : function (key, type, val, serverdatetime, metadataid, fn, scope,syncTimeUpdate)
				{
					// expand key
					key = this.key(key);

					// set value
					this.store.setItem(key, val);

					if (fn)
						fn.call(scope || this, true, val);
				},

				remove : function (key, fn, scope)
				{
					var val;

					// expand key
					key = this.key(key);

					// get value
					val = this.store.getItem(key);

					// delete value
					this.store.removeItem(key);

					if (fn)
						fn.call(scope || this, (val !== null), val);
				},
				removeAll : function (key, fn, scope)
				{
					try
					{
						window.localStorage.clear();
						if (fn)
							fn.call(scope || this, (val !== null), val);
					} catch (err)
					{
					}
				}
			}
		},
		// sessionstorage backend (sessionstorage, FF2+, IE8+,Chrome 20+)
		// (src:
		// http://www.whatwg.org/specs/web-apps/current-work/#the-sessionstorage)
		sessionstorage : {
			// (unknown?)
			size : -1,

			test : function ()
			{
				return window.sessionStorage ? true : false;
			},

			methods : {
				key : function (key)
				{
					return esc(this.name) + esc(key);
				},

				init : function ()
				{
					this.store = sessionStorage;
				},

				get : function (type, key, fn, scope)
				{
					// expand key
					key = this.key(key);

					if (fn)
					{
						fn.call(scope || this, true, this.store.getItem(key));
					} else
					{
						return this.store.getItem(key);
					}
				},

				set : function (key, type, val, serverdatetime, metadataid, fn, scope,syncTimeUpdate)
				{
					// expand key
					key = this.key(key);

					// set value
					this.store.setItem(key, val);

					if (fn)
						fn.call(scope || this, true, val);
				},

				remove : function (key, fn, scope)
				{
					var val;

					// expand key
					key = this.key(key);

					// get value
					val = this.store.getItem(key);

					// delete value
					this.store.removeItem(key);

					if (fn)
						fn.call(scope || this, (val !== null), val);
				},
				removeAll : function (key, fn, scope)
				{
					try
					{
						window.sessionStorage.clear();
						if (fn)
							fn.call(scope || this, (val !== null), val);
					} catch (err)
					{
					}
				}
			}
		},

		// IE backend
		ie : {
			prefix : '_persist_data-',
			// style: 'display:none; behavior:url(#default#userdata);',

			// 64k limit
			size : 64 * 1024,

			test : function ()
			{
				// make sure we're dealing with IE
				// (src: http://javariet.dk/shared/browser_dom.htm)
				return window.ActiveXObject ? true : false;
			},

			make_userdata : function (id)
			{
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

			methods : {
				init : function ()
				{
					var id = B.ie.prefix + esc(this.name);

					// save element
					this.el = B.ie.make_userdata(id);

					// load data
					if (this.o.defer)
						this.load();
				},

				get : function (key, fn, scope)
				{
					var val;

					// expand key
					key = esc(key);

					// load data
					if (!this.o.defer)
						this.load();

					// get value
					val = this.el.getAttribute(key);

					// call fn
					if (fn)
					{
						fn.call(scope || this, val ? true : false, val);
					} else
					{
						return val;
					}
				},

				set : function (key, val, fn, scope)
				{
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

				load : function ()
				{
					this.el.load(esc(this.name));
				},

				save : function ()
				{
					this.el.save(esc(this.name));
				},
				removeAll : function ()
				{
					try
					{
						document.body.removeChild(this.el);
					} catch (err)
					{
					}
				}
			}
		},

		// cookie backend
		// uses easycookie: http://pablotron.org/software/easy_cookie/
		cookie : {
			delim : ':',

			// 4k limit (low-ball this limit to handle browser weirdness, and
			// so we don't hose session cookies)
			size : 4000,

			test : function ()
			{
				// XXX: use easycookie to test if cookies are enabled
				return P.Cookie.enabled ? true : false;
			},

			methods : {
				key : function (key)
				{
					return this.name + B.cookie.delim + key;
				},

				get : function (key, val, fn, scope)
				{
					// expand key
					key = this.key(key);

					// get value
					var val = ec.get(key);

					// call fn
					if (fn)
					{
						fn.call(scope || this, val != null, val);
					} else
					{
						return val;
					}
				},

				set : function (key, val, fn, scope)
				{
					// expand key
					key = this.key(key);

					// save value
					ec.set(key, val, this.o);

					// call fn
					if (fn)
						fn.call(scope || this, true, val);
				},

				remove : function (key, val, fn, scope)
				{
					var val;

					// expand key
					key = this.key(key);

					// remove cookie
					val = ec.remove(key)

					// call fn
					if (fn)
						fn.call(scope || this, val != null, val);
				},
				removeAll : function (fn, scope)
				{

					// expand key

					// remove cookie
					val = ec.removeAll()

					// call fn
					if (fn)
						fn.call(scope || this);
				}
			}
		}
	};

	// init function
	var init = function ()
	{
		var i, l, b, key, fns = C.methods, keys = C.search_order;

		// set all functions to the empty function
		for (i = 0, l = fns.length; i < l; i++)
			P.Store.prototype[fns[i]] = empty;

		// clear type and size
		P.type = null;
		P.size = -1;

		// loop over all backends and test for each one
		for (i = 0, l = keys.length; !P.type && i < l; i++)
		{
			b = B[keys[i]];

			// test for backend
			if (b.test())
			{
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
		VERSION : VERSION,

		// backend type and size limit
		type : null,
		size : 0,

		// expose init function
		// init: init,

		add : function (o)
		{
			// add to backend hash
			B[o.id] = o;

			// add backend to front of search order
			C.search_order = [ o.id ].concat(C.search_order);

			// re-initialize library
			init();
		},

		remove : function (id)
		{
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
		Cookie : ec,

		// store API
		Store : function (name, o)
		{
			// verify name
			if (!C.name_re.exec(name))
				throw new Error("Invalid name");

			// XXX: should we lazy-load type?
			// if (!P._init)
			// init();

			if (!P.type)
				throw new Error("No suitable storage found");

			o = o || {};
			this.name = name;

			// get domain (XXX: does this localdomain fix work?)
			o.domain = o.domain || location.hostname || 'localhost.localdomain';

			this.o = o;

			// expires in 2 years
			o.expires = o.expires || 365 * 2;

			// set path to root
			o.path = o.path || '/';

			o.version = o.version || '1.0';

			// call init function
			this.init();
		}
	};

	// init persist
	init();

	// return top-level namespace
	return P;
})();

/**
 * @class canvas.persist This class uses PersistJS as base framework and changed according to canvas needs.This is a
 *        JavaScript client-side persistent storage library where it does not need any additional browser plugins or
 *        JavaScript libraries to work on the vast majority of current browsers provides a consistent, opaque API,
 *        regardless of the browser. Extensible Custom backends can be added easily and Backwards Compatible and can
 *        fall back to client side storage if no DB solution for the given browser is available.Each backend is wrapped
 *        by similar API's and exploses the exact same interface.
 */

canvas.persist = function ()
{

	Number.prototype.padLeft = function (base, chr)
	{
		var len = (String(base || 10).length - String(this).length) + 1;
		return len > 0 ? new Array(len).join(chr || '0') + this : this;
	}
	var d = new Date, dformat = [ d.getDate().padLeft(), (d.getMonth() + 1).padLeft(), '1970' ].join('/') + ' '
				+ [ d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft() ].join(':');

	dformat + "";
	
	var QuotaAvailable=true;

	if (Persist.type == "whatwg_db")
	{

		var store = new Persist.Store('CTM', {
			version : '1.0'
		});
	} else if (Persist.type == "localstorage" || Persist.type == "globalstorage" || Persist.type == "sessionstorage")
	{
		var store = new Persist.Store('CTM_', {
			version : '1.0'
		});
		var localStore = new Persist.Store('CTT_', {
			version : '1.0'
		});
	}

	return {
		/**
		 * @Method setValue
		 * @memberof "canvas.persist"
		 * @description This method is responsible for setting the metadata to client storage in encoded manner
		 * @access public
		 * @param {String} key This indicates setting unique key for value
		 * @param {String} type This indicates the metadata type
		 * @param {Object} data This hold data to be set
		 * @param {String} serverdatetime This indicates the server date time for the value to be set
		 * @param {Object} metadataid This hold metadata id an additional attribute
		 * @param {Function} providerDataStoreCallBack This is the reference to the actual function that should be
		 *            called back after setting the metadata
		 * @param {Object} scope This refers to providerDataStoreCallBack scope
		 */
		setValue : function (key, type, data, serverdatetime, metadataid, providerDataStoreCallBack, scope,syncTimeUpdate)
		{
			try
			{
				if(QuotaAvailable){
					if (cbx.core.isObject(data))
					{
						data = cbx.encode(data);
					}
					if (localStore)
					{

						/*
						 * if(cbx.isEmpty(localStore.get('',type))){ localStore.set(type, '',serverdatetime); }
						 */
						var syncKeyDelim = '$synctime$';
						if(cbx.isEmpty(syncTimeUpdate)){
							if (cbx.isEmpty(localStore.get('', syncKeyDelim)))
							{
								localStore.set(syncKeyDelim, '', serverdatetime);
							}
						}

						var typeList = localStore.get('', type + '-list');
						if (!cbx.isEmpty(typeList))
						{
							typeList = typeList.split(",");
							if (!typeList.contains(metadataid))
							{
								typeList.push(metadataid);
								localStore.set(type + '-list', '', typeList.join(","));
							}

						} else
						{
							localStore.set(type + '-list', '', metadataid);
						}

						var typeList = localStore.get('', 'CONTAINER_LIST');
						if (!cbx.isEmpty(typeList))
						{
							typeList = typeList.split(",");
							if (!typeList.contains(type))
							{
								typeList.push(type);
								localStore.set('CONTAINER_LIST', '', typeList.join(","));
							}

						} else
						{
							localStore.set('CONTAINER_LIST', '', type);
						}

					}
					if (store)
					{
						store.set(key, type, data, serverdatetime, metadataid, providerDataStoreCallBack, scope,syncTimeUpdate);
					} else
					{
						LOGGER.info('No store has been set', [ key, type, data ]);
					}
				}
			} catch (err)
			{
				if(err.code==22 || err.code=="22" || err.name=="QUOTA_EXCEEDED_ERR"){
				QuotaAvailable=false;	
				}
				LOGGER.error('Error while persisting data', "key--"+key, "type--"+type, "data--"+data, "err--"+err);
				
			}
		},
		/**
		 * @Method getValue
		 * @memberof "canvas.persist"
		 * @description This method is responsible for getting the metadata to client storage in encoded manner and
		 *              applies to the callback function
		 * @access public
		 * @param {String} type This indicates the metadata type
		 * @param {String} key This indicates setting unique key for value
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            setting the metadata
		 * @param {Object} scope This refers to callback scope
		 */
		getValue : function (type, key, callback, scope)
		{
			var data = null;
			try
			{

				if (store)
				{
					store.get(type, key, function (flag, val)
					{
						callback.call(scope || this, val);
					}, this);

				} else
				{
					LOGGER.info('No store available to get', [ type, key ]);
					callback.call(scope || this, data);
				}

			} catch (e)
			{
				LOGGER.error('Error while fetching persisted data', key, e);
				callback.call(scope || this, data);
			}
		},
		/**
		 * @Method removeValue
		 * @memberof "canvas.metadata.canvasStorage"
		 * @description This method is responsible for removing the metadata type based on the unique id from client
		 *              provided Storage
		 * @access public
		 * @param {String} key This indicates setting unique key for value
		 * @param {String} type This indicates the metadata type
		 * @param {String} id This indicates the metadata type id
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting the metadata from one of the providers
		 * @param {Object} scope This refers to callback scope
		 */
		removeValue : function (key, type, id, callback, scope)
		{
			try
			{

				store.remove(key, callback, scope);
				var self = this;
				setTimeout(function ()
				{
					if (Persist.type == "localstorage" || Persist.type == "globalstorage" || Persist.type == "sessionstorage")
					{

						var containerList = localStore.get('', 'CONTAINER_LIST');
						var data = [];
						if (!cbx.isEmpty(containerList) && store['store'].length > 0)
						{

							var typeList = localStore.get('', type + '-list');
							if (!cbx.isEmpty(typeList))
							{
								typeList = typeList.split(",");
								var valArray = [];
								for (var i = 0; i < typeList.length; i++)
								{
									if (typeList[i] != id)
										valArray.push(typeList[i]);
								}
								if (valArray.length > 0)
								{
									localStore.set(type + '-list', '', valArray.join(","));
								} else
								{
									localStore.remove(type + '-list');
									if (!cbx.isEmpty(containerList))
									{
										containerList = containerList.split(",");
										if (containerList.length == 1 && containerList.contains(type))
										{
											localStore.remove('CONTAINER_LIST');
										} else
										{
											var valArray = [];
											for (var i = 0; i < containerList.length; i++)
											{
												if (containerList[i] != type)
													valArray.push(containerList[i]);
											}
											if (valArray.length > 0)
											{
												localStore.set('CONTAINER_LIST', '', valArray.join(","));

											} else
											{
												localStore.remove('CONTAINER_LIST');
											}

										}
									}
								}
							}

							containerList = localStore.get('', 'CONTAINER_LIST');
							if (cbx.isEmpty(containerList))
							{
								self.removeAll();
							}

						} else
						{
							self.removeAll();
						}

					}
				}, 30);

			} catch (e)
			{
				LOGGER.error('Error while removing persisted data', key, e);
				callback.call(scope || this, null);
			}
		},
		/**
		 * @Method removeAll
		 * @memberof "canvas.persist"
		 * @description This method is responsible for removing all metadata from client storage
		 * @access public
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            removing all the metadata
		 * @param {Object} scope This refers to callback scope
		 */
		removeAll : function (callback, scope)
		{
			try
			{
				if (store)
					store.removeAll(callback, scope);
				else
					callback.call(scope || this, null);
			} catch (e)
			{
				LOGGER.error('Error while removing persisted data', key, e);
			}
		},
		/**
		 * @Method updateSyncTime
		 * @memberof "canvas.persist"
		 * @description This method is responsible for updating the synctime.
		 * @access public
		 * @param {String} value This updates the latest synctime to client provided storage
		 */
		updateSyncTime : function (value)
		{
			var data = '';
			if (Persist.type == "whatwg_db")
			{

				if (store)
				{
					store.updateSyncTime(value);
				} else
				{
					LOGGER.info('No synctime  has been reset', [ value ]);
				}
			}

			else if (Persist.type == "localstorage" || Persist.type == "globalstorage" || Persist.type == "sessionstorage")
			{

				if (store['store'].length > 0)
				{
					var syncKeyDelim = '$synctime$';
					localStore.set(syncKeyDelim, '', value);
				}
			}

		},
		/**
		 * @Method getSyncTime
		 * @memberof "canvas.persist"
		 * @description This method is responsible for getting the synctime from client storage.
		 * @access public
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting thes metadata synctime
		 * @param {Object} scope This refers to callback scope
		 */
		getSyncTime : function (callback, scope)
		{
			var data = '';
			if (Persist.type == "whatwg_db")
			{

				if (store)
				{
					store.getSyncTime(function (flag, val)
					{
						data = val || '';
						callback.call(scope || this, data);
					}, this);

				} else
				{
					LOGGER.info('No store available to get', [ type, key ]);
					callback.call(scope || this, '');
				}

			} else if (Persist.type == "localstorage" || Persist.type == "globalstorage" || Persist.type == "sessionstorage")
			{

				if (store['store'].length > 0)
				{
					var syncKeyDelim = '$synctime$';
					var data = localStore.get('', syncKeyDelim) || '';
					callback.call(scope || this, data);
				} else
				{
					callback.call(scope || this, '');
				}
			} else
			{
				callback.call(scope || this, '');
			}

		},
		/**
		 * @Method getSyncList
		 * @memberof "canvas.persist"
		 * @description This method is responsible for getting the synclist from client storage.
		 * @access public
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting thes metadata synclist
		 * @param {Object} scope This refers to callback scope
		 */
		getSyncList : function (callback, scope)
		{

			if (Persist.type == "whatwg_db")
			{

				store.getSyncList(function (flag, val)
				{

					if (flag && !cbx.isEmpty(val))
					{
						var valueArray = [];
						for (var i = 0; i < val.length; i++)
						{
							var tempObj = {};
							var metadatagrp = val.item(i)['metadatagrp'];
							tempObj.keys = [].concat(metadatagrp.split(","));
							tempObj.type = val.item(i)['type'];
							tempObj.synctime = val.item(i)['synctime'] || dformat;
							valueArray.push(tempObj);
						}
						callback.call(scope || this, valueArray);

					} else
					{
						callback.call(scope || this, []);
					}

				}, this);

			} else if (Persist.type == "localstorage" || Persist.type == "globalstorage" || Persist.type == "sessionstorage")
			{

				var containerList = localStore.get('', 'CONTAINER_LIST');
				var data = [];
				if (!cbx.isEmpty(containerList) && store['store'].length > 0)
				{
					containerList = containerList.split(",");
					var valueArray = [];
					var syncKeyDelim = '$synctime$';
					for (var i = 0; i < containerList.length; i++)
					{
						var tempObj = {};
						var typeList = localStore.get('', containerList[i] + '-list');
						tempObj.keys = [].concat(typeList.split(","));
						tempObj.type = containerList[i];
						tempObj.synctime = localStore.get('', syncKeyDelim) || dformat;
						valueArray.push(tempObj);
					}
					data = valueArray;
				}

				callback.call(scope || this, data);
			} else
			{
				callback.call(scope || this, []);
			}

		},
		/**
		 * @Method getStore
		 * @memberof "canvas.persist"
		 * @description This method is responsible for getting store.
		 * @access public
		 */
		getStore : function ()
		{
			return store || '';
		},
		/**
		 * @Method getStore
		 * @memberof "canvas.persist"
		 * @description This method is responsible for getting local store(localstorage or global storage).
		 * @access public
		 */
		getLocalStore : function ()
		{
			return localStore || '';
		}
	}
}();

