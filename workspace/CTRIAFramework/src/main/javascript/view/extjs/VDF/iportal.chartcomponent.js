/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 

 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */

Ext.namespace("iportal.orgviewcomponent");


iportal.orgviewcomponent.OrgViewConfig=function()
{

//================================ PRIVATE DATA/PROPERTIES ==================================== 


		var		nodeLeftMargin = 4  ; 					//default node left margin  
		var		nodeRightMargin = 4 ; 					//default node right margin 
		var		nodeWidth = 98 ; 						//default node width 
		var		nodeHeight = 53 ; 						//default node height  
		var		interChart = 10 ; 						//default inter chart separation 
		var     interLevel = 60 ; 						//default inter level
		var		interNode = 10 ; 						//default inter Node
		var     chartLeftMargin = 20 ; 					// default left margin for chart
		var     chartTopMargin = 20 ; 					// default Top margin for chart
		var		model = [] ;                            // default model layer for   chart  
		var		q = [] ; 								//queue data structure for segregating the 		detached and non detached nodes
		var		nid = 0 ; 								//unique node id should start from 1 onwards
		var		status = [] ; 							// maitains status for each node
		var		atta = [] ; 							// array to hold ids of attachingTo and attaching node
		var		tid = 0 ; 								//try to getNumericId always for tid//contains id of node that is envoking context menu
		var		sapStr = "" ; 							//saparator String to segregate the nodes
		var		docFlag = 0 ; 							//flag for writting to document either by document.write  ( s )  or document.write ( s2 )  ; 
		var		outerDivName= null;						//name of division that is populated every time when ever rendered , basically used to work with Extjs.
		var		orgViewInterface = {} ; 				// to return as object containing access to all methods
		var		nodeContextMenu=""	;					// stores context menu for node function name 
		var		metaData={};							//stores event handler for buidling blocks and nodes
		var		nodeTextFormatorHandler='';				//contains nodeTextFormator function name
		var		type1="ORANGE";
		var		type2="BLUE";
		var		type3="BLACK";		
		var		msg="No Data to Display";				// text to display  
		var 	highlightedNode=[];
		var 	focusedNode=null;

/*
 *
 * This is intended to collapse nodes of selected node
 * procedure is just to locate divs and hide them
 *
 */
function collapser (  ) {   // collapses all the nodes below the selected node

	sapStr = "collapse" ;  //first set the status to be set
	
	var sub = getChildIds (  )  ;  //getChildIds (  )  returns array of ids that are child nodes of selected node.

		for ( var i = 1 ; i < sub.length ; i += 1 ){  // to hide all child nodes as well as its building blocks //sub [ 0 ]  is node itself
			var ob = document.getElementById ( sub [ i ]  )  ; 
			if  ( ob ) {		
				ob.style.display = 'none' ; 
			}
			ob = document.getElementById ( "context"+sub [ i ]  )  ; 
			if  ( ob ) {
				ob.style.display = 'none' ; 
			}
			ob = document.getElementById ( "repeated"+sub [ i ]  )  ; 
			if  ( ob ) { 
				ob.style.display = 'none' ; 
			}
			ob = document.getElementById ( "sblock"+sub [ i ]  )  ; 
			if  ( ob ) {
				ob.style.display = 'none' ; 
			}
			ob = document.getElementById ( "arrow"+sub [ i ]  )  ; 
			if  ( ob ) {
				ob.style.display = 'none' ; 
			}
			ob = document.getElementById ( "shadow_i"+sub [ i ]  )  ; 
			if  ( ob ) {
				ob.style.display = 'none' ; 
			}
			ob = document.getElementById ( "shadow_j"+sub [ i ]  )  ; 
			if  ( ob ) {
				ob.style.display = 'none' ; 
			}
			var index = getModelIndex ( sub [ i ]  )  ; 
			var pid = model [ index ] .pid ; 
			ob = document.getElementById ( "fblock"+pid )  ; 
			if  ( ob ) {
				ob.style.display = 'none' ; 
			}
			ob = document.getElementById ( "hori"+pid )  ; 
			if  ( ob ) {
				ob.style.display = 'none' ; 
			}

	}//end for 

		ob = document.getElementById ( "shadow_i"+tid  )  ; 
		if  ( ob ) {
			ob.style.display = 'block' ; 
		}
		ob = document.getElementById ( "shadow_j"+tid  )  ; 
		if  ( ob ) {
			ob.style.display = 'block' ; 
		}

}//end of collapser (  ) 



/*
 * This method is intended to expand all the collapsed nodes except non child collapsed node 
 * Method checks the status if it is collapsed and then sets that to expanded
 *
 */

function expander (  ) {
	
	
	sapStr = "expand" ;  //first set the status to be set
	var sub = getChildIds (  )  ;  //getChildIds (  )  returns array of ids that are child nodes of selected node.
	for ( var i = 1 ; i < sub.length ; i += 1 ) { // to unhide all child nodes as well as its building blocks
		var ob = document.getElementById ( sub [ i ]  )  ; 
		var index = getModelIndex ( sub [ i ]  )  ; 
		var pid = model [ index ] .pid ;
		if  ( ob ) {
			ob.style.display = 'block' ; 
		}
		ob = document.getElementById ( "context"+sub [ i ]  )  ; 
		if  ( ob ) {
		 
			ob.style.display = 'block' ; 
		}

		ob = document.getElementById ( "repeated"+sub [ i ]  )  ; 
		if  ( ob ) {
		 
			ob.style.display = 'block' ; 
		}

		ob = document.getElementById ( "sblock"+sub [ i ]  )  ; 
		if  ( ob ) {
		 
			ob.style.display = 'block' ; 
		}

		ob = document.getElementById ( "arrow"+sub [ i ]  )  ; 
		if  ( ob ) {
		 
			ob.style.display = 'block' ; 
		}

		
		ob = document.getElementById ( "fblock"+pid )  ; 
		if  ( ob ) {
		 
			ob.style.display = 'block' ; 
		}

		ob = document.getElementById ( "hori"+pid )  ; 
		if  ( ob ) {
		 
			ob.style.display = 'block' ; 
		}

		

	}//end for 


		ob = document.getElementById ( "shadow_i"+tid  )  ; 
		if  ( ob ) {
		
			ob.style.display = 'none' ; 
		}
		
		ob = document.getElementById ( "shadow_j"+tid  )  ; 
		if  ( ob ) {
		
			ob.style.display = 'none' ; 
		}




}//end of expander (  ) 


	/**
	 * preserving state of collapsed to collapsed only
	 *
	 */
	
function preserveCollapsed() {
		/*	
			for (var i=0;i<model.length ; i++ ) { //preserving the state of collapsed lower level nodes as collapsed only

			var flg = model [ i ] .collapseFlag ; 

			if (flg) {
				tid = model [ i ].id  ; 
				collapser (  )  ; 
				}//endif

			}//end for 
			*/
			var count=0;
			var sub = getChildIds (  )  ;  //getChildIds (  )  returns array of ids that are child nodes of selected node.			
			for ( var i = 1 ; i < sub.length ; i += 1 ) { //preserving the state of collapsed lower level nodes as collapsed only
				var index = getModelIndex ( sub [ i ]  )  ; 
				var flg = model [index ] .collapseFlag ;
				if (flg) {
					tid = model [ index].id  ;
					collapser (  )  ;
					if(count!==0){
						ob = document.getElementById ( "shadow_i"+tid  )  ; 
						if  ( ob ) {
							ob.style.display = 'none' ; 
						}
						ob = document.getElementById ( "shadow_j"+tid  )  ; 
						if  ( ob ) {
							ob.style.display = 'none' ; 
						}
					}
					count=count+1;
					}//endif

			}//end for 
				
	
	}//end of preserveCollapsed ()
	
	/**
	 * this method is intended for node deletion operation
	 */

function deleting (  ) { // deleting nodes

	var index = getModelIndex ( tid )  ; 
	 var pid = -1 ; 
	  var pindex = -1 ; 
	   if ( index >= 0 ) 
	    pid = model [ index ] .pid ; 
	 	 pindex = getModelIndex ( pid )  ; 
   	     if ( pindex >= 0 ) 
	     model [ pindex ] .child = model [ pindex ] .child-1 ; 

		sapStr = "delete" ;  //first set the status to be set
	   var sub = attachNodes (  )  ;  ////sub contains nodes and sub nodes to attach
	  if ( model.length-sub.length > 0 ) 
	 model.length = model.length-sub.length ; 
	else
   model.length = 0 ; 
		
if ( model.length  > 0 ) 
	render (  )  ; 
else {
	
	var myDiv = document.getElementsByTagName ( outerDivName )  ; 
	 if ( myDiv )	{
		myDiv.innerHTML = " " ; 
	 }//endif
  }//end else
}//end deleting (  ) 

	/**
	 * selects the target node to attach
	 */
function selectTargetNode (  ) {
	var flag = 1 ; 
	 atta [ 1 ]  = tid ; 
	  if ( atta [ 0 ]  === atta [ 1 ]  ) 
		alert ( "recursive attaching not possible"+atta [ 0 ] +" and "+atta [ 1 ]  )  ; 
	  else {
		
		 tid = atta [ 0 ]  ;  //atta [ 0 ]  is the id of attaching node 
		  sapStr = "attach" ;  //first set the status to be set
		   var sub = attachNodes (  )  ;  ////sub contains nodes and sub nodes to attach
			for ( var i = 0 ; i < sub.length ; i += 1 ) {  //check for attaching a detached node with its heirarch node.
			 if  ( sub [ i ] .id === atta [ 1 ]  ) {
			 	flag = 0 ; 
				break ; 
			 }//endif
		 }//end for
	if ( flag === 1 ) {
		var pindex = getModelIndex ( atta [ 1 ]  )  ;  //index of parent node
		 model [ pindex ] .child = model [ pindex ] .child+1 ;   //no of child of parent incremented
		  sub [ 0 ] .pid = atta [ 1 ]  ;   //updating the pid of the attaching root.
		   var tlevel = model [ pindex ] .level ; 
		    tlevel += 1 ; 

		for ( var i = 0 ; i < sub.length ; i += 1 )   // updating the level of attaching nodes and its subtree
			sub [ i ] .level = sub [ i ] .level+tlevel ; 

		      model.length = model.length-sub.length ; 
	
		for ( var j = 0 ;  j < sub.length ;  j += 1 ) 
			insertInToModel ( sub [ j ]  )  ;    // call insertInToModel (  ) 


		render (  )  ; 
		}//end if 
		else
		alert ( "can not be attached to the same structure" )  ; 
	}//end else
}//end selectTargetNode (  ) 

	/**
	 * this method is intended to attach nodes
	 */
function attachNode (  ) 
{
	
	atta [ 0 ]  = tid ; 
	var index = getModelIndex ( tid )  ; 
	if ( model [ index ] . pid === 0 ) { // check for only detached nodes
	 document.onclick = stopstartbox ; 
	  document.onmousemove = updatebox1 ; 
	}//end if 
}
	
		/**
		 * attachNodes,it simply marks the nodes & returns the list of node ( s )  that are required to attach 
		 */
function attachNodes (  ) { //it simply marks the nodes & returns the list of node ( s )  that are required to attach 
 
	var index = -1 ; 
	 var pid = -1 ; 
	  var pindex = -1 ; 
	   resetStatus (  )  ; 
	    q [ 0 ]  = tid ;   //tid is the id of the node to detach
	     var i = 0 ; 
	      index = getModelIndex ( q [ i ]  )  ; 
	      if ( index  >= 0 ) 
		   pid = model [ index ] .pid ; 
 	    status [ index ]  = sapStr ; 
	if ( index >= 0 ) 
   model [ index ] .pid = 0 ; 				// for multi structure of detached tree 
	while ( i < q.length ) {
	 setStatus ( q [ i ]  , sapStr )  ; 
	 i += 1 ; 
	 }//end while
	  var v = segregate ( sapStr )  ; 
	   return v ; 
}//end of attachNodes (  ) 

  function stopstartbox (  )  {
   		document.getElementById ( 'mydiv' ) .style.display = 'none' ; 
		document.onclick  = "" ; 
		document.onmousemove = "" ; 
		selectTargetNode (  )  ; 
        }//end stopstartbox (  ) 


function stopMsg (  )  {
        		document.getElementById ( 'mydiv' ) .style.display = 'none' ; 
			    document.onclick  = "" ; 
				document.onmousemove = "" ; 
         }//end stopstartbox (  ) 

function updatebox ( evt )  {
			   mouseX = evt.pageX?evt.pageX:evt.clientX ; 
               mouseY = evt.pageY?evt.pageY:evt.clientY ; 
               document.getElementById ( 'mydiv' ) .style.left = mouseX ; 
               document.getElementById ( 'mydiv' ) .style.top =  ( mouseY+20 )  ; 
			   document.getElementById ( 'mydiv' ) .style.display = 'block' ; 
		 } //end updatebox (  ) 




function updatebox1 ( e  ) {

 if ( !e )
  	updatebox ( event )  ; //IE
 else
	updatebox ( e )  ; //firefox

}

	/** 
	 * this method is used by configureChart
	 */
function setContextMenu ( json )
	{
		for ( var i = 0; i < model.length ; i+=1 )
		{
			var context = "context"+model [ i ].id;
			 var obj = document.getElementById ( context )
				if (obj){
				obj.onclick=json.nodeContextMenu;
				}

		}
	}//end of setContextMenu

		/**
		 * Configuration related to chart handled here
		 * param json contains key and value pair  for these
		 * configuration
		 */

function configureChart ( json ) {
 
	if ( json.nodeContextMenu ) {
		nodeContextMenu=json.nodeContextMenu;
		setContextMenu ( json ) ;
	} //no else because of provision of more than one property at a time

		if  ( json.nodeMouseoverColor ) 
			changeCss ( ".nodeHover" , "backgroundColor" , json.nodeMouseoverColor )  ; 

			if  ( json.nodeBackgroundColor ) 
				changeCss ( ".node" , "backgroundColor" , json.nodeBackgroundColor )  ; 

				if  ( json.chartTopMargin ) {
				 	chartTopMargin = json.chartTopMargin ; 
					render (  )  ; 
					}

				   if  ( json.connectingLineStyle ) {
					changeCss ( ".line" , "borderLeft" , json.connectingLineStyle )  ; 
					changeCss ( ".lineHori" , "borderTop" , json.connectingLineStyle )  ; 
					}

						if  ( json.nodeBorderStyle ) {
							//nodeBorderStyle = json.nodeBorderStyle ; 
							changeCss ( ".node" , "border" , json.nodeBorderStyle )  ; 
						}
					if  ( json.nodeLeftMargin ) 
			 		 nodeLeftMargin = json.nodeLeftMargin ; 
	
				if  ( json.nodeRightMargin ) 
					nodeRightMargin = json.nodeRightMargin ; 
	
			if  ( json.nodeWidth ) {
	 		if ( json.nodeWidth > 80 ) {			//minimum nodeWidth
				nodeWidth = json.nodeWidth ; 
				render (  )  ; }
			}

		if  ( json.nodeHeight ) {
	 
		if ( json.nodeHeight > 40 ) {			//minimum nodeHeight
			nodeHeight = json.nodeHeight ; 
			render (  )  ; }
	}

	if  ( json.interChart ) {
	 
		if ( json.interChart > 10 ) {						//minimum interChart gap
			interChart = json.interChart ; 
			render (  )  ; }
		}
			if  ( json.interLevel ) {
	 
			if  ( json.interLevel > 100 ) {					//minimum interlevel gap
				interLevel = json.interLevel ; 
				render (  )  ; }
			}
				if  ( json.interNode ) {
			
				if ( json.interNode > 10 ) {						//minimum interNode gap
					interNode = json.interNode ; 
					render (  )  ; }
				}
					if  ( json.chartLeftMargin ) {
	 
					if  ( json.chartLeftMargin > 20 ) {
		 
					chartLeftMargin = json.chartLeftMargin ; 
					render (  )  ; 
					}
				}
	}//end of configureChart (  )  function
	
		/**
		 * To make changes in CSS style object changeCss method is there
		 * param ruleName is classname and attributeName is the attribute Name
		 * and value represents the value of attributeName
		 */

function changeCss ( ruleName , attributeName , value ) {
 

	var ss = document.styleSheets ; 
	var totCss = ss.length ; 
	
	for ( var i = 0 ; i < totCss ; i += 1 ) {
		 
		var totRules = ss [ i ] .cssRules? ss [ i ] .cssRules : ss [ i ] .rules ;  // browser independent statement

			for ( var j = 0 ; j < totRules.length ; j += 1 ) {
			 
				if ( totRules [ j ] .selectorText === ruleName ) {
				 
						switch ( attributeName ) {
		 
						case "backgroundColor": totRules [ j ] .style.backgroundColor = value ; break ; 
						case "border": totRules [ j ] .style.border = value ; break ; 
						case "borderTop": totRules [ j ] .style.borderTop = value ; break ; 
						case "borderLeft":totRules [ j ] .style.borderLeft = value ; break ; 
						case "width":totRules [ j ] .style.width = value ; break ; 
						case "height":totRules [ j ] .style.height = value ; break ; 
					}
				}//endif
			}//endfor
	 }//endfor

}//endfunction

		/**
		 * render is actual method which renders the div with correct html
		 *
		 **/


function render (  ) {
	var nwidth = nodeWidth+nodeLeftMargin+nodeRightMargin ; 
	 var nheight = nodeHeight ; 
	  var xinc = nwidth/2 ; 
		var yinc = interLevel/3 ; 
		var tpid = 0 ; 
		 var xi = 0 ; 
		  var xe = 0 ;

	calculateY (  )  ; 
	 resetX (  )  ; 
	  calculateX (  )  ; 


changeCss ( ".node" , "width" , nwidth+"px" )  ; 
 changeCss ( ".node" , "height" , nheight+"px" )  ; 
  changeCss ( ".nodeHover" , "width" , nwidth+"px" )  ; 
   changeCss ( ".nodeHover" , "height" , nheight+"px" )  ; 
//setting wdth and height of node ends


 
if ( model.length >= 1 )  
	{
	tpid = model [ 0 ] .pid ; 
	xi = model [ 0 ] .x ; 
	xe = model [ 0 ] .x ; 
	}

var s = '\n <div id = "mydiv" style = "position:absolute ; width:100px ; height:30px ; background:#99ABAB ; border:1px solid #000000 ; display:none"> &nbsp; Select  Target</div>' ; 
try{

this.direction = " left";
if(iportal.preferences.isLangDirectionRTL())
	this.direction = " right"
for (  var i = 0 ; i < model.length ; i += 1 ) {
 
var modelix = model [ i ] .x ; 
var modeliy = model [ i ] .y ; 
var arrowLoc = interLevel/2 ; 	

var num = model [ i ] .id ; 
var boxid = "box"+num ;  //not in use
var fblockid = "fblock"+num ; 
var sblockid = "sblock"+num ; 
var arrowid = "arrow"+num ; 
var shadow_i= "shadow_i"+model [ i ] .id ;
var shadow_j= "shadow_j"+model [ i ] .id ;

	
	s+='<div id='+shadow_i+' class="shadow_i"  style = "'+this.direction+':'+(modelix+1)+'px ;  top:'+(modeliy+4)+'px ;   	"></div>';
	s+='<div id='+shadow_j+' class="shadow_j"  style = "'+this.direction+':'+(modelix+2)+'px ;  top:'+(modeliy+2)+'px ;   	"></div>';

	if ( model [ i ] .nodetype === "2" ){
	
	s+='\n <div id = '+model [ i ] .id+'  class = "nodeType1"  onMouseout = "unhover ( this ) "  onMouseover = "hover ( this )  ;  "   style = "'+this.direction+':'+(modelix)+'px ;  top:'+modeliy+'px ;   	">'+model [ i ] .text+'</div>' ; 
	
	}else {
	s+='\n <div id = '+model [ i ] .id+'  class = "node"  onMouseout = "unhover ( this ) "  onMouseover = "hover ( this )  ;  "   style = "'+this.direction+':'+(modelix)+'px ;  top:'+modeliy+'px ;   	">'+model [ i ] .text+'</div>' ; 
	}
// Modified above for different node

 //below statement displays the icon for contextMenu inside node if visibility is 2
 if ( model [i] . visibility+"" === "2" ){																																													//	<img class = "imgContext"    />src = "img/contextMenu.gif"
 s+='\n <div  id = context'+model [ i ] .id+' class = "imgContext" onClick = "displayContextMenuOrg ( this.id )  ; "    style = "'+this.direction+':'+ (modelix+nwidth-18 ) +'px ;  top:'+ ( modeliy+nheight-15 ) +'px ;  "></div>' ; 
 }
 
 //below if statement displays the icon for occurance of the node more then one time in the structure
  if ( model [ i ] .uniqueness === "false" )  //means more than one time node exists

																																					//<img class = "imgClone"    src = "img/CloneAcc.gif"
 
	  s+='\n <div  id = repeated'+model [ i ] .id+' class = "imgClone"      style = "'+this.direction+':'+(modelix+nwidth-19 ) +'px ;  top:'+ ( modeliy-2) +'px ;   	"></div>' ;

	if ( model [ i ] .child > 0  ) { // if parent have child then only go through it
	    
		//below if  statement is for first vertical line top to bottom  (  starts from bottom of node and proceeds downward  ) 
			var offset=(navigator.appName === "Netscape")? 2:0; // check for IE or Mozilla/Netscape
		if ( model [ i ] .typeOfStr.toUpperCase (  )  === type1 )   // for EL type of structure line class is used and for ABT type of structures lineAbt css rule is used.
			s+='\n <div id = '+fblockid+' class = "line" style = "'+this.direction+':'+ (modelix+xinc ) +'px ;  top:'+ ( modeliy+nheight+offset ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
		else
			if ( model [ i ] .typeOfStr.toUpperCase (  )  === type2 )
			s+='\n <div id = '+fblockid+' class = "lineAbt" style = "'+this.direction+':'+ (modelix+xinc ) +'px ;  top:'+ ( modeliy+nheight+offset-2) +'px ;   height:'+yinc+'px ;   "></div>' ; 
			else
				if ( model [ i ] .typeOfStr.toUpperCase (  )  === type3 )
				s+='\n <div id = '+fblockid+' class = "blackLine" style = "'+this.direction+':'+ (modelix+xinc ) +'px ;  top:'+ ( modeliy+nheight+offset ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
	
		
	}//endif

	
	
	if ( model [ i ] .level > 0  )  {  // for second vertical line from bottom to top  (  starts from top of node and proceeds upward  ) 
	 
		
		var pind = getModelIndex ( model [ i ] .pid )  ; 
		
		if ( model [ pind ] .typeOfStr.toUpperCase (  )  === type1 ) {
		 
		
				/*if ( model [ i ] .suspended && model [ i ] .suspended === "true" ) 
				s+='\n <div id = '+sblockid+'  class = "dottedLine" style = "left:'+ ( modelix+xinc ) +'px ;  top:'+ ( modeliy-yinc ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
				else*/
				s+='\n <div id = '+sblockid+'  class = "line" style = "'+this.direction+':'+ (modelix+xinc ) +'px ;  top:'+ ( modeliy-yinc ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
		}
		else 
		if ( model [ pind ] .typeOfStr.toUpperCase (  )  === type2 )	{  // for ABT type of structures
		
		
				/*if ( model [ i ] .suspended && model [ i ] .suspended === "true" ) 
				s+='\n <div id = '+sblockid+'  class = "dottedLineAbt" style = "left:'+ ( modelix+xinc ) +'px ;  top:'+ ( modeliy-yinc ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
				else*/
				s+='\n <div id = '+sblockid+'  class = "lineAbt" style = "'+this.direction+':'+ (modelix+xinc ) +'px ;  top:'+ ( modeliy-yinc ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
	
		}
		else
			if ( model [ pind ] .typeOfStr.toUpperCase (  )  === type3 )	{  // for INVEST type of structures
		
		
				/*if ( model [ i ] .suspended && model [ i ] .suspended === "true" ) 
				s+='\n <div id = '+sblockid+'  class = "dottedBlackLine" style = "left:'+ ( modelix+xinc ) +'px ;  top:'+ ( modeliy-yinc ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
				else*/
				s+='\n <div id = '+sblockid+'  class = "blackLine" style = "'+this.direction+':'+ ( modelix+xinc ) +'px ;  top:'+ ( modeliy-yinc ) +'px ;   height:'+yinc+'px ;   "></div>' ; 
	
		}


	if ( model [i] . visibility+"" === "2" || model [i] . visibility+"" === "1"){
			
		if ( model [ i ] .flow+"" === "1"  ) {
		// attaching upArrow  mind it : to make changes in image size and width then also make same changes in div class i.e. arrows										<img class = "imgArrow"    src = "img/uparrow.gif">
			if ( model [ i ] .suspended && model [ i ] .suspended === "true" )
				s+='\n <div  id = '+arrowid+'   class = "upArrowR" style = "'+this.direction+':'+ (modelix+xinc-7 ) +'px ;  top:'+ ( modeliy- ( arrowLoc+8 )  ) +'px ;  "></div>' ;
			else
				s+='\n <div  id = '+arrowid+'   class = "upArrow" style = "'+this.direction+':'+ ( modelix+xinc-7 ) +'px ;  top:'+ ( modeliy- ( arrowLoc+8 )  ) +'px ;  "></div>' ;
		
		}//endif
		else if ( model [ i ] .flow+"" === "2"  ) {
		// attaching downArrow																																					<img  class = "imgArrow"     />	src = "img/downarrow.gif"
			if ( model [ i ] .suspended && model [ i ] .suspended === "true" )
				s+='\n <div  id = '+arrowid+'  flowMenu class = "dnArrowR"  style = "'+this.direction+':'+ ( modelix+xinc-7 ) +'px ;  top:'+ ( modeliy- ( arrowLoc+8 )  ) +'px ;  "></div>' ;
			else
				s+='\n <div  id = '+arrowid+'  flowMenu class = "dnArrow"  style = "'+this.direction+':'+ ( modelix+xinc-7 ) +'px ;  top:'+ ( modeliy- ( arrowLoc+8 )  ) +'px ;  "></div>' ;
		}//endif
		else if ( model [ i ] .flow+"" === "3"  ) {
			// attaching updownArrow																																				<img  class = "imgArrow"     />	src = "img/updnarrow.gif"
			if ( model [ i ] .suspended && model [ i ] .suspended === "true" )
				s+='\n <div  id = '+arrowid+'  flowMenu class = "upDnArrowR" style = "'+this.direction+':'+ ( modelix+xinc-7 ) +'px ;  top:'+ ( modeliy- ( arrowLoc+8 )  ) +'px ; "></div>' ;
			else
				s+='\n <div  id = '+arrowid+'  flowMenu class = "upDnArrow" style = "'+this.direction+':'+ ( modelix+xinc-7 ) +'px ;  top:'+ ( modeliy- ( arrowLoc+8 )  ) +'px ; "></div>' ;
		}//endif
	}//endif 
	}//endif of condi ( model [i] . visibility+"" === "2" )

	// Logic for horizontal line
	if ( model [ i ] .pid  ===  tpid ) {
	 
	

			if ( model [ i ] .x > xe ) 
				xe = model [ i ] .x ; 
			if ( model [ i ] .x < xi ) 
				xi = model [ i ] .x ; 

	}
	else {
	
	var twidth = xe-xi ; 
	
		
	tpid = model [ i ] .pid ; 
	xi = model [ i ] .x ; 
	xe = xi ; 
	}

	
}// endfor

}catch (e)	{
	alert ( e );
	}

	//blow statement is blocked by pk so that no horizonatal line will be drown in chart

		
var s1 = "" ; 

var s2 = s1+s;//+//'\n</body>\n</html>' ; //this statement is creating problem in muthus's work: need to check


if ( outerDivName === null ) { //for functionality inside EditPlus editor's browser

if ( model.length > 1 ) {
	 
	 var body = document.getElementsByTagName ( 'body' )  ; 

	body [ 0 ] .innerHTML = s ; 
	}
else {
	
		if ( docFlag === 0 ) {
		 
			document.write ( s )  ; 

		}
		else {
		
			document.write ( s2 )  ; 

		}



		docFlag = 1 ; 
	}//end of else



drawHoriLine();
reStoreSettings();
caterLineColor();
caterEntitlement();
}
else { // for div population like extJs

	var s3=drawHoriLine (  )  ; 
	reStoreSettings (  )  ; 

	updatePanel(s+" "+s3);     //updates outer div of Extjs
	caterLineColor();
	caterEntitlement (  )  ;  //check whether it should be before updatePanle function or after date 4/12/2008

	}//end else
	setContextMenu({nodeContextMenu:nodeContextMenu});  // to preserv and resets context menu of node 
	
}// end of render (  ) 


	/**
	 * cater line color accourding to subaccount's typeOfStr
	 **/

function caterLineColor(){

		

	for (var i=1;i<model.length ;i+=1 ){
		 var b="sblock"+model[i].id;	
		 var ob= document.getElementById(b);
		 var flagType1 = 0;
		var flagType2 = 0;
		var flagType3 =0 ;
		if(ob){
			 if (model[i].typeOfStr === type1){ //EL
				 if(model [ i ] .suspended && model [ i ] .suspended === "true")
					 ob.className = "dottedLine";
				 else
					 ob.className = "line";
				 
			 }else if (model[i].typeOfStr === type2){//ABT
				 if(model [ i ] .suspended && model [ i ] .suspended === "true")
					ob.className = "dottedLineAbt";
				 else
					ob.className = "lineAbt";
					  
			 }else if (model[i].typeOfStr === type3){//INVEST
				 if(model [ i ] .suspended && model [ i ] .suspended === "true")
					 ob.className = "dottedBlackLine";
				 else
					 ob.className = "blackLine";
			 }
		}//endif
	
		var childIds = getJustChildIds ( model [ i ] . id );

		/**
		 * checking whether all child have type1 type of structure (represented by 1)or 
 		 * all children have type2 type of structure (represented by 2) or
		 * all child have mixed of type1 and type2 (represnted by 3)
		 **/

		if ( childIds && childIds.length > 1 )	{
			
			for (var j=1; j<childIds.length ; j+=1 )	{
					
					var ind=getModelIndex(childIds[j]);
					if ( model [ ind ] . typeOfStr === type1  )
					{
						flagType1 = 1;
					}
					else
						if ( model [ ind ] . typeOfStr === type2  )	{
						flagType2 = 1;
						}
						else
							if ( model [ ind ] . typeOfStr === type3  )
							flagType3 = 1;

			}//endfor

			if (flagType3 === 1)	{
				var hori="hori"	+model [i].id;
				var fblk="fblock"+model [i].id;
				
				var h = document.getElementById ( hori );
				var f = document.getElementById ( fblk );

				
				if (h){
					h.className="blackHoriLine";
				}

				if (f)	{
					f.className = "blackLine";
				}
			}
			else
			if (flagType1 === 1 && flagType2 === 1)	{
				// means horizontal line should be black and first vertical line should be black
				var hori="hori"	+model [i].id;
				var fblk="fblock"+model [i].id;
				
				var h = document.getElementById ( hori );
				var f = document.getElementById ( fblk );
				
				if (h){
					h.className="blackHoriLine";
				}

				if (f)	{
					f.className = "blackLine";
				}
			}//endif
			else
				if (flagType1 === 1 )	{
				// means horizontal line should be type1 and first vertical line should be type1
				var hori="hori"	+model [i].id;
				var fblk="fblock"+model [i].id;
				
				var h = document.getElementById ( hori );
				var f = document.getElementById ( fblk );
				
				if (h){
					h.className="lineHori";
				}

				if (f)	{
					f.className = "line";
				}
			}//endif
			else
			if (flagType2 === 1 )	{
				// means horizontal line should be type2 and first vertical line should be type2
				var hori="hori"	+model [i].id;
				var fblk="fblock"+model [i].id;
				
				var h = document.getElementById ( hori );
				var f = document.getElementById ( fblk );
				
				if (h){
					h.className="lineHoriAbt";
				}

				if (f)	{
					f.className = "lineAbt";
				}
			}//endif

		}

	}//end for




	}//end of caterLineColor
	


	/**
	 *  based on entitlement of  node line coloration is handled here
	 */

function caterEntitlement (  ) {
 
	for  ( var i = 0 ; i < model.length ; i += 1  ) {
	 
	 if  ( model [ i ] .visibility === "0" ) {
	  
		 model [ i ] .visibility = 0 ; 
	 }
	 else
		 if  ( model [ i ] .visibility === "1" ) {
		  
		 model [ i ] .visibility = 1 ; 
		 }
		 else {
			 if( model [ i ].visibility === "2" )
			 model [ i ] .visibility = 2 ; 
			 }

	 }//end for

	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
		if ( model [ i ] .visibility === 0  ) {
		 
			var p = "arrow"+model [ i ] .id ; 
			var flowImg = document.getElementById ( p )  ; 
			if ( flowImg ) {
				flowImg.style.display = 'none' ; 
			}//end of if
			model [ i ] .toolTip = "You are not Entitled to instruction / Account" ; 
			p = "context"+model [ i ] .id ; 
			var flowImg = document.getElementById ( p )  ; 
			if ( flowImg ) {
				flowImg.style.display = 'none' ; 
			}//end of if
			
			/**
			 * Added the below line for showing the grayed box for the non entitled instruction(26Feb09)
			 */
			p=model [ i ] .id ;
			var nodeDiv = document.getElementById ( p )  ;
			if(nodeDiv){
				nodeDiv.className="nodeGrey";
			}

			p = "fblock"+model [ i ] .pid ; 
			var upperLine = document.getElementById ( p )  ; 

			if ( upperLine ) { //upper half vertical line
	
				upperLine.className = "notEntitledLine" ; 

			}//end of if
			

			

			p = "sblock"+model [ i ] .id ; 
			var lowerLine = document.getElementById ( p )  ; 
			if ( lowerLine ) {		//lower half vertical line
			 

				lowerLine.className = "notEntitledLine" ; 



			}//end of if

			
		}//endif
		else
			if  (  model [ i ] .visibility === 1 ) {
		//We commented the below pice of code  to show the arrow img on the vertical line if the visibility of AcctNode is 1 
		/*	var p = "arrow"+model [ i ] .id ; 
			var flowImg = document.getElementById ( p )  ; 
			if ( flowImg ) {
				flowImg.style.display = 'none' ; 
			}//end of if
		*/
			model [ i ] .toolTip = "You are not Entitled to instruction / Account" ; 
			var p = "context"+model [ i ] .id ; 
			var flowImg = document.getElementById ( p )  ; 
			if ( flowImg ) {
			 

				flowImg.style.display = 'none' ; 
			}//end of if

			}//endif

	}//end for




	/**
	 * if parents visibility is zero and any one of the child is with zero visibility 
	 * and at least one child is with non-zero visibility then style should be BLACK for horizontal line 
	 * and first vertical connecting line
	 */
/**
 * The below for loop is not required. Because we are going to show only the grayColor lines(Upperline,horiLine,lowerLine)
 * for the corresponding nodes and its child nodes if node's visibility is zero.
 
	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
		if ( model [ i ] .visibility === 0  ) {
		 
			var child0 = 0 ;  //represents number of childs with zero visibility
			var child12 = 0 ; //represents number of childs with non zero visibility
			
			
			var totChildIds = getJustChildIds ( model [ i ] .id )  ; 
			if  ( totChildIds.length  >=  3 ) {
			 
			
			for (  var k = 1 ; k<totChildIds.length ; k += 1 ) {//counting total nodes having zero ids
			 
				var index = getModelIndex ( totChildIds [ k ]  )  ; 
				if ( index >= 0 ) {
					
					if  ( model [ index ] .visibility === 0 ) {
					 
						child0 += 1 ; 
					}
				}
			}//end for
			
			if  ( child0  >= 1 ) {
			 

			for (  var k = 1 ; k < totChildIds.length ; k += 1 ) {//counting total nodes having zero ids
				 
				var index = getModelIndex ( totChildIds [ k ]  )  ; 
				if ( index >= 0 ) {
				 
					if  ( model [ index ] .visibility > 0 ) {
					 
						child12 += 1 ; 
					}
				}
			}//end for

			}//inner endif

			if  ( child0  >= 1 && child12  >= 1 ) {
			 
				var inde = getModelIndex ( totChildIds [ 1 ]  )  ; 
				if (  inde  >= 0 ) {
				 
				var pf = "fblock"+model [ inde ] .pid ; 
				var upLine = document.getElementById ( pf )  ; 
				if ( upLine ) {
					 

					upLine.className = "blackLine" ; 


					}

					var horiLine = document.getElementById ( "hori"+model [ inde ] .pid )  ; 
					if  ( horiLine ) {
					 
						horiLine.className = "blackHoriLine" ; 
					}


				}//endif of inde
			}//end of if for blackening the first half line and one horizontal line


		}//endif
	}//endif
	}//endfor
*/
	
	/*
	 * if parents visibility is one and any one of the child have atleast zero visibility and 
	 * at least one child have non zero visibility in that case again Black style for horizontal 
	 * and first vertical line
	 */

	for ( var i = 0 ; i < model.length ; i += 1 ) {
		if ( model [ i ] .visibility === 1  ) {
			var child0 = 0 ;  //represents number of childs with zero visibility
			var child12 = 0 ; //represents number of childs with non zero visibility
			
			var childsInstTypes=[];//it will contains the child's Product type of current node(EL,ABT,INVEST..)
			var tempChildsInstTypes="";
			var count=0;
			//
			var totChildIds = getJustChildIds ( model [ i ] .id )  ; 
			
			//Changing the Non Entiled Node's border color to Gray
			var nodeObject=document.getElementById ( totChildIds[0] ) ;
			nodeObject.className="NonEntlnode";
			if  ( totChildIds.length  >=  3 ) {
				for (  var k = 1 ; k < totChildIds.length ; k += 1 ) {//counting total nodes having zero ids			 
					var index = getModelIndex ( totChildIds [ k ]  )  ; 
					if ( index >= 0 ) {
						//Muthu-3
						tempChildsInstTypes=model[index].typeOfStr;
						if(!childsInstTypes.contains(tempChildsInstTypes)){
							childsInstTypes[count]=tempChildsInstTypes;
							count=count+1;
						}						
						//
						if  ( model [ index ] .visibility === 0 ) {					 
							child0 += 1 ; 
						}
					}
				}//end for
				
				if  ( child0  >= 1 ) {
					for (  var k = 1 ; k < totChildIds.length ; k += 1 ) {//counting total nodes having zero ids					 
						var index = getModelIndex ( totChildIds [ k ]  )  ; 
						if ( index >= 0 ) {					 
							if  ( model [ index ] .visibility > 0 ) {						 
								child12 += 1 ; 
							}
						}
					}//end for
				}//inner endif
	
				/*
				 * 1)Set Black Hori & upper Vertical line if Node Having both zero & non zero visibility Childs with different product type
				 * 2)Set the Corresponding product line color if Node Having both zero & non zero visibility Childs with Same product type
				 */
				if  ( child0  >= 1 && child12  >= 1 ) {
					var inde = getModelIndex ( totChildIds [ 1 ]  )  ; 
					if (  inde  >= 0 ) {
						var pf = "fblock"+model [ inde ] .pid ; 
						var upLine = document.getElementById ( pf )  ; 
						var horiLine = document.getElementById ( "hori"+model [ inde ] .pid )  ; 
						
						if(childsInstTypes){
							if(childsInstTypes.length>1){
								if ( upLine ) {
									upLine.className = "blackLine" ; 
								}
								if  ( horiLine ) {
										horiLine.className = "blackHoriLine" ; 
								}
							}else if(childsInstTypes.length==1){
								if ( childsInstTypes[0]==type1 ) {
									upLine.className = "line" ; 
								}else if ( childsInstTypes[0]==type2 ) {
									upLine.className = "lineAbt" ; 
								}else if ( childsInstTypes[0]==type3 ) {
									upLine.className = "blackLine" ; 
								}
							}
						}
						
					}//endif 
				}else if( child0  >= 1 && child12  == 0 ) {
					/*
					* If all the childs are zero visibility (all are ghost nodes).
					* So horizontal line and upper vertical line should be the GrayColor
					*/ 
					var inde = getModelIndex ( totChildIds [ 1 ]  )  ; 
					if (  inde  >= 0 ) {
						var pf = "fblock"+model [ inde ] .pid ; 
						var upLine = document.getElementById ( pf )  ; 
						var horiLine = document.getElementById ( "hori"+model [ inde ] .pid )  ;
						if ( upLine ) {
							upLine.className = "grayLine" ; 
						}
						if  ( horiLine ) {
								horiLine.className = "grayHori" ; 
						}
					}
					
				}
				
				
				
					
		}//endif
	}//endif
	}//endfor
	
	/** if parents visibility is zero and all child are 
	 * also have visibility zero or 1 then gray color line
	 * If current node's visibility is zero and all child node's visibility is 1 or 0 (Child nodes visibility should be 1 or 0 not 2)
	 * then lines between these nodes color should be gray.  
	 */
	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
		if ( model [ i ] .visibility === 0  ) {
			
			var totChildIds = getJustChildIds ( model [ i ] .id )  ; 
			if  ( totChildIds.length  >=  2 ) {
				
				var inde = getModelIndex ( totChildIds [ 1 ]  )  ; 
				if (  inde  >= 0 ) {//Setting the grayline for current Node's upperLine and horizontalLine
					var pf = "fblock"+model [ inde ] .pid ; 
					var upLine = document.getElementById ( pf )  ;
					var horiLine = document.getElementById ( "hori"+model [ inde ] .pid )  ;
					if ( upLine ) {
						upLine.className = "grayLine" ; 
					}
					if  ( horiLine ) {
						horiLine.className = "grayHori" ; 
					}
				}
					
				for (  var k = 1 ; k < totChildIds.length ; k += 1 ) {//Setting the grayline for all childs	 "LowerLine"					 
					var inde = getModelIndex ( totChildIds [ k ]  )  ; 
					if (  inde  >= 0 ) {
						var pf = "sblock"+model [ inde ] .id ; 
						var lowerLine = document.getElementById ( pf )  ;
						if ( lowerLine ) {
								lowerLine.className = "grayLine" ; 
						}
					}
				}
				
			
			}
			
			
			
			
		/** below pice of code not required. 
		 * Because if current node's visibility is zero then child node's visibility should be 0 or 1.
		 * So line color between these nodes should be gray color.
		 * 
		
			var child0 = 0 ;  //represents number of childs with zero visibility
			var child12 = 0 ; //represents number of childs with non zero visibility

			var totChildIds = getJustChildIds ( model [ i ] .id )  ; 
			if  ( totChildIds.length  >=  2 ) {
				for (  var k = 1 ; k < totChildIds.length ; k += 1 ) {//counting total nodes having zero ids				 
					var index = getModelIndex ( totChildIds [ k ]  )  ; 
					if ( index >= 0 ) {
						if  ( model [ index ] .visibility === 0 ) {
							child0 += 1 ; 
						}
					}
				}//end for
				
				if  ( child0  >= 1 ) {
					for (  var k = 1 ; k < totChildIds.length ; k += 1 ) {//counting total nodes having zero ids						 
						var index = getModelIndex ( totChildIds [ k ]  )  ; 
						if ( index >= 0 ) {						 
							if  ( model [ index ] .visibility > 0 ) {							 
								child12 += 1 ; 
							}
						}
					}//end for
				}//inner endif
	
				if  ( child0  >= 1 && child12  === 0 ) {
					var inde = getModelIndex ( totChildIds [ 1 ]  )  ; 
					if (  inde  >= 0 ) {
						var pf = "fblock"+model [ inde ] .pid ; 
						var upLine = document.getElementById ( pf )  ;
						var horiLine = document.getElementById ( "hori"+model [ inde ] .pid )  ;
						if ( upLine ) {
							upLine.className = "grayLine" ; 
						}
						if  ( horiLine ) {
							horiLine.className = "grayHori" ; 
						}
					}//endif of inde
				}//end of if for blackening the first half line and one horizontal line
				
		}//endif
*/
				
	}//endif
	}//endfor
	
	
}//end of caterEntitlement


		/**
		 * drawHoriLine, draws horizontal lines in chart
		 */


function drawHoriLine (  ) { 

var temp =  [  ]  ; 
var s = "" ; 	
var nwidth = nodeWidth+nodeLeftMargin+nodeRightMargin ; 
var nheight = nodeHeight ; 

var xinc = nwidth/2 ; 
var yinc = interLevel/2 +8; 

	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
		temp [ i ]  = model [ i ]  ; 
		
	}//endfor

	for ( var i = 0 ; i < temp.length ; i += 1 ) { //arranging according to pid in ascendind order
	 
		for (  var j = 0 ; j < temp.length- ( i+1 )  ; j += 1 ) {
		 
			var a=+temp [ j ] .pid ; 
			var b=+temp [ j+1 ] .pid ; 
			if ( a > b ) {
			 
				var t = temp [ j ]  ; 
				temp [ j ]  = temp [ j+1 ]  ; 
				temp [ j+1 ]  = t ; 
			}//endif
		}//endfor
	}//endfor



var tpid = temp [ 0 ] .pid ; 
var xi = temp [ 0 ] .x ; 
var xe = temp [ 0 ] .x ; 

	for ( var i = 0 ; i < temp.length ; i += 1 ) { // this loop is drawing horizontal lines
	 
	
	// Logic for horizontal line
	if ( temp [ i ] .pid  ===  tpid && temp [ i ] .pid > 0 ) {
	 


			if ( temp [ i ] .x > xe ) 
				xe = temp [ i ] .x ; 
			if ( temp [ i ] .x < xi ) 
				xi = temp [ i ] .x ; 

	}
	else
	if ( temp [ i ] .pid  !==  tpid ) {
	 
	var twidth = xe-xi ; 

		if ( i-1 > 0 ) {
		 
			var r = "hori"+tpid ; 
			
			var pind = getModelIndex ( temp [ i-1 ] .pid )  ; 

			if ( model [ pind ]  && model [ pind ] .typeOfStr.toUpperCase (  )  === type1 ) {
																																		//+3 for portal prob			//yinc
				s+='\n <div id = '+r+' class = "lineHori" style = "'+this.direction+':'+ ( xi+xinc ) +'px ;  top:'+ ( temp [ i-1 ] .y-yinc ) +'px ;  width:'+(twidth+0)+'px ;  height:'+5+'px ;   "></div>' ; 
				
			}
			else{
			if ( model [ pind ]  && model [ pind ] .typeOfStr.toUpperCase (  )  === type2 ){																																		//+3 for portal prob	//yinc
				s+='\n <div id = '+r+' class = "lineHoriAbt" style = "'+this.direction+':'+ ( xi+xinc ) +'px ;  top:'+ ( temp [ i-1 ] .y-yinc ) +'px ;  width:'+(twidth+0)+'px ;  height:'+5+'px ;   "></div>' ; 

			}
			else{
				if ( model [ pind ]  && model [ pind ] .typeOfStr.toUpperCase (  )  === type3 )	{																																	//+3 for portal prob	//yinc
				s+='\n <div id = '+r+' class = "blackHoriLine" style = "'+this.direction+':'+ ( xi+xinc ) +'px ;  top:'+ ( temp [ i-1 ] .y-yinc ) +'px ;  width:'+(twidth+3)+'px ;  height:'+5+'px ;   "></div>' ; 
				

			}
			}
			}


		}
	tpid = temp [ i ] .pid ; 
	xi = temp [ i ] .x ; 
	xe = xi ; 
	}//end if
	}//endfor



	var twidth = xe-xi ; 
	var r = "hori"+tpid ; 
			
			
			var pind = getModelIndex ( temp [ i-1 ] .pid )  ; 
			if ( pind >= 0 && model [ pind ] .typeOfStr.toUpperCase (  )  === type1 )																			//yinc							
			s+='\n <div  id = '+r+' class = "lineHori"  style = "'+this.direction+':'+ ( xi+xinc ) +'px ;  top:'+ ( temp [ i-1 ] .y-yinc ) +'px ;  width:'+twidth+'px ;  height:'+5+'px ;   "></div>' ; 
			else
				if ( pind >= 0 && model [ pind ] .typeOfStr.toUpperCase (  )  === type2 ){																			//yinc							
				s+='\n <div  id = '+r+' class = "lineHoriAbt"  style = "'+this.direction+':'+ ( xi+xinc ) +'px ;  top:'+ ( temp [ i-1 ] .y-yinc ) +'px ;  width:'+twidth+'px ;  height:'+5+'px ;   "></div>' ; 
				
			}
				else{
					
					if ( pind >= 0 && model [ pind ] .typeOfStr.toUpperCase (  )  === type3 ){																			//yinc							
					s+='\n <div  id = '+r+' class = "blackHoriLine"  style = "'+this.direction+':'+ ( xi+xinc ) +'px ;  top:'+ ( temp [ i-1 ] .y-yinc ) +'px ;  width:'+twidth+'px ;  height:'+5+'px ;   "></div>' ; 
					
				}
				}

	
	if ( outerDivName === null ) { //for functionality inside EditPlus editor's browser
	var body = document.getElementsByTagName ( 'body' )  ; 
	
	if ( body [ 0 ] .innerHTML !== null ) {
	 
	body [ 0 ] .innerHTML = body [ 0 ] .innerHTML+s ; 
	}
	else
		alert ( "no body [ 0 ] " )  ; 

	bottomRightMargin (  )  ; 
	}
	else { // for div population like extJs

		var brm=bottomRightMargin (  )  ; 
		return s+" "+brm;
	}//end else

}//end of drawHoriLine (  ) 


	/**
	 * calculates the y coordinates for nodes based
	 * on level of a node
	 */



function calculateY (  ) { // this fn is calculating the y coordinates for each node
 
var h1 = nodeHeight +interLevel ; 
var ctm = chartTopMargin ; 

	for (  var i = 0 ; i < model.length ; i += 1 ) {
	 
	var v =  ( model [ i ] .level*h1 ) +ctm ; 
	model [ i ] .y = v ; 
	}
}//end of calculteY (  )  function

	/**
	 * resets the x coordinates
	 */

function resetX (  ) {
 
	for (  var i = 0 ; i < model.length ; i += 1 ) {
	 
	model [ i ] .x = 0 ; 

	}
}

	/**
	 * calculates x coordinates for leaf nodes only
	 *
	 */


function leafX (  ) {
 
	var loc = chartLeftMargin ; 
	var incr = nodeLeftMargin + nodeRightMargin + nodeWidth + interNode ; 				

	for (  var i = 0 ; i < model.length ; i += 1 ) {
	 
		if ( model [ i ] .child === 0 ) {
			 
			model [ i ] .x = loc ; 
			loc = loc+incr ; 	
			}
	}//end for

}// end leaf  (  )  function

function sumx ( pid , i ) {
 
	var s = 0 ; 
	for ( i += 1 ; i < model.length ; i += 1 ) 
		if ( model [ i ] .pid === pid ) 
			s = s+model [ i ] .x ; 
	return s ; 
}

/**
 * calculates x coordinates for non child nodes
 */

function parentX (  ) {
 

	for ( var i = model.length-1 ; i >= 0 ; i-- ) {
	 

		if ( model [ i ] .child > 0 ) {
		 
		var id = model [ i ] .id ; 
		var s = sumx ( id , i )  ; 			
		model [ i ] .x = s/model [ i ] .child ; 
		}//endif

	}//end for
	
}//end parentX (  )  function

/**
 * calulates x coordinates for nodes
 *
 */

function calculateX (  ) {
 
	leafX (  )  ; 
	parentX (  )  ; 
}

	/**
	 * returns numeric number from id of any component
	 */

function getNumericId ( id ) { // function to get numeric id of any image like if "context3" is id it will fetch only numberic part that is 3 and so on.
 
	if ( isNaN ( id )  ) {
	 
		var i = id.length-1 ; 
		while  ( ! isNaN ( id.charAt ( i )  )  ) {
		 
			i-- ; 
		}
		return id.substring ( i+1 )  ; 
	}
	else
		return id ; 
}//end of getNumericId

	/**
	 *  To traverse the model 
	 */

function resetFocus(){

	var ScrollerContainer = document.getElementById('ChartsApi');
	ScrollerContainer.parentNode.scrollLeft = 0;
	ScrollerContainer.parentNode.scrollTop = 0;

}

function foucusNode(nodeId){
	var tmpNode=document.getElementById(nodeId);
	 var ScrollerContainer = document.getElementById('ChartsApi');
		ScrollerContainer.parentNode.scrollLeft = tmpNode.offsetLeft;
		ScrollerContainer.parentNode.scrollTop = tmpNode.offsetTop;
		if(focusedNode){
			document.getElementById(focusedNode).className='node orgnodehighted';
		}
		
		tmpNode.className='node ' + 'focusednode';
		focusedNode=nodeId;
}

/* 
 *  this API remove the highlighted node class
 */
function clearHighlightedNide(){
	if(highlightedNode && highlightedNode.length>0){
	 var hnodeElemCounter=0;
		for(hnodeElemCounter=0;hnodeElemCounter<highlightedNode.length;hnodeElemCounter++){
		document.getElementById(highlightedNode[hnodeElemCounter].DOM_ID).className='node';
		}
 }
 highlightedNode=[];
 //resetFocus();
}
/*
 * set focus to particular node among  highlighted node
 */
	function setFocusOnNode (node, isNext)
	{
		if (isNext)
		{
			if (node + 1 == highlightedNode.length)
			{
				node = 0;
			} else
			{
				node++;
			}
		}

		else
		{
			if (node == 0)
			{
				node = highlightedNode.length - 1;
			} else
			{
				node--;
			}
		}

		foucusNode(highlightedNode[node].DOM_ID);
		return node;
	}
/* 
 *  this API highlight the searched Node
 */
	 
	 function setHighlightedNode(key,val)
	 {
		 clearHighlightedNide();
		var nodeCounter=0;
		var recList=[];
		if(cbx.isArray(key)){
			for (var sKey in key){
				 for (nodeCounter = 0; nodeCounter < model.length; nodeCounter++)
					{
						var obj = {};
						cbx.apply(obj,model[nodeCounter].node);
						obj.DOM_ID = model[nodeCounter].id;
						var regExp = new RegExp(val);
						if (regExp.test(obj[key[sKey]]))
						{
							recList.push(obj);
						}
					}
			}	
		}
		
		
			
			if (recList.length > 0)
		{
			var highlghtednodeCounter = 0;
			for (highlghtednodeCounter = 0; highlghtednodeCounter < recList.length; highlghtednodeCounter++)
			{
				var miz = document.getElementById(recList[highlghtednodeCounter].DOM_ID);
				miz.className = miz.className + ' orgnodehighted';

			}
			focusedNode=recList[0].DOM_ID;
			foucusNode(recList[0].DOM_ID);
			
		}
			else{
				resetFocus();
			}
		highlightedNode=recList;
		return recList.length;
	 }
	  
	 
	 
function showModel (  ) {
 
	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
	alert ("model [ i ].node: "+model [ i ].node+ ", x = "+model [ i ] .x+"  , y = "+model [ i ] .y+"  , pid = "+model [ i ] .pid+" ,  id:"+model [ i ] .id+" ,  child:"+model [ i ] .child+" ,  level:"+model [ i ] .level+" ,  text: "+model [ i ] .text+" ,  dbid:"+model [ i ] .dbid+" ,  nodetype:"+model [ i ] .nodetype  +" ,  uniqueness:"+model [ i ] .uniqueness  +" ,  suspended:"+model [ i ] .suspended+" ,  flow:"+model [ i ] .flow+" ,  visibility:"+model [ i ] .visibility+" ,  typeOfStr:"+model [ i ] .typeOfStr+" ,  instDetail:"+model [ i ] .instDetail +", toolTip: "+model [ i ].toolTip +", collapsedFlag="+model [ i ].collapseFlag )  ; 
	}//end for
// Modified above for different node
}//end of showModel (  ) 

	/**
	 * returns the level of a node 
	 * param pid is id for which level is to be returned
	 */

function getLevel ( pid ) {
 
	var l = 0 ; 

	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
		if ( model [ i ] .id === pid ) 
			return ( model [ i ] .level+1 )  ; 
	}
	return ( l )  ; 
}//end of getLevel

	/***
	 * incrChild, increase the number of nodes by one 
	 */
