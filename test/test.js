
/**
 * jQuery.*
 * --------
 */

describe("$.attributify", function(){

	var o = {
		_attributes: {
			name: "john",
			age: 23
		}
	};

	$.attributify(o);
	$.eventify(o);

	it("Set value", function(){
		o.attr("foo", "bar");
		expect(o.attr("foo")).toBe("bar");
	});

	it("Change value and fire event", function(){
		var changed = false;
		var name = "tom";

		o.on("attributechange", function(e, _o){
			if(_o.value === name){
				changed = true;
			}
		});
		o.attr("name", name);
		expect(changed).toBe(true);
	});

});

describe("$.chainCase", function(){

	var src = [
		"FooBarBaz",
		"fooBarBaz"
	];

	it("Convert to chain-cased", function(){

		src = src.map(function(value){
			return $.chainCase(value);
		});

		expect(src[0]).toBe(src[1]);
		expect(src[0]).toBe("foo-bar-baz");
	});

});

describe("$.classify", function(){

	it("Call constructor", function(){
		var A = $.classify({
			name: null,
			age: null,
			_constructor: function(name, age){
				this.name = name;
				this.age = age;
			}
		});
		var a = new A("john", 23);

		expect(a.name).toBe("john");
		expect(a.age).toBe(23);
	});

	it("Extends", function(){
		var Animal = $.classify({
			walk: function(){
				return true;
			}
		});
		var Person = $.classify({
			hello: function(){
				return "hello";
			}
		})
		.extend(Animal);

		var john = new Person();

		expect(john.walk()).toBe(true);
		expect(john.hello()).toBe("hello");
	});

});

describe("$.configify", function(){

	var o = {
		_options: {
			name: "john",
			age: 23
		}
	};

	$.configify(o);

	it("Change option", function(){
		var name = "tom";
		o.config("name", name);
		expect(o.config("name")).toBe(name);
	});

	it("Change and get options", function(){
		var a, r;

		a = {
			name: "bob",
			age: 19
		};
		o.config(a);
		r = o.config();
		expect(r.name).toBe(a.name);
		expect(r.age).toBe(a.age);
	});

});

describe("$.dig", function(){

	var o = {
		name: "john",
		foo: {
			bar: {
				baz: "foobarbaz"
			}
		}
	};

	it("Digging object by dot-syntax string", function(){
		expect($.dig("name", o)).toBe("john");
		expect($.dig("foo.bar.baz", o)).toBe("foobarbaz");
		expect($.dig("hoge", o)).toBe(void 0);
	});

});

describe("$.escapeHTML", function(){

	var src = [
		'<script>',
		'<a href="#">foo</a>'
	];

	var check = function(str){
		return /(<|>)/.test(str);
	};

	it("Escape HTML String", function(){
		expect(check($.escapeHTML(src[0]))).toBe(false);
		expect(check($.escapeHTML(src[1]))).toBe(false);
	});

});

describe("$.eventify", function(){

	var o = {};

	$.eventify(o);

	it("Implement on, off, trigger", function(){
		["on", "off", "trigger"].forEach(function(name){
			expect($.isFunction(o[name])).toBe(true);
		});
	});

	it("Fire events", function(){
		var stack = [];
		var handler = function(){
			stack.push(true);
		};
		o.on("test", handler);
		o.trigger("test");
		o.off("test", handler);
		o.trigger("test");

		expect(stack).toEqual([true]);
	});

});

describe("$._eventify", function(){

	var o = {};

	$._eventify(o);

	it("Implement on, off, trigger", function(){
		["on", "off", "trigger"].forEach(function(name){
			expect($.isFunction(o[name])).toBe(true);
		});
	});

	it("Fire events", function(){
		var stack = [];
		var handler = function(){
			stack.push(1);
		};
		var handler2 = function(){
			stack.push(2);
		};
		o.on("test", handler);
		o.on("test", handler2);
		o.trigger("test");
		o.off("test", handler);
		o.trigger("test");

		expect(stack).toEqual([1,2,2]);
	});

});

