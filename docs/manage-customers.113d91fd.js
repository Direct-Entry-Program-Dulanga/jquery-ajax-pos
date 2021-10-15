parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"XDxO":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Customer=void 0;var e=function(){return function(e,t,s){this.id=e,this.name=t,this.address=s}}();exports.Customer=e;
},{}],"n6TJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./dto/Customer"),e="https://6c20934f-3597-4e3a-a6b8-bb3340352c7a.mock.pstmn.io",s=e+"/customers",a=6,i=[],r=0,n=1,d=1;function l(){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(t.readyState===t.DONE){if(200!==t.status)return void alert("Failed to fetch customers, try again...!");r=+t.getResponseHeader("X-Total-Count"),i=JSON.parse(t.responseText),$("#tbl-customers tbody tr").remove(),i.forEach(function(t){var e="<tr>\n                 <td>"+t.id+"</td>\n                 <td>"+t.name+"</td>\n                 <td>"+t.address+'</td>\n                 <td><i class="fas fa-trash trash"></i></td>\n                 </tr>';$("#tbl-customers tbody").append(e)}),o()}},t.open("GET",s+"?page="+n+"&size="+a,!0),t.send()}function o(){if(d=Math.ceil(r/a),u(),1!==d){for(var t='<li class="page-item"><a class="page-link" href="#!">«</a></li>',e=0;e<d;e++)t+='<li class="page-item '+(n===e+1?"active":"")+'"><a class="page-link" href="javascript:void(0);">'+(e+1)+"</a></li>";t+='<li class="page-item"><a class="page-link" href="javascript:void(0);">»</a></li>',$("ul.pagination").html(t),1===n?$(".page-item:first-child").addClass("disabled"):n===d&&$(".page-item:last-child").addClass("disabled"),$(".page-item:first-child").on("click",function(){return c(n-1)}),$(".page-item:last-child").on("click",function(){return c(n+1)}),$(".page-item:not(.page-item:first-child, .page-item:last-child)").on("click",function(){c(+$(this).text())})}}function c(t){t<1||t>d||(n=t,l())}function u(){d>1?$(".pagination").show():$(".pagination").hide()}function f(t){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(e.readyState===e.DONE){if(201!==e.status)return console.error(e.responseText),void alert("Failed to save the customer, retry");alert("Customer has been saved successfully"),r++,c(d=Math.ceil(r/a)),$("#txt-id, #txt-name, #txt-address").val(""),$("#txt-id").trigger("focus")}},e.open("POST",s,!0),e.setRequestHeader("Content-Type","application/json"),e.send(JSON.stringify(t))}function m(t){var e=new XMLHttpRequest;e.onreadystatechange=function(){e.readyState===e.DONE&&(204===e.status?(alert("Customer has been updated successfully"),$("#txt-id, #txt-name, #txt-address").val(""),$("#txt-id").trigger("focus"),$("#tbl-customers tbody tr.selected").removeClass("selected"),$("#txt-id").removeAttr("disabled")):alert("Failed to update the customer, retry"))},e.open("PUT",s,!0),e.setRequestHeader("Content-Type","application/json"),e.send(JSON.stringify(t))}function p(t){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(e.readyState===e.DONE){if(204!==e.status)return void alert("Failed to delete customer, try again...!");r--,c(d=Math.ceil(r/a))}},e.open("DELETE",s+"?id="+t,!0),e.send()}l(),$("#btn-save").on("click",function(e){e.preventDefault();var s=$("#txt-id"),a=$("#txt-name"),i=$("#txt-address"),r=s.val().trim(),n=a.val().trim(),d=i.val().trim(),l=!0;if($("#txt-id, #txt-name, #txt-address").removeClass("is-invalid"),d.length<3&&(i.addClass("is-invalid"),i.trigger("select"),l=!1),/^[A-Za-z ]+$/.test(n)||(a.addClass("is-invalid"),a.trigger("select"),l=!1),/^C\d{3}$/.test(r)||(s.addClass("is-invalid"),s.trigger("select"),l=!1),l)if(s.attr("disabled")){$("#tbl-customers tbody tr.selected");m(new t.Customer(r,n,d))}else f(new t.Customer(r,n,d))}),$("#tbl-customers tbody").on("click","tr",function(){var t=$(this).find("td:first-child").text(),e=$(this).find("td:nth-child(2)").text(),s=$(this).find("td:nth-child(3)").text();$("#txt-id").val(t).attr("disabled","true"),$("#txt-name").val(e),$("#txt-address").val(s),$("#tbl-customers tbody tr").removeClass("selected"),$(this).addClass("selected")}),$("#tbl-customers tbody").on("click",".trash",function(t){confirm("Are you sure to delete?")&&p($(t.target).parents("tr").find("td:first-child").text())}),$("#btn-clear").on("click",function(){$("#tbl-customers tbody tr.selected").removeClass("selected"),$("#txt-id").removeAttr("disabled").trigger("focus")});
},{"./dto/Customer":"XDxO"}]},{},["n6TJ"], null)
//# sourceMappingURL=/pos-app/manage-customers.113d91fd.js.map