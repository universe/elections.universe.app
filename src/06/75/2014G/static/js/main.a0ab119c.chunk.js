(this["webpackJsonpelections.universe.app"]=this["webpackJsonpelections.universe.app"]||[]).push([[0],{12:function(e,t,a){e.exports=a.p+"static/media/universe.4705ec55.svg"},15:function(e,t,a){e.exports=a(24)},21:function(e,t,a){},22:function(e,t,a){},23:function(e,t,a){},24:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),c=a(8),i=a.n(c),r=a(4),o=a(1),s=a(6),u=a.n(s),d=a(9),m=a(2),p=a(10),f=a(11),v=a(14),h=a(13),b={lat:37.765,lng:-122.4};function E(e){return"hsl("+240*e+", 100%, 50%)"}var g=new Set,y=function(e){Object(v.a)(a,e);var t=Object(h.a)(a);function a(){var e;Object(p.a)(this,a);for(var n=arguments.length,l=new Array(n),c=0;c<n;c++)l[c]=arguments[c];return(e=t.call.apply(t,[this].concat(l))).cache=null,e.state={map:null},e}return Object(f.a)(a,[{key:"componentDidMount",value:function(){window.initMap=this.initMap.bind(this);var e=document.createElement("script");e.async=!0,e.defer=!0,e.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAq_fAHf_uUBs9gXCAseIZVZl2shvHwGD0&callback=initMap",document.head.appendChild(e)}},{key:"initMap",value:function(){var e=this,t=new window.google.maps.Map(document.getElementById("map"),{center:b,zoom:13,disableDefaultUI:!0,clickableIcons:!1});t.data.loadGeoJson("https://cdn.universe.app/geojson/usa/06/75/precincts_2012.geojson"),t.data.setStyle({fillColor:"red",strokeOpacity:1,strokeWeight:2}),"ontouchstart"in document.documentElement||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?t.data.addListener("click",(function(t){var a=e.props,n=(a.mapType,a.HEAT,a.selectedCandidates,a.precinctMeta,a.contestData,a.setPrecinctStats),l=t.feature.getProperty("prec_2012");g.has(l)||0===g.size?n(null):n(e.props.precinct&&l===e.props.precinct?null:l)})):(t.data.addListener("mouseover",(function(t){var a=e.props,n=(a.mapType,a.HEAT),l=(a.selectedCandidates,a.precinctMeta,a.contestData,a.setPrecinctStats),c=t.feature.getProperty("prec_2012");!g.has(c)&&n[c]&&n[c][0]?l(c):l(null)})),t.data.addListener("mouseout",(function(t){(0,e.props.setPrecinctStats)(null)})));var a=this.props,n=a.mapType,l=a.values,c=a.HEAT,i=Math.min.apply(Math,Object(o.a)(l))||0,r=Math.max.apply(Math,Object(o.a)(l))||1;t.data.setStyle((function(e){var t=e.getProperty("prec_2012");return"TURNOUT"===n?{fillColor:c[t]&&c[t][0]?E((c[t][0]-0)/1):"black",clickable:!0}:"WINLOSE"===n?{fillColor:c[t]&&c[t][0]?E(c[t][3]?1:0):"black",clickable:!0}:{fillColor:c[t]&&c[t][0]?E((c[t][0]-i)/(r-i)):"black",clickable:!0}})),this.setState({map:t})}},{key:"render",value:function(){var e=this.state.map,t=this.props,a=t.mapType,n=t.values,c=t.HEAT,i=(t.precinct,t.selectedCandidates),r=JSON.stringify({HEAT:c,mapType:a,selectedCandidates:i});if(this.cache!==r){this.cache=r;var s=Math.min.apply(Math,Object(o.a)(n.filter(Boolean))),u=Math.max.apply(Math,Object(o.a)(n.filter(Boolean)));g.clear(),e&&e.data.setStyle((function(e){var t=e.getProperty("prec_2012");return c[t]&&c[t][0]||g.add(t),"TURNOUT"===a?{fillColor:c[t]&&c[t][0]?E((c[t][0]-0)/1):"black",clickable:!0}:"WINLOSE"===a?{fillColor:c[t]&&c[t][0]?E(c[t][3]?1:0):"black",clickable:!0}:"HOTSPOT"===a&&c[t]&&c[t][0]&&isNaN((c[t][0]-s)/(u-s))?{fillColor:c[t]&&c[t][0]?E(1):"black",clickable:!0}:{fillColor:c[t]&&c[t][0]?E((c[t][0]-s)/(u-s)):"black",clickable:!0}}))}return l.a.createElement("div",{id:"map"})}}]),a}(n.Component),O=(a(21),[{value:"WINLOSE",copy:"Win / Lose",id:"map-type-winlose"},{value:"SUPPORT",copy:"Support",id:"map-type-support"},{value:"HOTSPOT",copy:"Hotspot",id:"map-type-hotspot"}]),S=[{name:"AD 17",value:"AD17"},{name:"AD 19",value:"AD19"}],_=[{name:"District 1",value:"SD1"},{name:"District 2",value:"SD2"},{name:"District 3",value:"SD3"},{name:"District 4",value:"SD4"},{name:"District 5",value:"SD5"},{name:"District 6",value:"SD6"},{name:"District 7",value:"SD7"},{name:"District 8",value:"SD8"},{name:"District 9",value:"SD9"},{name:"District 10",value:"SD10"},{name:"District 11",value:"SD11"}],T={dem:"Democratic",rep:"Republican",npp:"No Party Preference",ai:"American Independent",pf:"Peace and Freedom",lib:"Libertarian",grn:"Green",misc:"Other"};a(22);function N(e){return l.a.createElement("div",{className:"checkbox"},l.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",version:"1.1",style:{position:"fixed",top:0,left:0,width:0,height:0}},l.a.createElement("defs",null,l.a.createElement("filter",{id:"goo"},l.a.createElement("feGaussianBlur",{in:"SourceGraphic",stdDeviation:"4",result:"blur"}),l.a.createElement("feColorMatrix",{in:"blur",mode:"matrix",values:"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7",result:"goo"}),l.a.createElement("feBlend",{in:"SourceGraphic",in2:"goo"})))),l.a.createElement("input",{className:"checkbox__input ".concat(e.disabled?"disabled":"","}"),type:"checkbox",checked:e.checked,onChange:function(){e.disabled||e.onChange(!e.checked)}}),l.a.createElement("label",{className:"checkbox__label"},e.children),l.a.createElement("svg",{className:"checkbox__check",width:"15",height:"14",viewBox:"0 0 15 14",fill:"none"},l.a.createElement("path",{d:"M2 8.36364L6.23077 12L13 2"})))}a(23);var D=function(e){var t=e.showSocialBar,a=Object(n.useState)(!1),c=Object(m.a)(a,2),i=c[0],r=c[1],o="email-form"+(i?" submitted":"");return l.a.createElement("section",{id:"social-bar",className:"".concat(t?"open":""," social-bar")},l.a.createElement("label",{className:"map__filter-label map__social-label",htmlFor:"email-input"},l.a.createElement("span",{className:"sectionTitle"},"Stay up to date on local elections:"),l.a.createElement("a",{href:"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Felections.universe.app%2F06%2F75%2F2020P",id:"fb-share",className:"fb-btn"},"Share"),l.a.createElement("a",{href:"https://twitter.com/intent/tweet?hashtags=universeapp&related=universeapp&text=Local%20politics%20matter&url=https%3A%2F%2Felections.universe.app%2F06%2F75%2F2020P",id:"twtr-share",className:"twtr-btn"},"Tweet")),l.a.createElement("form",{onSubmit:function(e){e.preventDefault();var t=e.target,a=Object.fromEntries(new FormData(t).entries()),n=new Headers;n.append("Content-Type","application/json"),window.fetch(t.action,{method:t.method,headers:n,body:JSON.stringify(a)}),r(!0)},className:o,id:"email-form",target:"_blank",method:"POST",action:"https://api.universe.app/v1/email/subscribe"},l.a.createElement("label",{className:"email-form__success"},"Thanks for subscribing!"),l.a.createElement("input",{type:"text",placeholder:"First Name",name:"FNAME",className:"email-form__name-input"}),l.a.createElement("input",{type:"text",placeholder:"Last Name",name:"LNAME",className:"email-form__name-input"}),l.a.createElement("input",{type:"email",placeholder:"Email",name:"EMAIL",id:"email-input",className:"email-form__input"}),l.a.createElement("button",{type:"submit",className:"email-form__submit",form:"email-form"}," Submit"),l.a.createElement("input",{type:"hidden",name:"u",value:"6b56ce91de42db2930dd99758"}),l.a.createElement("input",{type:"hidden",name:"id",value:"74b5983973"}),l.a.createElement("input",{type:"hidden",name:"redirect",value:"https://elections.universe.app/06/75/2020P"}),l.a.createElement("input",{type:"hidden",name:"TAGS",value:"06_75_2020P"})))};var j=function(e){var t=e.value,a=e.state,n=e.stateSetter,c=e.name,i="toggleButton"+(a.includes(t)?" toggleButton__open":"");return l.a.createElement("div",{className:i,onClick:function(){return function(e,t,a){a(t.includes(e)?t.filter((function(t){return t!==e})):[].concat(Object(o.a)(t),[e]))}(t,a,n)}},c)},k=!1,w=function(e){var t=e.contests,a=e.neighborhoods,c=e.mapType,i=e.setMapType,r=e.assemblyDistricts,o=e.setAssemblyDistricts,s=e.supervisorDistricts,u=e.setSupervisorDistricts,d=e.selectedNeighborhoods,p=e.setSelectedNeighborhoods,f=e.selectedContest,v=e.setSelectedContest,h=e.candidateTotals,b=e.selectedCandidates,E=e.setSelectedCandidates,g=(e.registration,e.totalVotes,e.precinctStats),y=e.setFilterType,w=e.filterType,A=e.activeRunoff,C=e.setActiveRunoff,M=e.numRunoffs,P=e.numSeats,I=e.children,x=Object(n.useState)(!1),F=Object(m.a)(x,2),L=F[0],U=F[1],H=Object(n.useState)("candidates"),R=Object(m.a)(H,2),B=R[0],V=R[1];function W(e){var t=document.getElementById("tab-panel");t&&t.scrollTo({left:e*t.scrollWidth,behavior:"smooth"})}var G=function(e){var t=e.target;y(t.value),E([])},J=function(e){var t=e.target;i(t.value),L||U(!L)},z=function(e){if(-1===b.indexOf(e))E("HEADTOHEAD"===w?[b.pop(),e]:[e]);else{var t=b.filter((function(t){return t!==e}));E(t)}},q=Object.keys(h||{}).sort((function(e,t){return h[e]>h[t]?-1:1})),Z=h.TOTAL;return l.a.createElement("div",{className:"panelContainer"},l.a.createElement("h1",{id:"touchPad"},g||"Nov 3rd 2020 San Francisco Primary"),l.a.createElement("div",{className:"panelContent"},I,l.a.createElement(D,{showSocialBar:L}),l.a.createElement("label",{className:"map__filter-label map__filter-label--race",htmlFor:"campaign-dropdown"},"Race:"),l.a.createElement("select",{value:f,onChange:function(e){v(e.currentTarget.value)},id:"campaign-dropdown"},t.map((function(e,t){return l.a.createElement("option",{key:t,value:t},e)}))),l.a.createElement("label",{className:"map__filter-label map__filter-label--map-type",htmlFor:"map-type"},"Map Type:"),l.a.createElement("div",{id:"map-type",className:"toggle"},O.map((function(e,t){var a=e.value,i=e.copy,r=e.id,o="";return 0===t?o="toggle__label-first":t===O.length-1&&(o="toggle__label-last"),l.a.createElement(n.Fragment,{key:a},l.a.createElement("input",{onChange:J,checked:a===c,type:"radio",value:a,id:r,name:"map-type"}),l.a.createElement("label",{className:o,htmlFor:r},i))}))),function(e){return"SUPPORT"===e||"WINLOSE"===e}(c)&&l.a.createElement("div",{id:"filter-type",className:"toggle filter__sub-type"},l.a.createElement("input",{onChange:G,checked:"INDIVIDUAL"===w,type:"radio",value:"INDIVIDUAL",id:"filter-type-individual",name:"filter-type"}),l.a.createElement("label",{className:"toggle__label-first",htmlFor:"filter-type-individual"},"Individual",l.a.createElement("span",null,"Pick One")),l.a.createElement("input",{onChange:G,checked:"HEADTOHEAD"===w,type:"radio",value:"HEADTOHEAD",id:"filter-type-head-to-head",name:"filter-type"}),l.a.createElement("label",{className:"toggle__label-last",htmlFor:"filter-type-head-to-head"},"Head to Head",l.a.createElement("span",null,"Pick Two to Compare"))),M?l.a.createElement("div",{id:"filter-type",className:"toggle"},l.a.createElement("div",{className:"filter__runoff-label"},"Runoff:"),new Array(M).fill(1).map((function(e,t,a){return l.a.createElement(n.Fragment,{key:t},l.a.createElement("input",{onChange:function(){return C(t)},checked:A===t,type:"radio",value:t,id:"filter-runoff-".concat(t),name:"filter-runoff"}),l.a.createElement("label",{className:"toggle__label",htmlFor:"filter-runoff-".concat(t)},t+1===a.length?"Final":t+1))}))):void 0,l.a.createElement("ul",{className:"tabset"},l.a.createElement("li",null,l.a.createElement("button",{className:"tab ".concat("candidates"===B?"tab--active":""),onClick:function(e){return W(0)}},"Candidates")),l.a.createElement("li",null,l.a.createElement("button",{className:"tab ".concat("turfs"===B?"tab--active":""),onClick:function(e){return W(100)}},"Turfs"))),l.a.createElement("section",{className:"tabs",onScroll:function(e){var t=e.target;if(!k){k=window.setTimeout((function(){return k=!1}),50);var a=t.children.length,n=t.scrollWidth/a,l=t.scrollLeft/n,c=t.scrollLeft-Math.floor(l)*n<n/2,i=Math.max(0,Math.min(a-1,c?Math.floor(l):Math.ceil(l)));V(i?"turfs":"candidates")}},id:"tab-panel"},l.a.createElement("div",null,l.a.createElement("table",{className:"map__candidates"},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null),l.a.createElement("th",null,"Place"),l.a.createElement("th",{id:"table-name"},"TURNOUT"===c?"Party":"Candidate"),l.a.createElement("th",null,"Votes"),l.a.createElement("th",null,"Percent"))),l.a.createElement("tbody",{id:"election-results"},q.map((function(e,t){if("TOTAL"===e||1===e.length)return null;var a=(h[e]||0)/(Z||0)*100,n=h[e];return l.a.createElement("tr",{key:t,className:"".concat(t===P?"final-seat":""," "," "),onClick:function(){return z(e)}},l.a.createElement("td",null,l.a.createElement(N,{checked:b.indexOf(e)>-1,onChange:function(){return z(e)}})),l.a.createElement("td",null,t),l.a.createElement("td",{id:"table-name"},T[e]||e),l.a.createElement("td",null,n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")),l.a.createElement("td",null,(isNaN(a)?"0":a.toFixed(2))+"%"))}))))),l.a.createElement("div",null,l.a.createElement("label",{className:"map__filter-label",htmlFor:"campaign-dropdown"},"Assembly District"),l.a.createElement("div",{className:"wrap"},S.map((function(e){return l.a.createElement(j,{state:r,stateSetter:o,value:e.value,name:e.name,key:e.name})}))),l.a.createElement("label",{className:"map__filter-label",htmlFor:"campaign-dropdown"},"Supervisor District"),l.a.createElement("div",{className:"wrap"},_.map((function(e){return l.a.createElement(j,{state:s,stateSetter:u,name:e.name,value:e.value,key:e.name})}))),l.a.createElement("label",{className:"map__filter-label",htmlFor:"campaign-dropdown"},"Neighborhoods"),l.a.createElement("div",{className:"wrap"},Array.from(a).map((function(e){return l.a.createElement(j,{state:d,stateSetter:p,value:e,name:e,key:e})})))))))},A=a(12),C=a.n(A);var M="November 3rd 2020 San Francisco";function P(e){return((e.exec(window.location.search)||[])[1]||"").split(",").map(decodeURIComponent).filter(Boolean)}function I(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}var x=function(){for(var e,t,a,c,i=Object(n.useState)({}),s=Object(m.a)(i,2),p=s[0],f=s[1],v=Object(n.useState)({}),h=Object(m.a)(v,2),b=h[0],E=h[1],g=Object.keys(p||{}).slice(1),O=Object(n.useState)(!0),S=Object(m.a)(O,2),_=S[0],T=S[1],N=new Set,D=0,j=Object.values(b||{});D<j.length;D++){var k=j[D];N.add(k.doeNeighborhood)}Object(n.useEffect)((function(){Object(d.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=f,e.next=3,fetch("./data.json?q=".concat(Math.floor(1e7*Math.random())));case 3:return e.next=5,e.sent.json();case 5:return e.t1=e.sent,(0,e.t0)(e.t1),e.t2=E,e.next=10,fetch("./precincts.json");case 10:return e.next=12,e.sent.json();case 12:e.t3=e.sent,(0,e.t2)(e.t3),T(!1);case 15:case"end":return e.stop()}}),e)})))()}),[]);var A=Object(n.useState)(parseInt(P(/e=(\d+)/gi)[0])),x=Object(m.a)(A,2),F=x[0],L=x[1],U=Object(n.useState)(function(e){var t;return"SUPPORT"!==(e=null===(t=e)||void 0===t?void 0:t.toUpperCase())&&"HOTSPOT"!==e&&"WINLOSE"!==e&&"TURNOUT"!==e?"SUPPORT":e}(P(/t=([^&]+)/gi)[0])),H=Object(m.a)(U,2),R=H[0],B=H[1],V=Object(n.useState)((/f=([^&]+)/gi.exec(window.location.search)||[])[0]||"INDIVIDUAL"),W=Object(m.a)(V,2),G=W[0],J=W[1],z=Object(n.useState)(P(/a=([^&]+)/gi)),q=Object(m.a)(z,2),Z=q[0],X=q[1],$=Object(n.useState)(P(/s=([^&]+)/gi)),K=Object(m.a)($,2),Q=K[0],Y=K[1],ee=Object(n.useState)(P(/n=([^&]+)/gi)),te=Object(m.a)(ee,2),ae=te[0],ne=te[1],le=Object(n.useState)(null),ce=Object(m.a)(le,2),ie=ce[0],re=ce[1],oe=Object(n.useState)(0),se=Object(m.a)(oe,2),ue=se[0],de=se[1],me=Object(n.useState)(P(/c=([^&]+)/gi)),pe=Object(m.a)(me,2),fe=pe[0],ve=pe[1],he=g[F];Object(n.useEffect)((function(){p&&!_&&(he?de(Math.max(0,(p[he].__META__.ranks||0)-1)):L(0))}),[_,p,he]);var be={},Ee=[],ge={},ye=(null===p||void 0===p?void 0:p[he])||{},Oe={},Se={},_e=new Set,Te=0,Ne=0,De=fe;if(p&&b){ie&&(ye[ie]=ye[ie]||{turnout:{},0:{}});for(var je=0,ke=Object(o.a)(new Set([].concat(Object(o.a)(Object.keys(ye)),Object(o.a)(Object.keys(b)))));je<ke.length;je++){var we,Ae,Ce,Me,Pe,Ie,xe=ke[je];if("__META__"!==xe&&((!ie||xe===ie)&&(ye[xe]=ye[xe]||{turnout:{},0:{}},!(ae.length>0)||ae.includes(null===b||void 0===b||null===(we=b[xe])||void 0===we?void 0:we.doeNeighborhood)))){if(Z.length>0){if(!Z.includes("AD17")&&"7"===xe[0]||"1"===xe[0]&&parseInt(xe[2])>=4)continue;if(!Z.includes("AD19")&&"9"===xe[0]||"1"===xe[0]&&parseInt(xe[2])<4)continue}if(Q.length>0){if(!Q.includes("SD1")&&"1"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD2")&&"2"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD3")&&"3"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD4")&&"4"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD5")&&"5"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD6")&&"6"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD7")&&"7"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD8")&&"8"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD9")&&"9"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD10")&&"0"===xe[1]&&"1"!==xe[0])continue;if(!Q.includes("SD11")&&"1"===xe[0])continue}var Fe,Le=ye[xe],Ue=Se[xe]={},He=(null===Le||void 0===Le||null===(Ae=Le.turnout)||void 0===Ae?void 0:Ae.all)||0,Re=b[xe]&&(null===(Ce=b[xe])||void 0===Ce?void 0:Ce.registration[(null===ye||void 0===ye||null===(Me=ye.__META__)||void 0===Me?void 0:Me.party)||"all"]);if("all"!==(null===ye||void 0===ye||null===(Pe=ye.__META__)||void 0===Pe?void 0:Pe.party))Re+=(null===(Fe=b[xe])||void 0===Fe?void 0:Fe.registration.npp)||0;var Be,Ve=Object(r.a)((null===ye||void 0===ye||null===(Ie=ye.__META__)||void 0===Ie?void 0:Ie.candidates)||[]);try{for(Ve.s();!(Be=Ve.n()).done;){var We=Be.value;Le[ue]=Le[ue]||{},Le[ue][We]=Le[ue][We]||0}}catch(kt){Ve.e(kt)}finally{Ve.f()}if("INDIVIDUAL"===G&&(Ne+=He,Te+=Re||0),"TURNOUT"===R){be.TOTAL=(be.TOTAL||0)+(Re||0);for(var Ge=0,Je=Object.keys((null===Le||void 0===Le?void 0:Le.turnout)||{});Ge<Je.length;Ge++){var ze,qe,Ze,Xe=Je[Ge];"all"!==Xe&&(_e.add(Xe),Ue[Xe]=((null===Le||void 0===Le?void 0:Le.turnout[Xe])||0)/((null===(ze=b[xe])||void 0===ze||null===(qe=ze.registration)||void 0===qe?void 0:qe[Xe])||1),be[Xe]=(be[Xe]||0)+(Le.turnout[Xe]||0),Oe[Xe]=(Oe[Xe]||0)+((null===(Ze=b[xe])||void 0===Ze?void 0:Ze.registration[Xe])||0),Ee.push(Ue[Xe]))}}else{be.TOTAL=(be.TOTAL||0)+(He||0);for(var $e=0,Ke=Object.keys(Le[ue]||{});$e<Ke.length;$e++){var Qe=Ke[$e];"TOTAL"!==Qe&&"turnout"!==Qe&&("INDIVIDUAL"!==G&&-1!==De.indexOf(Qe)&&(Ne+=Le[ue][Qe]||0,Te+=Le[ue][Qe]||0),_e.add(Qe),be[Qe]=(be[Qe]||0)+(Le[ue][Qe]||0),Ue[Qe]=Le[ue][Qe]/He,"HOTSPOT"!==R&&Ee.push(Ue[Qe]))}}}}if(De=fe.length&&_e.has(fe[0])?fe:[Object(o.a)(_e).sort((function(e,t){return be[e]>be[t]?-1:1}))[0]].filter(Boolean),!_){var Ye,et,tt;!fe.length&&De[0]&&ve([De[0]]),"SUPPORT"!==R&&"WINLOSE"!==R&&"HEADTOHEAD"===G?(J("INDIVIDUAL"),ve([fe[0]])):"TURNOUT"!==R&&he&&fe.length&&-1===(null===(Ye=p[he])||void 0===Ye||null===(et=Ye.__META__)||void 0===et||null===(tt=et.candidates)||void 0===tt?void 0:tt.indexOf(fe[0]))&&ve([]);var at=g.indexOf(he)?"e=".concat(g.indexOf(he)):"",nt=fe.length>0&&Object.getOwnPropertyNames(be).indexOf(fe[0])>-1?"c=".concat(Object(o.a)(De).join(",")):"",lt=Q.length?"s=".concat(Object(o.a)(Q).join(",")):"",ct=Z.length?"a=".concat(Object(o.a)(Z).join(",")):"",it=ae.length?"n=".concat(Object(o.a)(ae).join(",")):"",rt=["SUPPORT"===R?null:"t=".concat(R),"INDIVIDUAL"===G?null:"f=".concat(G),at,nt,lt,ct,it].filter(Boolean).join("&"),ot="".concat(window.location.pathname).concat(rt?"?":"").concat(rt);window.history.replaceState({},"",ot)}for(var st=0,ut=Object.keys(ye);st<ut.length;st++){var dt,mt=ut[st],pt=Object(r.a)(De);try{for(pt.s();!(dt=pt.n()).done;){var ft=dt.value;if("__META__"!==mt){var vt=Se[mt];if(vt){var ht=Object.values(vt).filter((function(e){return"number"===typeof e&&!isNaN(e)})).filter(Boolean),bt=new Set(ht.sort().slice(-1*ye.__META__.seats));ge[mt]=[vt[ft],Math.min.apply(Math,Object(o.a)(ht)),Math.max.apply(Math,Object(o.a)(ht)),bt.has(vt[ft])],!isNaN(vt[ft])&&Ee.push(vt[ft])}}}}catch(kt){pt.e(kt)}finally{pt.f()}}}var Et="".concat(I(Ne),"/").concat(I(Te)," (").concat((Ne/(Te||1)*100).toFixed(2),"%) turnout");if(ie&&(Et="PCT ".concat(ie,": ").concat(Et)),ie&&ye[ie]&&ge&&ge[ie])if("TURNOUT"===R){var gt,yt=Object(r.a)(fe);try{for(yt.s();!(gt=yt.n()).done;){var Ot=gt.value;console.log(ye[ie].turnout,b[ie].registration,Ot),Et="PCT ".concat(ie,": ").concat(ye[ie].turnout[Ot]||0,"/").concat(b[ie].registration[Ot]||0," (").concat((100*(ge[ie][0]||0)).toFixed(2)+"%",")")}}catch(kt){yt.e(kt)}finally{yt.f()}}else if("INDIVIDUAL"!==G){var St,_t=Object(r.a)(fe);try{for(_t.s();!(St=_t.n()).done;){var Tt=St.value;ye[ie][ue][Tt]}}catch(kt){_t.e(kt)}finally{_t.f()}Et="PCT ".concat(ie,": ").concat(ye[ie][ue][fe[0]]||0," vs ").concat(ye[ie][ue][fe[1]]||0)}else{var Nt,Dt=Object(r.a)(fe);try{for(Dt.s();!(Nt=Dt.n()).done;){var jt=Nt.value;Et="PCT ".concat(ie,": ").concat(ye[ie][ue][jt]||0,"/").concat(b[ie].registration.all||0," (").concat((100*(ge[ie][0]||0)).toFixed(2)+"%",")")}}catch(kt){Dt.e(kt)}finally{Dt.f()}}return l.a.createElement("div",{id:"main"},l.a.createElement("h1",{className:"title"},M),l.a.createElement("a",{href:"https://universe.app"},l.a.createElement("img",{src:C.a,alt:"Universe Logo",className:"logo"})),l.a.createElement(y,{selectedCandidates:De,contestData:ye,mapType:R,HEAT:ge,precinctMeta:b,values:Ee,setPrecinctStats:re,precinct:ie}),l.a.createElement("div",{className:"padding"}),l.a.createElement(w,{contests:g,neighborhoods:N,mapType:R,setMapType:B,assemblyDistricts:Z,setAssemblyDistricts:X,supervisorDistricts:Q,setSupervisorDistricts:Y,selectedNeighborhoods:ae,setSelectedNeighborhoods:ne,selectedContest:F,setSelectedContest:L,candidateTotals:be,selectedCandidates:De,setSelectedCandidates:ve,registration:Te,totalVotes:Ne,precinctStats:Et,filterType:G,setFilterType:J,numSeats:he&&(null===(e=p[he])||void 0===e||null===(t=e.__META__)||void 0===t?void 0:t.seats)||1,numRunoffs:he&&(null===(a=p[he])||void 0===a||null===(c=a.__META__)||void 0===c?void 0:c.ranks)||0,activeRunoff:ue,setActiveRunoff:de},l.a.createElement("h1",{className:"title"},M)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(x,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[15,1,2]]]);
//# sourceMappingURL=main.a0ab119c.chunk.js.map