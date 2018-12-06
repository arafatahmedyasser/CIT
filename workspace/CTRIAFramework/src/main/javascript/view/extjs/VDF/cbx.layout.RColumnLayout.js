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
Ext.ns('cbx.layout');
/**
 * @class cbx.layout.RColumnLayout
 * @extends Ext.layout.ContainerLayout
 * <p>This is the layout style of choice for creating structural layouts in a multi-column format where the width of
 * each column can be specified as a percentage or fixed width, but the height is allowed to vary based on the content.
 * This class is intended to be extended or created via the layout:'column' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.</p>
 * <p>RColumnLayout does not have any direct config options (other than inherited ones), but it does support a
 * specific config property of <b><tt>columnWidth</tt></b> that can be included in the config of any panel added to it.  The
 * layout will use the columnWidth (if present) or width of each panel during layout to determine how to size each panel.
 * If width or columnWidth is not specified for a given panel, its width will default to the panel's width (or auto).</p>
 * <p>The width property is always evaluated as pixels, and must be a number greater than or equal to 1.
 * The columnWidth property is always evaluated as a percentage, and must be a decimal value greater than 0 and
 * less than 1 (e.g., .25).</p>
 * <p>The basic rules for specifying column widths are pretty simple.  The logic makes two passes through the
 * set of contained panels.  During the first layout pass, all panels that either have a fixed width or none
 * specified (auto) are skipped, but their widths are subtracted from the overall container width.  During the second
 * pass, all panels with columnWidths are assigned pixel widths in proportion to their percentages based on
 * the total <b>remaining</b> container width.  In other words, percentage width panels are designed to fill the space
 * left over by all the fixed-width and/or auto-width panels.  Because of this, while you can specify any number of columns
 * with different percentages, the columnWidths must always add up to 1 (or 100%) when added together, otherwise your
 * layout may not render as expected.  Example usage:</p>
 * <pre><code>
// All columns are percentages -- they must add up to 1
var p = new Ext.Panel({
    title: 'Column Layout - Percentage Only',
    layout:'column',
    items: [{
        title: 'Column 1',
        columnWidth: .25 
    },{
        title: 'Column 2',
        columnWidth: .6
    },{
        title: 'Column 3',
        columnWidth: .15
    }]
});

// Mix of width and columnWidth -- all columnWidth values must add up
// to 1. The first column will take up exactly 120px, and the last two
// columns will fill the remaining container width.
var p = new Ext.Panel({
    title: 'Column Layout - Mixed',
    layout:'column',
    items: [{
        title: 'Column 1',
        width: 120
    },{
        title: 'Column 2',
        columnWidth: .8
    },{
        title: 'Column 3',
        columnWidth: .2
    }]
});
</code></pre>
 */