function incrChild ( pid ) {
 
	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
		if ( model [ i ] .id === pid ) 
			model [ i ] .child = model [ i ] .child+1 ; 
	}
}//end of incrChild 

	/**
	 * adds the json object to model
	 */

function addNewNode ( json ) {
 
	var pid = tid ;  // pid is local variable for pid to which node is to be attached
	
	var id = nid ;   //id contains id for new node
		nid += 1 ; 
	var child = 0 ; 
	var level ; 
	
	if ( pid === 0 ) 
		level = 0 ; 
	else {
	

		
		level = getLevel ( pid )  ; 
		incrChild ( pid )  ; 

	}

	var p ; 


	if ( json && json.text ) 

		p = {node:(json.text)?json.text:'',instDetail:(json.instDetail)?json.instDetail:""   , x:0 , y:0 , pid:pid , id:id , flow:3 , child:child , level:level , text:nodeTextFormatorHandler ( json.text , json.visibility, id )  , suspended:""+json.suspended , visibility: ( json.visibility === "undefined" ) ?2:json.visibility , typeOfStr: ( json.typeOfStr ) ?json.typeOfStr:"EL"} ; 
	else

		p = {node:(json.text)?json.text:'',instDetail:(json.instDetail)?json.instDetail:""   , x:0 , y:0 , pid:pid , id:id , child:child , level:level , text:id , suspended:""+json.suspended , visibility: ( json.visibility === "undefined" ) ?2:json.visibility , typeOfStr: ( json.typeOfStr ) ?json.typeOfStr:"EL"} ; 

	if ( json && json.dbid ) 
		p.dbid = json.dbid ; 
	else
		p.dbid = -1 ;   //default dbid is equal to -1

	if ( json && json.toolTip ) 
	p.toolTip = json.toolTip ; 

	
	if ( model.length ) {
	 

		insertInToModel ( p )  ; 
	}
	else
		model [ 0 ]  = p ; 


	render (  )  ; 

	

}//end of addNewNode


	/**
	 * method returns the index number of a specified node
	 * from the model
	 * param tid is id of a node
	 */