describe("$.format", function(){

	it("Return formatted string: %s", function(){
		expect($.format("%s/%s/%s", "foo", "bar", "baz")).toBe("foo/bar/baz");
		expect($.format("%s/%s", "foo", "bar", "baz")).toBe("foo/bar")
		expect($.format("%s/%s/%s", "foo", "bar")).toBe("foo/bar/")
	});

	it("Returnd formatted string: %s, %d", function(){
		expect($.format("%s:%d", "foo", 1.23)).toBe("foo:1.23");
		expect($.format("%s:%d", "foo", "bar")).toBe("foo:NaN");
	});

});

describe("$.formatNumber", function(){

	it("Returnd formatted number", function(){
		expect($.formatNumber(1234567890)).toBe("1,234,567,890");
		expect($.formatNumber(-1234567890)).toBe("-1,234,567,890");
		expect($.formatNumber(123456.789)).toBe("123,456.789");
		expect($.formatNumber(-123456.789)).toBe("-123,456.789");
	});

});

describe("$.observe", function(){

	var flag = false;
	var stack = [];

	beforeEach(function(done){
		$.observe(function(){
			return flag;
		})
		.done(function(){
			stack.push(true);
			done();
		});

		setTimeout(function(){
			flag = true;
		}, 100);
	});

	it("Observe state", function(){
		expect(stack).toEqual([true]);
	});

});

describe("$.parseQuery", function(){

	var response, data = {
		name: "john",
		age: "23",
		color: ["red", "blue"],
		message: "foo bar baz"
	};

	beforeEach(function(done){
		$.ajax({
			url: "/",
			data: data,
			beforeSend: function(r, o){
				response = $.parseQuery(o.url);
				done();
			}
		});
	});

	it("Parse query string", function(){
		$.each(data, function(key, value){
			expect(value).toEqual(response[key]);
		});
	});

	it("Extract search query from url", function(){
		var str = "http://www.example.com:8080/the/path/to/?name=john&age=23#section-01";
		expect($.parseQuery(str)).toEqual({name: "john", age: "23"});
	});

});

describe("$.parseURL", function(){

	it("Parse URL String", function(){
		var url = "https://www.example.com:8080/the/path/to/index.html?foo=bar&baz=piyo#section";
		var o = $.parseURL(url);

		expect(o.hash).toBe("#section");
		expect(o.host).toBe("www.example.com:8080");
		expect(o.hostname).toBe("www.example.com");
		expect(o.href).toBe(url);
		expect(o.origin).toBe("https://www.example.com:8080");
		expect(o.pathname).toBe("/the/path/to/index.html");
		expect(o.port).toBe("8080");
		expect(o.protocol).toBe("https:");
		expect(o.search).toBe("?foo=bar&baz=piyo");

	});

});

describe("$.series / delay", function(){

	var stack = [];

	beforeEach(function(done){
		var start = $.now();

		$.series(function(){
			return 100;
		}, function(){
			stack.push(($.now() - start) >= 100);
			return 200;
		}, function(){
			stack.push(($.now() - start) >= 300);
			return 300;
		}, function(){
			stack.push(($.now() - start) >= 600);
			done();
		});
	});

	it("Return number to delay process", function(){
		expect(stack).toEqual([true, true, true]);
	});

});

describe("$.series  / promise", function(){

	var stack = [];

	beforeEach(function(done){
		$.series(function(){
			stack.push(true);
		}, function(){
			stack.push(true);
		}, function(){
			stack.push(true);
			return false;
		}, function(){
			stack.push(false);
		})
		.then(function(){
			stack.push(false);
		}, function(){
			stack.push(true);
			done();
		});
	});

	it("Return false to reject", function(){
		expect(stack).toEqual([true, true, true, true]);
	});

});

