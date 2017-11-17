'use strict';

angular.module('ng311')

.constant('ENV', {name:'production',owner:'DAWASCO',title:'SmartDawasco',version:'v0.1.0',description:'Citizen Feedback System',apiEndPoint:{mobile:'',web:''},socketEndPoint:{mobile:'',web:''},socketEnable:false,settings:{locale:'sw',name:'open311',email:'example@example.com',phone:'(000) 000 000 000',currency:'USD',dateFormat:'dd/MM/yyyy',timeFormat:'hh:mm:ss',defaultPassword:'guest',abbreviations:{thousand:'K',million:'M',billion:'B',trillion:'T'}}})

;