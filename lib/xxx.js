/**
 * Created by Chenjx on 14-5-26.
 */
(function(window){

    'use strict' ;

    let config = {
        Template : {
            suffix : '\}' ,
            prefix : '@\{'
        }
    } ;


    /***************************************************************************************************************
     *
     *  各类工具对象
     *
     ***************************************************************************************************************
     */

    /**
     * Map类
     * @returns {Map}
     * @constructor
     */
    function Map () {
        this.data = {} ;
        this.count = 0 ;
        if (typeof Map.prototype.get != "function") {
            /**
             * 向map中新增一个键值对
             * @param key
             * @param value
             * @returns {*}         如果key已存在，返回原有的value；如果不存在，返回当前value
             */
            Map.prototype.put = function (key , value) {
                if (typeof key === 'object') throw new Error ('Parameter key must not be a object.') ;
                if (this.contains(key)) {
                    let v = this.data[key] ;
                    this.data[key] = value ;
                    return v ;
                }
                this.data[key] = value ;
                this.count ++ ;
                return value ;
            } ;
            /**
             * 合并另一个map
             * @param map
             * @returns {Map}       返回当前map
             */
            Map.prototype.putAll = function (map) {
                if (map instanceof Map) {
                    if (map.count > 0) {
                        let me = this ;
                        map.each(function(key , value){
                            me.put(key , value) ;
                        }) ;
                    }
                    return this ;
                } else {
                    throw new Error ("Parameter must be instance of Map.");
                }
            } ;
            /**
             * 获取值
             * @param key
             * @returns {*}
             */
            Map.prototype.get = function (key) {
                return this.data[key] ;
            } ;
            /**
             * 删除一个键值对
             * @param key
             * @returns {*}         如果删除的key存在，返回对应的value；否则返回null
             */
            Map.prototype.remove = function (key) {
                if (this.contains(key)) {
                    let v = this.data[key] ;
                    delete this.data[key] ;
                    this.count -- ;
                    return v ;
                }
                return null ;
            } ;
            /**
             * 删除所有数据
             * @type {clear}
             */
            Map.prototype.removeAll = Map.prototype.clear = function() {
                let c = this.count ;
                this.data = {} ;
                this.count = 0 ;
                return c ;
            };
            /**
             * 判断是否包含指定key
             * @type {containsKey}
             */
            Map.prototype.contains = Map.prototype.containsKey = function (key) {
                return this.data.hasOwnProperty(key) ;
            } ;
            /**
             * 判断是否包含指定value
             * @param value
             * @returns {boolean}
             */
            Map.prototype.containsValue = function(value) {
                for (let k in this.data) {
                    if (this.data[k] == value) return true ;
                }
                return false ;
            } ;
            /**
             * 获取所有key的数组
             * @returns {Array}
             */
            Map.prototype.keys = function() {
                let arr = new Array() ;
                for (let k in this.data) {
                    arr.push(k) ;
                }
                return arr ;
            } ;
            /**
             * 获取所有value的数组
             * @returns {Array}
             */
            Map.prototype.values = function() {
                let arr = [] ;
                for (let k in this.data) {
                    if (this.data.hasOwnProperty(k)) {
                        arr.push(this.data[k]) ;
                    }
                }
                return arr ;
            } ;
            /**
             * 获取键值组合的字符串，默认分隔符为&等号为=
             * @param andStr
             * @param eqStr         等号
             * @returns {string}
             */
            Map.prototype.toKvString = Map.prototype.tostring = function (andStr , eqStr) {
                andStr = andStr || '&' ;
                eqStr = eqStr || '=' ;
                let result = "" ;
                for (let s in this.data) {
                    result += s + eqStr + this.data[s] + andStr ;
                }
                if (this.count > 0) {
                    result = result.substring(0 , result.length - 1) ;
                }
                return result ;
            } ;
            /**
             * 遍历所有的key
             * @param callback      遍历的回调函数，获取以下两个值：
             * @param k     key
             * @param i     index
             */
            Map.prototype.eachKeys = function(callback) {
                let i = 0 ;
                for (let k in this.data) {
                    callback.call(k , i++) ;
                }
            } ;
            /**
             * 遍历所有的value
             * @param callback      遍历的回调函数，获取以下两个值：
             * @param v     value
             * @param i     index
             */
            Map.prototype.eachValues = function(callback) {
                let i = 0 ;
                for (let k in this.data) {
                    if (this.data.hasOwnProperty(k)) {
                        callback.call(this.data[k] , i ++) ;
                    }
                }
            } ;
            /**
             * 遍历所有键值对
             * @param callback      遍历的回调函数，获取以下三个值：
             * @param k     key
             * @param v     value
             * @param i     index
             */
            Map.prototype.each = function(callback) {
                let i = 0 ;
                for (let k in this.data) {
                    let v = this.data[k] ;
                    callback.call({key:k,value:v} , k , this.data[k] , i++) ;
                }
            } ;
            Map.prototype.size = function() {
                return this.count ;
            } ;
            Map.prototype.getData = function () {
                return this.data ;
            } ;
            Map.prototype.equals = function (map) {
                if (!map instanceof Map) throw new Error ('parameter error.') ;
                if (this.count === 0 && map.size() === 0) return true ;
                let ad = this.data , bd = map.getData() ;
                for (let a in ad) {
                    if (ad[a] != bd[a]) return false ;
                }
                for (let a in bd) {
                    if (ad[a] != bd[a]) return false ;
                }
                return true ;
            } ;
        }
        return this ;
    }


    function Loop (data) {
        this.data = data ;
        if (typeof Loop.prototype.init != 'function') {
            Loop.prototype.set = function (data) {
                this.data = data ;
                return this ;
            } ;
            Loop.prototype.init = function() {
                if (!this.data instanceof Array) {
                    throw new Error('parameter error .') ;
                }
                return this ;
            };
            Loop.prototype.size = function() {
                return this.data.length ;
            };
            Loop.prototype.reverse = function() {
                this.data.reverse() ;
                return this ;
            };
            Loop.prototype.next = function() {
                let tmp = this.data.shift() ;
                this.data.push(tmp) ;
                return tmp ;
            };
            Loop.prototype.last = function() {
                let tmp = this.data.pop() ;
                this.data.unshift(tmp) ;
                return tmp ;
            };
            Loop.prototype.setStart = function(index) {
                if (!index instanceof Number) {
                    throw new Error('parameter error .') ;
                }
                if (index >= this.data.length) {
                    throw new Error('Value must be less than ' + this.data.length + ' .') ;
                }
                if (index > 0 && this.data.length > 1) {
                    let tmp = this.data.splice(0,index) ;
                    this.data = this.data.concat(tmp);
                }
                return this ;
            };
        }
    }

    /**
     * URL对象，用户参数控制，跳转等操作
     * @param url       url地址，为空时生成当前url的对象
     * @returns {*}
     * @constructor
     */
    function Url (url) {
        this.url = url || window.location ;
        this.map = new Map() ;
        if (typeof Url.prototype.setUrl != 'function') {
            /**
             * 设置url
             * @param url
             */
            Url.prototype.setUrl = function (url) {
                this.clear() ;
                this.url = url ;
                this.init() ;
            } ;
            /**
             * 重写toString方法，将数据以参数形式生成url地址
             * @returns {string}
             */
            Url.prototype.toString = function () {
                let url = this.url , data = [] , _this = this ;
                this.map.each(function (key, val) {
                    if (val instanceof Array) {
                        let _key = key.endsWith('[]') ? key : key + '[]' ;
                        for (let i = 0 ; i < val.length ; i ++) {
                            data.push(_key + '=' + val[i]) ;
                        }
                    } else {
                        data.push(key + '=' + val) ;
                    }
                }) ;
                return url + (data.length === 0 ? '' : '?') + data.join('&')  ;
            } ;
            /**
             * 设置参数
             * @param key
             * @param value
             * @returns {Url}
             */
            Url.prototype.setParam = function (key , value) {
                this.map.put(key , value) ;
                return this ;
            } ;
            /**
             * 设置参数集合
             * @param paramsMap
             * @param isClear       设置参数时，是否清空原有的数据
             * @returns {Url}
             */
            Url.prototype.setParamsMap = function (paramsMap , isClear) {
                if (isClear) this.map.clear() ;
                this.map.putAll(paramsMap) ;
                return this ;
            } ;
            /**
             * 获取参数的值
             * @param key
             * @returns {*}
             */
            Url.prototype.getParamValue = function (key) {
                return this.map.get(key) ;
            } ;
            /**
             * 获取所有参数的map
             * @returns {Map|*}
             */
            Url.prototype.getAllParams = function() {
                return this.map ;
            } ;
            /**
             * 对比参数，判断是否包含与传入参数相等的key，value
             * @param key
             * @param value
             * @returns {boolean}
             */
            Url.prototype.paramEquals  = function (key , value) {
                if (Utils.isEmpty(key)) {
                    return false ;
                }
                let val = this.getParamValue(key) ;
                return val == value ;
            } ;
            /**
             * 清空参数，并且将地址设置为空
             */
            Url.prototype.clear = function() {
                this.map.clear() ;
                this.url = '' ;
            } ;
            /**
             * 跳转至url所包含的路径
             */
            Url.prototype.go = function () {
                window.location.href = this.toString() ;
            } ;
            Url.prototype.replace = function() {
                window.location.replace(this.toString()) ;
            } ;
            Url.prototype.init = function () {
                if (typeof this.url === 'object' && this.url.hasOwnProperty('href')) {
                    this.url = this.url.href ;
                }
                if (this.url.indexOf('?') > 0) {
                    let u = this.url.split('?') ;
                    if (u.length == 1) {
                    } else if (u.length == 2) {
                        this.url = u[0] ;
                        u = u[1].split('&') ;
                        for (let i = 0 ,len = u.length ; i < len ; i ++) {
                            let p = u[i].split('=') ,
                                _key = p[0] , _val = p[1] ;
                            if (p[0].endsWith('[]')) {
                                let _data = this.map.get(_key) || [] ;
                                _data.push(_val) ;
                                this.map.put(_key, _data) ;
                            } else {
                                this.map.put(_key, _val) ;
                            }
                        }
                    } else {
                        throw new Error("Bad URL format.") ;
                    }
                }
                return this ;
            } ;
            Url.prototype.containsKey = function (key) {
                return this.map.contains(key) ;
            } ;
            Url.prototype.containsValue = function (value) {
                return this.map.containsValue(value) ;
            } ;
            Url.prototype.containsAll = function (key , value) {
                return this.map.get(key) === value ;
            } ;
            Url.prototype.getBaseUrl = function () {
                return this.url ;
            } ;
        }
        return this.init();
    }

    /**
     *
     * @param tplStr                    模板内容，如果模板中的key为数字，需加上前缀"tpl_i_"
     * @param data                      数据，可以是js对象，也可以是数组
     * @param rule                      替换规则，用法如下：
     * data:{key1:'val1',key2:'val2'}
     * rule: {key1:{val1:'aaa',val2:'bbb','def':'默认值'}}
     * 输出结果为： key1:'aaa'
     * @param alias                     设置变量别名，用法如下：
     * data : {a:'aa',b:'bb'}
     * alias : {a:'c',b:'d'}
     * 输出结果为：{a:'aa',b:'bb',c:'aa',d:'bb'}
     * 属性需要多个alias时: {a:['b','c']}
     * @returns {SimpleTemplate}
     * @constructor
     */
    function SimpleTemplate (tplStr , data , rule , alias) {
        this.tplStr = tplStr instanceof Array ? tplStr.join('') : tplStr ;
        this.data = data ;
        this.rule = rule ;
        this.alias = alias ;
        this.txtOutLimit = '...' ;
        /**
         * 初始化
         */
        this.init = function () {
            if (alias) {
                if (this.data instanceof Array) {
                    for (let i = 0 , len = this.data.length ; i < len ; i ++) {
                        this.data[i] = _clone(this.data[i] , this.alias) ;
                    }
                } else {
                    this.data = _clone(this.data , this.alias) ;
                }
            }
        } ;
        /**
         * 输出结果
         * @returns {string}
         */
        this.html = function () {
            let result = new Array() , me = this ;
            if (!me.data || !me.tplStr) throw new Error('tplString and data cannot be null.') ;
            if (this.data instanceof Array) {
                for (let i = 0 , len = me.data.length ; i < len ; i ++) {
                    result.push(_render(me.tplStr , me.data[i] , me.rule )) ;
                }
            } else {
                result.push(_render (me.tplStr , me.data , me.rule)) ;
            }
            return result.join('') ;
            function _render (str , data , rule ) {
                if (rule) {
                    for (let key in rule) {
                        let oldVal = data[key] ;
                        let values = rule[key] ;
                        if (values != null && values != undefined) {
                            let rst = values[oldVal] ;
                            if (!rst && values['def']) rst = values['def'] ;
                            rst ?  data[key] = rst : '' ;
                        }
                    }
                }
                let s = str ;
                for (let k in data) {
                    let key = k ;
                    if (/^\d+/.test(k)) {
                        key = 'tpl_i_' + k ;
                    }
                    let rdata = data[k] ,
                        regex = new RegExp ('@{' + key + '}','gm') ;
                    s = s.replace(regex, rdata) ;
                }
                return s ;
            }
        } ;
        /**
         * 更新数据
         * @param data
         * @returns {SimpleTemplate}
         */
        this.update = function (data) {
            this.data = data ;
            this.init() ;
            return this ;
        } ;
        this.init() ;
        return this ;
        function _clone (data , alias) {
            for (let k in alias) {
                if (alias[k] instanceof Array) {
                    for (let i = 0 , len = alias[k].length ; i < len ; i ++) {
                        data[alias[k][i]] = data[k] ;
                    }
                } else {
                    data[alias[k]] = data[k] ;
                }
            }
            return data ;
        }
    }

    /*
    循环：
    @{:for item in items index i}
        @{item.prop1}
        @{item['prop2']}
    @{/:for}

    条件：
    @{:if a=b}
    @{:else}
    @{:elseif b=c}
    @{/:if}

    三元操作：
    @{:value==2?"val1":"val2"}

    rule:
    {prop1:{"key1":"value1","key1":"value1","@":"default value"},prop2:......}

    alias : 
    {prop1:alias1,prop2:[alias2,alias3]
    */
    function Template (tpl , data , rule , alias) {
        this.tpl = tpl instanceof Array ? tpl.join('') : tpl ;
        this.data = data ;
        this.rule = rule ;
        this.alias = alias ;
        this.propMatcher = new RegExp(config.Template.prefix + '[a-zA-Z0-9_\s\'\"=\.\[\]]*?' + config.Template.suffix , 'g');
        this.funcMatcher = new RegExp(config.Template.prefix + ':(?<exp>[a-z]*)[a-zA-Z0-9_\s\'\"=\.\[\]]*?'+config.Template.suffix+'.*?' + config.Template.prefix + ':/\k<exp>' + config.Template.suffix ,'g') ;
        // this.propMatcher = /@\{[a-zA-Z0-9_\s\'\"=\.\[\]]*?\}/g;
        // this.funcMatcher = /@\{:(?<exp>[a-z]*)[a-zA-Z0-9_\s\'\"=\.\[\]]*?\}.*?@\{:/\k<exp>\}/g;
        if (typeof Template.prototype.html !== 'function') {
            Template.prototype.init = function() {
                return this ;
            } ;
            Template.prototype.update = function(data) {

            } ;
            Template.prototype.html = function() {

            } ;
        }
        return this.init() ;
    }

    function ExtraTemplate () {

    }

    /***************************************************************************************************************
     *
     *  工具类
     *
     ***************************************************************************************************************
     */
    let Utils = {
        isUndefined : function(obj) {
            return obj === undefined && typeof obj === 'undefined' ;
        },
        isNull : function(obj) {
            return this.isUndefined(obj) || null === obj ;
        } ,
        isEmpty : function (obj) {
            if (this.isNull(obj)) return true ;
            return obj === '' ;
        }
    }

    /***************************************************************************************************************/
    let xxx = {
        Global : {} ,
        Map : Map ,
        Url : Url ,
        Loop : Loop ,
        STemplate : SimpleTemplate ,
        Template : Template ,
        XTemplate : ExtraTemplate ,
        Utils : Utils
    }

    if ( typeof define === "function" && define.amd ) {
        define('xxx',[] , function(){return xxx ;}) ;
    } else {
        window.xxx = xxx ;
    }

})(window) ;