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
 * */

package com.intellectdesign.canvas.formdefinition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class is for form item definition extends base form definition.
 * 
 * @version 1.0
 */
public class FormItemDefinition extends BaseFormDefinition
{

	/**
	 * Default serial version UID
	 */
	private static final long serialVersionUID = 1L;

	private String formId;
	private String itemId;
	private String parentId;
	private String position;
	private String itemType;
	private String displayNmKey;
	private String plainLbl;
	private String layout;
	private String anchor;
	private String visibleInd;
	private String editableInd;
	private String readOnlyInd;
	private String requiredInd;
	private String bundleKey;
	private String lookupInd;
	private String vType;
	private String minLength;
	private String maxLength;
	private String maxNumLines;
	private String maxCharsPerLine;
	private String rowSpan;
	private String colSpan;
	private String totalColumns;
	private String includeSelectInd;
	private String containerInd;
	private String collapsibelInd;
	private String rawKeys;
	private String rawValues;
	private String dsViewId;
	private String dsKeyColumnId;
	private String dsValueColumnId;
	private List<BaseFormDefinition> childItems;
	private List<String> childForms;
	private String widgetId;
	private String conditionalInd;
	private String cacheDataInd;
	private String ctxContainerInd;
	private String validOnSwitchInd;
	private ArrayList supportedMimeTypes;
	private String multiLangInd;
	private String columnType;
	private String copyPasteInd;
	private FormDefinition formMetaData;
	private String resizableInd;
	/* A variable labelAlignType has been added to hold label alignment configuration for a form field */
	private String labelAlignType;
	private String hideLabel;
	// added a new column to hold the linked currency column.
	private String linkedCurrComp;
	private String appendCurrMode;
	/**
	 * For Editable lookup - associated widget's PRODUCT, SUB-PRODUCT, FUNCTION_CODE as values handling.
	 */
	private String widgetProductCode;
	private String widgetSubProductCode;
	private String widgetFunctionCode;
	
	/**
	 * To say whether this field has to be included in the form print/Export
	 */
	private String printReqInd;
	private String channelId;

	/**
	 * Private variable to hold the label width in an item level
	 * 
	 */
	private String labelCharCount;

	/**
	 * This method gets the label Character Count
	 * 
	 * @return labelCharCount - String value of the label Character count
	 */
	public String getLabelCharCount()
	{
		return labelCharCount;
	}

	/**
	 * This method sets the label Character Count
	 * 
	 * @param labelCharCount - String value of the label Char Count
	 */
	public void setLabelCharCount(String labelCharCount)
	{
		this.labelCharCount = labelCharCount;
	}

	/**
	 * This class gets the value of the  Hide Label Flag
	 * 
	 * @return hideLabel - "Y" or "N"  value indicates whether to hide the label or not
	 */
	public String getHideLabel()
	{
		return hideLabel;
	}

	/**
	 * This class sets the HideLabel flag.
	 * 
	 * @param hideLabel -  "Y" or "N" value indicating whether to hide the label or not
	 */

	public void setHideLabel(String hideLabel)
	{
		this.hideLabel = hideLabel;
	}

	/**
	 * default constructor
	 */

	public FormItemDefinition()
	{
		// default constructor
	}

	/**
	 * This method is for adding the form by using formid.
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#addForm(java.lang.String)
	 * @param formid
	 */
	@Override
	public void addForm(String formid)
	{/* Empty Stub */
	}

	/**
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#clone()
	 */
	@Override
	/**
	 *  This class is used to create copy of the FormItemDefinition object
	  
	 * @return - Object
	 * @throws CloneNotSupportedException
	   
	 */
	protected Object clone() throws CloneNotSupportedException
	{
		FormItemDefinition def = (FormItemDefinition) super.clone();

		List<BaseFormDefinition> clChildItems = new ArrayList<BaseFormDefinition>();
		if (def.childItems != null)
		{
			for (BaseFormDefinition bDef : def.childItems)
			{
				clChildItems.add((BaseFormDefinition) bDef.clone());
			}
		}
		def.setChildItems(clChildItems);
		return def;
	}

	/**
	 * This method is an alternative constructor that accepts a hashmap of form item definition 
	 * and associates it to appropriate properties
	 * 
	 * @param dataMap - Map object contains form item definition keys and values 
	 */

