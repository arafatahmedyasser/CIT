/**
\ * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.formdefinition.addinfo.AdditionalDataCodeValue;

/**
 * This class handles the form definition configuration.
 * 
 * @version 1.0
 */
public class FormDefinition extends BaseFormDefinition
{

	/**
	 * Default Serial version UID
	 */
	private static final long serialVersionUID = 1L;

	private String formId;
	private String formDesc;
	private String formTitle;
	private String layout;
	private String totalColumns;
	private List<BaseFormDefinition> childItems;
	private List<String> childForms;
	private String bundleKey;
	private String datasourceClass;

	/* A variable labelAlignType has been added to hold labels alignment configuration for the form */
	private String labelAlignType;

	private String formLogo;

	private String channelId;
	
	private String itemType;
	
	
	

	/**
	 * This method returns the item type
	 * 
	 * @return itemType - String value of the Item Type
	 */
	public String getItemType()
	{
		return itemType;
	}

	/**
	 * This class sets the item type
	 * 
	 * @param itemType - String value of the itemType 
	 */
	public void setItemType(String itemType)
	{
		this.itemType = itemType;
	}

	/**
	 * A private variable which will be used within the class. 
	 * The variable will be used to determine the label width of the components.
	 * 
	 * */
	private String labelCharCount;

	/**
	 * This method gets the total characters allowed for item labels 
	 * 
	 * @return labelCharCount - String value of the Label Character Count
	 */
	public String getLabelCharCount()
	{
		return labelCharCount;
	}

	/**
	 * This method sets the label Character Count
	 * 
	 * @param labelCharCount - String value of the label Character Count
	 */
	public void setLabelCharCount(String labelCharCount)
	{
		this.labelCharCount = labelCharCount;
	}

	/**
	 * This class provides the form logo path
	 * 
	 * @return formLogo - String value of the form logo
	 */

	public String getFormLogo()
	{
		return formLogo;
	}

	/**
	 * This sets the form logo path
	 * 
	 * @param formLogo - String value of the logo path
	 */

	public void setFormLogo(String formLogo)
	{
		this.formLogo = formLogo;
	}

	/**
	 * initialMultiplicity: It has been added for the intial multiplicity of the subform.
	 * Currently used as an indicator whether the sub form is a multi sub form or not. 
	 * Possible Values:Currently 2 or more
	 */

	private String initialMultiplicity;

	/**
	 * This class is used to get InitialMultiplicity
	 * 
	 * @return initialMultiplicity - String value of the InitialMultiplicity
	 * 
	 */

	public String getInitialMultiplicity()
	{
		return initialMultiplicity;
	}

	/**
	 * This class is used to set Initial Multipli city
	 * 
	 * @param InitialMultiplicity - String value of the InitialMultiplicity
	 */

	public void setInitialMultiplicity(String initialMultiplicity)
	{
		this.initialMultiplicity = initialMultiplicity;
	}

	private List<BaseFormDefinition> addDataDrivenItems;

	private Map<String, List<AdditionalDataCodeValue>> additionalData;

	/**
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#clone()
	 */
	@Override
	/**
	 *  This class is used to create copy of the current Form Definition object
	  
	 * @return - Object
	 * @throws CloneNotSupportedException
	   
	 */
	protected Object clone() throws CloneNotSupportedException
	{
		FormDefinition def = (FormDefinition) super.clone();
		List<BaseFormDefinition> clChildItems = new ArrayList<BaseFormDefinition>();
		List<BaseFormDefinition> clAddDataDrivenItems = new ArrayList<BaseFormDefinition>();
		if (def.childItems != null)
		{
			for (BaseFormDefinition bDef : def.childItems)
			{
				clChildItems.add((BaseFormDefinition) bDef.clone());
			}
		}
		def.setChildItems(clChildItems);

		if (def.addDataDrivenItems != null)
		{
			for (BaseFormDefinition bDef : def.addDataDrivenItems)
			{
				clAddDataDrivenItems.add((BaseFormDefinition) bDef.clone());
			}
		}
		def.setAddDataDrivenItems(clAddDataDrivenItems);
		def.setAdditionalData(null);
		return def;
	}

	/**
	 * This is a default constructor
	 */
	public FormDefinition()
	{
	}

