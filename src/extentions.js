
module.exports = function($){

	"use strict";

	$.extend($.support, {
		cssTransition: ("transition" in document.createElement("i").style)
	});

	$.extend($, {

		attributify: function(obj){
			obj.EVENT_ATTRIBUTE_CHANGE = "attributechange";
			obj.attr = function(){
				var my = this, args = arguments;
				this.attributes = this.attributes || {};
				switch($.type(args[0])){
					case "undefined": return this.attributes;
					case "string":
						if(args.length === 1){
							return this.attributes[args[0]];
						}
						if(args[1] !== this.attributes[args[0]]){
							this.attributes[args[0]] = args[1];
							if($.isFunction(this.trigger)){
								this.trigger(this.EVENT_ATTRIBUTE_CHANGE, {
									key: args[0],
									value: args[1]
								});
							}
						}
						break;
					case "object":
						$.each(args[0], function(key, value){
							my.attr(key, value);
						});
						break;
					default: break;
				}
				return this;
			};
			obj.attr(obj._attributes);
			return obj;
		},

		chainCase: function(str, delimiter){
			delimiter = delimiter || "-";
			return str.replace(/[A-Z]/g, function(s){
				return delimiter + s.toLowerCase();
			})
			.replace(new RegExp("^\\" + delimiter), "");
		},

		classify: function(props){
			var ClassObject = function(){
				if($.isFunction(this._constructor)){
					this._constructor.apply(this, arguments);
				}
			};
			$.extend(true, ClassObject.prototype, props);
			ClassObject.extend = function(sup){
				var key;
				sup = $.isFunction(sup) ? sup.prototype : sup;
				for(key in sup){
					if(sup.hasOwnProperty(key) && key !== "_constructor"){
						this.prototype[key] = sup[key];
					}
				}
				this.prototype._super = function(){
					sup._constructor.apply(this, arguments);
				};
				return this;
			};
			return ClassObject;
		},

		configify: function(obj){
			obj.config = function(){
				var args = arguments;
				this.options = this.options || {};
				switch($.type(args[0])){
					case "undefined": return this.options;
					case "string":
						if(args.length === 1){
							return this.options[args[0]];
						}
						this.options[args[0]] = args[1];
						break;
					case "object":
						$.extend(this.options, args[0]);
						break;
					default: break;
				}
				return this;
			};
			obj.config(obj._options);
			return obj;
		},

		dig: function(path, obj){
			var o;
			obj = (obj === void 0) ? window : obj;
			o = obj;
			path.split(".").forEach(function(name){
				if(o === void 0){ return; }
				if(! (name in o)){
					return o = void 0;
				}
				o = o[name];
			});
			return o;
		},

		escapeHTML: function(str){
			var el = document.createElement("i");
			el.appendChild(document.createTextNode(str));
			return el.innerHTML;
		},

		_eventify: function(obj){
			var emitter = $(obj);
			["on", "off", "trigger"].forEach(function(name){
				obj[name] = function(){
					emitter[name].apply(emitter, arguments);
					return this;
				};
			});
			return obj;
		},

		eventify: function(obj){
			return (function(){
				var hasAsArray = function(key, obj){
					return (key in obj) && $.isArray(obj[key]);
				};
				this._listeners = {};
				this.on = function(type, handler){
					if(! hasAsArray(type, this._listeners)){
						this._listeners[type] = [];
					}
					this._listeners[type].push(handler);
				};
				this.off = function(type, handler){
					if(hasAsArray(type, this._listeners)){
						this._listeners[type] = this._listeners[type].filter(function(_handler){
							return (handler !== _handler);
						});
					}
				};
				this.trigger = function(type, data){
					var self = this;
					if(hasAsArray(type, this._listeners)){
						this._listeners[type].forEach(function(handler){
							handler.apply(self, [new Event(type), data]);
						});
					}
				};
				return this;
			}).call(obj);
		},

		format: function(format){
			var i = 0,
				j = 0,
				r = "",
				next = function(args){
					j += 1; i += 1;
					return args[j] !== void 0 ? args[j] : "";
				};

			for(i=0; i<format.length; i++){
				if(format.charCodeAt(i) === 37){
					switch(format.charCodeAt(i+1)){
						case 115: r += next(arguments); break;
						case 100: r += Number(next(arguments)); break;
						default: r += format[i]; break;
					}
				} else {
					r += format[i];
				}
			}
			return r;
		},

		formatNumber: function(num){
			return num.toString().split(".")
			.map(function(value, i){
				if(i) return value;
				return value.replace(/([0-9]+?)(?=(?:[0-9]{3})+$)/g , "$1,");
			})
			.join(".");
		},

		observe: function(callback, interval, timeout){
			var o = {
				interval: interval || 33,
				timeout: timeout || 60000,
				callback: callback,

				df: $.Deferred(),
				timer: null,
				start: null,
				now: function(){
					return (new Date()).getTime();
				},

				run: function(){
					clearTimeout(this.timer);
					if(callback()){
						return this.df.resolve();
					}
					if((this.now() - this.start) >= timeout){
						return this.df.reject();
					}
					this.timer = setTimeout(this.run, this.interval);
				}
			};

			o.start = o.now();
			o.run = o.run.bind(o);
			o.run();

			return o.df;
		},

		parseQuery: function(str, asArray){
			var list = [], data = {}, decode;
			decode = function(str){
				return decodeURIComponent(str.replace(/\+/g, "%20"));
			};
			str.replace(/(^.*?\?|#.*?$)/g, "")
			.split("&")
			.forEach(function(item){
				item = item.split("=");
				if(item.length > 1){
					list.push({
						key: decode(item[0]).replace(/\[\]$/, ""),
						value: decode(item[1])
					});
				}
			});
			if(asArray){
				return list;
			}
			list.forEach(function(item){
				if(item.key in data){
					if(! $.isArray(data[item.key])){
						data[item.key] = [data[item.key]];
					}
					data[item.key].push(item.value);
					return;
				}
				data[item.key] = item.value;
			});
			return data;
		},

		parseURL: function(url){
			var a, r = {};
			a = document.createElement("a");
			a.href = url;
			[
				"hash",
				"host",
				"hostname",
				"href",
				"origin",
				"pathname",
				"port",
				"protocol",
				"search"
			].forEach(function(name){
				r[name] = a[name];
			});
			return r;
		},

		random: function(start, end){
			var random = function(start, end){
				return Math.floor(Math.random() * (end - start + 1)) + start;
			};
			return $.isArray(start) ? start[random(0, start.length - 1)] : random(start, end);
		},

		rebase: function(obj, pattern){
			pattern = pattern || /^_[a-z]/;
			pattern = ($.type(pattern) !== "regexp") ? new RegExp(pattern) : pattern;
			$.each(obj, function(key, value){
				if(pattern.test(key) && $.isFunction(value)){
					obj[key] = value.bind(obj);
				}
			});
			return obj;
		},

		render: function(template, data){
			var func = function(vars){
				return template.replace(/([\{]{2,3})([\w\.\-]+)([\}]{2,3})/g, function(a,b,c){
					var value = $.dig(c, vars) || "";
					value = (b.length > 2) ? value : $.escapeHTML(value);
					return value;
				});
			};
			return data === void 0 ? func : func(data);
		},

		scrollTo: function(dest, offset, options, selector){
			if($.type(dest) !== "number"){
				dest = $(dest)[selector === void 0 ? "offset" : "position"]().top;
			}
			offset = offset || 0;
			options = options || {};
			selector = selector || "html,body";
			$(selector).animate({
				scrollTop: dest + offset
			}, options);
		},
		
		series: function(){
			var df = $.Deferred(),
				args = arguments,
				i = -1,
				timer = null,
				run;

			run = function(){
				var r;

				clearTimeout(timer);
				i += 1;
				if(i >= args.length){
					return df.resolve();
				}
				r = args[i]();
				if(false === r){
					df.reject();
				}
				r = (r === void 0) ? 1 : r;
				switch($.type(r)){
					case "number": timer = setTimeout(run, r); break;
					case "object": 
						if($.isFunction(r.then)){
							r.then(run ,function(){
								df.reject();
							});
						}
						break;
					default: break;
				}
			}

			run();

			return df;
		},

		times: function(count, callback){
			var i = count;
			while(i--){
				callback(count - i - 1);
			}
		},

		timing: {
			_supported: ("performance" in window) && ("timing" in window.performance),
			_data: {},
			_start: (new Date()).getTime(),

			mark: function(name){
				if(this._supported){
					window.performance.mark(name);
				} else {
					this._data[name] = {
						type: "mark",
						startTime: (new Date()).getTime() - this._start
					};
				}
			},

			marks: function(){
				return this.getEntries("mark", "startTime");
			},

			measure: function(name, start, end){
				if(this._supported){
					window.performance.measure(name, start, end);
				} else {
					this._data[name] = {
						type: "measure",
						duration: this.get(end) - this.get(start)
					};
				}
			},

			measures: function(){
				return this.getEntries("measure", "duration");
			},

			get: function(name){
				if(this._supported){
					var items = window.performance.getEntriesByName(name);
					return items.length ? items[0].startTime : void 0;
				}
				return (name in this._data) ? this._data[name].startTime : void 0;
			},

			getEntries: function(type, key){
				var data = {};
				if(this._supported){
					window.performance.getEntriesByType(type)
					.forEach(function(item){
						data[item.name] = item[key];
					});
				} else {
					$.each(this._data, function(name, item){
						if(item.type === type){
							data[name] = item[key];
						}
					});
				}
				return data;
			}
		}

	});
	
	$.fn.extend({

		extract: function(asArray){
			var list = [], data = {};
			this.find("input[name], select[name], textarea[name]").each(function(){
				var name = this.name;
				if(["radio", "checkbox"].indexOf(this.type) >= 0){
					return ! this.checked ? null : list.push({
						name: name,
						value: this.value
					});
				}
				if(this.nodeName === "SELECT"){
					return $(this).find("option:selected").each(function(){
						list.push({
							name: name,
							value: this.value
						});
					});
				}
				list.push({
					name: name,
					value: this.value
				});
			});
			if(asArray){
				return list;
			}
			list.forEach(function(item){
				if(data[item.name] !== void 0){
					if($.type(data[item.name]) !== "array"){
						data[item.name] = [data[item.name]];
					}
					data[item.name].push(item.value);
					return;
				}
				data[item.name] = item.value;
			});
			return data;
		},

		serializeObject: function(){
			var vars = {};
			this.serializeArray().forEach(function(item){
				if(item.name in vars){
					if(! $.isArray(vars[item.name])){
						vars[item.name] = [vars[item.name]];
					}
					vars[item.name].push(item.value);
					return;
				}
				vars[item.name] = item.value;
			});
			return vars;
		},

		submitAsync: function(options){
			var props = $.extend({
				url: this.prop("action"),
				type: this.prop("method"),
				data: this.serializeObject()
			}, options);
			return $.ajax(props);
		},

		transition: function(props, options){
			var o, transition = [];

			o = $.extend({
				duration: 400,
				delay: 0,
				easing: "ease",
				done: $.noop
			}, options);

			if(! $.support.cssTransition){
				switch(o.easing){
					case "ease": o.easing = "swing";
					case "ease-in": o.easing = "easeInSine";
					case "ease-out": o.easing = "easeOutSine";
					case "ease-in-out": o.easing = "easeInOutSine";
					default: break;
				}
				o.easing = (o.easing in $.easing) ? o.easing : "swing";

				this.stop().delay(o.delay).animate(props, {
					duration: o.duration,
					easing: o.easing,
					done: o.done
				});

				return this;
			}

			$.each(props, function(key, value){
				transition.push(
					[
						key,
						o.duration + "ms",
						o.easing,
						o.delay + "ms"
					].join(" ")
				);
			});
			transition = transition.join(",");

			this.each(function(){
				var el = $(this),
					done = (function(e){
						o.done.call(this, e);
						$(this).css("transition", "").off("transitionend", done);
					}).bind(this);

				el.css("transition", transition)
				.on("transitionend", done)
				.css(props);

				setTimeout(function(){
					el.trigger("transitionend");
				}, o.duration + 33);
			});

			return this;
		}

	});
};