function getModelIndex ( tid ) { //tid can be a number or json object containing text
 

	var index = -1 ; 
	
	if ( tid.text ) {
	 
		var tidText = nodeTextFormatorHandler ( tid.text , tid.visibility, tid.id )  ; 
		var ind =  [  ]  ; 
		var p = 0 ; 
		for ( var i = 0 ; i < model.length ; i += 1 ) {


				if ( model [ i ] .text === tid.text ) 
				{
				ind [ p++ ]  = i ; 

				}//end if
		}
		if ( p === 0 ) 
			return -1 ; 
		else
			if ( p === 1 )  
				return ind [ 0 ]  ; 
			else
				return ind ; 
	
	}//end of if
	else {
	
		for ( var i = 0 ; i < model.length ; i += 1 ) 
				if ( model [ i ] .id == tid ) {
				 
				index = i ; 
				break ; 
				}//end if
		return index ; 
	}//end of else
}

	/**
	 * sets the status of a node 
	 * param pid is id of node and stat is status  to set
	 */
function setStatus ( pid , stat ) {
 
	

	for ( var i = 0 ; i < model.length ; i += 1 ) 
				if ( model [ i ] .pid === pid ) {
				 
				status [ i ]  = stat ; //status ; 

				
				q [ q.length ]  = model [ i ] .id ; 
				}//endif
				
}

		/**
		 * resetStatus refreshes the status of nodes
		 */

