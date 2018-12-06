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
/**
 * 
 * @param element
 * @param handler
 * @returns {FastButton}
 */ 
/**
 * 
 * @param element
 * @param handler
 * @returns {FastButton}
 */ 
function FastButton(element, handler) {
            this.element = element;
            this.handler = handler;
            element.addEventListener('touchstart', this, false);
         };
         FastButton.prototype.handleEvent = function(event) {
            switch (event.type) {
               case 'touchstart': this.onTouchStart(event); break;
               case 'touchmove': this.onTouchMove(event); break;
               case 'touchend': this.onClick(event); break;
               case 'click': this.onClick(event); break;
            }
         };
         FastButton.prototype.onTouchStart = function(event) {
             event.stopPropagation();
            this.element.addEventListener('touchend', this, false);
            document.body.addEventListener('touchmove', this, false);
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
 isMoving = false;
         };
         FastButton.prototype.onTouchMove = function(event) {
            if(Math.abs(event.touches[0].clientX - this.startX) > 10 || Math.abs(event.touches[0].clientY - this.startY) > 10) {
               this.reset();
            }
         };
         FastButton.prototype.onClick = function(event) {
            this.reset();
            this.handler(event);
            if(event.type == 'touchend') {
               preventGhostClick(this.startX, this.startY);
            }
         };
         FastButton.prototype.reset = function() {
            this.element.removeEventListener('touchend', this, false);
            document.body.removeEventListener('touchmove', this, false);
         };
         function preventGhostClick(x, y) {
            coordinates.push(x, y);
            window.setTimeout(gpop, 2500);
         };
         function gpop() {
            coordinates.splice(0, 2);
         };
         function gonClick(event) {
            for(var i = 0; i < coordinates.length; i += 2) {
               var x = coordinates[i];
               var y = coordinates[i + 1];
               if(Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                  event.stopPropagation();
                  event.preventDefault();
               }
            }
         };
         document.addEventListener('click', gonClick, true);
         var coordinates = [];
         function initFastButtons() {
 new FastButton(document.getElementById("fastclick"), goSomewhere);
         };
         function goSomewhere() {
 var theTarget = document.elementFromPoint(this.startX, this.startY);
 if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
 
 var theEvent = document.createEvent('MouseEvents');
 theEvent.initEvent('click', true, true);
 theTarget.dispatchEvent(theEvent);
         };