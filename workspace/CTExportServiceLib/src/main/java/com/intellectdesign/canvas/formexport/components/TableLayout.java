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
import java.util.List;

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

import com.intellectdesign.canvas.formexport.framework.FormExportItemCreator;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;

/**
 * This class constructs the table layouts which will arrange the items on after the other from left to right.
 * 
 * @version 1.0
 */
public class TableLayout implements Renderable
{
	FormExportModel formModel;
	String itemId;

	private TableLayout(){
		
	}
	/**
	 * Constructor of the class which is associated with the params
	 * 
	 * @param formModel
	 * @param itemId
	 */
	public TableLayout(FormExportModel formModel, String itemId)
	{
		this.formModel = formModel;
		this.itemId = itemId;
	}

	/**
	 * This method creates and renders a Table Layout and renders as HTML component
	 * 
	 * @param html
	 * @return void
	 * @throws IOException
	 */
	public void renderOn(HtmlCanvas html) throws IOException
	{

		// Generalize the TR TD generation

		// and should go through the form creator through respective components

		FormExportItemCreator itemCreator = new FormExportItemCreator(formModel, itemId);

		List itemArray = itemCreator.getChildItems();

		if (itemArray == null)
		{
			return;
		}
		String stylecss="background-color:#fff;border: 1px solid #939598;";

		html = html.table(new HtmlAttributes().width("100%").cellspacing("0").cellpadding("0"));

		for (int itemIndex = 0; itemIndex < itemArray.size();)
		{
			html = html.tr();
			for (int tempColCount = 0; tempColCount < 2; tempColCount++)
			{
				if (itemIndex < itemArray.size())
				{
					html = html.render(itemCreator.getItemRender((String) itemArray.get(itemIndex)));
					itemIndex++;
				}
			}

			html = html._tr();
		}

		html = html._table();

	}
}