function resetStatus (  ) {  //resets the status off all nodes as "ok"
 

	for ( var i = 0 ; i < model.length ; i += 1 ) 		//initialising status of all nodes as ok
	    status [ i ]  = "ok " +model [ i ] .id ; 	

status.length = model.length ; 
q.length = 0 ; 

}//resetStatus (  ) 

	/**
	 * detaches nodes
	 */


function detachExistingNode (  ) {
 

sapStr = "detached" ; 
detachNodes (  )  ; 
q.length = 0 ;  // refreshing the queue

}//end detachExistingNode

	/**
	 * detachNodes returns list of detach nodes
	 */

function detachNodes (  ) {
 
	var index = -1 ; 
	var pid = -1 ; 
	var pindex = -1 ; 

	resetStatus (  )  ; 




	q [ 0 ]  = tid ;   //tid is the id of the node to detach
	var i = 0 ; 
	
	index = getModelIndex ( q [ i ]  )  ; 
	

	
	if ( model [ index ] .pid > 0 ) {
	 
	pid = model [ index ] .pid ; 

	pindex = getModelIndex ( pid )  ; 
	model [ pindex ] .child = model [ pindex ] .child-1 ; 

	
	status [ index ]  = sapStr ; 
	model [ index ] .pid = 0 ; 				// for multi structure of detached tree 

while ( i < q.length ) {
	 

	setStatus ( q [ i ]  , sapStr )  ; 

	i += 1 ; 
	}//end while

  //segregates detached node or sub tree 
		segregate ( sapStr )  ; 


render (  )  ; 
	}//endif

}//end of detachExistingNode (  ) 

	/***
	 * segregate returns the list of nodes that are having a particular state 
	 */

