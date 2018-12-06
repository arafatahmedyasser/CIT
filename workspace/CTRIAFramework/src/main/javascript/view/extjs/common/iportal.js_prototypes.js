
/**
 * Apply a function to each element, return the new array.
 */
Array.prototype.walk = function(f) {
	var a = [], i = this.length;
	while (i--) {
		a.push(f(this[i]));
	}
	return a.reverse();
};

/**
 * 
 */
Array.prototype.getIndexOf = function(elt /* , from */) {
	var len = this.length;

	var from = Number(arguments[1]) || 0;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0)
		from += len;

	for (; from < len; from++) {
		if (from in this && this[from] === elt)
			return from;
	}
	return -1;
};

// 
/**
 * create a new array which is the copy of original array.
 */
Array.prototype.copy = function() {
	var copy = [];

	for (var i = 0; i < this.length; ++i) {
		copy[i] = (typeof this[i].copy != "undefined") ? this[i].copy()
				: this[i];
	}

	return copy;
};

/**
 * 
 */
Array.prototype.insert = function(i, v) {
	if (i >= 0) {
		//for IE, mandatory to mention the second argument for splice method
		  var a = this.slice(), b; 
		  if(Ext.isIE){
			  b = a.splice( i,(a.length-i) );
		  }
		  else
			  b = a.splice( i );
		  a[i] = v;
		  return a.concat( b );}
};

/**
 * 
 */
Array.prototype.unique = function(b) {
	var a = [], i, l = this.length;
	for (i = 0; i < l; i++) {
		if (a.indexOf(this[i], 0, b) < 0) {
			a.push(this[i]);
		}
	}
	return a;
};

/**
 * Function to copy the data of a array fully into another array
 */
Array.prototype.copy = function() {
	var copy = [];
	for (var i = 0; i < this.length; ++i) {
		copy[i] = (typeof this[i].copy != "undefined") ? this[i].copy()
				: this[i];
	}
	return copy;
};

/**
 * 
 */
Array.prototype.equals = function(a) {
	if (this.length != a.length) {
		return false;
	}
	for (var i = 0; i < this.length; ++i) {
		if (this[i] !== a[i]) {
			return false;
		}
	}
	return true;
};

/**
 * Function to find the index of a content of an array by paasing the content as
 * a parameter
 */
Array.prototype.indexOf = function(elt) {
	var len = this.length >>> 0;

	var from = Number(arguments[1]) || 0;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0)
		from += len;

	for (; from < len; from++) {
		if (from in this && this[from] === elt)
			return from;
	}
	return -1;
};

/**
 * Function to check whether a value exists in a array. If it exists method will
 * return true else false
 */
Array.prototype.contains = function(testData) {
	
	/*for (var i = 0; i < this.length; ++ i){
		if (Ext.util.Format.trim(this[i]) === Ext.util.Format.trim(testData)) {
			return true;
		}
	}
    return false ;*/
	   for (var i in this)
	   {
	       if (this[i] == testData){
	    	   return true;
	       }
	   }
	return false;
   
};

/**
 * Function to remove a value from a array
 */
Array.prototype.removeByValue = function(value) {
	var i, indexes = [];

	for (i = 0; i < this.length; ++i) {
		if (this[i] === value) {
			indexes.push(i);
		}
	}

	for (i = indexes.length - 1; i >= 0; --i) {
		this.splice(indexes[i], 1);
	}
};
/**
 * Remove at a particular Index of an Array.By John Resig (MIT Licensed)
 * Source:http://ejohn.org/blog/javascript-array-remove/
 */
Array.prototype.removeAt = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};


/**
 * Add an element at the specified index
 * 
 * @param {Object}
 *            o The object to add
 * @param {int}
 *            index The index position the element has to be inserted
 * @return {Boolean} True if you can insert
 */
Array.prototype.insertAt =  function(o, index) {
		if (index > -1 && index <= this.length) {
			this.splice(index, 0, o);
			return true;
		}
		return false;
};


Array.prototype.groupBy = function(property) {
	"use strict";
	function deepCopy(p,groupName,groupIndex) {
		var c = {};
		c['groupName']=groupName;
		c['groupIndex']=groupIndex;
		for ( var i in p) {
			if (typeof p[i] === 'object') { 
				//Commented by Dharma to fix the analyst name loading issue in coverage sector page.  Need to get confirmation with Gagan.
				//c[i] = (p[i].constructor === Array) ? [] : {};
				//deepCopy(p[i], c[i]);
				c[i] = deepCopy(p[i],groupName,groupIndex);
			} else {
				c[i] = p[i];
			}
		}
		return c;
	}
	var retarr = [];
	var len = this.length;
	for ( var i = 0; i < len; i++) {
		var groupedlen = retarr.length, found = false;
		for ( var j = 0; j < groupedlen; j++) {
			if (this[i][property] === retarr[j].key) {
				retarr[j].values.push(deepCopy(this[i],this[i][property],j));
				found = true;
				break;
			}
		}
		if (found === false) {
			retarr.push({
				key : this[i][property],
				values : []
			});
			var newretarr=retarr.length - 1;
			retarr[newretarr].values.push(deepCopy(this[i],this[i][property],newretarr));
		}
	}
	return retarr;
};


String.prototype.endsWith = function(str) {
	return (this.match(str + "$") == str)
};
/**
 * 
 */
String.prototype.escapeEntityReference = function() {
	return this.replace('&lt;', '<').replace('&gt;', '>').replace('&quote;',
			'"').replace('&nbsp;', ' ')
};
/**
 * 
 */
String.prototype.unescapeEntityReference = function() {
	return this.replace('<', '&lt;').replace('>', '&gt;').replace('"',
			'&quote;').replace(' ', '&nbsp;')
};
// 
/**
 * repeat a string for a specified number of times
 */
String.prototype.repeat = function(n) {
	var ret = "";
	for (var i = 0; i < n; ++i) {
		ret += this;
	}
	return ret;
};
/**
 * 
 */
String.prototype.startsWith = function(str) {
	return (this.match("^" + str) == str);
};

//Logger.debug Issue fix-start
String.prototype.trim = function(){
    var re = /^\s+|\s+$/g;
    return function(){ return this.replace(re, ""); };
}();
//Logger.debug Issue fix End

String.format = function ()
{
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++)
	{
		var reg = new RegExp("\\{[\\s]*" + i + "[\\s]*\\}","gm");
		s = s.replace(reg, arguments[i + 1]);
	}

	return s;
};



if (typeof Object.keys !== "function") {
    (function() {
        Object.keys = Object_keys;
        function Object_keys(obj) {
            var keys = [], name;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        }
    })();
}


