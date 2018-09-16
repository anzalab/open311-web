'use strict';

angular.module('ng311')

.constant('ENV', {name:'development',owner:'DAWASCO',author:'DAWASCO',title:'DAWASCO',version:'v0.1.0',description:'Citizen Feedback System',apiEndPoint:{web:'http://127.0.0.1:3000',mobile:'http://127.0.0.1:3000'},socketEndPoint:{web:'',mobile:''},socketEnable:false,settings:{locale:'sw',name:'DAWASCO',email:'lallyelias87@gmail.com',phone:'(000) 000 000 000',currency:'USD',dateFormat:'dd/MM/yyyy',timeFormat:'hh:mm:ss',defaultPassword:'guest',abbreviations:{thousand:'K',million:'M',billion:'B',trillion:'T'}}})

;