function segregate ( state ) {
 
	var detach =  [  ]  ; 
	var ok =  [  ]  ; 
	var j = 0 ; 
	var k = 0 ; 
	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
		if ( status [ i ]  === state ) {
		 	
			detach [ j ++ ]  = model [ i ]  ;  //contains detaching nodes

		}
		else {
		
			ok [ k ++ ]  = model [ i ]  ;   //contains non detachable nodes
		}
	}//end for

		for ( var i = 0 ; i < ok.length ; i += 1 ) 
		model [ i ]  = ok [ i ]  ; 
	
	model.length = ok.length ; 


	var sub = 0 ; 
	if  ( detach.length > 0 && detach [ 0 ] .level !== null ) {
	 
	
		sub=detach [ 0 ] .level ; 
	}//endif

	for ( var i = 0 ; i < detach.length ; i += 1 ) {
	 
	detach [ i ] .level-=sub ; 
	model [ model.length ]  = detach [ i ]  ; 
	}//end for

return detach ; 
}//end of segregate  (  ) 


	/**
	 * insertInToModel is intended to insert json object in orgview model
	 * param p is json object
	 */

function insertInToModel ( p ) {
 
var i , j ; 
var flag = 0 ; 
	var tid = p.pid ; 




	for ( i = model.length-1 ;  i > 0 ; i-- ) { // finding the location to insert
	 
		if ( tid  ===  model [ i ] .pid ) { 
		 
			flag = 1 ;  
			break ; 
		}
	}//endfor

	if ( flag === 0 ) {  //if node do not found at its Pid Group then it should be placed adjacent to the id of parent in the model
	 
	
				for ( i = model.length-1 ;  i >= 0 ; i-- ) { // finding the location to insert
				 
				if ( tid  ===  model [ i ] .id ) { 
				 
				flag = 1 ;  
				break ; 
				}
				}//endfor
	}//endif




	if ( flag === 1 ) { // then shift the nodes to create space in between
	 
		for ( j = model.length-1 ;  j > i ; j-- ) 
			model [ j+1 ]  = model [ j ]  ; 
	model [ i+1 ]  = p ; 
	}//endif
	else
		if ( model.length ) 
			model [ model.length ]  = p ; 
		else
			model [ 0 ]  = p ; 

}//end of insertInToModel (  )  function


	/**
	 * getChildIds returns the  child ids of a node 
	 * including child of child 
	 *  
	 */



