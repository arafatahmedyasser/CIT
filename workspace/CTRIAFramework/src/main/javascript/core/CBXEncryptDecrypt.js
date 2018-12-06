/*
CryptoJS v3.1.2

code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(g, j) {
    var e = {},
        d = e.lib = {},
        m = function() {},
        n = d.Base = {
            extend: function(a) {
                m.prototype = this;
                var c = new m;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function() {
                    c.$super.init.apply(this, arguments)
                });
                c.init.prototype = c;
                c.$super = this;
                return c
            },
            create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function() {},
            mixIn: function(a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        q = d.WordArray = n.extend({
            init: function(a, c) {
                a = this.words = a || [];
                this.sigBytes = c != j ? c : 4 * a.length
            },
            toString: function(a) {
                return (a || l).stringify(this)
            },
            concat: function(a) {
                var c = this.words,
                    p = a.words,
                    f = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (f % 4)
                    for (var b = 0; b < a; b++) c[f + b >>> 2] |= (p[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((f + b) % 4);
                else if (65535 < p.length)
                    for (b = 0; b < a; b += 4) c[f + b >>> 2] = p[b >>> 2];
                else c.push.apply(c, p);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = g.ceil(c / 4)
            },
            clone: function() {
                var a = n.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) {
                for (var c = [], b = 0; b < a; b += 4) c.push(4294967296 * g.random() | 0);
                return new q.init(c, a)
            }
        }),
        b = e.enc = {},
        l = b.Hex = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var b = [], f = 0; f < a; f++) {
                    var d = c[f >>> 2] >>> 24 - 8 * (f % 4) & 255;
                    b.push((d >>> 4).toString(16));
                    b.push((d & 15).toString(16))
                }
                return b.join("")
            },
            parse: function(a) {
                for (var c = a.length, b = [], f = 0; f < c; f += 2) b[f >>> 3] |= parseInt(a.substr(f,
                    2), 16) << 24 - 4 * (f % 8);
                return new q.init(b, c / 2)
            }
        },
        k = b.Latin1 = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var b = [], f = 0; f < a; f++) b.push(String.fromCharCode(c[f >>> 2] >>> 24 - 8 * (f % 4) & 255));
                return b.join("")
            },
            parse: function(a) {
                for (var c = a.length, b = [], f = 0; f < c; f++) b[f >>> 2] |= (a.charCodeAt(f) & 255) << 24 - 8 * (f % 4);
                return new q.init(b, c)
            }
        },
        h = b.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(k.stringify(a)))
                } catch (b) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(a) {
                return k.parse(unescape(encodeURIComponent(a)))
            }
        },
        u = d.BufferedBlockAlgorithm = n.extend({
            reset: function() {
                this._data = new q.init;
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = h.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(a) {
                var b = this._data,
                    d = b.words,
                    f = b.sigBytes,
                    l = this.blockSize,
                    e = f / (4 * l),
                    e = a ? g.ceil(e) : g.max((e | 0) - this._minBufferSize, 0);
                a = e * l;
                f = g.min(4 * a, f);
                if (a) {
                    for (var h = 0; h < a; h += l) this._doProcessBlock(d, h);
                    h = d.splice(0, a);
                    b.sigBytes -= f
                }
                return new q.init(h, f)
            },
            clone: function() {
                var a = n.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    d.Hasher = u.extend({
        cfg: n.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            u.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(b, d) {
                return (new a.init(d)).finalize(b)
            }
        },
        _createHmacHelper: function(a) {
            return function(b, d) {
                return (new w.HMAC.init(a,
                    d)).finalize(b)
            }
        }
    });
    var w = e.algo = {};
    return e
}(Math);
(function() {
    var g = CryptoJS,
        j = g.lib,
        e = j.WordArray,
        d = j.Hasher,
        m = [],
        j = g.algo.SHA1 = d.extend({
            _doReset: function() {
                this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(d, e) {
                for (var b = this._hash.words, l = b[0], k = b[1], h = b[2], g = b[3], j = b[4], a = 0; 80 > a; a++) {
                    if (16 > a) m[a] = d[e + a] | 0;
                    else {
                        var c = m[a - 3] ^ m[a - 8] ^ m[a - 14] ^ m[a - 16];
                        m[a] = c << 1 | c >>> 31
                    }
                    c = (l << 5 | l >>> 27) + j + m[a];
                    c = 20 > a ? c + ((k & h | ~k & g) + 1518500249) : 40 > a ? c + ((k ^ h ^ g) + 1859775393) : 60 > a ? c + ((k & h | k & g | h & g) - 1894007588) : c + ((k ^ h ^
                        g) - 899497514);
                    j = g;
                    g = h;
                    h = k << 30 | k >>> 2;
                    k = l;
                    l = c
                }
                b[0] = b[0] + l | 0;
                b[1] = b[1] + k | 0;
                b[2] = b[2] + h | 0;
                b[3] = b[3] + g | 0;
                b[4] = b[4] + j | 0
            },
            _doFinalize: function() {
                var d = this._data,
                    e = d.words,
                    b = 8 * this._nDataBytes,
                    l = 8 * d.sigBytes;
                e[l >>> 5] |= 128 << 24 - l % 32;
                e[(l + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296);
                e[(l + 64 >>> 9 << 4) + 15] = b;
                d.sigBytes = 4 * e.length;
                this._process();
                return this._hash
            },
            clone: function() {
                var e = d.clone.call(this);
                e._hash = this._hash.clone();
                return e
            }
        });
    g.SHA1 = d._createHelper(j);
    g.HmacSHA1 = d._createHmacHelper(j)
})();
(function() {
    var g = CryptoJS,
        j = g.enc.Utf8;
    g.algo.HMAC = g.lib.Base.extend({
        init: function(e, d) {
            e = this._hasher = new e.init;
            "string" == typeof d && (d = j.parse(d));
            var g = e.blockSize,
                n = 4 * g;
            d.sigBytes > n && (d = e.finalize(d));
            d.clamp();
            for (var q = this._oKey = d.clone(), b = this._iKey = d.clone(), l = q.words, k = b.words, h = 0; h < g; h++) l[h] ^= 1549556828, k[h] ^= 909522486;
            q.sigBytes = b.sigBytes = n;
            this.reset()
        },
        reset: function() {
            var e = this._hasher;
            e.reset();
            e.update(this._iKey)
        },
        update: function(e) {
            this._hasher.update(e);
            return this
        },
        finalize: function(e) {
            var d =
                this._hasher;
            e = d.finalize(e);
            d.reset();
            return d.finalize(this._oKey.clone().concat(e))
        }
    })
})();
(function() {
    var g = CryptoJS,
        j = g.lib,
        e = j.Base,
        d = j.WordArray,
        j = g.algo,
        m = j.HMAC,
        n = j.PBKDF2 = e.extend({
            cfg: e.extend({
                keySize: 4,
                hasher: j.SHA1,
                iterations: 1
            }),
            init: function(d) {
                this.cfg = this.cfg.extend(d)
            },
            compute: function(e, b) {
                for (var g = this.cfg, k = m.create(g.hasher, e), h = d.create(), j = d.create([1]), n = h.words, a = j.words, c = g.keySize, g = g.iterations; n.length < c;) {
                    var p = k.update(b).finalize(j);
                    k.reset();
                    for (var f = p.words, v = f.length, s = p, t = 1; t < g; t++) {
                        s = k.finalize(s);
                        k.reset();
                        for (var x = s.words, r = 0; r < v; r++) f[r] ^= x[r]
                    }
                    h.concat(p);
                    a[0] ++
                }
                h.sigBytes = 4 * c;
                return h
            }
        });
    g.PBKDF2 = function(d, b, e) {
        return n.create(e).compute(d, b)
    }
})();

/**
 * jsbn.js
 * */