	public FormItemDefinition(Map dataMap)
	{
		formId = (String) dataMap.get("FORM_ID");
		parentId = (String) dataMap.get("PARENT_ID");
		itemId = (String) dataMap.get("ITEM_ID");
		itemType = (String) dataMap.get("ITEM_TYPE");
		plainLbl = (String) dataMap.get("PLAIN_LBL");
		displayNmKey = (String) dataMap.get("DISPLAY_NM_KEY");
		layout = (String) dataMap.get("LAYOUT");
		anchor = (String) dataMap.get("ANCHOR");
		setBundleKey((String) dataMap.get("BUNDLE_KEY"));
		minLength = (String) dataMap.get("MIN_LENGTH");
		maxLength = (String) dataMap.get("MAX_LENGTH");
		maxNumLines = (String) dataMap.get("MAX_NUM_LINES");
		maxCharsPerLine = (String) dataMap.get("MAX_CHAR_PER_LINES");
		totalColumns = (String) dataMap.get("TOTAL_COLS");
		rowSpan = (String) dataMap.get("ROW_SPAN");
		colSpan = (String) dataMap.get("COL_SPAN");
		vType = (String) dataMap.get("VALIDATION_TYPE");

		rawKeys = (String) dataMap.get("RAW_KEYS");
		rawValues = (String) dataMap.get("RAW_VALUES");
		includeSelectInd = (String) dataMap.get("INCLUDE_SELECT_IND");
		containerInd = (String) dataMap.get("CONTAINER_IND");
		visibleInd = (String) dataMap.get("VISIBLE_IND");
		editableInd = (String) dataMap.get("EDITABLE_IND");
		readOnlyInd = (String) dataMap.get("READ_ONLY_IND");
		requiredInd = (String) dataMap.get("REQUIRED_IND");
		lookupInd = (String) dataMap.get("LOOKUP_IND");
		collapsibelInd = (String) dataMap.get("COLLAPSIBLE_FIRST_IND");
		dsViewId = (String) dataMap.get("DS_VIEW_ID");
		dsKeyColumnId = (String) dataMap.get("DS_KEY_COLUMN_ID");
		dsValueColumnId = (String) dataMap.get("DS_VAL_COLUMN_ID");
		widgetId = (String) dataMap.get("WIDGET_ID");
		conditionalInd = (String) dataMap.get("CONDITIONAL_IND");
		cacheDataInd = (String) dataMap.get("CACHE_DATA_IND");
		ctxContainerInd = (String) dataMap.get("CONTEXT_CONATINER_IND");
		validOnSwitchInd = (String) dataMap.get("VALIDATE_ON_SWITCH_IND");
		multiLangInd = (String) dataMap.get("MULTI_LANG_IND");
		hideLabel = (String) dataMap.get("HIDE_LABEL");
		resizableInd = (String) dataMap.get("RESIZABLE_IND");
		supportedMimeTypes = new ArrayList();
		supportedMimeTypes = (ArrayList) dataMap.get("SUPPORTED_MIME_TYPES");
		labelAlignType = (String) dataMap.get(FormDefinitionConstants.LABEL_ALIGN_TYPE);
		linkedCurrComp = (String) dataMap.get("LINKED_CURR_COL");
		columnType = (String) dataMap.get("COLUMN_TYPE");
		widgetProductCode = (String) dataMap.get("WIDGET_PRODUCT_CODE");
		widgetSubProductCode = (String) dataMap.get("WIDGET_SUB_PRODUCT_CODE");
		widgetFunctionCode = (String) dataMap.get("WIDGET_FUNCTION_CODE");
		copyPasteInd=(String)dataMap.get(FormDefinitionConstants.COPY_PASTE_IND);		
		printReqInd = (String) dataMap.get("PRINT_REQUIRED_IND");
		channelId = (String) dataMap.get("CHANNEL_ID");
		labelCharCount = (String) dataMap.get("LABEL_CHAR_COUNT");
		appendCurrMode = (String)dataMap.get("APPEND_CURRENCY_MODE");
	}

	/**
	 * 
	 * This method provides the JSON String representation of the Form Item Definition
	 * with additional prameter to include children items.
	 * 
	 * @param includeChildren - Boolean flag indicating whether to include 
	 * the child forms of the current form that the form items belonging to 
	 * 
	 * @return FormDef - JSON string representaion of form with form item definition.
	 */

	private String getFormDefJSON(boolean includeChildren)
	{
		return this.formMetaData.toJSONString(true, this);
	}