function getChildIds (  ) { //this function returns array of child nodes including the envoking node at 0 location.
 
	var index = -1 ; 
	var pid = -1 ; 
	var pindex = -1 ; 


	resetStatus (  )  ; 


	q [ 0 ]  = tid ;   //tid is the id of the node to detach
	var i = 0 ; 
	
	index = getModelIndex ( q [ i ]  )  ; 
	
	if  ( index  >= 0 ) {
	 
	pid = model [ index ] .pid ; 
	}

	status [ index ]  = sapStr ; 
	

while ( i < q.length ) {
	 

	setStatus ( q [ i ]  , sapStr )  ; 

	i += 1 ; 
	}//end while

return q ; 

}//end of getChildIds (  ) 

	/**
	 * getJustChildIds returns the just child ids of a node 
	 * and note child of child's
	 * param idd is the id of node for which to find child
	 * 
	 */

function getJustChildIds ( idd ) { //this function returns array of just child nodes including the envoking node at 0 location.
 
	var index = -1 ; 
	var pid = -1 ; 
	var pindex = -1 ; 
	q.length = 0 ; 

	resetStatus (  )  ; 


	q [ 0 ]  = idd ; 
	for  ( var i = 0 ; i < model.length  ; i += 1  ) {
	 
		if  ( model [ i ] .pid === q [ 0 ]  ) {
		 
		q [ q.length ]  = model [ i ] .id ; 
		}
	}

return q ; 

}//end of getChildIds (  ) 

/**
 * getNodesChildIds returns the just child ids of a given node 
 * and not child of child's
 * param idd is the id of node for which to find child
 * 
 */
function getNodesChildIds ( idd ) { //this function returns array of just child nodes including the envoking node at 0 location.
	 
	var index = -1 ; 
	var pid = -1 ; 
	var pindex = -1 ; 
	q.length = 0 ; 

	resetStatus (  )  ; 
	q [ 0 ]  = idd ; 
	for  ( var i = 0 ; i < model.length  ; i += 1  ) {
		if  ( model [ i ] .pid == q [ 0 ]  ) {
			q [ q.length ]  = model [ i ] .id ; 
		}
	}
return q ; 

}//end of getNodesChildIds (  ) 
	/**
	 * bottomRightMargin provides bottom and right margin for chart
	 * 
	 */



function bottomRightMargin (  ) {  // provides bottom and right margin for chart
 
	var y = model [ 0 ] .y ; 
	for ( var i = 0 ;  i < model.length ;  i += 1 )  //finding maximum y coordinate of chart
		if ( y < model [ i ] .y ) 
			y = model [ i ] .y ; 
	
	y = y+nodeHeight ; 
	var s = '\n <div id = "bottomMargin"  class = "bMargin"     style = "'+this.direction+':1px ;  top:'+y+'px ;  width:10px ;  height:'+chartTopMargin+'px  	">&nbsp; </div>' ; 

	//logic for right margin
		
	var x = model [ 0 ] .x ; 
	for ( var i = 0 ;  i < model.length ;  i += 1 )  //finding maximum x coordinate of chart
		if ( x < model [ i ] .x ) 
			x = model [ i ] .x ; 
	
	x = x+nodeWidth+nodeLeftMargin+nodeRightMargin ; 
	s+='\n <div id = "rightMargin"  class = "rMargin"     style = "'+this.direction+':'+x+'px ;  top:1px ;  width:'+chartLeftMargin+'px ;  height:10px  	"></div>' ; 
	//logic for right margin ends



	if ( outerDivName === null ){ //for functionality inside EditPlus  editor's/ /normal browser
	var body = document.getElementsByTagName ( 'body' )  ; 
	
	if ( body [ 0 ] .innerHTML !== null ) {
	 
	body [ 0 ] .innerHTML=body [ 0 ] .innerHTML+s ; 
	}
	else
		alert ( "no body [ 0 ] " )  ; 
	
	}
	else{    // for div population like extJs
	return s;
	}//endelse

}//end of bottomRightMargin function

	/**
	 * updatePanel updates the division with fresh data
	 * param v is the name of div 
	 * that is supposed to be populated by api
	 */

	function updatePanel ( v ) { //populates the outerDivNam
	

	var myDiv=	document.getElementById(outerDivName);
	if(myDiv){
	myDiv.innerHTML=v;
	}//endif

	}//end of updatePanel



	/**
	 * storeSetting stores the state of nodes nodewise
	 */



function storeSetting (  id , attributeName , value ) {
 
	var index = getModelIndex ( id )  ; 
	if  ( index  >= 0 ) {
	 
		var str = attributeName ; 
		switch ( str ) {
		 
		case "backgroundColor": model [ index ] .backgroundColor = value ; break ; 
		case "collapseFlag": model [ index ] .collapseFlag = value ;break ; 
		}//endswitch
	}//endif
}//end of storeSetting


	/**
	 * reStoreSettings : this method is intended to use the settings done by storeSettings method
	 * like bacvkground collapsed state etc
	 */

function reStoreSettings (  ) {
 
	
	for  ( var i = 0 ; i < model.length  ; i += 1  ) {
	 
		if (  model [ i ] .backgroundColor ) {
		 
			var obj = document.getElementById ( model [ i ] .id )  ; 
			obj.style.backgroundColor = model [ i ] .backgroundColor ; 
		}//endif

		if (  model [ i ] .collapseFlag ) {
		 
			
			if (  model [ i ] .collapseFlag === 1 ) {
			 
				
				tid = model [ i ] .id ; 
				collapser (  )  ; 
			}
		}//endif
	}//endfor



			if (  metaData.onclick  ) 

				orgViewInterface.nodeEventHandler ( "onClick" , metaData.onclick  )  ; 
			
			if (  metaData.ondblclick  ) 

				orgViewInterface.nodeEventHandler ( "ondblclick" , metaData.ondblclick  )  ; 

			if (  metaData.onmousedown  ) 

				orgViewInterface.nodeEventHandler ( "onmousedown" , metaData.onmousedown  )  ; 

			if (  metaData.onmousemove  ) 

				orgViewInterface.nodeEventHandler ( "onmousemove" , metaData.onmousemove  )  ; 

			if (  metaData.onmouseout  ) 

				orgViewInterface.nodeEventHandler ( "onmouseout" , metaData.onmouseout  )  ; 

			if (  metaData.onmouseover  ) 

				orgViewInterface.nodeEventHandler ( "onmouseover" , metaData.onmouseover  )  ; 

			if (  metaData.onmouseup  ) 

				orgViewInterface.nodeEventHandler ( "onmouseup" , metaData.onmouseup  )  ; 

			//restoring settings for building blocks
			if (  metaData.onclickbb  ) 

				orgViewInterface.lineEventHandler ( "onClick" , metaData.onclickbb  )  ; 
			
			if (  metaData.ondblclickbb  ) 

				orgViewInterface.lineEventHandler ( "ondblclick" , metaData.ondblclickbb  )  ; 

			if (  metaData.onmousedownbb  ) 

				orgViewInterface.lineEventHandler ( "onmousedown" , metaData.onmousedownbb  )  ; 

			if (  metaData.onmousemovebb  ) 

				orgViewInterface.lineEventHandler ( "onmousemove" , metaData.onmousemovebb  )  ; 

			if (  metaData.onmouseoutbb  ) 

				orgViewInterface.lineEventHandler ( "onmouseout" , metaData.onmouseoutbb  )  ; 

			if (  metaData.onmouseoverbb  ) 

				orgViewInterface.lineEventHandler ( "onmouseover" , metaData.onmouseoverbb  )  ; 

			if (  metaData.onmouseupbb  ) 

				orgViewInterface.lineEventHandler ( "onmouseup" , metaData.onmouseupbb  )  ; 




}//end of reStoreSettings

	/**
	 * setNodeTextFormator sets the renderer method for node 
	 * paramm fname is the name of function or renderer method
	 */

function setNodeTextFormator( fname ) //sets the renderer method for node
	{
	nodeTextFormatorHandler = fname;
	}





	/**
	 * func function is recursively access the json data and stores in the orgview model
	 * param json is data passed and parent is recursively assigned by this function itself
	 * level represents the level of a node
	 */

function func ( json , level , parent ) { //recursive function to use JSON objects in children format 
 
for ( var i = 0 ; json && i < json.length ; i += 1 ) {
		json [ i ] .id = nid ;  //important statement for finding pid
		
		var obj ; //json object to put into q [ array ] 
		if ( level === 0 )                                                                                                                                                                         
			obj = {node:(json [i].text)?json[i].text:'',instDetail: (json [ i ] .instDetail )? json [ i ] .instDetail:" "  , text:nodeTextFormatorHandler ( json [ i ] .text , json [ i ] .visibility, nid)  , flow:3 , toolTip:""+json [ i ] .toolTip , id:nid , pid:0 , level:0 , child:0 , x:0 , y:0 , suspended:""+json [ i ] .suspended , visibility: ( json [ i ] .visibility === "undefined" ) ?2:json [ i ] .visibility , typeOfStr: ( json [ i ] .typeOfStr ) ?json [ i ] .typeOfStr:"EL" , uniqueness: ( json [ i ] .uniqueness === "undefined" ) ?"true":json [ i ] .uniqueness,nodetype: ( json [ i ] .nodetype === "undefined" ) ?"":json [ i ] .nodetype} ;  //EL = Entrust loan

		else
			obj = {node:(json [i].text)?json[i].text:'',instDetail: ( json [ i ] .instDetail )? json [ i ] .instDetail: " " , text:nodeTextFormatorHandler ( json [ i ] .text , json [ i ] .visibility, nid )  , flow: ( json [ i ] .flow ) ?json [ i ] .flow:3 , toolTip:""+json [ i ] .toolTip , id:nid , pid: ( parent ) ?parent.id:0 , level:level , child:0 , x:0 , y:0 , suspended:""+json [ i ] .suspended , visibility: ( json [ i ] .visibility === "undefined" ) ?2:json [ i ] .visibility , typeOfStr: ( json [ i ] .typeOfStr ) ?json [ i ] .typeOfStr:"EL" , uniqueness: ( json [ i ] .uniqueness === "undefined" ) ?"true":json [ i ] .uniqueness,nodetype: ( json [ i ] .nodetype === "undefined" ) ?"":json [ i ] .nodetype} ;  //EL = Entrust loan

// Modified above for different node
		if ( json [ i ] .dbid ) 
			obj.dbid = json [ i ] .dbid ; 
		else
			obj.dbid = -1 ;   //default dbid is equal to -1
		
		nid += 1 ;  //incrementing id for next node
		
		model [ model.length ]  = obj ;  //storing the json object at a location
		
		model [ model.length-1 ] .level = level ; 
		
	if ( json [ i ] .children ) {
		 
		func ( json [ i ] .children , level+1 , json [ i ]  )  ; 
		}
	else {
		
		//parent.child += 1 ; 
		func ( json [ i+1 ]  , level , json [ i ]  )  ; 
		}
		
		if ( parent && parent.id ) 
		incrChild ( parent.id )  ; 
}//end for

}//end func

	/**
	 * getCompleteNode method is intended to return the complete node information 
	 * including current node and the parent node
	 * current node information is stored at 0 index and parent node info at 1.
	 */