//Copyright (c) 2005  Tom Wu
//All Rights Reserved.
//See "LICENSE" for details.

//Basic JavaScript BN library - subset useful for RSA encryption.

//Bits per digit
var dbits;

//JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

//(public) Constructor
function BigInteger(a,b,c) {
if(a != null)
 if("number" == typeof a) this.fromNumber(a,b,c);
 else if(b == null && "string" != typeof a) this.fromString(a,256);
 else this.fromString(a,b);
}

//return new, unset BigInteger
function nbi() { return new BigInteger(null); }

//am: Compute w_j += (x*this_i), propagate carries,
//c is initial carry, returns final carry.
//c < 3*dvalue, x < 2*dvalue, this_i < dvalue
//We need to select the fastest one that works in this environment.

//am1: use a single mult and divide to get the high bits,
//max digit bits should be 26 because
//max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
while(--n >= 0) {
 var v = x*this[i++]+w[j]+c;
 c = Math.floor(v/0x4000000);
 w[j++] = v&0x3ffffff;
}
return c;
}
//am2 avoids a big mult-and-extract completely.
//Max digit bits should be <= 30 because we do bitwise ops
//on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
var xl = x&0x7fff, xh = x>>15;
while(--n >= 0) {
 var l = this[i]&0x7fff;
 var h = this[i++]>>15;
 var m = xh*l+h*xl;
 l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
 c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
 w[j++] = l&0x3fffffff;
}
return c;
}
//Alternately, set max digit bits to 28 since some
//browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
var xl = x&0x3fff, xh = x>>14;
while(--n >= 0) {
 var l = this[i]&0x3fff;
 var h = this[i++]>>14;
 var m = xh*l+h*xl;
 l = xl*l+((m&0x3fff)<<14)+w[j]+c;
 c = (l>>28)+(m>>14)+xh*h;
 w[j++] = l&0xfffffff;
}
return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
BigInteger.prototype.am = am2;
dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
BigInteger.prototype.am = am1;
dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
BigInteger.prototype.am = am3;
dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

//Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
var c = BI_RC[s.charCodeAt(i)];
return (c==null)?-1:c;
}

//(protected) copy this to r
function bnpCopyTo(r) {
for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
r.t = this.t;
r.s = this.s;
}

//(protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
this.t = 1;
this.s = (x<0)?-1:0;
if(x > 0) this[0] = x;
else if(x < -1) this[0] = x+this.DV;
else this.t = 0;
}

//return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

//(protected) set from string and radix
function bnpFromString(s,b) {
var k;
if(b == 16) k = 4;
else if(b == 8) k = 3;
else if(b == 256) k = 8; // byte array
else if(b == 2) k = 1;
else if(b == 32) k = 5;
else if(b == 4) k = 2;
else { this.fromRadix(s,b); return; }
this.t = 0;
this.s = 0;
var i = s.length, mi = false, sh = 0;
while(--i >= 0) {
 var x = (k==8)?s[i]&0xff:intAt(s,i);
 if(x < 0) {
   if(s.charAt(i) == "-") mi = true;
   continue;
 }
 mi = false;
 if(sh == 0)
   this[this.t++] = x;
 else if(sh+k > this.DB) {
   this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
   this[this.t++] = (x>>(this.DB-sh));
 }
 else
   this[this.t-1] |= x<<sh;
 sh += k;
 if(sh >= this.DB) sh -= this.DB;
}
if(k == 8 && (s[0]&0x80) != 0) {
 this.s = -1;
 if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
}
this.clamp();
if(mi) BigInteger.ZERO.subTo(this,this);
}

//(protected) clamp off excess high words
function bnpClamp() {
var c = this.s&this.DM;
while(this.t > 0 && this[this.t-1] == c) --this.t;
}

//(public) return string representation in given radix
function bnToString(b) {
if(this.s < 0) return "-"+this.negate().toString(b);
var k;
if(b == 16) k = 4;
else if(b == 8) k = 3;
else if(b == 2) k = 1;
else if(b == 32) k = 5;
else if(b == 4) k = 2;
else return this.toRadix(b);
var km = (1<<k)-1, d, m = false, r = "", i = this.t;
var p = this.DB-(i*this.DB)%k;
if(i-- > 0) {
 if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
 while(i >= 0) {
   if(p < k) {
     d = (this[i]&((1<<p)-1))<<(k-p);
     d |= this[--i]>>(p+=this.DB-k);
   }
   else {
     d = (this[i]>>(p-=k))&km;
     if(p <= 0) { p += this.DB; --i; }
   }
   if(d > 0) m = true;
   if(m) r += int2char(d);
 }
}
return m?r:"0";
}

//(public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

//(public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

//(public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
var r = this.s-a.s;
if(r != 0) return r;
var i = this.t;
r = i-a.t;
if(r != 0) return (this.s<0)?-r:r;
while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
return 0;
}

//returns bit length of the integer x
function nbits(x) {
var r = 1, t;
if((t=x>>>16) != 0) { x = t; r += 16; }
if((t=x>>8) != 0) { x = t; r += 8; }
if((t=x>>4) != 0) { x = t; r += 4; }
if((t=x>>2) != 0) { x = t; r += 2; }
if((t=x>>1) != 0) { x = t; r += 1; }
return r;
}

//(public) return the number of bits in "this"
function bnBitLength() {
if(this.t <= 0) return 0;
return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

//(protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
var i;
for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
for(i = n-1; i >= 0; --i) r[i] = 0;
r.t = this.t+n;
r.s = this.s;
}

//(protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
for(var i = n; i < this.t; ++i) r[i-n] = this[i];
r.t = Math.max(this.t-n,0);
r.s = this.s;
}

//(protected) r = this << n
function bnpLShiftTo(n,r) {
var bs = n%this.DB;
var cbs = this.DB-bs;
var bm = (1<<cbs)-1;
var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
for(i = this.t-1; i >= 0; --i) {
 r[i+ds+1] = (this[i]>>cbs)|c;
 c = (this[i]&bm)<<bs;
}
for(i = ds-1; i >= 0; --i) r[i] = 0;
r[ds] = c;
r.t = this.t+ds+1;
r.s = this.s;
r.clamp();
}

//(protected) r = this >> n
function bnpRShiftTo(n,r) {
r.s = this.s;
var ds = Math.floor(n/this.DB);
if(ds >= this.t) { r.t = 0; return; }
var bs = n%this.DB;
var cbs = this.DB-bs;
var bm = (1<<bs)-1;
r[0] = this[ds]>>bs;
for(var i = ds+1; i < this.t; ++i) {
 r[i-ds-1] |= (this[i]&bm)<<cbs;
 r[i-ds] = this[i]>>bs;
}
if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
r.t = this.t-ds;
r.clamp();
}

//(protected) r = this - a
function bnpSubTo(a,r) {
var i = 0, c = 0, m = Math.min(a.t,this.t);
while(i < m) {
 c += this[i]-a[i];
 r[i++] = c&this.DM;
 c >>= this.DB;
}
if(a.t < this.t) {
 c -= a.s;
 while(i < this.t) {
   c += this[i];
   r[i++] = c&this.DM;
   c >>= this.DB;
 }
 c += this.s;
}
else {
 c += this.s;
 while(i < a.t) {
   c -= a[i];
   r[i++] = c&this.DM;
   c >>= this.DB;
 }
 c -= a.s;
}
r.s = (c<0)?-1:0;
if(c < -1) r[i++] = this.DV+c;
else if(c > 0) r[i++] = c;
r.t = i;
r.clamp();
}