	/**
	 * This is an alternative constructor that accepts a hashmap of form definition data 
	 * and associate it to appropriate Form Definition object.
	 * 
	 * @param def - Mapping form defintion column keys and values  
	 * 
	 */
	public FormDefinition(Map<String, String> def)
	{
		if (def != null)
		{
			formId = def.get("FORM_ID");
			itemId = def.get("FORM_ID");
			formDesc = def.get("FORM_DESC");
			formTitle = def.get("FORM_TITLE");
			layout = def.get("LAYOUT");
			totalColumns = def.get("TOTAL_COLUMNS");
			setBundleKey(def.get("BUNDLE_KEY"));
			datasourceClass = def.get("DATASOURCE_CLASS");
			formLogo = def.get("FORM_LOGO");// FW_134
			labelAlignType = def.get(FormDefinitionConstants.LABEL_ALIGN_TYPE);
			itemType = def.get(FormDefinitionConstants.ITEM_TYPE);
			initialMultiplicity = def.get("INITIAL_MULTIPLICITY");
			channelId = def.get("CHANNEL_ID");
			labelCharCount = def.get(FormDefinitionConstants.LABEL_CHAR_COUNT);
		}
	}

	/**
	 * The method is intended to populate all the immediate 
	 * children components that would need addition data support in an ArrayList. 
	 * 
	 * This list will be later used by FormManager for creating additional supporting data for these fiels
	 * as a part of the meta data request.
	 * 
	 * @param baseObjDef - BaseFormDefinition object
	 */
	public void addDataDrivenItems(BaseFormDefinition baseObjDef)
	{
		if (addDataDrivenItems == null)
		{
			addDataDrivenItems = new ArrayList<BaseFormDefinition>();
		}
		addDataDrivenItems.add(baseObjDef);
	}

	/**
	 * This method returns the list of all the child items 
	 * that would need additional data support.
	 * 
	 * @return addDataDrivenItems - List object that contains the items those need additional data
	 */
	public List<BaseFormDefinition> getAddDataDrivenItems()
	{
		return addDataDrivenItems;
	}

	/**
	 * This method converts the JSONString representation of the current Form Definition object.
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#toJSONString()
	 * @param includeChildren
	 */
	@Override
	public String toJSONString(boolean includeChildren)
	{
		return toJSONString(includeChildren, null);
	}

	/**
	 * This method is invoked by formItemDefinition to combine the 
	 * string representation of the formDefinition Json with formItemDefinition Json
	 * 
	 * @param includeChildren - Boolean value indicates whether to include the child items or not
	 * @param itemInfo - FormItemDefinition object to be appended with the JSONString of the Form Definition  
	 */