function getCompleteNode( node )
	{
	var arr=[]; //arr[0] for child node information and arr[1] for parent node information
	var childindex = getModelIndex (node.id);
	var childnode=null;
	var parentindex=0;
	var parentnode=null;
	var pid=-1;

	if (childindex >=0){
	 childnode= model[childindex];
	 pid=childnode.pid;
	}

	parentindex = getModelIndex (pid);
	if (parentindex >= 0){
	 parentnode= model[parentindex];
	}

	arr[0]=childnode;
	arr[1]=parentnode;
	

	return arr;
	}// end of getCompleteNode


orgViewInterface.getCompleteNode= function( node )	{
		var t=getCompleteNode( node );
		return t;
	}
orgViewInterface.func = function ( protoData ) {
	 

	func ( protoData , 0 )  ; 
	}

	orgViewInterface.setOuterDiv = function(divName){
		outerDivName=divName;

	}//end of setOuterDiv
	
	orgViewInterface.setNodeID = function(inputID){// avoid confilict with cashcon panel and ManageStructure panel by differentiating the differnet range of IDs.
		nid=inputID;
	}//end of setID

	orgViewInterface.render = function (  ) {
	 

		render (  )  ; 
	}//end render
	orgViewInterface.addNewNode = function ( json ) {
	 

		addNewNode ( json )  ; 
	}//end addNewNode


	orgViewInterface.flowToolTipTextFormator = function ( json ) {
	 
		
		var t = 	flowToolTipTextFormator ( json )  ; 

		return t ; 
	}//end flowToolTipTextFormator

	

	orgViewInterface.nodeTextFormator = function ( json , b ) {
	 

		var t = 	nodeTextFormator ( json , b )  ; 

		return t ; 
	}//end flowToolTipTextFormator



	orgViewInterface.getModelIndex = function ( node ) {
	 

		var t = 	getModelIndex ( node )  ; 

		return t ; 
	}//end getModelIndex



	orgViewInterface.configureChart = function ( json ) {
	 
		configureChart ( json )  ; 
	}//end configureChart



	orgViewInterface.getNodeId = function ( json ,  pid ) { //you can pass string or json object containg account number text attribute 
	 


			var obj ; 
			if ( json.text ) 
				 obj = {text:json.text} ; 	
			else
				 obj = {text:json} ; //at this place json is a sting 



		if ( json && pid ) {  //if both json and pid both are provided
		 


			tid = pid.id ;  //setting tid to search ids of child nodes 
			var ids = getChildIds (  )  ;  //ids [ 0 ]  contains parent itself
				var inde =  [  ]  ; 
				var p = 0 ; 
				for  ( var i = 1 ; i < ids.length  ; i += 1  ) {
				 
					var index = getModelIndex ( ids [ i ]  )  ; 
					if ( model [ index ] .text === obj.text && model [ index ] .pid === pid.id )  //pid.id is id of parent
						inde [ p++  ]  = model [ index ] .id ; 
				}//end for

			
				if ( p === 0 ) 
					return null ; //return new Node ( -1 )  ; 
				else
					if ( p === 1 ) 
						return new iportal.orgviewcomponent.Node ( inde [ 0 ]  )  ; 
					else {
						
						for (  var i = 0 ; i < inde.length ; i += 1 ) 
							inde [ i ]  = new iportal.orgviewcomponent.Node ( inde [ i ]  )  ; 
						return inde ; 
						}

		}//endif 
		else
		if ( json ) { //json may be a string or json object
		  
			//without providing pid ,  it will search in whole multi structure and will return all ids if occurs more then once
						
			var v = getModelIndex ( obj )  ; 

			if ( v.length ) {
			 
				var inde =  [  ]  ; 
				var p = 0 ; 
				for  ( var i = 0 ; i < v.length  ; i += 1  ) {
				 
					var index = v [ i ]  ; 
					inde [ p++  ]  = model [ index ] .id ; 
				}//end for

			
				if ( p === 0 ) 
					 return null ; //return new Node ( -1 )  ; 
				else
					if ( p === 1 ) 
					return new iportal.orgviewcomponent.Node ( inde [ 0 ]  )  ; 
					else {
						
						for (  var i = 0 ; i < inde.length ; i += 1 ) 
							inde [ i ]  = new iportal.orgviewcomponent.Node ( inde [ i ]  )  ; 

						return inde ; 

						}
			}
			else
				if ( v >= 0 ) 
				return new iportal.orgviewcomponent.Node ( model [ v ] .id )  ; 
				else
					return null ; //return new Node ( -1 )  ; 
		}//endif

	}//getNodeId


orgViewInterface.nodeEventHandler =  function ( eventName , functionName ) { //this is nodeEventHandler Method
	 
	var str = eventName.toLowerCase (  )  ;  
	
	for ( var i = 0 ; i < model.length ; i += 1 ) {
	 
	var obj = document.getElementById ( model [ i ] .id )  ; 
	function handleEvent(evt)
	{
	var modelCounter=0;
	for(modelCounter=0;modelCounter<model.length;modelCounter++){
		if(evt.currentTarget.id==model[modelCounter].id){
		var EvtData=model[modelCounter].node;
		break;
		}
	}
	if(evt.which==3){
		this.contextclick(EvtData);
		}
		else{
		functionName(EvtData);
		}
	}
	switch ( str ) {
	 
		case "onclick":obj.onclick = handleEvent ; break ; 
		case "ondblclick":obj.ondblclick = handleEvent ; break ; 
		case "onmousedown":obj.onmousedown = handleEvent ; break ; 
		case "onmousemove":obj.onmousemove = handleEvent ; break ; 
		case "onmouseout":obj.onmouseout = handleEvent ; break ; 
		case "onmouseover":obj.onmouseover = handleEvent ; break ; 
		case "onmouseup":obj.onmouseup = handleEvent ; break;
		case "contextclick":obj.contextclick = functionName ; 
	}//end case

	}//endfor

	/* switch ( str ) {
	
		case "onclick" : metaData.onclick = functionName ; break ; 
		case "ondblclick" :metaData.ondblclick = functionName ; break ; 
		case "onmousedown":metaData.onmousedown = functionName ; break ; 
		case "onmousemove":metaData.onmousemove = functionName ; break ; 
		case "onmouseout":metaData.onmouseout = functionName ; break ; 
		case "onmouseover":metaData.onmouseover = functionName ;  break ; 
		case "onmouseup":metaData.onmouseup = functionName ; 
	}//end case
*/


	
	} //end of nodeEventHandler


	orgViewInterface.lineEventHandler =  function ( eventName , functionName ) { //this EventHandler Method for building block 'arround arrow'
	 
		var str = eventName.toLowerCase (  )  ;  

		
		for ( var i = 0 ; i < model.length ; i += 1 ) {
		 
		var bb = "arrow"+model [ i ] .id ; 
		var obj = document.getElementById ( bb )  ; 
		
		function handleEvent(evt)
		{
		var modelCounter=0;
		for(modelCounter=0;modelCounter<model.length;modelCounter++){
			if(evt.currentTarget.id=='arrow'+model[modelCounter].id){
			var EvtData=model[modelCounter].node;
			break;
			}
		}
		functionName(EvtData);
		}

			if ( obj ) {

		switch ( str ) {
		 
			case "onclick":obj.onclick = handleEvent ; break ; 
			case "ondblclick":obj.ondblclick = handleEvent ; break ; 
			case "onmousedown":obj.onmousedown = handleEvent ; break ; 
			case "onmousemove":obj.onmousemove = handleEvent ; break ; 
			case "onmouseout":obj.onmouseout = handleEvent ; break ; 
			case "onmouseover":obj.onmouseover = handleEvent ; break ; 
			case "onmouseup":obj.onmouseup = handleEvent ; 
		}//end case
			}//endif

		}//endfor

		/* switch ( str ) {
		 
			case "onclick" : metaData.onclickbb = functionName ; break ; 
			case "ondblclick" :metaData.ondblclickbb = functionName ; break ; 
			case "onmousedown":metaData.onmousedownbb = functionName ; break ; 
			case "onmousemove":metaData.onmousemovebb = functionName ; break ; 
			case "onmouseout":metaData.onmouseoutbb = functionName ; break ; 
			case "onmouseover":metaData.onmouseoverbb = functionName ; break ; 
			case "onmouseup":metaData.onmouseupbb = functionName ; 
		}//end case */
	} //end of lineEventHandler




	orgViewInterface.getReference =  function ( id ) {
	 
		if  ( id  >= 1  ) {
		 
			return new iportal.orgviewcomponent.Node ( id )  ; 
		}
		else
			return id ; 
		
	}//end of getRefrence



	
	orgViewInterface.locate  = function  ( accnoStr ) {  // accnostr is a string of account number for locating and returns all Node id  objects that contains that account number
	 

		var finded =  [  ]  ; 

		for ( var i = 0 ; i < model.length ; i += 1 ) {
		 
		if (  model [ i ] .text.indexOf ( accnoStr )  >= 0 ) 

			if ( finded.length ) 
				finded [ finded.length ]  = new iportal.orgviewcomponent.Node ( model [ i ] .id )  ; 
			else
				finded [ 0 ]  = new iportal.orgviewcomponent.Node ( model [ i ] .id )  ; 
		}//endfor
		
		return finded ; 
	}//end of locate

//--------------------------Node Related Operations----------------------

	orgViewInterface.addNode = function ( json , desti ) { 
		 
		
		that = desti ; 
		var ob = {pid:0 , text:nodeTextFormator ( json.text , json.visibility?json.visibility:2 )  , toolTip:json.toolTip} ; 

		if ( json && json.dbid ) 
			ob.dbid = json.dbid ; 
		else
			ob.dbid = -1 ;   //default dbid is equal to -1
		
		//set tid first to which node is to be attached
		tid = that.id ;  

		addNewNode ( json )  ; 

		
		var iid = -1 ; 
		
		var index = getModelIndex ( ob )  ; 
		

		if ( index && !index.length && index >= 0 )  //means only one unique node exists
		{
			
		 iid = model [ index ] .id ; 


		}
		else
			if (  index && index.length  ) {
			 
				iid = model [ index [ 0 ]  ] .id ; 
				for ( var i = 0 ; i < index.length ; i += 1 ) 
					if ( iid < model [ index [ i ]  ] .id ) 
					iid = model [ index [ i ]  ] .id ; 
			}

		
		}//end of addNode function

	orgViewInterface.collapse = function ( that ) { 
		 
		tid = that.id ; 
		collapser (  )  ; 
		storeSetting ( that.id , "collapseFlag" , 1 )  ; 
		}

	orgViewInterface.expand = function ( that ) { 
		 
		tid = that.id ; 
		expander (  )  ; 
		storeSetting ( that.id , "collapseFlag" , 0 )  ; 
		tid = that.id ;
		preserveCollapsed();
		}

	orgViewInterface.deleteIt = function ( that ) { 

		tid = that.id ; 
		deleting (  )  ; 
		}

	orgViewInterface.detach = function ( that ) {
		 
			tid = that.id ; 
			detachExistingNode (  )  ; 
		}

	orgViewInterface.attachNode = function ( src, that ) { // src=BB
		
   	    var index=getModelIndex(src.id);
		if ( model [ index ].pid === 0 ) { //only detached node can be attached
		
		var iid=-1;
		if(!index.length && index!=-1) //means only one unique node exists 
		iid=model[index].id;
		if (iid !=-1)
		{
		tid=iid;

		attachNode();

		tid=that.id;
		selectTargetNode();
		stopMsg();//stops the message box
	
		render();
		}//endif
		}//outer if
		else
			alert("attachment not possible");

	}//end attach

	orgViewInterface.setText = function ( json , that ) {
		 

		var index = getModelIndex ( that.id )  ; 


		if ( index  !==  -1 ) {
		 
			model [ index ] .text = nodeTextFormator ( json , model [ index ] .visibility )  ; 
			render (  )  ; 
		}//endif
		}//end of setText

	orgViewInterface.setFlow =  function  ( val , that ) { // val can be 0 or 1 or 2 or 3 
			 
			var index = getModelIndex ( that.id )  ; 
			if ( index  !==  -1 ) {
			 
			model [ index ] .flow = val ; 
			render (  )  ; 
			}//enif 

		}//end setFlow