//(protected) r = this * a, r != this,a (HAC 14.12)
//"this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
var x = this.abs(), y = a.abs();
var i = x.t;
r.t = i+y.t;
while(--i >= 0) r[i] = 0;
for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
r.s = 0;
r.clamp();
if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

//(protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
var x = this.abs();
var i = r.t = 2*x.t;
while(--i >= 0) r[i] = 0;
for(i = 0; i < x.t-1; ++i) {
 var c = x.am(i,x[i],r,2*i,0,1);
 if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
   r[i+x.t] -= x.DV;
   r[i+x.t+1] = 1;
 }
}
if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
r.s = 0;
r.clamp();
}

//(protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
//r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
var pm = m.abs();
if(pm.t <= 0) return;
var pt = this.abs();
if(pt.t < pm.t) {
 if(q != null) q.fromInt(0);
 if(r != null) this.copyTo(r);
 return;
}
if(r == null) r = nbi();
var y = nbi(), ts = this.s, ms = m.s;
var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
else { pm.copyTo(y); pt.copyTo(r); }
var ys = y.t;
var y0 = y[ys-1];
if(y0 == 0) return;
var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
var i = r.t, j = i-ys, t = (q==null)?nbi():q;
y.dlShiftTo(j,t);
if(r.compareTo(t) >= 0) {
 r[r.t++] = 1;
 r.subTo(t,r);
}
BigInteger.ONE.dlShiftTo(ys,t);
t.subTo(y,y);	// "negative" y so we can replace sub with am later
while(y.t < ys) y[y.t++] = 0;
while(--j >= 0) {
 // Estimate quotient digit
 var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
 if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
   y.dlShiftTo(j,t);
   r.subTo(t,r);
   while(r[i] < --qd) r.subTo(t,r);
 }
}
if(q != null) {
 r.drShiftTo(ys,q);
 if(ts != ms) BigInteger.ZERO.subTo(q,q);
}
r.t = ys;
r.clamp();
if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

//(public) this mod a
function bnMod(a) {
var r = nbi();
this.abs().divRemTo(a,null,r);
if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
return r;
}

//Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

//(protected) return "-1/this % 2^DB"; useful for Mont. reduction
//justification:
//      xy == 1 (mod m)
//      xy =  1+km
//xy(2-xy) = (1+km)(1-km)
//x[y(2-xy)] = 1-k^2m^2
//x[y(2-xy)] == 1 (mod m^2)
//if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
//should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
//JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
if(this.t < 1) return 0;
var x = this[0];
if((x&1) == 0) return 0;
var y = x&3;		// y == 1/x mod 2^2
y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
// last step - calculate inverse mod DV directly;
// assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
// we really want the negative inverse, and -DV < y < DV
return (y>0)?this.DV-y:-y;
}

//Montgomery reduction
function Montgomery(m) {
this.m = m;
this.mp = m.invDigit();
this.mpl = this.mp&0x7fff;
this.mph = this.mp>>15;
this.um = (1<<(m.DB-15))-1;
this.mt2 = 2*m.t;
}

//xR mod m
function montConvert(x) {
var r = nbi();
x.abs().dlShiftTo(this.m.t,r);
r.divRemTo(this.m,null,r);
if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
return r;
}

//x/R mod m
function montRevert(x) {
var r = nbi();
x.copyTo(r);
this.reduce(r);
return r;
}

//x = x/R mod m (HAC 14.32)
function montReduce(x) {
while(x.t <= this.mt2)	// pad x so am has enough room later
 x[x.t++] = 0;
for(var i = 0; i < this.m.t; ++i) {
 // faster way of calculating u0 = x[i]*mp mod DV
 var j = x[i]&0x7fff;
 var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
 // use am to combine the multiply-shift-add into one call
 j = i+this.m.t;
 x[j] += this.m.am(0,u0,x,i,0,this.m.t);
 // propagate carry
 while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
}
x.clamp();
x.drShiftTo(this.m.t,x);
if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

//r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

//r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

//(protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

//(protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
if(e > 0xffffffff || e < 1) return BigInteger.ONE;
var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
g.copyTo(r);
while(--i >= 0) {
 z.sqrTo(r,r2);
 if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
 else { var t = r; r = r2; r2 = t; }
}
return z.revert(r);
}

//(public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
var z;
if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
return this.exp(e,z);
}

//protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

//public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

//"constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);



/**
 * prng4.js
 * */

//prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;






/**
 * rng.js
 * */
//Random number generator - requires a PRNG backend, e.g. prng4.js

//For best results, put code like
//<body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
//in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

//Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
rng_pool[rng_pptr++] ^= x & 255;
rng_pool[rng_pptr++] ^= (x >> 8) & 255;
rng_pool[rng_pptr++] ^= (x >> 16) & 255;
rng_pool[rng_pptr++] ^= (x >> 24) & 255;
if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

//Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
rng_seed_int(new Date().getTime());
}

//Initialize the pool with junk if needed.
if(rng_pool == null) {
rng_pool = new Array();
rng_pptr = 0;
var t;
if(window.crypto && window.crypto.getRandomValues) {
 // Use webcrypto if available
 var ua = new Uint8Array(32);
 window.crypto.getRandomValues(ua);
 for(t = 0; t < 32; ++t)
   rng_pool[rng_pptr++] = ua[t];
}
if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
 // Extract entropy (256 bits) from NS4 RNG if available
 var z = window.crypto.random(32);
 for(t = 0; t < z.length; ++t)
   rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
}  
while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
 t = Math.floor(65536 * Math.random());
 rng_pool[rng_pptr++] = t >>> 8;
 rng_pool[rng_pptr++] = t & 255;
}
rng_pptr = 0;
rng_seed_time();
//rng_seed_int(window.screenX);
//rng_seed_int(window.screenY);
}

function rng_get_byte() {
if(rng_state == null) {
 rng_seed_time();
 rng_state = prng_newstate();
 rng_state.init(rng_pool);
 for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
   rng_pool[rng_pptr] = 0;
 rng_pptr = 0;
 //rng_pool = null;
}
// TODO: allow reseeding after first request
return rng_state.next();
}

function rng_get_bytes(ba) {
var i;
for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;





/**
 * rsa.js
 * */
//Depends on jsbn.js and rng.js

//Version 1.1: support utf-8 encoding in pkcs1pad2

//convert a (hex) string to a bignum object
function parseBigInt(str,r) {
return new BigInteger(str,r);
}

function linebrk(s,n) {
var ret = "";
var i = 0;
while(i + n < s.length) {
 ret += s.substring(i,i+n) + "\n";
 i += n;
}
return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
if(b < 0x10)
 return "0" + b.toString(16);
else
 return b.toString(16);
}

//PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
if(n < s.length + 11) { // TODO: fix for utf-8
 alert("Message too long for RSA");
 return null;
}
var ba = new Array();
var i = s.length - 1;
while(i >= 0 && n > 0) {
 var c = s.charCodeAt(i--);
 if(c < 128) { // encode using utf-8
   ba[--n] = c;
 }
 else if((c > 127) && (c < 2048)) {
   ba[--n] = (c & 63) | 128;
   ba[--n] = (c >> 6) | 192;
 }
 else {
   ba[--n] = (c & 63) | 128;
   ba[--n] = ((c >> 6) & 63) | 128;
   ba[--n] = (c >> 12) | 224;
 }
}
ba[--n] = 0;
var rng = new SecureRandom();
var x = new Array();
while(n > 2) { // random non-zero pad
 x[0] = 0;
 while(x[0] == 0) rng.nextBytes(x);
 ba[--n] = x[0];
}
ba[--n] = 2;
ba[--n] = 0;
return new BigInteger(ba);
}

