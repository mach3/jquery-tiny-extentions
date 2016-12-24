
# 細かすぎて伝わらないjQuery拡張集

[細かすぎて伝わらないjQuery拡張 \(1\) \- Advent Calendar 2016 \- Mach3\.laBlog](http://blog.mach3.jp/2016/12/01/ac2016-01.html)

***

## Index

### [$.chainCase(str) :String](http://blog.mach3.jp/2016/12/02/ac2016-02)

キャメルケースの文字列をチェインケース・スネークケースに変換する  
jQuery依存度 : 無

### [$.classify(obj) :Function](http://blog.mach3.jp/2016/12/03/ac2016-03)

クラスライクな関数を生成する  
jQuery依存度 : 中

### [$.configify(obj) :Object](http://blog.mach3.jp/2016/12/04/ac2016-04)

オブジェクトに options を設定・変更する config() メソッドを実装する  
jQuery依存度 : 中

### [$.dig(path, obj) :Any](http://blog.mach3.jp/2016/12/05/ac2016-05)

ドットシンタックスの文字列を渡すとそのオブジェクトを掘り起こして返す  
jQuery依存度 : 無

### [$.escapeHTML(str) :String](http://blog.mach3.jp/2016/12/06/ac2016-06)

HTML文字列をエスケープする  
jQuery依存度 : 無

### [$.eventify(obj) :Object](http://blog.mach3.jp/2016/12/07/ac2016-07)

オブジェクトにイベント管理のメソッド（on, off, trigger）を実装する  
jQuery依存度 : 低-中

### [$.attributify(obj) :Object](http://blog.mach3.jp/2016/12/08/ac2016-08)

オブジェクトに属性管理のメソッド .attr() を実装する  
jQuery依存度 : 低

### [$.format(template, str, str...) :String](http://blog.mach3.jp/2016/12/09/ac2016-09)

"%s%d" 形式のフォーマットに則って整形された文字列を返す  
jQuery依存度 : 無

### [$.formatNumber(num) :String](http://blog.mach3.jp/2016/12/10/ac2016-10)

数値を三桁ずつカンマで区切った文字列で返す  
jQuery依存度 : 無

### [$.observe(callback) :Deferred](http://blog.mach3.jp/2016/12/11/ac2016-11)

コールバック関数を渡してその返り値を監視する  
jQuery依存度 : 無

### [$.parseQuery(str, asArray) :String](http://blog.mach3.jp/2016/12/12/ac2016-12)

URLのサーチ文字列（"?key=value&key2=value2" ）をパースする  
jQuery依存度 : 低

### [$.parseURL(str) :Object](http://blog.mach3.jp/2016/12/13/ac2016-13)

URL文字列をホスト名やサーチ文字列・ハッシュなどにパースする  
jQuery依存度 : 無

### [$.random(start, end) :Any](http://blog.mach3.jp/2016/12/14/ac2016-14)

範囲の間からランダムな数値を取得したり、リストの中からランダムに値を取得する  
jQuery依存度 : 無

### [$.rebase(obj, pattern) :Object](http://blog.mach3.jp/2016/12/15/ac2016-15)

オブジェクトに属しているメソッドをそのオブジェクトに bind する  
jQuery依存度 : 低

### [$.render(template, data) :String|Function](http://blog.mach3.jp/2016/12/16/ac2016-16)

単機能のテンプレート関数  
jQuery依存度 : 低

### [$.scrollTo(dest, offset, options, selector) :void](http://blog.mach3.jp/2016/12/17/ac2016-17)

ページあるいは要素の中身をアニメーションでスクロールする  
jQuery依存度 : 高

### [$.fn.serializeObject() :Object](http://blog.mach3.jp/2016/12/18/ac2016-18)

フォーム要素をシリアライズして、オブジェクトで返す  
jQuery依存度 : 高

### [$.fn.extract(asArray) :Object|Array](http://blog.mach3.jp/2016/12/19/ac2016-19)

非Form要素の内容をシリアライズする  
jQuery依存度 : 高

### [$.series(callback, callback ...) :Deferred](http://blog.mach3.jp/2016/12/20/ac2016-20)

連鎖的に直列処理を実行する  
jQuery依存度 : 高

### [$.fn.submitAsync(props) :Deferred](http://blog.mach3.jp/2016/12/21/ac2016-21)

Form要素を非同期でsubmitする  
jQuery依存度 : 高

### [$.times(count, callback) :void](http://blog.mach3.jp/2016/12/22/ac2016-22)

n回処理を繰り返す  
jQuery依存度 : 無

### [$.timing.*](http://blog.mach3.jp/2016/12/23/ac2016-23)

User Timing API のラッパー  
jQuery依存度 : 無

### [$.fn.transition(props, options) :jQueryObject](http://blog.mach3.jp/2016/12/23/ac2016-23)

$.fn.animate() のようにCSS Transitionを実現する  
jQuery依存度 : 高