describe("$.random", function(){

	it("Random by range", function(){
		$.times(3, function(){
			var value = $.random(11, 22);
			expect(value <= 22 && value >= 11).toBe(true);
		});
	});

	it("Random from value list", function(){
		var list = ["foo", "bar", "baz"];
		$.times(3, function(){
			var value = $.random(list);
			expect(list.indexOf(value) >= 0).toBe(true);
		});
	});

});

describe("$.rebase", function(){

	var stack = [];
	var a = $.eventify({});
	var b = {
		_onFoo: function(){
			stack.push(this === b);
		}
	};
	var c = $.rebase({
		_onBar: function(){
			stack.push(this === c);
		}
	});

	a.on("foo", b._onFoo);
	a.on("bar", c._onBar);

	a.trigger("foo");
	a.trigger("bar");

	it("Apply methods to the object", function(){
		expect(stack).toEqual([false, true]);
	});

});

describe("$.render", function(){

	it("Render by format", function(){
		var s = $.render("{{name}}:{{age}}:{{blank}}:{{email}}", {
			name: "john",
			age: 23,
			email: "john@example.com"
		});
		expect(s).toBe("john:23::john@example.com");
	});

	it("Escape html", function(){
		var s = "<script>";
		var r = $.render("{{{value}}}", {value: s});
		var r_e = $.render("{{value}}", {value: s});
		expect(r).toBe(s);
		expect(r_e).not.toBe(s);
		expect(/(<|>)/.test(r_e)).toBe(false);
	});

});

describe("$.scrollTo", function(){

	var container = $("<div>").css({
		position: "absolute",
		visibility: "hidden",
		width: 100,
		height: 100,
		overflow: "auto"
	});

	var content = $("<div>").css({
		height: 800,
		backgroundColor: "red"
	})
	.appendTo(container);

	var stack = [];

	beforeEach(function(done){
		$(function(){
			container.prependTo("body");

			$.series(function(){
				$.scrollTo(400, 80, {
					duration: 400,
					done: function(){
						stack.push(container.scrollTop() === 480);
						done();
					}
				}, container);
				return 100;
			}, function(){
				var top = container.scrollTop();
				stack.push(top > 0);
				stack.push(top < 480);
			});
		});
	});

	it("Scroll element to dest", function(){
		expect(stack).toEqual([true, true, true]);
	});

});

describe("times", function(){

	var stack = [];
	$.times(5, function(index){
		stack.push(index);
	});

	it("Process times", function(){
		expect(stack).toEqual([0,1,2,3,4]);
	});

});

describe("$.timing.*", function(){

	beforeEach(function(done){
		$.series(
			function(){
				$.timing.mark("foo");
				return 100;
			},
			function(){
				$.timing.mark("bar");
				return 100;
			},
			function(){
				$.timing.mark("baz");
				$.timing.measure("foo_bar", "foo", "bar");
				$.timing.measure("bar_baz", "bar", "baz");
				done();
			}
		);
	});

	it("Measure timings", function(){
		$.each($.timing.measures(), function(key, value){
			expect($.type(value)).toBe("number");
		});
		$.each($.timing.getEntries("mark", "startTime"), function(key, value){
			expect($.type(value)).toBe("number");
		});
	});

});


describe("$.timing.* / fallback", function(){

	$.timing._supported = false;

	beforeEach(function(done){
		$.series(
			function(){
				$.timing.mark("foo");
				return 100;
			},
			function(){
				$.timing.mark("bar");
				return 100;
			},
			function(){
				$.timing.mark("baz");
				$.timing.measure("foo_bar", "foo", "bar");
				$.timing.measure("bar_baz", "bar", "baz");
				done();
			}
		);
	});

	it("Measure timings", function(){
		$.each($.timing.measures(), function(key, value){
			expect($.type(value)).toBe("number");
		});
		$.each($.timing.getEntries("mark", "startTime"), function(key, value){
			expect($.type(value)).toBe("number");
		});
	});

});


/**
 * jQuery.fn.*
 * -----------
 */