//"empty" RSA key constructor
function RSAKey() {
this.n = null;
this.e = 0;
this.d = null;
this.p = null;
this.q = null;
this.dmp1 = null;
this.dmq1 = null;
this.coeff = null;
}

//Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
if(N != null && E != null && N.length > 0 && E.length > 0) {
 this.n = parseBigInt(N,16);
 this.e = parseInt(E,16);
}
else
 alert("Invalid RSA public key");
}

//Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
return x.modPowInt(this.e, this.n);
}

//Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
if(m == null) return null;
var c = this.doPublic(m);
if(c == null) return null;
var h = c.toString(16);
if((h.length & 1) == 0) return h; else return "0" + h;
}

//Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//var h = this.encrypt(text);
//if(h) return hex2b64(h); else return null;
//}

//protected
RSAKey.prototype.doPublic = RSADoPublic;

//public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;



(function() {
    var u = CryptoJS,
        p = u.lib.WordArray;
    u.enc.Base64 = {
        stringify: function(d) {
            var l = d.words,
                p = d.sigBytes,
                t = this._map;
            d.clamp();
            d = [];
            for (var r = 0; r < p; r += 3)
                for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++) d.push(t.charAt(w >>> 6 * (3 - v) & 63));
            if (l = t.charAt(64))
                for (; d.length % 4;) d.push(l);
            return d.join("")
        },
        parse: function(d) {
            var l = d.length,
                s = this._map,
                t = s.charAt(64);
            t && (t = d.indexOf(t), -1 != t && (l = t));
            for (var t = [], r = 0, w = 0; w <
                l; w++)
                if (w % 4) {
                    var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4),
                        b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4);
                    t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4);
                    r++
                }
            return p.create(t, r)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function(u) {
    function p(b, n, a, c, e, j, k) {
        b = b + (n & a | ~n & c) + e + k;
        return (b << j | b >>> 32 - j) + n
    }

    function d(b, n, a, c, e, j, k) {
        b = b + (n & c | a & ~c) + e + k;
        return (b << j | b >>> 32 - j) + n
    }

    function l(b, n, a, c, e, j, k) {
        b = b + (n ^ a ^ c) + e + k;
        return (b << j | b >>> 32 - j) + n
    }

    function s(b, n, a, c, e, j, k) {
        b = b + (a ^ (n | ~c)) + e + k;
        return (b << j | b >>> 32 - j) + n
    }
    for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++) b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0;
    r = r.MD5 = v.extend({
        _doReset: function() {
            this._hash = new w.init([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function(q, n) {
            for (var a = 0; 16 > a; a++) {
                var c = n + a,
                    e = q[c];
                q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360
            }
            var a = this._hash.words,
                c = q[n + 0],
                e = q[n + 1],
                j = q[n + 2],
                k = q[n + 3],
                z = q[n + 4],
                r = q[n + 5],
                t = q[n + 6],
                w = q[n + 7],
                v = q[n + 8],
                A = q[n + 9],
                B = q[n + 10],
                C = q[n + 11],
                u = q[n + 12],
                D = q[n + 13],
                E = q[n + 14],
                x = q[n + 15],
                f = a[0],
                m = a[1],
                g = a[2],
                h = a[3],
                f = p(f, m, g, h, c, 7, b[0]),
                h = p(h, f, m, g, e, 12, b[1]),
                g = p(g, h, f, m, j, 17, b[2]),
                m = p(m, g, h, f, k, 22, b[3]),
                f = p(f, m, g, h, z, 7, b[4]),
                h = p(h, f, m, g, r, 12, b[5]),
                g = p(g, h, f, m, t, 17, b[6]),
                m = p(m, g, h, f, w, 22, b[7]),
                f = p(f, m, g, h, v, 7, b[8]),
                h = p(h, f, m, g, A, 12, b[9]),
                g = p(g, h, f, m, B, 17, b[10]),
                m = p(m, g, h, f, C, 22, b[11]),
                f = p(f, m, g, h, u, 7, b[12]),
                h = p(h, f, m, g, D, 12, b[13]),
                g = p(g, h, f, m, E, 17, b[14]),
                m = p(m, g, h, f, x, 22, b[15]),
                f = d(f, m, g, h, e, 5, b[16]),
                h = d(h, f, m, g, t, 9, b[17]),
                g = d(g, h, f, m, C, 14, b[18]),
                m = d(m, g, h, f, c, 20, b[19]),
                f = d(f, m, g, h, r, 5, b[20]),
                h = d(h, f, m, g, B, 9, b[21]),
                g = d(g, h, f, m, x, 14, b[22]),
                m = d(m, g, h, f, z, 20, b[23]),
                f = d(f, m, g, h, A, 5, b[24]),
                h = d(h, f, m, g, E, 9, b[25]),
                g = d(g, h, f, m, k, 14, b[26]),
                m = d(m, g, h, f, v, 20, b[27]),
                f = d(f, m, g, h, D, 5, b[28]),
                h = d(h, f,
                    m, g, j, 9, b[29]),
                g = d(g, h, f, m, w, 14, b[30]),
                m = d(m, g, h, f, u, 20, b[31]),
                f = l(f, m, g, h, r, 4, b[32]),
                h = l(h, f, m, g, v, 11, b[33]),
                g = l(g, h, f, m, C, 16, b[34]),
                m = l(m, g, h, f, E, 23, b[35]),
                f = l(f, m, g, h, e, 4, b[36]),
                h = l(h, f, m, g, z, 11, b[37]),
                g = l(g, h, f, m, w, 16, b[38]),
                m = l(m, g, h, f, B, 23, b[39]),
                f = l(f, m, g, h, D, 4, b[40]),
                h = l(h, f, m, g, c, 11, b[41]),
                g = l(g, h, f, m, k, 16, b[42]),
                m = l(m, g, h, f, t, 23, b[43]),
                f = l(f, m, g, h, A, 4, b[44]),
                h = l(h, f, m, g, u, 11, b[45]),
                g = l(g, h, f, m, x, 16, b[46]),
                m = l(m, g, h, f, j, 23, b[47]),
                f = s(f, m, g, h, c, 6, b[48]),
                h = s(h, f, m, g, w, 10, b[49]),
                g = s(g, h, f, m,
                    E, 15, b[50]),
                m = s(m, g, h, f, r, 21, b[51]),
                f = s(f, m, g, h, u, 6, b[52]),
                h = s(h, f, m, g, k, 10, b[53]),
                g = s(g, h, f, m, B, 15, b[54]),
                m = s(m, g, h, f, e, 21, b[55]),
                f = s(f, m, g, h, v, 6, b[56]),
                h = s(h, f, m, g, x, 10, b[57]),
                g = s(g, h, f, m, t, 15, b[58]),
                m = s(m, g, h, f, D, 21, b[59]),
                f = s(f, m, g, h, z, 6, b[60]),
                h = s(h, f, m, g, C, 10, b[61]),
                g = s(g, h, f, m, j, 15, b[62]),
                m = s(m, g, h, f, A, 21, b[63]);
            a[0] = a[0] + f | 0;
            a[1] = a[1] + m | 0;
            a[2] = a[2] + g | 0;
            a[3] = a[3] + h | 0
        },
        _doFinalize: function() {
            var b = this._data,
                n = b.words,
                a = 8 * this._nDataBytes,
                c = 8 * b.sigBytes;
            n[c >>> 5] |= 128 << 24 - c % 32;
            var e = u.floor(a /
                4294967296);
            n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360;
            n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
            b.sigBytes = 4 * (n.length + 1);
            this._process();
            b = this._hash;
            n = b.words;
            for (a = 0; 4 > a; a++) c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360;
            return b
        },
        clone: function() {
            var b = v.clone.call(this);
            b._hash = this._hash.clone();
            return b
        }
    });
    t.MD5 = v._createHelper(r);
    t.HmacMD5 = v._createHmacHelper(r)
})(Math);
(function() {
    var u = CryptoJS,
        p = u.lib,
        d = p.Base,
        l = p.WordArray,
        p = u.algo,
        s = p.EvpKDF = d.extend({
            cfg: d.extend({
                keySize: 4,
                hasher: p.MD5,
                iterations: 1
            }),
            init: function(d) {
                this.cfg = this.cfg.extend(d)
            },
            compute: function(d, r) {
                for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) {
                    n && s.update(n);
                    var n = s.update(d).finalize(r);
                    s.reset();
                    for (var a = 1; a < p; a++) n = s.finalize(n), s.reset();
                    b.concat(n)
                }
                b.sigBytes = 4 * q;
                return b
            }
        });
    u.EvpKDF = function(d, l, p) {
        return s.create(p).compute(d,
            l)
    }
})();
CryptoJS.lib.Cipher || function(u) {
    var p = CryptoJS,
        d = p.lib,
        l = d.Base,
        s = d.WordArray,
        t = d.BufferedBlockAlgorithm,
        r = p.enc.Base64,
        w = p.algo.EvpKDF,
        v = d.Cipher = t.extend({
            cfg: l.extend(),
            createEncryptor: function(e, a) {
                return this.create(this._ENC_XFORM_MODE, e, a)
            },
            createDecryptor: function(e, a) {
                return this.create(this._DEC_XFORM_MODE, e, a)
            },
            init: function(e, a, b) {
                this.cfg = this.cfg.extend(b);
                this._xformMode = e;
                this._key = a;
                this.reset()
            },
            reset: function() {
                t.reset.call(this);
                this._doReset()
            },
            process: function(e) {
                this._append(e);
                return this._process()
            },
            finalize: function(e) {
                e && this._append(e);
                return this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function(e) {
                return {
                    encrypt: function(b, k, d) {
                        return ("string" == typeof k ? c : a).encrypt(e, b, k, d)
                    },
                    decrypt: function(b, k, d) {
                        return ("string" == typeof k ? c : a).decrypt(e, b, k, d)
                    }
                }
            }
        });
    d.StreamCipher = v.extend({
        _doFinalize: function() {
            return this._process(!0)
        },
        blockSize: 1
    });
    var b = p.mode = {},
        x = function(e, a, b) {
            var c = this._iv;
            c ? this._iv = u : c = this._prevBlock;
            for (var d = 0; d < b; d++) e[a + d] ^=
                c[d]
        },
        q = (d.BlockCipherMode = l.extend({
            createEncryptor: function(e, a) {
                return this.Encryptor.create(e, a)
            },
            createDecryptor: function(e, a) {
                return this.Decryptor.create(e, a)
            },
            init: function(e, a) {
                this._cipher = e;
                this._iv = a
            }
        })).extend();
    q.Encryptor = q.extend({
        processBlock: function(e, a) {
            var b = this._cipher,
                c = b.blockSize;
            x.call(this, e, a, c);
            b.encryptBlock(e, a);
            this._prevBlock = e.slice(a, a + c)
        }
    });
    q.Decryptor = q.extend({
        processBlock: function(e, a) {
            var b = this._cipher,
                c = b.blockSize,
                d = e.slice(a, a + c);
            b.decryptBlock(e, a);
            x.call(this,
                e, a, c);
            this._prevBlock = d
        }
    });
    b = b.CBC = q;
    q = (p.pad = {}).Pkcs7 = {
        pad: function(a, b) {
            for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4) l.push(d);
            c = s.create(l, c);
            a.concat(c)
        },
        unpad: function(a) {
            a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
        }
    };
    d.BlockCipher = v.extend({
        cfg: v.cfg.extend({
            mode: b,
            padding: q
        }),
        reset: function() {
            v.reset.call(this);
            var a = this.cfg,
                b = a.iv,
                a = a.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
            else c = a.createDecryptor, this._minBufferSize = 1;
            this._mode = c.call(a,
                this, b && b.words)
        },
        _doProcessBlock: function(a, b) {
            this._mode.processBlock(a, b)
        },
        _doFinalize: function() {
            var a = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                a.pad(this._data, this.blockSize);
                var b = this._process(!0)
            } else b = this._process(!0), a.unpad(b);
            return b
        },
        blockSize: 4
    });
    var n = d.CipherParams = l.extend({
            init: function(a) {
                this.mixIn(a)
            },
            toString: function(a) {
                return (a || this.formatter).stringify(this)
            }
        }),
        b = (p.format = {}).OpenSSL = {
            stringify: function(a) {
                var b = a.ciphertext;
                a = a.salt;
                return (a ? s.create([1398893684,
                    1701076831
                ]).concat(a).concat(b) : b).toString(r)
            },
            parse: function(a) {
                a = r.parse(a);
                var b = a.words;
                if (1398893684 == b[0] && 1701076831 == b[1]) {
                    var c = s.create(b.slice(2, 4));
                    b.splice(0, 4);
                    a.sigBytes -= 16
                }
                return n.create({
                    ciphertext: a,
                    salt: c
                })
            }
        },
        a = d.SerializableCipher = l.extend({
            cfg: l.extend({
                format: b
            }),
            encrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                var l = a.createEncryptor(c, d);
                b = l.finalize(b);
                l = l.cfg;
                return n.create({
                    ciphertext: b,
                    key: c,
                    iv: l.iv,
                    algorithm: a,
                    mode: l.mode,
                    padding: l.padding,
                    blockSize: a.blockSize,
                    formatter: d.format
                })
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._parse(b, d.format);
                return a.createDecryptor(c, d).finalize(b.ciphertext)
            },
            _parse: function(a, b) {
                return "string" == typeof a ? b.parse(a, this) : a
            }
        }),
        p = (p.kdf = {}).OpenSSL = {
            execute: function(a, b, c, d) {
                d || (d = s.random(8));
                a = w.create({
                    keySize: b + c
                }).compute(a, d);
                c = s.create(a.words.slice(b), 4 * c);
                a.sigBytes = 4 * b;
                return n.create({
                    key: a,
                    iv: c,
                    salt: d
                })
            }
        },
        c = d.PasswordBasedCipher = a.extend({
            cfg: a.cfg.extend({
                kdf: p
            }),
            encrypt: function(b, c, d, l) {
                l = this.cfg.extend(l);
                d = l.kdf.execute(d,
                    b.keySize, b.ivSize);
                l.iv = d.iv;
                b = a.encrypt.call(this, b, c, d.key, l);
                b.mixIn(d);
                return b
            },
            decrypt: function(b, c, d, l) {
                l = this.cfg.extend(l);
                c = this._parse(c, l.format);
                d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt);
                l.iv = d.iv;
                return a.decrypt.call(this, b, c, d.key, l)
            }
        })
}();
(function() {
    for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++) a[c] = 128 > c ? c << 1 : c << 1 ^ 283;
    for (var e = 0, j = 0, c = 0; 256 > c; c++) {
        var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4,
            k = k >>> 8 ^ k & 255 ^ 99;
        l[e] = k;
        s[k] = e;
        var z = a[e],
            F = a[z],
            G = a[F],
            y = 257 * a[k] ^ 16843008 * k;
        t[e] = y << 24 | y >>> 8;
        r[e] = y << 16 | y >>> 16;
        w[e] = y << 8 | y >>> 24;
        v[e] = y;
        y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e;
        b[k] = y << 24 | y >>> 8;
        x[k] = y << 16 | y >>> 16;
        q[k] = y << 8 | y >>> 24;
        n[k] = y;
        e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1
    }
    var H = [0, 1, 2, 4, 8,
            16, 32, 64, 128, 27, 54
        ],
        d = d.AES = p.extend({
            _doReset: function() {
                for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++)
                    if (j < d) e[j] = c[j];
                    else {
                        var k = e[j - 1];
                        j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24);
                        e[j] = e[j - d] ^ k
                    }
                c = this._invKeySchedule = [];
                for (d = 0; d < a; d++) j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>>
                    8 & 255]] ^ n[l[k & 255]]
            },
            encryptBlock: function(a, b) {
                this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l)
            },
            decryptBlock: function(a, c) {
                var d = a[c + 1];
                a[c + 1] = a[c + 3];
                a[c + 3] = d;
                this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s);
                d = a[c + 1];
                a[c + 1] = a[c + 3];
                a[c + 3] = d
            },
            _doCryptBlock: function(a, b, c, d, e, j, l, f) {
                for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++) var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++],
                    s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++],
                    t =
                    d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++],
                    n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++],
                    g = q,
                    h = s,
                    k = t;
                q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++];
                s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++];
                t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++];
                n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++];
                a[b] = q;
                a[b + 1] = s;
                a[b + 2] = t;
                a[b + 3] = n
            },
            keySize: 8
        });
    u.AES = p._createHelper(d)
})();


