'use strict';

angular.module('ng311')

.constant('ENV', {name:'production',owner:'DAWASCO',title:'SmartDawasco',version:'v0.1.0',description:'Citizen Feedback System',apiEndPoint:{mobile:'https://dawasco.herokuapp.com',web:'https://dawasco.herokuapp.com'},settings:{name:'open311',email:'example@example.com',phone:'(000) 000 000 000',currency:'USD',dateFormat:'dd/MM/yyyy',timeFormat:'hh:mm:ss',defaultPassword:'guest'}})

;