	public String toJSONString(boolean includeChildren, FormItemDefinition itemInfo)
	{
		StringBuffer sb = new StringBuffer();

		sb.append("f1:" + "'" + formId + "',");

		sb.append("f5:" + "'Y',");

		sb.append("f2:" + "'" + formDesc + "',");

		sb.append("f3:" + "'" + formTitle + "',");

		sb.append("l2:" + "'" + layout + "',");

		sb.append("b1:" + "'" + bundleKey + "',");

		/* Appending labelAlignType config value to FormDefinition JSON string */
		sb.append("l1:" + "'" + labelAlignType + "',");

		sb.append("t1:" + "'" + totalColumns + "',");
		sb.append("f4:" + "'" + formLogo + "',");
		sb.append("channelId:" + "'" + channelId + "',");
		sb.append("i3:" + "'" + itemType + "',");
		sb.append("i4:" + "'" + initialMultiplicity + "',");
		sb.append("p5:" + "'" + labelCharCount + "',");

		/**
		 * If the received FormItemDefinition object parameter is not null ,column and row span attributes are appended
		 * to this current form .
		 */
		if (itemInfo != null)
		{
			sb.append("c4:" + "'" + itemInfo.getColSpan() + "',");
			sb.append("r6:" + "'" + itemInfo.getRowSpan() + "',");

			/**
			 * Sending the item id as a part of form.Now a sub form can also be treated as an item which will help to
			 * find the subform easily in the warpper panel *
			 * */
			sb.append("i2:" + "'" + itemInfo.getItemId() + "',");

		}
		sb.append("a3: {");
		if (additionalData != null && additionalData.size() > 0)
		{
			StringBuffer sbCodeVal = null;
			StringBuffer sbDataMap = new StringBuffer();
			String codeValStr = null;
			String dataMapStr = null;
			for (Map.Entry<String, List<AdditionalDataCodeValue>> dataMap : additionalData.entrySet())
			{
				sbCodeVal = new StringBuffer();
				sbDataMap.append(dataMap.getKey() + ": [");
				if (dataMap.getValue() != null)
				{
					for (AdditionalDataCodeValue codeVal : dataMap.getValue())
					{

						sbCodeVal.append(codeVal.toJSONString() + ",");
					}
				}
				codeValStr = sbCodeVal.toString();
				if (codeValStr.length() > 0)
				{
					sbDataMap.append(codeValStr.substring(0, codeValStr.length() - 1));
				} else
				{
					sbDataMap.append(codeValStr);
				}
				sbDataMap.append("],");
			}
			dataMapStr = sbDataMap.toString();
			sb.append(dataMapStr.substring(0, dataMapStr.length() - 1));
		}
		sb.append("},");

		sb.append("a4: [");
		if (null != addDataDrivenItems)
		{
			StringBuffer fieldsBuff = new StringBuffer();
			for (Object itemObj : addDataDrivenItems)
			{
				if (null != itemObj)
				{
					FormItemDefinition itemDefn = (FormItemDefinition) itemObj;
					String flag = itemDefn.getCacheDataInd();
					if ("N".equals(flag))
					{
						fieldsBuff.append("\"" + itemDefn.getItemId() + "\",");
					}
				}
			}
			String fieldsStr = fieldsBuff.toString();
			if (fieldsStr != null && fieldsStr.length() > 0)
			{
				sb.append(fieldsStr.substring(0, fieldsStr.length() - 1));
			}
		}
		sb.append("],");
		// populating datadrivenfields that doesn't need data to be cached--
		// Starts

		if (includeChildren)
		{
			sb.append("b1:" + "'" + bundleKey + "',");
		} else
		{
			sb.append("b1:" + "'" + bundleKey + "'");
		}
		if (includeChildren)
		{
			StringBuffer sb1 = new StringBuffer();
			if (childItems != null)
			{
				for (BaseFormDefinition mn : childItems)
				{
					sb1.append(mn.toJSONString(false) + ",");
				}
				String nodes = sb1.toString();
				if (nodes.length() > 0)
				{
					nodes = nodes.substring(0, nodes.length() - 1);
				}
				sb.append("children:" + "[" + nodes + "]");
			} else
			{
				sb.append("\"children\":" + "[]");
			}
		}
		return "{" + sb.toString() + "}";
	}

	/**
	 * This method adds the sub Form Id to the current FormDefinition object
	 * 
	 * @param formid - String value of the form Id to add
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#addForm(java.lang.String )
	 */
	@Override
	public void addForm(String formid)
	{
		if (childForms == null)
		{
			childForms = new ArrayList<String>();
		}

		for (String id : childForms)
		{
			if (id.equals(formid))
			{
				return;
			}
		}
		childForms.add(formid);
	}

	/**
	 * This method is used to add the child
	 * 
	 * @param baseObjDef to add
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#addChild(com.intellectdesign
	 *      .cib.formdefinition.BaseFormDefinition)
	 */
	@Override
	public void addChild(BaseFormDefinition baseObjDef)
	{
		if (childItems == null)
		{
			childItems = new ArrayList<BaseFormDefinition>();
		}
		for (BaseFormDefinition baseObj : childItems)
		{
			if (baseObj.getItemId().equals(baseObjDef.getItemId()))
			{
				return;
			}
		}
		childItems.add(baseObjDef);

	}

	/**
	 * This method gets the child forms of the current Form
	 * 
	 * @return List - object that contains all the forms added as sub form
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#getChildren()
	 */
	@Override
	public List getChildren()
	{
		return childForms;
	}

	/**
	 * This method gets the current FormId
	 * 
	 * @return formId - String value of the FormId
	 */
	public String getFormId()
	{
		return formId;
	}

	/**
	 * This method sets the Form id
	 * 
	 * @param formId - String value of the Form Id
	 */
	public void setFormId(String formId)
	{
		this.formId = formId;
	}

	/**
	 * This method returns the Form Description 
	 * 
	 * @return formDesc - String value of the Form Description
	 */
	public String getFormDesc()
	{
		return formDesc;
	}

	/**
	 * This method sets the Form Description
	 * 
	 * @param formDesc - String value of the Form Description
	 */
	public void setFormDesc(String formDesc)
	{
		this.formDesc = formDesc;
	}

	/**
	 * This method gets the formTitle
	 * 
	 * @return formTitle - String value of the Form Title
	 */
	public String getFormTitle()
	{
		return formTitle;
	}

	/**
	 * This method sets the formTitle
	 * 
	 * @param formTitle - String value of the Form Title
	 */
	public void setFormTitle(String formTitle)
	{
		this.formTitle = formTitle;
	}