/**
 * Program	:	To get the server public key and generate encrypt the session key, send it to server. 
 *              Validate the session key received from the server with the one generated 
 */

var tempKey;

	function keyExchangeSuccess()
    {
		//console.log("Handshake is success");
    }
    

    
	function keyExchangeFailure(ErrorMsg)
    {
		//console.log("Error:"+ErrorMsg);		
	}
	
   function isErrorResponse(json_data){
    	var code=json_data.statuscode;
    	var status=false;
    	if(code!=200){
    		status=true;
    	}
    	return status;
    }
    
   function CBXCryptDecrypt(encryptedData,error_handler){

		if(CBXCryptProp.key)								   			// Secret key is already set for the current session, proceed with encrypting the user data
		{
			//console.log("Key isnt NULL, call clientEncrypt() ");
			if(isFunction(CBXCrypt.clientDecrypt))
			{
				data=CBXCrypt.clientDecrypt(encryptedData,CBXCryptProp.key);
				return data;
			}
			else
				keyExchangeFailure("CBXCrypt.clientDecrypt is not set");
	    }
		else
			return data;	
}

serializedString = function(paramData) {
	var paramDataStr = [];
	  for(var p in paramData)
		if (paramData.hasOwnProperty(p)) {
		  paramDataStr.push(encodeURIComponent(p) + "=" + encodeURIComponent(paramData[p]));
		}
	  return paramDataStr.join("&");
}