	/**
	 * This method converts JSONString format.
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#toJSONString()
	 * @param includeChildren
	 * @return returns the JSONString format for the Object
	 */
	@Override
	public String toJSONString(boolean includeChildren)
	{
		if (this.formMetaData != null)
		{
			return getFormDefJSON(true);
		}
		StringBuffer sb = new StringBuffer();
		sb.append("f1:" + "'" + formId + "',");
		sb.append("i2:" + "'" + itemId + "',");
		sb.append("p1:" + "'" + parentId + "',");
		sb.append("i3:" + "'" + itemType + "',");
		sb.append("d1:" + "'" + displayNmKey + "',");
		sb.append("p2:" + "'" + plainLbl + "',");
		sb.append("l2:" + "'" + layout + "',");
		sb.append("a1:" + "'" + anchor + "',");
		sb.append("v2:" + "'" + visibleInd + "',");
		sb.append("e1:" + "'" + editableInd + "',");
		sb.append("r3:" + "'" + readOnlyInd + "',");
		sb.append("r4:" + "'" + requiredInd + "',");
		sb.append("b1:" + "'" + bundleKey + "',");
		sb.append("l4:" + "'" + lookupInd + "',");
		sb.append("v3:" + "'" + vType + "',");
		sb.append("m4:" + "'" + minLength + "',");
		sb.append("m2:" + "'" + maxLength + "',");
		sb.append("m3:" + "'" + maxNumLines + "',");
		sb.append("m1:" + "'" + maxCharsPerLine + "',");
		sb.append("r6:" + "'" + rowSpan + "',");
		sb.append("c4:" + "'" + colSpan + "',");
		sb.append("t1:" + "'" + totalColumns + "',");
		sb.append("i1:" + "'" + includeSelectInd + "',");
		sb.append("c7:" + "'" + containerInd + "',");
		sb.append("c3:" + "'" + collapsibelInd + "',");
		sb.append("r1:" + "'" + rawKeys + "',");
		sb.append("r2:" + "'" + rawValues + "',");
		sb.append("w2:" + "'" + widgetId + "',");
		sb.append("c6:" + "'" + conditionalInd + "',");
		sb.append("c1:" + "'" + cacheDataInd + "',");
		sb.append("c8:" + "'" + ctxContainerInd + "',");
		sb.append("v1:" + "'" + validOnSwitchInd + "',");
		sb.append("m5:" + "'" + multiLangInd + "',");
		sb.append("c5:" + "'" + columnType + "',");
		sb.append("d2:" + "'" + dsKeyColumnId + "',");
		sb.append("d3:" + "'" + dsValueColumnId + "',");
		sb.append("r5:" + "'" + resizableInd + "',");
		sb.append("s1:" + "'" + supportedMimeTypes + "',");
		sb.append("h1:" + "'" + hideLabel + "',");
		sb.append("l3:" + "'" + linkedCurrComp + "',");
		sb.append("appendCurrMode:" + "'" + appendCurrMode + "',"); 
	    
		sb.append("l1:" + "'" + labelAlignType + "',"); 
		sb.append("w3:" + "'" + widgetProductCode + "',");
		sb.append("w4:" + "'" + widgetSubProductCode + "',");
		sb.append("w1:" + "'" + widgetFunctionCode + "',");		
		sb.append("p3:" + "'" + printReqInd + "',");		
		sb.append("p4:" + "'" + labelCharCount + "',");
		sb.append("c9:" + "'" + copyPasteInd + "',");
		sb.append("c10:" + "'" + channelId + "',");
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
			return "{" + sb.toString().substring(0, sb.toString().length() - 1) + "}";
		}
		return "{" + sb.toString() + "}";
	}

	/**
	 * This method adds the child form items to the Form Definition object.
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#addChild(com.intellectdesign.cib
	 *      .formdefinition.BaseFormDefinition)
	 * @param baseObjDef
	 */
	@Override
	public void addChild(BaseFormDefinition baseObjDef)
	{
		if (this.formMetaData != null)
		{
			this.formMetaData.addChild(baseObjDef);
		} else
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
	}

	/**
	 * This method provides the child forms and form items.
	 * 
	 * @see com.intellectdesign.cib.formdefinition.BaseFormDefinition#getChildren()
	 * @return List of childrens
	 */
	@Override
	public List<BaseFormDefinition> getChildren()
	{
		return childItems;
	}

	/**
	 * This method provides the current item Position on the form.
	 * 
	 * @return position - String value of the position
	 */
	public String getPosition()
	{
		return position;
	}

	/**
	 * This method sets the current item Position on the form
	 * 
	 * @param position - String value of the position to set
	 */
	public void setPosition(String position)
	{
		this.position = position;
	}

	/**
	 * This method gets the itemId.
	 * 
	 * @return itemId - String value of the item id
	 */
	public String getItemId()
	{
		return itemId;
	}

	/**
	 * This method set the ItemId
	 * 
	 * @param itemId - String value of the itemId 
	 */
	public void setItemId(String itemId)
	{
		this.itemId = itemId;
	}

	/**
	 * This method gets the ItemType
	 * 
	 * @return itemType - String value of the item Type
	 */
	public String getItemType()
	{
		return itemType;
	}

	/**
	 * This method sets the Item Type
	 * 
	 * @param itemType - String value of the itemType
	 */
	public void setItemType(String itemType)
	{
		this.itemType = itemType;
	}

	/**
	 * This method gets the Display Name Key of the current item for the property driven label text.
	 * 
	 * @return displayNmKey - String value of the Display label key without the text 'LBL'
	 */
	public String getDisplayNmKey()
	{
		return displayNmKey;
	}

	/**
	 * This method sets the Display Name Key of the Item
	 * 
	 * @param displayNmKey the displayNmKey to set
	 */
	public void setDisplayNmKey(String displayNmKey)
	{
		this.displayNmKey = displayNmKey;
	}

	/**
	 * This method gets the plain text to be rendered as Item Label
	 * 
	 * @return plainLbl - String value of the plain text
	 */
	public String getPlainLbl()
	{
		return plainLbl;
	}

	/**
	 * This method sets the plain text as Item Label 
	 * 
	 * @param plainLbl - String value of the plain text
	 */
	public void setPlainLbl(String plainLbl)
	{
		this.plainLbl = plainLbl;
	}

	/**
	 * This method gets the anchor size of the item
	 * 
	 * @return anchor - string value of the anchor size
	 */
	public String getAnchor()
	{
		return anchor;
	}

	/**
	 * This method sets the anchor size of the item 
	 * 
	 * @param anchor - String value of the anchor size
	 */
	public void setAnchor(String anchor)
	{
		this.anchor = anchor;
	}

	/**
	 * This method gets the value of the Visible Indicator flag
	 * 
	 * @return visibleInd - "Y" or "N" value indicating 
	 * whether the item should be visible or not
	 */
	public String getVisibleInd()
	{
		return visibleInd;
	}

	/**
	 * This method sets the visible Indicator flag value
	 * 
	 * @param visibleInd - String value of the visible Ind to set
	 */
	public void setVisibleInd(String visibleInd)
	{
		this.visibleInd = visibleInd;
	}

	/**
	 * This method gets the Editable Ind
	 * 
	 * @return editableInd - "Y" or "N" value indicating 
	 * whether the item should be enabled or disabled
	 */
	public String getEditableInd()
	{
		return editableInd;
	}

	/**
	 * This method sets the Editable Indicator
	 * 
	 * @param editableInd - String value of the editable Indicator 
	 */
	public void setEditableInd(String editableInd)
	{
		this.editableInd = editableInd;
	}

	/**
	 * This method provides the value of the Read Only Indicator
	 * 
	 * @return readOnlyInd - "Y" or "N" value indicating 
	 * whether the item should be in Read Only Mode or Editabel mode 
	 */
	public String getReadOnlyInd()
	{
		return readOnlyInd;
	}

	/**
	 * This method sets the Read Only Indicator value.
	 * 
	 * @param readOnlyInd - String value of the read Only Indicator
	 */
	public void setReadOnlyInd(String readOnlyInd)
	{
		this.readOnlyInd = readOnlyInd;
	}

	/**
	 * This method gets the required Indicator value
	 * 
	 * @return requiredInd - "Y" or "N" value indicating 
	 * whether the item should be treated as Mandatory item or not
	 */
	public String getRequiredInd()
	{
		return requiredInd;
	}

	/**
	 * This method sets the Required Indicator value
	 * 
	 * @param requiredInd - String value of the required Indicator
	 */
	public void setRequiredInd(String requiredInd)
	{
		this.requiredInd = requiredInd;
	}

	/**
	 * This method provides the value of the bundle Key
	 * 
	 * @return bundleKey - String value of the property file bundle key
	 */
	public String getBundleKey()
	{
		return bundleKey;
	}

	/**
	 * This method sets the bundleKey. If the passing key is "canvas", this method will provide 
	 * the canvas-default property bundle.
	 * 
	 * @param bundleKey - String value of the bundleKey 
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
	 * This method provides the value of the Lookup Indicator, 
	 * which indicates whether the current item is a lookup or not
	 * 
	 * @return lookupInd - "Y" or "N" value indicating 
	 * whether the item is a lookup or not
	 * 
	 */
	public String getLookupInd()
	{
		return lookupInd;
	}

	/**
	 * This method sets the value of the lookup Indicator
	 * 
	 * @param lookupInd -String value of the lookupInd 
	 */
	public void setLookupInd(String lookupInd)
	{
		this.lookupInd = lookupInd;
	}

	/**
	 * This method provides the item validation type 
	 * 
	 * @return vType - String value of the Validation Type
	 */
	public String getvType()
	{
		return vType;
	}

	/**
	 * This method sets the item validation Type
	 * 
	 * @param vType - String value of the validation type
	 */
	public void setvType(String vType)
	{
		this.vType = vType;
	}

	/**
	 * This method gets the minimum lenth of the data enterted in text and text area items
	 * 
	 * @return minLength - String value of the Minimum text length
	 */
	public String getMinLength()
	{
		return minLength;
	}

	/**
	 * This method sets the minimum Length of the text entered in text items
	 * 
	 * @param minLength - String value of the minimum Length to set
	 */
	public void setMinLength(String minLength)
	{
		this.minLength = minLength;
	}

	/**
	 * This method gets the maximum Length allowed for entering values in entext 
	 * 
	 * @return maxLength - String value of the maximum text allowed
	 */
	public String getMaxLength()
	{
		return maxLength;
	}

	/**
	 * This method sets the maxLength of the text to be entered in the Text controls
	 * 
	 * 
	 * @param maxLength - String value of the max Length of the data 
	 */
	public void setMaxLength(String maxLength)
	{
		this.maxLength = maxLength;
	}

	/**
	 * This method provides the maximum characters per line allowed in text area 
	 * 
	 * @return maxCharsPerLine - String value of the Maximum Characters allowed per line
	 */
	public String getMaxCharsPerLine()
	{
		return maxCharsPerLine;
	}

	/**
	 * This method provides the value of the Maximum Characters Per Line
	 * 
	 * @param maxCharsPerLine the maxCharsPerLine to set
	 */
	public void setMaxCharsPerLine(String maxCharsPerLine)
	{
		this.maxCharsPerLine = maxCharsPerLine;
	}

	/**
	 * This method provides the Row Span value
	 * 
	 * @return rowSpan - String value of the Row Span
	 */
	public String getRowSpan()
	{
		return rowSpan;
	}

	/**
	 * This method sets the value of the Row Span
	 * 
	 * @param rowSpan - String value of the row Span 
	 */
	public void setRowSpan(String rowSpan)
	{
		this.rowSpan = rowSpan;
	}

	/**
	 * This method provides the value of the Col Span
	 * 
	 * @return colSpan - String value of the Col Span
	 */
	public String getColSpan()
	{
		return colSpan;
	}

	/**
	 * This method sets the value of the Col Span
	 * 
	 * @param colSpan - String value of the col Span 
	 */
	public void setColSpan(String colSpan)
	{
		this.colSpan = colSpan;
	}

	/**
	 * This method gets the value of FormId
	 * 
	 * @return formId - String value of the Form Id
	 */
	public String getFormId()
	{
		return formId;
	}

	/**
	 * This method sets the value of the Form Id
	 * 
	 * @param formId - String value of the formId 
	 */
	public void setFormId(String formId)
	{
		this.formId = formId;
	}

	/**
	 * This method provides the parent id of the currrent item
	 * 
	 * @return parentId - String value of the Parent Id
	 */
	public String getParentId()
	{
		return parentId;
	}

	/**
	 * This method sets the value of the ParentId
	 * 
	 * @param parentId - String value of the Parent Id 
	 */
	public void setParentId(String parentId)
	{
		this.parentId = parentId;
	}

	/**
	 * This method gets the Total Columns for containers to arrange 
	 * the items on it 
	 * 
	 * @return totalColumns - String value of the Total Columns
	 */
	public String getTotalColumns()
	{
		return totalColumns;
	}

	/**
	 * This method sets the Total Columns
	 * 
	 * @param totalColumns - String value of the Total Columns 
	 */
	public void setTotalColumns(String totalColumns)
	{
		this.totalColumns = totalColumns;
	}

	/**
	 * This method provides the JSON String representation of the form item definition 
	 * 
	 * @return toString - JSONString format of the Form Item Definition  
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		return toJSONString();
	}

	/**
	 * This method provides the value of the layout 
	 * 
	 * @return layout - String value of the layout
	 */
	public String getLayout()
	{
		return layout;
	}

	/**
	 * This method sets the value of the item layout
	 * 
	 * @param layout - String value of layout to set
	 */
	public void setLayout(String layout)
	{
		this.layout = layout;
	}

	/**
	 * This method provides the maximum number of lines allowed in Text Area
	 * 
	 * @return maxNumLines - String value of the Maximum Number of Lines 
	 */
	public String getMaxNumLines()
	{
		return maxNumLines;
	}

	/**
	 * This method sets the Maximum Number of Lines 
	 * 
	 * @param maxNumLines - String value of the maximum Number of Lines 
	 */
	public void setMaxNumLines(String maxNumLines)
	{
		this.maxNumLines = maxNumLines;
	}

	/**
	 * This method provides the value of the Include Select Indicator
	 * 
	 * @return includeSelectInd - "Y" or "N" value indicating whether to include the 
	 * 								word "Select" as the first list value in the combo boxes
	 */
	public String getIncludeSelectInd()
	{
		return includeSelectInd;
	}

	/**
	 * This method sets the value of the Include Select Indicator
	 * 
	 * @param includeSelectInd - String value of the include Select Indicator
	 */
	public void setIncludeSelectInd(String includeSelectInd)
	{
		this.includeSelectInd = includeSelectInd;
	}

	/**
	 * This method provides the value of the Container Indicator
	 * 
	 * @return containerInd - "Y" or "N" value indicating whether the current item is a Container or not
	 * 
	 */
	public String getContainerInd()
	{
		return containerInd;
	}

	/**
	 * This method provides the Container Indicator
	 * 
	 * @param containerInd - String value of the container Ind 
	 */
	public void setContainerInd(String containerInd)
	{
		this.containerInd = containerInd;
	}

	/**
	 * This method provides the Collapsible Indicator that 
	 * collapses or expands the Field Set item after form loading  
	 * 
	 * @return collapsibelInd - "Y" or "N" value indicating whether to collapse or expand the field set
	 */
	public String getCollapsibelInd()
	{
		return collapsibelInd;
	}

	/**
	 * This method sets the value of the Collapsible Indicator 
	 * 
	 * @param collapsibelInd - String value of the Collapsibel Indicator
	 */
	public void setCollapsibelInd(String collapsibelInd)
	{
		this.collapsibelInd = collapsibelInd;
	}

	/**
	 * This method provides the value of RawKeys
	 * 
	 * @return rawKeys - String value of the RawKeys
	 */
	public String getRawKeys()
	{
		return rawKeys;
	}

	/**
	 * This method sets the value of RawKeys
	 * 
	 * @param rawKeys - String value of the RawKeys
	 */
	public void setRawKeys(String rawKeys)
	{
		this.rawKeys = rawKeys;
	}

	/**
	 * This method provides the value of the RawValues.
	 * 
	 * @return rawValues - String value of raw Values
	 */
	public String getRawValues()
	{
		return rawValues;
	}

	/**
	 * This method provides the value of the ChildItems.
	 * 
	 * @return childItems - 
	 */
	public List<BaseFormDefinition> getChildItems()
	{
		return childItems;
	}

	/**
	 * This method sets the ChildItems.
	 * 
	 * @param childItems - List object containing the childItems 
	 */
	public void setChildItems(List<BaseFormDefinition> childItems)
	{
		this.childItems = childItems;
	}

	/**
	 * This method sets the value of the RawValues
	 * 
	 * @param rawValues - String value of the rawValues
	 */
	public void setRawValues(String rawValues)
	{
		this.rawValues = rawValues;
	}

	/**
	 * This method provides the Data-source View Id
	 * 
	 * @return dsViewId - String value of the dsViewId
	 */
	public String getDsViewId()
	{
		return dsViewId;
	}

	/**
	 * This method sets the Data-source View Id
	 * 
	 * @param dsViewId - String value of the data-source View Id to set
	 */
	public void setDsViewId(String dsViewId)
	{
		this.dsViewId = dsViewId;
	}

	/**
	 * This method provides the Data-source Key Column Id
	 * 
	 * @return dsKeyColumnId - String value of the data-source Key Column Id
	 */
	public String getDsKeyColumnId()
	{
		return dsKeyColumnId;
	}

	/**
	 * This method sets the data-source Key Column Id
	 * 
	 * @param dsKeyColumnId - String value of the data-source Key Column Id 
	 */
	public void setDsKeyColumnId(String dsKeyColumnId)
	{
		this.dsKeyColumnId = dsKeyColumnId;
	}

	/**
	 * This method provides the data-source Value Column Id
	 * 
	 * @return dsValueColumnId - String value of the data-source Value Column Id
	 */
	public String getDsValueColumnId()
	{
		return dsValueColumnId;
	}

	/**
	 * This method sets the data-source Value Column Id
	 * 
	 * @param dsValueColumnId - String value of the data-source Value Column Id
	 */
	public void setDsValueColumnId(String dsValueColumnId)
	{
		this.dsValueColumnId = dsValueColumnId;
	}

	/**
	 * This method provides the Widget Id
	 * 
	 * @return widgetId - String value of the Widget Id
	 */
	public String getWidgetId()
	{
		return widgetId;
	}

	/**
	 * This method sets the Widget Id
	 * 
	 * @param widgetId - String value of the widgetId 
	 */
	public void setWidgetId(String widgetId)
	{
		this.widgetId = widgetId;
	}

	/**
	 * This method provides the value of the Conditional Indicator
	 * 
	 * @return ConditionalInd - "Y" or "N" value indicating whether the current item is conditional mandatory
	 */

	public String getConditionalInd()
	{
		return conditionalInd;
	}

	/**
	 * This method sets the value of the Conditional Indicator
	 * 
	 * @param conditionalInd - String value of the Conditional Indicator
	 */
	public void setConditionalInd(String conditionalInd)
	{
		this.conditionalInd = conditionalInd;
	}

	/**
	 * This method provides the Cache Data Indicator
	 * 
	 * @return CacheDataInd - "Y" or "N" value indicating whether to cache item data or not 
	 */

	public String getCacheDataInd()
	{
		return cacheDataInd;
	}

	/**
	 * This method sets the value of Cache Data Indicator
	 * 
	 * @param CacheDataInd - String value of the Cache Data Ind to set
	 */

	public void setCacheDataInd(String cacheDataInd)
	{
		this.cacheDataInd = cacheDataInd;
	}

	/**
	 * This method provides the context container indicator 
	 * 
	 * @return CtxContainerInd - "Y" or "N" value indicating whether to get context container or not
	 */
	public String getCtxContainerInd()
	{
		return ctxContainerInd;
	}

	/**
	 * This method sets the context container indicator 
	 * 
	 * @return CtxContainerInd - String value of the context container indicator
	 */
	public void setCtxContainerInd(String ctxContainerInd)
	{
		this.ctxContainerInd = ctxContainerInd;
	}

	/**
	 * This method provides the value of Validate on Switch Indicator
	 * 
	 * @return ValidOnSwitchInd - "Y" or "N" value indicating whether to validate the items before switching tab
	 */

	public String getValidOnSwitchInd()
	{
		return validOnSwitchInd;
	}

	/**
	 * This method sets the value of Validate on Switch Indicator
	 * 
	 * @param validOnSwitchInd - String value of validdate on Switch Indicator
	 */
	public void setValidOnSwitchInd(String validOnSwitchInd)
	{
		this.validOnSwitchInd = validOnSwitchInd;
	}

	/**
	 * This method provides the value of the Resizable Indicator.
	 * 
	 * @return resizableInd - "Y" or "N" value indicating whether the user can resize the form or not
	 */
	public String getResizableInd()
	{
		return resizableInd;
	}

	/**
	 * This method sets the value of the Resizable Indicator.
	 * 
	 * @param resizableInd - String value of resizable indicator 
	 */
	public void setResizableInd(String resizableInd)
	{
		this.resizableInd = resizableInd;
	}

	/**
	 * This method provides the Form Definition Meta Data.
	 * 
	 * @return formMetaData - BasesFormDefinition object containing the form definition meta data
	 */
	public BaseFormDefinition getFormMetaData()
	{
		return formMetaData;
	}

	/**
	 * This method sets the Form Definition Meta Data .
	 * 
	 * @param formMetaData - BaseFormDefinition object containing the Form Meta data
	 */
	public void setFormMetaData(BaseFormDefinition formMetaData)
	{
		this.formMetaData = (FormDefinition) formMetaData;
	}

	/**
	 * This method provides the column type
	 * 
	 * @return ColumnType - String value of the column type
	 */
	public String getColumnType()
	{
		return columnType;
	}

	/**
	 * This method sets the column type
	 * 
	 * @param columnType - String value of the Column Type 
	 * 
	 */

	public void setColumnType(String columnType)
	{
		this.columnType = columnType;
	}

	/**
	 * This method provides the list of Supported Mime Types
	 * 
	 * @return supportedMimeTypesList - List containing the Supported Mime Types for file upload 
	 */
	public List getSupportedMimeTypes()
	{
		List supportedMimeTypesList = new ArrayList();
		for (int i = 0; i < supportedMimeTypes.size(); i++)
		{
			supportedMimeTypesList.add(((HashMap) supportedMimeTypes.get(i)).get("MIME_TYPE"));
		}
		return supportedMimeTypesList;
	}

	/**
	 * This method sets the supported mime types.
	 * 
	 * @param supportedFileFormats - ArrayList of supported MimeTypes
	 */
	public void setSupportedMimeTypes(ArrayList supportedMimeTypes)
	{
		this.supportedMimeTypes = supportedMimeTypes;
	}

	/**
	 * This method provides the value of the Multi Language Indicator
	 * 
	 * @return MultiLangInd - "Y" or "N" value indicating support for Multi Language 
	 */
	public String getMultiLangInd()
	{
		return multiLangInd;
	}

	/**
	 * This method sets the value for Multi Language Indicator
	 * 
	 * @param MultiLangInd - String value of the Multi Language Indicator
	 */

	public void setMultiLangInd(String multiLangInd)
	{
		this.multiLangInd = multiLangInd;
	}

	/**
	 * This method provides the value of the Linked Currency Component
	 * 
	 * @return LinkedCurrComp - String value of the Linked Currency Component
	 */
	public String getLinkedCurrComp()
	{
		return linkedCurrComp;
	}

	/**
	 * This method sets the Linked Currency Component value
	 * 
	 * @param LinkedCurrComp - String value of the Linked Currency Component 
	 */
	public void setLinkedCurrComp(String linkedCurrComp)
	{
		this.linkedCurrComp = linkedCurrComp;
	}

	/* The following two methods have been added to get and set value for labelAlignType for a Form item */
	/**
	 * This method provides the label Alignment Type
	 * 
	 * @return labelAlignType - String value of the label Aling Type
	 */
	public String getLabelAlignType()
	{
		return labelAlignType;
	}

	/**
	 * This method sets the label Align Type
	 * 
	 * @param labelAlignType - String value of the label Aling Type
	 */
	public void setLabelAlignType(String labelAlignType)
	{
		this.labelAlignType = labelAlignType;
	}

	/**
	 * This method provides the Product Code of the widget 
	 * 
	 * @return widgetProductCode - String value of the Product Code of the Widget 
	 */
	public String getWidgetProductCode()
	{
		return widgetProductCode;
	}

	/**
	 * This method sets the Widget Product Code 
	 * 
	 * @param widgetProductCode - String value of the widget Product Code 
	 */
	public void setWidgetProductCode(String widgetProductCode)
	{
		this.widgetProductCode = widgetProductCode;
	}

	/**
	 * This method provides the Sub Product Code of the widget
	 * 
	 * @return widgetSubProductCode - String value of the Sub Product Code of the Widget
	 */
	public String getWidgetSubProductCode()
	{
		return widgetSubProductCode;
	}

	/**
	 * This method sets the Widget Sub Product Code
	 * 
	 * @param widgetSubProductCode - String value of the widget Sub Product Code 
	 */
	public void setWidgetSubProductCode(String widgetSubProductCode)
	{
		this.widgetSubProductCode = widgetSubProductCode;
	}

	/**
	 * This method provides the Function Code of the widget
	 * 
	 * @return widgetFunctionCode - String value of the Function Code of the Widget
	 */
	public String getWidgetFunctionCode()
	{
		return widgetFunctionCode;
	}

	/**
	 * This method sets the Widget Function Code
	 * 
	 * @param widgetFunctionCode - String value of the widget Sub Product Code
	 */
	public void setWidgetFunctionCode(String widgetFunctionCode)
	{
		this.widgetFunctionCode = widgetFunctionCode;
	}

	
	/**
	 * This method provides whether the current item value needs to be printed while printing the form
	 * 
	 * @return printReqInd - "Y" or "N" value indicating whether current item data needs to be printed
	 */
	public String getPrintReqInd()
	{
		return printReqInd;
	}

	/**
	 * This method sets the value for the Print Req Indicator
	 * 
	 * @param printReqInd - String value of the Print Required Indicator
	 */
	public void setPrintReqInd(String printReqInd)
	{
		this.printReqInd = printReqInd;
	}

	/**
	 * This method provides the channel id that the item should render
	 * 
	 * @return channelId - String value of the Channel Id
	 */
	public String getChannelId()
	{
		return channelId;
	}

	/**
	 * This method sets value of the channelId
	 * 
	 * @param channelId - String value of the channel Id 
	 */
	public void setChannelId(String channelId)
	{
		this.channelId = channelId;
	}
	/**
	 * @return the copyPasteInd
	 */
	public String getCopyPasteInd()
	{
		return copyPasteInd;
	}

	/**
	 * @param copyPasteInd the copyPasteInd to set
	 */
	public void setCopyPasteInd(String copyPasteInd)
	{
		this.copyPasteInd = copyPasteInd;
	}
	 public String getAppendCurrMode()
	    {
	        return appendCurrMode;
	    }

	    public void setAppendCurrMode(String appendCurrMode)
	    {
	        this.appendCurrMode = appendCurrMode;
	    }
}
