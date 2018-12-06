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

package com.intellectdesign.canvas.formexport.components;

import java.io.IOException;
import java.util.Map;

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

/**
 * The Empty Field class renders the Empty Field that occupies the mapped position on the form. The area marked with
 * Empty Field will be blank and no other items can be placed * This class produces Empty Field HTML component
 * 
 * @version 1.0
 */
public class EmptyField implements Renderable
{
	@SuppressWarnings("unused")
	Map item;

	private EmptyField(){
		
	}
	/**
	 * Constructor of the class which is associated with the params
	 * 
	 * @param item
	 */
	public EmptyField(Map item)
	{
		this.item = item;
	}
	
	
	public void renderOn(HtmlCanvas html) throws IOException {
		renderKey(html);
		renderValue(html);		
	}
	
	private void renderKey(HtmlCanvas html) throws IOException {
		html.td(new HtmlAttributes().width("20%"))
			.div().content(" ")
		._td();
	}
	
	private void renderValue(HtmlCanvas html) throws IOException {
		html.td(new HtmlAttributes().width("30%"))
    		.div().content(" ")
    	._td();
	}
}