decryptResponseTextForPc = function(response, options){
	
	if(!CBXCryptProp.needEncryption){
		return;
	}
	var decrypted_data = decryptResponseText(response.responseText);
	response.responseText = decrypted_data;
	options.params = options.config;
}

decryptResponseText=function(responseText,error_handler){
	if(!CBXCryptProp.needEncryption){
		
		return responseText;
	}
	if(responseText === undefined) {
		return;
	}
	if(typeof responseText === 'object') {
		responseText = JSON.stringify(responseText);
	}
	if(responseText.indexOf("status") > -1 && responseText.indexOf("data") > -1 && responseText.indexOf("statuscode") > -1) {
		var respObj=JSON.parse(responseText);
		if(isErrorResponse(respObj)){
			return;
		}
		var data =respObj.data
		var decrypted_data = CBXCrypt.decrypt(data); 				//decrypting the response text received from server

		return decrypted_data;
	} else {
		return responseText;
	}
}

addEncryptionLayerToExt=function(config){
	//make changes to the config data before passing the request to the server
	//we are changing the params to encrypted cipher text and attaching a sucees handler to decrypt the servers response
	// Responsible for getting the request data, process the request data to a query string and encrypting the data before sending it to server 
	var json_params = config.params;
	var json_queryString = serializedString(json_params);
	config.params = {};	
	var enc_error_handler=new error_handler("Dummy Error Handler");
	config.params={data:encryptQueryString(json_queryString,enc_error_handler)};
	
	if(typeof config.success == "function"){
		var orig_success=config.success;
	}else if(typeof config.successhandler == "function"){
		var orig_success=config.successhandler;
	}
	config.success=function(resp,config){
		
      	// use global data filter on response text
      	config.params=json_params;
      	orig_success(resp,config);

	}
}


addEncryptionLayerToAjaxForPC=function(options){
	
	if(!CBXCryptProp.needEncryption){
		return;
	}
	
	options.config = options.params;
	options.params = {
			"data":options.params
	};
	
	addEncryptionLayerToAjax(options);
	
}


addEncryptionLayerToAjax=function(config){
	//make changes to the config data before passing the request to the server
	//we are changing the params to encrypted cipher text and attaching a sucees handler to decrypt the servers response
	// Responsible for getting the request data, process the request data to a query string and encrypting the data before sending it to server
	if(!CBXCryptProp.needEncryption){
		return;
	}
	
	var refObj = config.params||config;
	var json_params = refObj.data||refObj;
	var json_queryString = serializedString(json_params);
	refObj = {};	
	var enc_error_handler=new error_handler("Dummy Error Handler");

	if(config.params === undefined) {
		config.data = {data:encryptQueryString(json_queryString,enc_error_handler)};
		return;
	}
	if(config.params.data){
		config.params={data:encryptQueryString(json_queryString,enc_error_handler)};
	}
	else if(config.params){
		config.data = {data:encryptQueryString(json_queryString,enc_error_handler)};
	}
}


encryptQueryString=function(queryString,error_handler){
	if(!CBXCryptProp.needEncryption){
		return;
	}
	var json_queryString;
	json_queryString=queryString+"&encrypted=true"; //a place-holder param to validate decryption
	var encryptedData=CBXCrypt.encrypt(json_queryString);
	//check error in the encryptedData and call error handler
	if(hasError(encryptedData)){
		//get the error data from encryptedData and pass it to error handler
		error_handler.handle_error(encryptedData);
		return;
	}
	return encryptedData;
}
hasError = function(json_data){
	 return false;
}

