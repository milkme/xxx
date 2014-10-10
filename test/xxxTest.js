/**
 * Created by Chenjx on 14-5-30.
 */
describe("Map" , function(){

    'use strict';

    var map ,map1;

    beforeEach(function(){
        map = new xxx.Map() ;
        map1 = new xxx.Map() ;
        map1.put('k11' , 'v11') ;
        map1.put('k22' , 'v22') ;
    })

    it('should add one key and value' , function(){
        var o = map.put("k1","v1") ;
        expect(map.size()).toEqual(1) ;
        expect(map.get('k1')).toEqual("v1") ;
        expect(o).toEqual('v1') ;
    }) ;

    it('should return old value' , function(){
        map.put("k1","v1") ;
        var o = map.put('k1','v2') ;
        expect(o).toEqual('v1');
    }) ;

    it('should throw an error' , function(){
        var o = 'ff' ;
        expect(function(){
            map.putAll(o) ;
        }).toThrowError('Parameter must be instance of Map.') ;
    }) ;

    it ('size add 2' , function(){
        var size = map.size() ;
        map.putAll(map1) ;
        expect(map.size()).toEqual(size + map1.size()) ;
    }) ;

}) ;