	/**
	 * This method returns the Form Layout 
	 * 
	 * @return layout - String value of the Form Layout
	 */
	public String getLayout()
	{
		return layout;
	}

	/**
	 * This method sets the layout
	 * 
	 * @param layout - String value of the layout 
	 */
	public void setLayout(String layout)
	{
		this.layout = layout;
	}

	/**
	 * This method returns the total Columns for laying out the form items on the form
	 * 
	 * @return totalColumns - String value of the number of Columns 
	 */
	public String getTotalColumns()
	{
		return totalColumns;
	}

	/**
	 * This method sets the total Columns
	 * 
	 * @param totalColumns - String value of the total Columns
	 */
	public void setTotalColumns(String totalColumns)
	{
		this.totalColumns = totalColumns;
	}

	/**
	 * This method gets the string value of the bundle Key
	 * 
	 * @return bundleKey - String value of the bundle key
	 */
	public String getBundleKey()
	{
		return bundleKey;
	}

	/**
	 * This method sets the bundleKey. If the passing value is "canvas", 
	 * the bundle key will provide the labels from the canvas-default property files.
	 * 
	 * @param bundleKey - String value of the bundle key. 
	 */
	public void setBundleKey(String bundleKey)
	{
		String fwBundleKey = "canvas-default";

		if ("canvas".equals(bundleKey))
		{
			bundleKey = fwBundleKey;
		}
		this.bundleKey = bundleKey;
	}

	/**
	 * This method gets the Label Align Type
	 * 
	 * @return labelAlignType - String value of the Label Alignment Type
	 */
	public String getLabelAlignType()
	{
		return labelAlignType;
	}

	/**
	 * This method sets the Label Alignment Type
	 * 
	 * @param labelAlignType - String value of the Label Alignment Type 
	 */
	public void setLabelAlignType(String labelAlignType)
	{
		this.labelAlignType = labelAlignType;
	}

	/**
	 * This method provides the additionalData mapping 
	 * 
	 * @return additionalData - Mapping of Item and their Additional Data Code Value
	 */
	public Map<String, List<AdditionalDataCodeValue>> getAdditionalData()
	{
		return additionalData;
	}

	/**
	 * This method sets the mapping of Item Id and their additionalData
	 * 
	 * @param additionalData - Mapping of the the additionalData 
	 */
	public void setAdditionalData(Map<String, List<AdditionalDataCodeValue>> additionalData)
	{
		this.additionalData = additionalData;
	}

	/**
	 * This method gets the ChildItems 
	 * 
	 * @return childItems - List of FormDefinition objects that contains the children of the Form  
	 */
	public List<BaseFormDefinition> getChildItems()
	{
		return childItems;
	}

	/**
	 * This method sets the Child Forms of the current Form item
	 * 
	 * @param childItems - List of FormDefinition object that contains all child items
	 */
	public void setChildItems(List<BaseFormDefinition> childItems)
	{
		this.childItems = childItems;
	}

	/**
	 * This method sets the list of data driven Items
	 * 
	 * @param addDataDrivenItems - String value of the DataDrivenItems
	 */
	public void setAddDataDrivenItems(List<BaseFormDefinition> addDataDrivenItems)
	{
		this.addDataDrivenItems = addDataDrivenItems;
	}

	/**
	 * This method returns the Data Source Class path
	 * 
	 * @return datasourceClass - String value of the Data source class path
	 */
	public String getDatasourceClass()
	{
		return datasourceClass;
	}

	/**
	 * This method is used to set the Datasource Class path
	 * 
	 * @param datasourceClass - String value of the Data source class path
	 */
	public void setDatasourceClass(String datasourceClass)
	{
		this.datasourceClass = datasourceClass;
	}

	/**
	 * This method gets the channelId for the form
	 * 
	 * @return channelId - String value of the Channel Id
	 */
	public String getChannelId()
	{
		return channelId;
	}

	/**
	 * This method gets the channelId for the form
	 * 
	 * @param channelId - String value of the Channel Id
	 */
	public void setChannelId(String channelId)
	{
		this.channelId = channelId;
	}

	/**
	 * This method provides the JSONString representation of Form Definition object.
	 * 
	 * @return toString - JSONString representation of Form Definition object
	 * 
	 * @see com.intellectdesign.canvas.formdefinition.BaseFormDefinition#toJSONString() 
	 */
	@Override
	public String toString()
	{
		return toJSONString();
	}
}