orgViewInterface.setToolTip =  function ( html , that ) {
	 
		var index = getModelIndex ( that.id )  ; 
		if ( index  !==  -1 ) {
		 
			model [ index ] .toolTip = html ; 

			render (  )  ; 
		}//endif
	}//end of setToolTip


orgViewInterface.getChildIds = function ( that ) {
	 
	tid = that.id ; 
	var  ids = getChildIds (  )  ; 
	return ids ; 
	}//end of getChildIds

orgViewInterface.setBgColor = function ( color , that ) {
		 
		var v = document.getElementById ( that.id )  ; 
			if ( v ) {
			 
				v.style.backgroundColor = color ; 
				storeSetting ( that.id , "backgroundColor" , color )  ; 
			}
		} //end of setBgColor
orgViewInterface.getInstDetail = function ( id )
	{
	
	var n=getNumericId(id);


	var i=getModelIndex(n);


	
	var toolTip="";
	if (i >=0 )
	{
	 toolTip=model[i].instDetail;
	}


	return toolTip;
	}


orgViewInterface.getNumericId = function ( id  ) {

	var t = getNumericId ( id ) ;
	return t;
	}// end of getNumericId

orgViewInterface.getNodesChildIds = function ( id  ) {

	var t = getNodesChildIds ( id ) ;
	return t;
	}// end of getNodesChildIds

orgViewInterface.detach = function ( that  ) { ////that=BB


		tid=that.id;
		detachExistingNode();
	}

orgViewInterface.showModel= function (   ) { 

		showModel();

	}

orgViewInterface.setHighlightedNode= function (  key,val ) { 

	return setHighlightedNode(key,val );

}

orgViewInterface.clearHighlightedNide= function (  ) { 

	clearHighlightedNide( );

}
orgViewInterface.setFocusOnNode= function (node,isNext) { 

	return setFocusOnNode(node,isNext);

}

orgViewInterface.getToolTip= function (  idno ) { 

		var i=getModelIndex (idno );

		if (i >=0 )	{

			return model [ i ] . toolTip;
		}
		else
		return "";
	}


	
orgViewInterface.setNodeTextFormator = function ( fname  ) { 

		setNodeTextFormator( fname ) ;

	}


return orgViewInterface ; 
}//end of class OrgViewConfig








//Logic for Control creation for OrgViewChart

iportal.orgviewcomponent.OrgView=function (  ) {
 



}//end of OrgView

iportal.orgviewcomponent.OrgView.prototype = {
	
	addChart:function ( cc , root ) { //this function inserts root one by one at a time 
		 

		try{
				
		var node ; 

		if (root && root.length  > 0 ) { //want to create multi structure
			 
				
				cc.func ( root , 0 )  ; //pass 0 as indicator for the root level as 0 as well as PId as 0 ,  This function itself is putting nodes in model
				
				
				//document.write ( "<br>" )  ; 	// I do not know why this statement is necessory to render the treeData....May be it is pausing  the processor. 

				for  ( var i = 0 ;  i < root.length  ;  i += 1  ) { // this block is working  fine
				 
				 node = {pid:0 , text:root [ i ] .text , toolTip:root [ i ] .toolTip} ;   //because  always pid = 0 for root 

				}//end for 
				
				
				cc.render (  )  ; 


			}//endif
			else
			if ( root && root.visibility)	{
			
			 
			 var visib =  ( root.visibility && root.visibility !== "undefined" ) ?root.visibility:2 ; 
			 node = {pid:0 , text:root.text , toolTip:root.toolTip , suspended:""+root.suspended , visibility: ( root.visibility === "undefined" ) ?2:root.visibility , typeOfStr: ( root.typeOfStr ) ?root.typeOfStr:"EL" , uniqueness: ( root.uniqueness === "undefined" ) ?"true":root.uniqueness,nodetype: ( root.nodetype === "undefined" ) ?"":root.nodetype} ;  //EL = Entrust loan  //because  always pid=0 for root 
	
	// Modified above for different node

			 if ( root && root.dbid ) 
				node.dbid = root.dbid ; 
			 else
				node.dbid = -1 ;   //default dbid is equal to -1
			 

			 cc.addNewNode ( node )  ;  // this function is putting the nodes in model

			}//end else

			}catch ( e ) 
			{
			alert  ("addChart="+ e )  ; 
			}//end of catch

		} , 

	getNodeId: function ( cc , json , pid ) {
	 
		var t = cc.getNodeId ( json , pid )  ; 
		return t ; 
	} , 
	
	configure: function ( cc , json ) {
	 
		cc.configureChart ( json )  ; 
	} , 
	
	nodeEventHandler: function  ( cc , eventName , functionName ) {
	 
		cc.nodeEventHandler ( eventName , functionName )  ; 
	} , 
	
	lineEventHandler: function  ( cc , eventName , functionName ) {
	 
		cc.lineEventHandler ( eventName , functionName )  ; 
	} , 

	getReference: function ( cc , id ) {  //cc to maitain consistency
	 
		if  ( id  >= 1  ) {
		 
			return new iportal.orgviewcomponent.Node ( id )  ; 
		}
		else
			return id ; 
	} , 
	
	locate:function  ( cc , accnoStr ) {
	 
		var t = cc.locate ( accnoStr )  ; 
		return t ; 
	}




}//end of OrgViewPrototype




iportal.orgviewcomponent.Node=function ( id ) {
  
	if (id !== undefined )
  {
  
  id=iportal.orgviewcomponent.OrgViewConfig (  ).getNumericId(id);
	this.id = +id ; 
  }
	

}//end of Node



iportal.orgviewcomponent.Node.prototype = {
	
	addNode:function ( cc , json , desti ) {
	 
		cc.addNode ( json , desti )  ; 
	} , 

	collapse:function ( cc , that ) {
	 
		cc.collapse ( that )  ; 
	} , 

	expand:function ( cc , that ) {
	 
		cc.expand ( that )  ; 
	} , 
	
	deleteIt:function ( cc , that ) {

		cc.deleteIt ( that )  ; 
	} , 

	
	detach:function ( cc , that ) {
	 
		cc.detach ( that )  ; 
	} , 

	attach:function ( cc , that ) {
	 
		cc.attach ( that )  ; 
	} , 

	setText:function ( cc , json , that ) {
	 
		cc.setText ( json , that )  ; 
	} , 
		
	setFlow:function ( cc , val , that ) {
	 
		cc.setFlow ( val , that )  ; 
	} , 

	setToolTip:function ( cc , html , that ) {
	 
		cc.setToolTip ( html , that )  ; 
	} , 

	getChildIds:function ( cc , that ) {
	 
		var t = cc.getChildIds ( that )  ; 
		return t ; 
	} , 
	setBgColor:function ( cc , color , that ) {
	 
	  cc.setBgColor ( color , that )  ; 
	}


}//end of Node.prototype 



iportal.orgviewcomponent.OrgViewPanel = function (  ) {
 
var cc = iportal.orgviewcomponent.OrgViewConfig (  )  ;			//uses factory pattern
var nd =  new iportal.orgviewcomponent.Node (  )  ;				//simple class
var ovp = new iportal.orgviewcomponent.OrgView (  )  ;			//simple class

var orgViewPanelInterface = {} ; 


orgViewPanelInterface.setOuterDiv = function(divName){
	cc.setOuterDiv(divName);
}//end of setOuterDiv
orgViewPanelInterface.addChart = function ( protoData ) {
	 

	ovp.addChart ( cc , protoData )  ; 

	}//end of addChart

orgViewPanelInterface.configure = function ( json ) {
	 
		ovp.configure ( cc , json )  ; 
	}

	
orgViewPanelInterface.getNodeId = function ( json , pid ) {
	 
		var t = ovp.getNodeId ( cc , json , pid )  ; 
		return t ; 
	}


orgViewPanelInterface.nodeEventHandler = function ( json , pid ) {
	 
		ovp.nodeEventHandler ( cc , json , pid )  ; 
	}

orgViewPanelInterface.lineEventHandler = function ( eventName , functionName ) {
	 
		ovp.lineEventHandler ( cc , eventName , functionName )  ; 
	}
orgViewPanelInterface.getReference = function ( id ) {
	 
	var t = ovp.getReference ( cc , id )  ; 
	return t ; 
	}

orgViewPanelInterface.locate = function ( accnoStr ) {
	 
	var t = ovp.locate ( cc , accnoStr )  ; 
	return t ; 
	}

//---------------Node related -----------//

orgViewPanelInterface.setNodeID = function(inputID){// avoid confilict with cashcon panel and ManageStructure panel by differentiating the differnet range of IDs.
	cc.setNodeID(inputID);
}//end of setNodeID


orgViewPanelInterface.addNode = function ( json , desti ) {
	 
		
		if (isNaN(desti)) {

				nd.addNode ( cc , json , desti )  ; 
		}
		else
			nd.addNode (cc, json , new iportal.orgviewcomponent.Node ( desti ));
	}

orgViewPanelInterface.collapse = function ( that ) {
	 

		if (isNaN(that))
		{
			nd.collapse ( cc , that )  ; 
		}
		else
		{
			var id= cc.getNumericId ( that ) ;
			nd.collapse ( cc , new iportal.orgviewcomponent.Node ( id ) )  ; 
		}


	}
orgViewPanelInterface.expand = function ( that ) {
	
	 if (isNaN(that))
		{
			nd.expand ( cc , that )  ; 
		}
		else
		{
			var id= cc.getNumericId ( that ) ;
			nd.expand ( cc , new iportal.orgviewcomponent.Node ( id ) )  ; 
		}
		
	}

orgViewPanelInterface.deleteIt = function ( that ) {
	 
		nd.deleteIt ( cc , that )  ; 
	}

orgViewPanelInterface.detach = function ( that ) {
	 
		nd.detach ( cc , that )  ; 
	}



orgViewPanelInterface.setText = function ( json , that ) {
	 
		nd.setText ( cc , json , that )  ; 
	}

orgViewPanelInterface.setFlow = function ( val , that ) {
	 
		nd.setFlow ( cc , val , that )  ; 
	}

orgViewPanelInterface.setToolTip = function ( html , that ) {
	 
		nd.setToolTip ( cc , html , that )  ; 
	}

orgViewPanelInterface.getToolTip = function ( idno ) {
	 
		var t = cc.getToolTip( idno )  ; 
		
		return t;
	}

orgViewPanelInterface.getChildIds = function ( that ) {
	 
		var t = nd.getChildIds ( cc , that )  ; 
		return t ; 
	}

orgViewPanelInterface.setBgColor = function ( color , that ) {
			nd.setBgColor ( cc , color , that )  ; 
	}


orgViewPanelInterface.getInstDetail = function ( id )
	{
		var t=cc.getInstDetail(id);
		return t;
	}

orgViewPanelInterface.getNumericId = function ( id )
	{
		var t=cc.getNumericId ( id );
		return t;
	}


orgViewPanelInterface.detach = function ( that  ) { 

	 if ( isNaN ( that ) ) 
	    cc.detach (   that )  ; 
	 else
		cc.detach (  new iportal.orgviewcomponent.Node (that) )  ; 

	}




orgViewPanelInterface.attach = function ( src,tar  ) { ////that=BB

	 if ( isNaN ( src ) ) //means an object
	    cc.attachNode (   src, tar )  ; 
	

	}


orgViewPanelInterface.showModel = function (   ) { 

		    cc.showModel (  )  ; 
	}
orgViewPanelInterface.setHighlightedNode = function ( key,val ) { 

   return cc.setHighlightedNode ( key,val  )  ; 
}
orgViewPanelInterface.clearHighlightedNide = function (  ) { 

    cc.clearHighlightedNide (   )  ; 
}
orgViewPanelInterface.setFocusOnNode = function ( node ,isNext) { 

     return cc.setFocusOnNode ( node  ,isNext)  ; 
}


orgViewPanelInterface.setNodeTextFormator = function ( fname ) {
	 
		cc.setNodeTextFormator ( fname )  ; 
	}


orgViewPanelInterface.getCompleteNode = function ( node ) {  
	var arr=null;
	 if (isNaN(node)) {
	 	arr=cc.getCompleteNode ( node )  ; 
	 }
	 else
			arr=cc.getCompleteNode ( new iportal.orgviewcomponent.Node( node ) )  ;

	return arr;
	}//end of getCompleteNode

orgViewPanelInterface.getNodesChildIds = function ( id  ) {
	var arr = cc.getNodesChildIds ( id ) ;
	return arr;
}// end of getJustChildIds
return orgViewPanelInterface ; 
}