cbx.layout.RColumnLayout = Ext.extend(Ext.layout.ContainerLayout, { 
        monitorResize: true, 
        extraCls: "x-column", 
        scrollOffset: 0, 
        margin: 0, 
        split: true, 
        fitHeight: false, 
        background: false, 
 
        // private 
        isValidParent: function(c, target) { 
            return this.innerCt && (c.getPositionEl ? c.getPositionEl() : c.getEl()).dom.parentNode == this.innerCt.dom; 
        }, 
 
        renderAll: function(ct, target) { 
            if (this.split && !this.splitBars) { 
                this.splitBars = []; 
                this.margin = this.margin || 5; 
            } 
 
            cbx.layout.RColumnLayout.superclass.renderAll.apply(this, arguments); 
        }, 
 
        getLayoutTargetSize: function() { 
            var target = this.container.getLayoutTarget(), 
        ret; 
 
            if (target) { 
                ret = target.getViewSize(); 
 
                // IE in strict mode will return a width of 0 on the 1st pass of getViewSize. 
                // Use getStyleSize to verify the 0 width, the adjustment pass will then work properly 
                // with getViewSize 
                if (Ext.isIE && Ext.isStrict && ret.width === 0) { 
                    ret = target.getStyleSize(); 
                } 
 
                ret.width -= (target.getPadding("lr") + this.scrollOffset); 
                ret.height -= target.getPadding("tb"); 
            } 
 
            return ret; 
        }, 
 
        // private 
        onLayout: function(ct, target) {
	        var cs = ct.items.items, len = cs.length, c, cel, i;

	        if(!this.innerCt){
	            target.addClass('x-column-layout-ct');

	            // the innerCt prevents wrapping and shuffling while
	            // the container is resizing
	            this.innerCt = target.createChild({cls:'x-column-inner', style: {position: 'relative'}});
	            this.innerCt.createChild({cls:'x-clear'});
	        }
	        this.renderAll(ct, this.innerCt);

	        var size = this.getLayoutTargetSize();

	        if(size.width < 1 && size.height < 1){ // display none?
	            return;
	        }

	        var w = size.width - target.getPadding('lr') - this.scrollOffset,
	            h = size.height - target.getPadding('tb');
	        var pw = this.availableWidth = w;
	        if (this.split) {
	            this.minWidth = Math.min(pw / len, 100);
	            this.maxWidth = pw - ((this.minWidth + 5) * (len ? (len - 1) : 1));
	        }

//	      Set the size of the column container. Set the height if we are configure to fit the height.
	        this.innerCt.setSize(w, this.fitHeight ? h : undefined);
	        if(this.fitHeight){
	            this.innerCt.setSize(w, h);
	        } else {
	            this.innerCt.setWidth(w);
	        }
	        // some columns can be percentages while others are fixed
	        // so we need to make 2 passes
			var lastProportionedColumn;
	        for(i = 0; i < len; i++){
	            c = cs[i];
	            cel = c.getEl();

//	          Add the margin
	            if (this.margin && (i < (len - 1))) {
	                cel.setStyle("margin-right", this.margin + 'px');
	            }
	            if(c.columnWidth){
	                lastProportionedColumn = i;
	            } else {
	                pw -= (c.getSize().width + cel.getMargins('lr'));
	            }
	        }

//	      Keep track of remaining unallocated width. Last proportioned column takes all remaining width.
	        var remaining = (pw = pw < 0 ? 0 : pw);

	        var splitterPos = 0;
	        for(i = 0; i < len; i++){
	            c = cs[i];
	            cel = c.getEl();
	            if(c.columnWidth){
	            	var w = (i == lastProportionedColumn) ? remaining : Math.floor(c.columnWidth * pw);
	                if(this.fitHeight){
	                    c.setSize(w - cel.getMargins('lr'), h);
	                } else {
	                    c.setWidth(w - cel.getMargins('lr'));
	                }
	                remaining -= w;
	            } else if (this.fitHeight) {
	                c.setHeight(h);
	            }

//	          Create the splitbar between the current item and the next which resizes the current item.
	            if (this.split) {
	                var cw = cel.getWidth();

	                if (i < (len - 1)) {
	                    splitterPos += cw;
	                    if (this.splitBars[i]) {
	                        this.splitBars[i].el.setHeight(h);
	                    } else {
	                    	var style = iportal.preferences.isLangDirectionRTL()==true?
	                    					{top: '0px',right: splitterPos + 'px',height: h + 'px'}
	                    						:{top: '0px',left: splitterPos + 'px',height: h + 'px'};
		                    if(iportal.preferences.isLangDirectionRTL()==true){
	                        this.splitBars[i] = new Ext.SplitBar(this.innerCt.createChild({
	                            cls: 'x-layout-split x-layout-split-west',
	                            style: style
		                        }), cel,Ext.SplitBar.HORIZONTAL,Ext.SplitBar.RIGHT);
		                    }else{
		                    	this.splitBars[i] = new Ext.SplitBar(this.innerCt.createChild({
		                            cls: 'x-layout-split x-layout-split-west',
		                            style: style
	                        }), cel);
		                    }
	                        this.splitBars[i].index = i;
	                        this.splitBars[i].leftComponent = c;
	                        this.splitBars[i].addListener('resize', this.onColumnResize, this);
	                        this.splitBars[i].addListener('beforeresize', this.onBeforeResize, this);
	                        this.splitBars[i].minSize = this.minWidth;
	                    }

//	                  Keep track of splitter position
	                    splitterPos += this.splitBars[i].el.getWidth();
	                }
//	              Initial column widths are a one-off setting if split set
	                delete c.columnWidth;
	            }
	        }

//	      Set maximum item widths.
	        if (this.split) {
	            this.setMaxWidths();
	        }
	    },
	    
	    /**
	     * Added to enable formContainer's min width
	     * 
	     * Will hold valid only for two column layout or greater
	     * 
	     * The splitter will not resize beyond the form container's
	     * min width given by the developer.
	     * 
	     */
	    onBeforeResize : function(sb){
	    	
	    	var rightComponent,rightWidth,leftWidth;
	    	/**
	    	 * Getting the left and right components of the splitter
	    	 */
	    	var leftComponentIndex = this.container.items.indexOf(sb.leftComponent);
	    	if(this.container.items.length>leftComponentIndex+1){
	    		rightComponent = this.container.getComponent(leftComponentIndex+1);
	    	}
	    	/**
	    	 * Checking for the right component.Will fail for a stack layout
	    	 * and hence wont proceed further 
	    	 */
	    	if(rightComponent && sb.leftComponent.resizeWidth){
	    		/**
	    		 * sb.leftComponent.resizeWidth -> The standard dimensions of 
	    		 * formcontainer configured by the developer.The formcontainer
	    		 * will communicate this width to the corresponding portal column
	    		 * which it is sitting in.
	    		 * 
	    		 * sb.leftComponent.newResizeWidth -> This is the new dimension
	    		 * given to the portal column after a successful drag action through
	    		 * the resizer(splitter).
	    		 * 
	    		 *  @logic : If a formcontainer sits in a portal column,the 
	    		 *  resizer should know the min width before initiating the drag 
	    		 *  and hence this listener.This will always look if the 
	    		 *  component being resized is a portal container for forms (or)
	    		 *  context apps.If so,the minsize and the max size will be 
	    		 *  set accordingly.
	    		 *  
	    		 *  This will always allow a formcontainer to be resized more
	    		 *  than its min width,but never below.
	    		 *  
	    		 */
	    		if(sb.leftComponent.newResizeWidth && sb.leftComponent.newResizeWidth>sb.leftComponent.resizeWidth){
	    			leftWidth = sb.leftComponent.newResizeWidth; 
	    		}
	    		else{
	    			leftWidth = sb.leftComponent.resizeWidth;
	    		}
	    		if(sb.leftComponent.containsAppWidget && rightComponent.containsAppWidget){
	    				sb.setMaximumSize(leftWidth);
	    	    		sb.setMinimumSize(leftWidth);
	    		}
	    		else if(sb.leftComponent.containsAppWidget && !rightComponent.containsAppWidget){
		    		sb.setMinimumSize(leftWidth);
	    		}
	    		else if(!sb.leftComponent.containsAppWidget && rightComponent.containsAppWidget){
	    			sb.setMaximumSize(leftWidth);
	    		}
	    		else{
	    			sb.setMaximumSize(this.maxWidth);
	    		}
	    		
	    	}
	    },
	    
        //  On column resize, explicitly size the Components to the left and right of the SplitBar 
        onColumnResize: function(sb, newWidth) { 
            if (sb.dragSpecs.startSize) { 
                sb.leftComponent.setWidth(newWidth); 
 
                var items = this.container.items.items, 
            expansion = newWidth - sb.dragSpecs.startSize, 
            i, 
            c, 
            w, 
            len; 
 
                for (i = sb.index + 1, len = items.length; expansion && i < len; i++) { 
                    c = items[i]; 
                    w = c.el.getWidth(); 
 
                    newWidth = w - expansion; 
                    if (newWidth < this.minWidth) { 
                        c.setWidth(this.minWidth); 
                    } else if (newWidth > this.maxWidth) { 
                        expansion -= (newWidth - this.maxWidth); 
                        c.setWidth(this.maxWidth); 
                    } else { 
                        c.setWidth(c.el.getWidth() - expansion); 
                        break; 
                    } 
                } 
                this.setMaxWidths(); 
            } 
        }, 
 
        setMaxWidths: function() { 
            var items = this.container.items.items, 
        spare = items[items.length - 1].el.dom.offsetWidth - 100, 
        i = items.length - 2; 
 
            for (i; i > -1; i--) { 
                var sb = this.splitBars[i], 
            sbel = sb.el, 
            c = items[i], 
            cel = c.el, 
            itemWidth = cel.dom.offsetWidth; 
 
                if(iportal.preferences.isLangDirectionRTL()==true)
                	sbel.setStyle("right", Math.floor(Ext.lib.Dom.getViewWidth()) - cel.getX() + "px");
                else{
                	sbel.setStyle("left", (cel.getX() - Ext.fly(cel.dom.parentNode).getX() + itemWidth) + "px");
                }
                sb.maxSize = itemWidth + spare; 
                sb.setCurrentSize(itemWidth);
                
                /**
                 * Communicating the new resized width back to the portal column
                 * for the resizer to decide the resize width on before resize 
                 * of the next resize action 
                 */
                c.newResizeWidth = c.resizeWidth && c.newResizeWidth?itemWidth: null;
                if(cbx.isEmpty(c.newResizeWidth)){
                	delete c.newResizeWidth;
                }
                
                spare = itemWidth - 100; 
            } 
        }, 
 
        onResize: function() { 
            if (this.split) { 
                var items = this.container.items.items, tw = 0, c, i, 
                    elWidth; 
 
                if (items[0].rendered) { 
                    for (i = 0; i < items.length; i++) { 
                        c = items[i]; 
                        tw += c.el.getWidth() + c.el.getMargins("lr"); 
                    } 
                    for (i = 0; i < items.length; i++) { 
                        c = items[i]; 
                        elWidth = c.el.getWidth(); 
                        if (elWidth > 0) { 
                            c.columnWidth = (elWidth + c.el.getMargins("lr")) / tw; 
                        } 
                    } 
                } 
            } 
            cbx.layout.RColumnLayout.superclass.onResize.apply(this, arguments); 
        } 
    }); 

 
    Ext.Container.LAYOUTS['rcolumn'] = cbx.layout.RColumnLayout;  