describe("$.fn.extract", function(){

	var container = $("<div>");

	[
		$("<input>", {type: "text", name: "name", value: "john"}),
		$("<input>", {type: "radio", name: "gender", value: "male"}).prop("checked", true),
		$("<input>", {type: "radio", name: "gender", value: "female"}).prop("chekced", false),
		$("<input>", {type: "checkbox", name: "color", value: "red"}).prop("checked", true),
		$("<input>", {type: "checkbox", name: "color", value: "green"}).prop("checked", false),
		$("<input>", {type: "checkbox", name: "color", value: "blue"}).prop("checked", true),
		$("<textarea>", {name: "message"}).val("Hello, world !")
	]
	.forEach(function(el){
		el.appendTo(container);
	});

	it("Extract from non-form element", function(){
		var o = container.extract();
		expect(o.name).toBe("john");
		expect(o.gender).toBe("male");
		expect(o.color.join(",")).toBe("red,blue");
		expect(o.message).toBe("Hello, world !");
	});

});


describe("$.fn.serializeObject", function(){

	var form = $("<form>");

	[
		$("<input>", {type: "text", name: "name", value: "john"}),
		$("<input>", {type: "radio", name: "gender", value: "male"}).prop("checked", true),
		$("<input>", {type: "radio", name: "gender", value: "female"}).prop("chekced", false),
		$("<input>", {type: "checkbox", name: "color", value: "red"}).prop("checked", true),
		$("<input>", {type: "checkbox", name: "color", value: "green"}).prop("checked", false),
		$("<input>", {type: "checkbox", name: "color", value: "blue"}).prop("checked", true),
		$("<textarea>", {name: "message"}).val("Hello, world !")
	]
	.forEach(function(el){
		el.appendTo(form);
	});

	it("Serialize form as object", function(){
		var o = form.serializeObject();
		expect(o.name).toBe("john");
		expect(o.gender).toBe("male");
		expect(o.color.join(",")).toBe("red,blue");
		expect(o.message).toBe("Hello, world !");
	});

});

describe("$.fn.submitAsync", function(){

	var res, data = {
		name: "john",
		gender: "male",
		color: ["red", "blue"],
		message: "Hello, world !"
	};

	beforeEach(function(done){
		var form = $("<form>", {
			action: "/",
			method: "post"
		});

		[
			$("<input>", {type: "text", name: "name", value: "john"}),
			$("<input>", {type: "radio", name: "gender", value: "male"}).prop("checked", true),
			$("<input>", {type: "radio", name: "gender", value: "female"}).prop("chekced", false),
			$("<input>", {type: "checkbox", name: "color", value: "red"}).prop("checked", true),
			$("<input>", {type: "checkbox", name: "color", value: "green"}).prop("checked", false),
			$("<input>", {type: "checkbox", name: "color", value: "blue"}).prop("checked", true),
			$("<textarea>", {name: "message"}).val("Hello, world !")
		]
		.forEach(function(el){
			el.appendTo(form);
		});

		form.submitAsync({
			beforeSend: function(xhr, o){
				res = $.parseQuery(o.data);
				done();
			}
		});
	});

	it("Send form async", function(){
		$.each(data, function(key, value){
			expect(value).toEqual(res[key]);
		});

	});

});

describe("$.fn.transition", function(){

	var stack = [];
	var div = $("<div>").css({
		left: 0,
		top: 0,
		width: 100,
		height: 100,
		backgroundColor: "red",
		position: "absolute",
		visibility: "hidden"
	});

	beforeEach(function(done){

		$(function(){
			$.series(
				function(){
					div.prependTo("body");
					return 1;
				},
				function(){
					div.transition({
						top: 100
					}, {
						done: function(){
							stack.push(div.offset().top === 100);
							done();
						}
					});
					return 100;
				},
				function(){
					var top = div.offset().top;
					stack.push(top > 0 && top < 100);
				}
			);

		});

	});

	it("Animate by css transition", function(){
		expect(stack).toEqual([true, true]);
	});

});
