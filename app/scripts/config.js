'use strict';

angular.module('ng311')

.constant('ENV', {name:'development',owner:'DAWASA',author:'DAWASA',title:'DAWASA',version:'v0.1.0',description:'Citizen Feedback System',apiEndPoint:{web:'http://127.0.0.1:5000',mobile:'http://127.0.0.1:5000'},socketEndPoint:{web:'',mobile:''},socketEnable:false,settings:{locale:'sw',name:'DAWASA',email:'lallyelias87@gmail.com',phone:'(000) 000 000 000',currency:'TZS',dateFormat:'dd/MM/yyyy',timeFormat:'hh:mm:ss',defaultPassword:'guest',abbreviations:{thousand:'K',million:'M',billion:'B',trillion:'T'}}})

;