encryptLogin=function(parentElement){
	if(!CBXCryptProp.needEncryption){
		return;
	}
	var inputElements=parentElement.getElementsByTagName("input");
	var json_queryString="";
	for(var i=0;i<inputElements.length;i++){
		var key=inputElements[i].name;
		var value=inputElements[i].value;
		json_queryString=key+"="+value+"&"+json_queryString;
	}
	json_queryString=json_queryString+"&encrypted=true"; //a place-holder param to validate decryption
	var encryptedData=CBXCrypt.encrypt(json_queryString);
	return encryptedData;
}


	
	function CBXCryptEncrypt(data){

		
		if(!CBXCryptProp.key)											// Check if the secret key is already set for the current session, if not proceed for handshake
		{
			//console.log("Key is NULL, call exchangeKeys()");
			if(isFunction(CBXCrypt.exchangeKeys))
			   CBXCrypt.exchangeKeys(keyExchangeSuccess,keyExchangeFailure);
			else
				keyExchangeFailure("CBXCrypt.exchangeKeys is not set");	
				
		}
		if(CBXCryptProp.key)								   			// Secret key is already set for the current session, proceed with encrypting the user data
		{
			//console.log("Key isnt NULL, call clientEncrypt() ");
			if(isFunction(CBXCrypt.clientEncrypt))
				{
					var encryptedData=CBXCrypt.clientEncrypt(data,CBXCryptProp.key);
				}
			else
				keyExchangeFailure("CBXCrypt.clientEncrypt is not set");
		}
		return encryptedData;
		
	}


	function CBXCryptExchangeKeys(success,failure){
		if(isFunction(CBXCrypt.generateSecretKey))	
	      {
		    CBXCrypt.generateSecretKey(failure,function(secretKey){
		    if(isFunction(CBXCrypt.getPublicKey))	
			 {
			  CBXCrypt.getPublicKey(failure,function(pubKey){
			  if(isFunction(CBXCrypt.encryptKey))	
				{
				 CBXCrypt.encryptKey(failure,secretKey,pubKey,function(encKey){
				 if(isFunction(CBXCrypt.setKey))	
				   {
					CBXCrypt.setKey(encKey,failure,function(httpResponse){
					if(isFunction(CBXCrypt.validateKey))
					  {
					   if(CBXCrypt.validateKey(httpResponse,secretKey,failure))
						   { 
						    if(isFunction(success))
						       success();
						    else 
						    	failure("Sorry!!! success is not a function");
						   }
					   else
						   {
						   if(isFunction(failure))
							     failure("Handshake failed");
						    else 
						    	alert("Sorry!!! failure is not a function");
						   }
					  }else 
						  failure("CBXCrypt.validateKey is not set");
				    });
				   }else
						failure("CBXCrypt.setKey is not set");		
				  });
				 }else
					 failure("CBXCrypt.encryptKey is not set");
				});
			   }else
				  failure("CBXCrypt.getPublicKey is not set");
			  });  
		    }else
		    	failure(" CBXCrypt.generateSecretKey is not set");
	  }

	
	
	

	function CBXCryptGenerateSecretKey(failure,callback){
		/**
		 * Forms the secret key
		 */
		var seed = Math.random() + "";									// To get seed value for generating secret key
		var KeyLength = CBXCryptProp.KeyLength;
		var salt = CryptoJS.lib.WordArray.random(KeyLength/8);					// To get salt value for generating secret key
		var key128Bits = CryptoJS.PBKDF2(seed, salt, { keySize: KeyLength/32 });	// To generate 128 bit sized secret key using PBKDF2 of CryptoJS 
		if(key128Bits!=null)
			{
			 tempKey=key128Bits.toString();				    			// Set secret key as the value to the key property of CBXCrypt
			 //console.log("tempKey generated= "+tempKey);
			 if(isFunction(callback))									// Check if callback is a function
			    callback(tempKey);												// Calling CBXCrypt.getPublicKey function
			 else
				 failure("Sorry!!! callback is not a function ");
			
			}
		else
			failure("Sorry!! Could not generate 128 bit secret key");

	}

	
	
	function CBXCryptGetPublicKey(failure,callback){
		/**
		 * Gets the public key from the server
		 * */
		var publicKeyRequest = new XMLHttpRequest();    					// Create an object of XMLHttpRequest
		if(CBXCryptProp.pubKeyURL!=null)									// Check if the server URL to get the public key is set in the CBXCrypt pubKeyURL property
		{	
			//var url=CBXCryptProp.pubKeyURL;
			if (canvas.env.network.getState() != 'ACTIVE'){
				canvas.metadata.getMetaData("PUBLIC_KEY",'PUBLIC_KEY',function(metadatavalue){
					if(isFunction(callback) && !cbx.isEmpty(metadatavalue)){
					callback(metadatavalue);  // Calling CBXCrypt.encryptKey function
					}
				},this);
			}
			else{
			var url = iportal.systempreferences.isHybrid() === "true" ? getDomainUrl() + "GetPublicKey" : CBXCryptProp.pubKeyURL;
		    
			publicKeyRequest.open('POST', url, false);							// For synchronous call
		    publicKeyRequest.send("generateKeyPair=true");						// Request for generating key pair for RSA key
		    if (publicKeyRequest.status == 200) {          					// Check if the request has succeeded
			if(!isError(publicKeyRequest.responseText))						// Check if server response contains any error
				{
				//console.log("Public key is "+publicKeyRequest.responseText);
						if(isFunction(callback)){									   // Check if callback is a function
							 var d = new Date,
						        dformat = [ d.getDate().padLeft(),
						                    (d.getMonth()+1).padLeft(),
						                    d.getFullYear()].join('/')+
						                    ' ' +
						                  [ d.getHours().padLeft(),
						                    d.getMinutes().padLeft(),
						                    d.getSeconds().padLeft()].join(':');
										 dformat+"";
							canvas.metadata.storeMetaData("PUBLIC_KEY",{id:'PUBLIC_KEY',value:publicKeyRequest.responseText,serverdatetime:dformat});
				  callback(publicKeyRequest.responseText);												   // Calling CBXCrypt.encryptKey function
						}
						else{
					failure("Sorry!!! callback is not a function ");
						}
				}
			else
				failure(publicKeyRequest.responseText);
		    }
		    else if (publicKeyRequest.status == 404)
		    	failure("Server not found");
		    else if(publicKeyRequest.status == 500)
		    	failure("Internal server error");
		}
		}
		else
			failure("Server URL to obtain public key is not set");
		
		
	}

	
	
	
	function CBXCryptEncryptKey(failure,secretKey,pubKey,callback){
		/** Create an object of RSA key and encrypt the session key sent by server using the server's public key */		 	
		var RsaKey= new RSAKey();							  				// Create an object of RSA key of rsa.js
		//console.log("RsaKey= "+ RsaKey);
		var keyComp = JSON.parse(pubKey); 			// Get the N and e pair of the server public key
		RsaKey.setPublic(keyComp.n,keyComp.e);				 				// Set the key pair N and e of public key to the RSA object created		
		var cipherText=RsaKey.encrypt(secretKey);         			// Encrypt the secret key using the server public key
		if(cipherText!=null)
			{
			//console.log("cipherText= "+ cipherText);			
		     if(isFunction(callback))									   // Check if callback is a function		     
		         callback(cipherText);										// Calling CBXCrypt.setKey function
		     else
		    	 failure("Sorry!!! callback is not a function ");
			}
		else
			failure("Sorry!!! Secret key could not be encrypted");
	}
	
	
	

	function CBXCryptSetKey(encKey,failure,callback){
		/**
		 * Client sends its secrete key to the server and then gets the encrypted secret key from the server back
		 * */
		//console.log("encKey in setKey func= "+encKey);
		var encSecretKeyRequest = new XMLHttpRequest();    					// Create an object of XMLHttpRequest
		if(CBXCryptProp.handShakeURL!=null)
		{
			//var url = CBXCryptProp.handShakeURL; 
			
			var url = iportal.systempreferences.isHybrid()==="true" ? getDomainUrl() + "HandShakeServlet" : CBXCryptProp.handShakeURL;
			
			
			var params = "key="+encodeURIComponent(encKey);    					// Encode the encrypted secret key before sending it to the server
			encSecretKeyRequest.open("POST", url, false);      					// For synchronous call
			encSecretKeyRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  //Send the proper header information along with the request
			encSecretKeyRequest.onreadystatechange = function() {				//Call a function when the state changes.
				if(encSecretKeyRequest.readyState == 4 && encSecretKeyRequest.status == 200) {
					//console.log("Handshake done");			
				} 
				
			};
			encSecretKeyRequest.send(params);		                              // Send the encrypted secret key
			if(!isError(encSecretKeyRequest.responseText))						// Check if server response contains any error
			{
				 if(encSecretKeyRequest.status == 404)
					failure("Server not found");
				else if(encSecretKeyRequest.status == 500)
					failure("Internal server error");
				else
					
					{
					 var responseContent = JSON.parse(encSecretKeyRequest.responseText);  // get the encrypted secret key from the server as the response 
				     callback(responseContent.key);									// Calling CBXCrypt.validateKey function
					}
			}
			else
				failure(publicKeyRequest.responseText);
		
			
		}
		else
			failure("Server URL to obtain encrypted secret key from the server is not set");
	}


	

	function CBXCryptValidateKey(responseKey,secretKey,failure){
		/**
		 * Validate if the client's secret key is same as the key sent back by the server
		 * */
		if(isFunction(CBXCrypt.clientDecrypt))
			{
			//console.log("val responseKey= "+responseKey);
			//console.log("val secretKey= "+secretKey);
    	     var decryptedKey = CBXCrypt.clientDecrypt(responseKey,secretKey); 			// Decrypt the encrypted secret key received by the server 
		     if(secretKey == decryptedKey)											// Check if received secret key from server is same as the generated one 
			   {
		    	 	storeKey(secretKey);
		    	 	return true;
			   }
		     else
		    	 /**
		    	  * negative request scenarios will be handled here
		    	  */
		    	 failure("Handshake failed");
			}
		 else
		    failure("CBXCrypt.clientDecrypt is not set");	 

	}


	
	

	function CBXCryptClientDecrypt(cipherText,secretKey){
		/**
		 * Call AES API to decrypt the key
		 * accepts base64 encoded cipherText and returns "String" value of the decoded data
		 */
		//console.log("secretKey= "+ secretKey);
		//console.log("cipherText= "+ cipherText);
		key = CryptoJS.enc.Hex.parse(secretKey);						// Encode the key using hex encoding

		//console.log("key= "+ key);
		var cipherParams = CryptoJS.lib.CipherParams.create({
			ciphertext: CryptoJS.enc.Base64.parse(cipherText) 			// Encode the cipher text using Base64 encoding
		});
		
		
		//console.log("cipherParams= "+cipherParams);

		
		var decrypted = CryptoJS.AES.decrypt(					// Decrypt the encoded cipher text using encoded key
				cipherParams,
				key,
				{ iv: key });
		//console.log("decrypted= "+decrypted);
		var plainText = decrypted.toString(CryptoJS.enc.Utf8);  		// Encode the decrypted data using UTF8 encoding to get the required plain text 
		//console.log("plain text = "+plainText);
		return plainText;	

	}
	

	
	
	function CBXCryptClientEncrypt(plainText,aesKey){
		/**
		 * Call AES API to encrypt the key
		 * accepts "String" value of plainText and encrypt that into base64 encoded data
		 */

		key = CryptoJS.enc.Hex.parse(aesKey);   						// Encode the key using hex encoding

		var encrypted = CryptoJS.AES.encrypt(   						// Encrypt the plain text using the encoded key
				plainText,
				key,
				{ iv: key });
		var cipherText = encrypted.ciphertext.toString();				// Convert the encrypted data to string get the required cipher text
		return cipherText;
	}

	
	
	
