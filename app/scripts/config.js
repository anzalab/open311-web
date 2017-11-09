'use strict';

angular.module('ng311')

.constant('ENV', {name:'development',owner:'DAWASCO',title:'SmartDawasco',version:'v0.1.0',description:'Citizen Feedback System',apiEndPoint:{web:'http://127.0.0.1:3000',mobile:'http://127.0.0.1:3000'},socketEndPoint:{web:'http://127.0.0.1:3000',mobile:'http://127.0.0.1:3000'},socketEnable:false,settings:{locale:'sw',name:'open311',email:'example@example.com',phone:'(000) 000 000 000',currency:'USD',dateFormat:'dd/MM/yyyy',timeFormat:'hh:mm:ss',defaultPassword:'guest',abbreviations:{thousand:'K',million:'M',billion:'B',trillion:'T'}}})

;