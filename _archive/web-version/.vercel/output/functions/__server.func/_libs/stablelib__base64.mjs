import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/@stablelib/base64/lib/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Package base64 implements Base64 encoding and decoding.
	*/
	var INVALID_BYTE = 256;
	/**
	* Implements standard Base64 encoding.
	*
	* Operates in constant time.
	*/
	var Coder = function() {
		function Coder(_paddingCharacter) {
			if (_paddingCharacter === void 0) _paddingCharacter = "=";
			this._paddingCharacter = _paddingCharacter;
		}
		Coder.prototype.encodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 8 + 5) / 6 | 0;
			return (length + 2) / 3 * 4 | 0;
		};
		Coder.prototype.encode = function(data) {
			var out = "";
			var i = 0;
			for (; i < data.length - 2; i += 3) {
				var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
				out += this._encodeByte(c >>> 18 & 63);
				out += this._encodeByte(c >>> 12 & 63);
				out += this._encodeByte(c >>> 6 & 63);
				out += this._encodeByte(c >>> 0 & 63);
			}
			var left = data.length - i;
			if (left > 0) {
				var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
				out += this._encodeByte(c >>> 18 & 63);
				out += this._encodeByte(c >>> 12 & 63);
				if (left === 2) out += this._encodeByte(c >>> 6 & 63);
				else out += this._paddingCharacter || "";
				out += this._paddingCharacter || "";
			}
			return out;
		};
		Coder.prototype.maxDecodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 6 + 7) / 8 | 0;
			return length / 4 * 3 | 0;
		};
		Coder.prototype.decodedLength = function(s) {
			return this.maxDecodedLength(s.length - this._getPaddingLength(s));
		};
		Coder.prototype.decode = function(s) {
			if (s.length === 0) return /* @__PURE__ */ new Uint8Array(0);
			var paddingLength = this._getPaddingLength(s);
			var length = s.length - paddingLength;
			var out = new Uint8Array(this.maxDecodedLength(length));
			var op = 0;
			var i = 0;
			var haveBad = 0;
			var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
			for (; i < length - 4; i += 4) {
				v0 = this._decodeChar(s.charCodeAt(i + 0));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v0 << 2 | v1 >>> 4;
				out[op++] = v1 << 4 | v2 >>> 2;
				out[op++] = v2 << 6 | v3;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
				haveBad |= v2 & INVALID_BYTE;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (i < length - 1) {
				v0 = this._decodeChar(s.charCodeAt(i));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				out[op++] = v0 << 2 | v1 >>> 4;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
			}
			if (i < length - 2) {
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				out[op++] = v1 << 4 | v2 >>> 2;
				haveBad |= v2 & INVALID_BYTE;
			}
			if (i < length - 3) {
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v2 << 6 | v3;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (haveBad !== 0) throw new Error("Base64Coder: incorrect characters for decoding");
			return out;
		};
		Coder.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -15;
			result += 62 - b >>> 8 & 3;
			return String.fromCharCode(result);
		};
		Coder.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
			result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		Coder.prototype._getPaddingLength = function(s) {
			var paddingLength = 0;
			if (this._paddingCharacter) {
				for (var i = s.length - 1; i >= 0; i--) {
					if (s[i] !== this._paddingCharacter) break;
					paddingLength++;
				}
				if (s.length < 4 || paddingLength > 2) throw new Error("Base64Coder: incorrect padding");
			}
			return paddingLength;
		};
		return Coder;
	}();
	exports.Coder = Coder;
	var stdCoder = new Coder();
	function encode(data) {
		return stdCoder.encode(data);
	}
	exports.encode = encode;
	function decode(s) {
		return stdCoder.decode(s);
	}
	exports.decode = decode;
	/**
	* Implements URL-safe Base64 encoding.
	* (Same as Base64, but '+' is replaced with '-', and '/' with '_').
	*
	* Operates in constant time.
	*/
	var URLSafeCoder = function(_super) {
		__extends(URLSafeCoder, _super);
		function URLSafeCoder() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		URLSafeCoder.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -13;
			result += 62 - b >>> 8 & 49;
			return String.fromCharCode(result);
		};
		URLSafeCoder.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
			result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		return URLSafeCoder;
	}(Coder);
	exports.URLSafeCoder = URLSafeCoder;
	var urlSafeCoder = new URLSafeCoder();
	function encodeURLSafe(data) {
		return urlSafeCoder.encode(data);
	}
	exports.encodeURLSafe = encodeURLSafe;
	function decodeURLSafe(s) {
		return urlSafeCoder.decode(s);
	}
	exports.decodeURLSafe = decodeURLSafe;
	exports.encodedLength = function(length) {
		return stdCoder.encodedLength(length);
	};
	exports.maxDecodedLength = function(length) {
		return stdCoder.maxDecodedLength(length);
	};
	exports.decodedLength = function(s) {
		return stdCoder.decodedLength(s);
	};
}));
//#endregion
export { require_base64 as t };