/**
 * Function to check is the parameter is a function
 * */
function isFunction(func)
{
	var flag;

	if (typeof func === "function") 		// Checking if func is a function 
	   flag=true;
	else
	   flag=false;

	return flag;

}
	
	
	
	
	
/**
* Forms the encryption key
*/
function isError(str){		
   var flag= (str.indexOf("ERROR") > -1 );				// Check if the http response contains any error message
   return flag;																
}

 
//Properties file to set all the CBX Encyption and Decryption components. 



var CBXCryptProp={
			key:null,												   // Secret key of the session
			pubKeyURL:'GetPublicKey',						           // URL to get the server public key
			handShakeURL:'HandShakeServlet',				           // URL to send and get the secret key to and from the server
			needEncryption: iportal.systempreferences.isNeedEncryption(),							           // Flag to check if the user wants to encrypt data 
			KeyLength : 128,										   // By default its 128 , AES supports only 128,192 and 256 key lengths
			validTill:null,
			lastConn:null
};


CBXCrypt={
			encrypt:CBXCryptEncrypt,						   // Method to check if secret key is available for the current session and call the functions accordingly to proceed
			decrypt:CBXCryptDecrypt,
			exchangeKeys:CBXCryptExchangeKeys,			   	   // Method has sequence of function calls to perform handshake between client and the server 
			generateSecretKey:CBXCryptGenerateSecretKey,       // Method to generate the secret key for the current session
			getPublicKey:CBXCryptGetPublicKey,			   	   // Method to get server public key  
			encryptKey:CBXCryptEncryptKey,				   	   // Method to encrypt the secret key using server public key
			setKey:CBXCryptSetKey,						   	   // Method to send the secret key to the server and get the encrypted secret key from the server
			validateKey:CBXCryptValidateKey,				   // Method to validate the secret key sent by the server
			clientDecrypt:CBXCryptClientDecrypt,			   // Method to decrypt the user data
			clientEncrypt:CBXCryptClientEncrypt			   	   // Method to encrypt the user data
};

/*if(typeof(Storage) !== "undefined") {
	if(sessionStorage.cryptProp==null)							       // Check if CBXCrypt object has already been created and stored in session storage
	{
		sessionStorage.cryptProp=JSON.stringify(CBXCryptProp);     // Store the CBXCrypt object in the session storage
	}
	else{												               // CBXCrypt is already created
		CBXCryptProp=JSON.parse(sessionStorage.cryptProp);	       // Get the CBXCrypt from the session storage
	}
} else {
	
}*/



if(CBXCryptProp.needEncryption==true && CBXCryptProp.key==null)	   // Secret key is not generated and the user wants to encrypt data
{
	if(isFunction(CBXCrypt.exchangeKeys))
		CBXCrypt.exchangeKeys(keyExchangeSuccess,keyExchangeFailure);			// Initiate for handshake process
	else
		keyExchangeFailure("CBXCrypt.exchangeKeys function is not defined");
}
else{
	//console.log("Key already present or there is no need for encryption");
}



function storeKey(key){

	CBXCryptProp.key=key;
	/*if(typeof(Storage) !== "undefined") {
			sessionStorage.cryptProp=JSON.stringify(CBXCryptProp);     // Store the CBXCrypt object in the session storage
		
	}*/

}
