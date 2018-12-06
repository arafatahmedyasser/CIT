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

package com.intellectdesign.canvas.formexport.framework;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.rendersnake.Renderable;

import com.intellectdesign.canvas.formexport.components.Composite;
import com.intellectdesign.canvas.formexport.components.Container;
import com.intellectdesign.canvas.formexport.components.EmptyField;
import com.intellectdesign.canvas.formexport.components.HtmlPanel;
import com.intellectdesign.canvas.formexport.components.LabelField;
import com.intellectdesign.canvas.formexport.components.ListField;
import com.intellectdesign.canvas.formexport.components.ListOfHashMapField;
import com.intellectdesign.canvas.formexport.components.Tabpanel;
import com.intellectdesign.canvas.formexport.components.TextArea;
import com.intellectdesign.canvas.formexport.components.TextField;
import com.intellectdesign.canvas.formexport.components.WidgetPanel;

/**
 * The Item Creator class incharge of creating the corresponding html components eqiuvalent to the components in the
 * screen.
 * 
 * 
 * @version 1.0
 * 
 */
public class FormExportItemCreator
{

	FormExportModel formModel;
	String parentItemId;

	/**
	 * The HashMap incharge of the mapping for the JS component to java html component
	 */
	public static final HashMap<String, String> componentRenderMapping = new HashMap<String, String>()
	{
		public static final long serialVersionUID = 1L;
		{
			// TextField
			put("cbx-amountfield", "TextField");
			put("cbx-datefield", "TextField");
			put("cbx-editablelookup", "TextField");
			put("cbx-spinnerfield", "TextField");
			put("cbx-textfield", "TextField");
			put("cbx-combobox", "TextField");
			//Added for multiselect drop down list in edit mode
			put("cbx-multiselectcombobox", "ListField");
			put("cbx-iconcombobox", "TextField");
			put("cbx-radiogroup", "TextField");
			put("cbx-hyperlink", "TextField"); 

			put("cbx-staticamountfield", "TextField");
			put("cbx-staticcombobox", "TextField");
			//Added for multiselect drop down list in view mode
			put("cbx-staticmultiselectcombobox", "ListField");
			put("cbx-staticdatefield", "TextField");
			put("cbx-staticfield", "TextField");
			put("cbx-radiogroupstaticfield", "TextField");
			put("cbx-checkboxgroupstaticfield", "TextField");
			
			
			//EmptyField
			put("cbx-button", "EmptyField");
			put("cbx-emptycell", "EmptyField");
			put("cbx-hidden", "EmptyField");
			put("cbx-conditionalMandatoryText", "EmptyField");
			put("cbx-mandatoryText", "EmptyField");
			put("cbx-line", "EmptyField");

			// ListField
			put("cbx-checkboxgroup", "ListField");
			//put("cbx-checkboxgroupstaticfield", "ListField");
			put("cbx-itemselector", "ListField");

			// ListOfHashMapField
			put("cbx-fileuploadpanel", "ListOfHashMapField");

			// LabelField
			put("cbx-label", "LabelField");
			put("cbx-title", "LabelField");

			// HtmlPanel
			put("cbx-htmleditor", "HtmlPanel");

			// TextArea
			put("cbx-textarea", "TextArea");
			put("cbx-statictextarea", "TextArea");

			// WidgetPanel
			put("cbx-widgetpanel", "WidgetPanel");
			
			//CompositeField
			put("cbx-compositefield", "Composite");
			
			//Container
			put("cbx-panel", "Container");
			put("cbx-fieldset", "Container");
			put("cbx-lazzypanel", "Container");
			put("cbx-lazzyformpanel", "Container");

			// Tabpanel
			put("cbx-tabpanel", "Tabpanel");

		}
	};

	private FormExportItemCreator() {

	}


	/**
	 * The Constructor of the class that has to be initialized with the params
	 * 
	 * @param formModel
	 * @param parentItemId
	 */
	public FormExportItemCreator(FormExportModel formModel, String parentItemId)
	{
		this.formModel = formModel;
		this.parentItemId = parentItemId;
	}

	/**
	 * The Method incharge of returning the child items
	 * 
	 * @return List childItems
	 */
	public List getChildItems()
	{
		Map screenData = formModel.getScreenFormData();
		Map formData = (Map) screenData.get(parentItemId);
		List itemArray = (List) formData.get("childItem");

		return itemArray;
	}

	/**
	 * The Method incharge returning the exact equivalent component to be rendered
	 * 
	 * @param item
	 * @return Renderable htmlComponent
	 */
	public Renderable getItemRender(String item)
	{
		String arr[]=item.split("@@@");
		String hideLabel="",cellNo="";
		item=arr[0];
		if(arr.length>1)
		{
			hideLabel=arr[1];
			if(arr.length>2)
				cellNo=arr[2];
		}
		Map itemMetadata = formModel.getItemData(item);
		if (itemMetadata == null)
		{
			return new EmptyField(itemMetadata);
		}
		
		String visibleInd = (String)itemMetadata.get("VISIBLE_IND");
		
		String printReqInd = (String)itemMetadata.get("PRINT_REQUIRED_IND");
		
		if(!"Y".equals((String)itemMetadata.get("HIDE_LABEL")) )
			itemMetadata.put("CONTAINER_HIDELABEL", hideLabel);
		
		String itemType = componentRenderMapping.get(itemMetadata.get("itemType"));
		
		if("N".equals(visibleInd) || "N".equals(printReqInd))
			return new EmptyField(itemMetadata);
		else if("TextField".equals(itemType))
			return new TextField(formModel,itemMetadata);
		else if("TextArea".equals(itemType))
			return new TextArea(formModel,itemMetadata);
		else if("EmptyField".equals(itemType))
			return new EmptyField(itemMetadata);
		else if("ListField".equals(itemType))
			return new ListField(formModel,itemMetadata);
		else if("LabelField".equals(itemType))
			return new LabelField(formModel,itemMetadata);
		else if("HtmlPanel".equals(itemType))
			return new HtmlPanel(formModel,itemMetadata);
		else if("WidgetPanel".equals(itemType))
			return new WidgetPanel(formModel,itemMetadata);
		else if("ListOfHashMapField".equals(itemType))
			return new ListOfHashMapField(formModel,itemMetadata);
		else if("Container".equals(itemType))
			return new Container(formModel,item,itemMetadata);
		else if("Tabpanel".equals(itemType))
			return new Tabpanel(formModel,item,itemMetadata);
		else if("Composite".equals(itemType))
			return new Composite(formModel,item,itemMetadata);
		else
			return new EmptyField(itemMetadata);
	}
}
