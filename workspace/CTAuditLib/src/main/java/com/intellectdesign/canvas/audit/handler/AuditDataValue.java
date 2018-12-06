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
 * This contains eventId,auditId,resourceBundle,dataTranslatorClass and auditFormatterClass as an object
 */

package com.intellectdesign.canvas.audit.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.intellectdesign.canvas.event.handler.IData;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class contains eventId,auditId,auditFormatterClass,resourceBundle,dataTranslatorClass as data value objects.
 * This also contains the mandatory, optional, DSA, translation and collection fields of an event as an array list.
 * 
 * @version 1.0
 */
public class AuditDataValue implements IData
{
	/**
	 * Default value of serialVersionUID.
	 */
	private static final long serialVersionUID = 1L;

	/***
	 * adds to the auditFieldConfig. This method have been changed to final due to checkstyles issue fixing.This might
	 * be changed if any classes extends in future
	 * 
	 * @param auditFieldConfig addAuditFieldConfig
	 */
	public final void addAuditFieldConfig(final AuditFieldConfig auditFieldConfig)
	{
		data.put(auditFieldConfig.getFieldName(), auditFieldConfig);
	}

	/***
	 * gets the auditFieldConfig of fieldName. This method have been changed to final due to checkstyles issue
	 * fixing.This might be changed if any classes extends in future
	 * 
	 * @param fieldName A {@code String}
	 * @return the data of fieldName
	 */
	public final AuditFieldConfig getAuditFieldConfig(final String fieldName)
	{
		return data.get(fieldName);
	}

	/***
	 * gets the getAuditDataAsMap. This method have been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return HashMap dvo
	 * @throws AuditHandlerException getAuditDataAsMap
	 */
	public final HashMap getAuditDataAsMap() throws AuditHandlerException
	{

		HashMap dvo = new HashMap();
		if (eventId <= 0)
		{

			throw new AuditHandlerException("AUD012",
					AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD012"));
		} else
		{
			dvo.put(AuditConstants.EVENT_ID, eventId);
			if (auditId <= 0)
			{

				throw new AuditHandlerException("AUD013",
						AuditConstants.EVENT_PROP_READER.retrieveProperty("AUD013"));
			} else
			{
				dvo.put(AuditConstants.AUDIT_ID, auditId);
				dvo.put(AuditConstants.AUDIT_FORMATTER_CLASS, auditFormatterClass);
			}
		}
		return dvo;
	}

	/***
	 * returns the string representation. This method have been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @return string String representation of AuditDataValue
	 */
	public final String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		sb.append("eventId:");
		sb.append(eventId);
		sb.append(", auditId:");
		sb.append(auditId);
		sb.append(", auditFormatterClass:");
		sb.append(auditFormatterClass);
		sb.append(", resourceBundle:");
		sb.append(resourceBundle);
		sb.append(", dataTranslatorClass:");
		sb.append(dataTranslatorClass);
		sb.append(", data:");
		sb.append(data);
		sb.append("}");
		return sb.toString();

	}

	/***
	 * returns the eventId. This method have been changed to final due to checkstyles issue fixing.This might be changed
	 * if any classes extends in future
	 * 
	 * @return long eventId
	 */
	public final long getEventId()
	{
		return eventId;
	}

	/***
	 * returns event Id as String. This method have been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return String eventId
	 */
	public final String getEventIdAsString()
	{
		return String.valueOf(eventId);
	}

	/***
	 * Sets the eventId. This method have been changed to final due to checkstyles issue fixing.This might be changed if
	 * any classes extends in future
	 * 
	 * @param nEventId A {@code long}
	 */
	public final void setEventId(final long nEventId)
	{
		this.eventId = nEventId;
	}

	/***
	 * returns the auditId. This method have been changed to final due to checkstyles issue fixing.This might be changed
	 * if any classes extends in future
	 * 
	 * @return the auditId
	 */
	public final long getAuditId()
	{
		return auditId;
	}

	/***
	 * sets the auditId. This method have been changed to final due to checkstyles issue fixing.This might be changed if
	 * any classes extends in future
	 * 
	 * @param nAuditId A {@code long}
	 */
	public final void setAuditId(final long nAuditId)
	{
		this.auditId = nAuditId;
	}

	/***
	 * returns the customResourceBundle. This method have been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @return String resourceBundle
	 */
	public final String getResourceBundle()
	{
		return resourceBundle;
	}

	/***
	 * sets the customResourceBundle. This method have been changed to final due to checkstyles issue fixing.This might
	 * be changed if any classes extends in future
	 * 
	 * @param sResourceBundle A {@code String}
	 */
	public final void setResourceBundle(final String sResourceBundle)
	{
		this.resourceBundle = sResourceBundle;
	}

	/***
	 * returns the dataTranslatorClass of an eventId. This method have been changed to final due to checkstyles issue
	 * fixing.This might be changed if any classes extends in future
	 * 
	 * @return dataTranslatorClass
	 */
	public final String getDataTranslatorClass()
	{
		return dataTranslatorClass;
	}

	/***
	 * sets the dataTranslatorClass. This method have been changed to final due to checkstyles issue fixing.This might
	 * be changed if any classes extends in future
	 * 
	 * @param sDataTranslatorClass A {@code String}
	 */
	public final void setDataTranslatorClass(final String sDataTranslatorClass)
	{
		this.dataTranslatorClass = sDataTranslatorClass;
	}

	/***
	 * returns the data. This method have been changed to final due to checkstyles issue fixing.This might be changed if
	 * any classes extends in future
	 * 
	 * @return data
	 */
	public final Map<String, AuditFieldConfig> getData()
	{
		return data;
	}

	/***
	 * sets the data. This method have been changed to final due to checkstyles issue fixing.This might be changed if
	 * any classes extends in future
	 * 
	 * @param auditData A {@code HashMap<String, AuditFieldConfig>}
	 */
	public final void setData(final Map<String, AuditFieldConfig> auditData)
	{
		this.data = auditData;
	}

	/***
	 * returns the auditFormatterClass. This method have been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @return auditFormatterClass A {@code String}
	 */
	public final String getAuditFormatterClass()
	{
		return auditFormatterClass;
	}

	/***
	 * sets the auditFormatterClass. This method have been changed to final due to checkstyles issue fixing.This might
	 * be changed if any classes extends in future
	 * 
	 * @param sAuditFormatterClass A {@code String}
	 */
	public final void setAuditFormatterClass(final String sAuditFormatterClass)
	{
		this.auditFormatterClass = sAuditFormatterClass;
	}

	/***
	 * gets the mandatoryDataElements as an arrayList. This method have been changed to final due to checkstyles issue
	 * fixing.This might be changed if any classes extends in future
	 * 
	 * @return mandatoryDataElements
	 */
	public final ArrayList<String> getMandatoryDataElements()
	{
		Set<String> fields = data.keySet();
		Iterator<String> it = fields.iterator();
		ArrayList<String> mandatoryDataElements = new ArrayList<String>();
		AuditFieldConfig field = null;
		for (; it.hasNext();)
		{
			field = data.get(it.next());
			if (field.isRequiredInd())
			{
				mandatoryDataElements.add(field.getFieldName());
			}
		}
		return mandatoryDataElements;
	}

	/***
	 * gets the optionalDataElements as an arrayList. This method have been changed to final due to checkstyles issue
	 * fixing.This might be changed if any classes extends in future
	 * 
	 * @return optionalDataElements
	 */
	public final ArrayList<String> getOptionalDataElements()
	{
		Set<String> fields = data.keySet();
		Iterator<String> it = fields.iterator();
		ArrayList<String> optionalDataElements = new ArrayList<String>();
		AuditFieldConfig field = null;
		for (; it.hasNext();)
		{
			field = data.get(it.next());
			if (!field.isRequiredInd())
			{
				optionalDataElements.add(field.getFieldName());
			}
		}
		return optionalDataElements;
	}

	/***
	 * gets the dsaFieldsList as an arrayList. This method have been changed to final due to checkstyles issue
	 * fixing.This might be changed if any classes extends in future
	 * 
	 * @return dsaFieldsList
	 */
	public final ArrayList<String> getDSAFields()
	{
		Set<String> fields = data.keySet();
		Iterator<String> it = fields.iterator();
		ArrayList<String> dsaFieldsList = new ArrayList<String>();
		AuditFieldConfig field = null;
		for (; it.hasNext();)
		{
			field = data.get(it.next());
			if (field.isUsedForDsa())
			{
				dsaFieldsList.add(field.getFieldName());
			}
		}
		return dsaFieldsList;
	}

	/***
	 * gets the translationFields as an arrayList. This method have been changed to final due to checkstyles issue
	 * fixing.This might be changed if any classes extends in future
	 * 
	 * @return translationFields
	 */
	public final ArrayList<String> getTranslationFields()
	{
		Set<String> fields = data.keySet();
		Iterator<String> it = fields.iterator();
		ArrayList<String> translationFields = new ArrayList<String>();
		AuditFieldConfig field = null;
		for (; it.hasNext();)
		{
			field = data.get(it.next());
			if (field.isTranslationRequiredInd())
			{
				translationFields.add(field.getFieldName());
			}
		}
		return translationFields;
	}

	/***
	 * This method used to get the list of CollectionFieldsForEvent as an arrayList. This method have been changed to
	 * final due to checkstyles issue fixing.This might be changed if any classes extends in future
	 * 
	 * @return listCollectionFieldsForEvent
	 */
	public final ArrayList<String> getListCollectionFields()
	{
		Set<String> fields = data.keySet();
		Iterator<String> it = fields.iterator();

		AuditFieldConfig childField = null;
		listCollectionFieldsForEvent = new ArrayList<String>();
		for (; it.hasNext();)
		{
			childField = data.get(it.next());
			if (childField.getCollectionFieldReference() != null
					&& childField.getCollectionFieldReference().trim().length() > 0)
			{
				listCollectionFieldsForEvent.add(childField.getFieldName());
			}
		}
		return listCollectionFieldsForEvent;
	}

	/**
	 * This method is used to get list of Mandatory fields Config
	 * 
	 * @return mandatoryFieldsConfig
	 */
	public final List<AuditFieldConfig> getMandatoryFieldsConfig()
	{
		return this.mandatoryFieldsConfig;
	}

	/**
	 * This method is used to get list of Optional fields Config
	 * 
	 * @return optionalFieldsConfig
	 */
	public final List<AuditFieldConfig> getOptionalFieldsConfig()
	{
		return this.optionalFieldsConfig;
	}

	/**
	 * This method goes through the entire configuration provided to create the hierarchy for collection handling as
	 * well as to categorize the list into mandatory and optional list that will facilitate faster audit processing
	 */
	public void preProcessConfiguration()
	{
		// Step 1: Order the configuration into a hierarchy to ensure that the configuration entries that corresponds to
		// a collection are routed within the collection.
		Set<Map.Entry<String, AuditFieldConfig>> allEntries = data.entrySet();
		Iterator<Map.Entry<String, AuditFieldConfig>> it = allEntries.iterator();
		Map.Entry<String, AuditFieldConfig> aChildElement;
		// Pass 1: Identify the list of fields that have been marked as collections.
		Map<String, AuditFieldConfig> collectionFields = new LinkedHashMap<String, AuditFieldConfig>();
		String temp;
		while (it.hasNext())
		{
			aChildElement = it.next();
			if (aChildElement.getValue().isCollectionInd())
			{
				collectionFields.put(aChildElement.getKey(), aChildElement.getValue());
			}
			// In case the field label is not provided, then make the Field name same as label.
			temp = aChildElement.getValue().getFieldLabel();
			if (temp == null || "".equals(temp.trim()))
			{
				temp = aChildElement.getValue().getFieldName();
				aChildElement.getValue().setFieldLabel(temp);
			}
		}
		// Pass 2: Get the list of fields that have marked themselves as a child to a parent. Remove these from the main
		// list and add it to the child list of the appropriate parent. The below logic will ensure that complete tree
		// gets built as it will also move any child collections within its appropriate parent
		it = allEntries.iterator();
		String parentRef = null;
		AuditFieldConfig parentConfig = null;
		while (it.hasNext())
		{
			aChildElement = it.next();
			parentRef = aChildElement.getValue().getCollectionFieldReference();
			if ((parentRef != null) && (!"".equals(parentRef.trim())))
			{
				// So a valid collection ref identified. Identify the Collection item and move the current item as a
				// child of that parent.
				parentConfig = collectionFields.get(parentRef);
				if (parentConfig != null)
				{
					// Add the current item as a child to the parent
					parentConfig.getChildren().add(aChildElement.getValue());
				} else
				{
					// hmmmm. This is bad. Log this as an erraneous configuration.
					LOGGER.cterror("CTAUD00120", aChildElement.getKey(), parentRef, aChildElement.getKey());
				}
				// Remove the current item from the iterator and hence the underlying set / map
				it.remove();
			}
		}
		// Step 2: Segregate the Mandatory and optional audit configuration. By now the entire tree should have been
		// created. So this can be done only within the first level of audit.
		it = allEntries.iterator();
		mandatoryFieldsConfig = new ArrayList<AuditFieldConfig>();
		optionalFieldsConfig = new ArrayList<AuditFieldConfig>();
		while (it.hasNext())
		{
			aChildElement = it.next();
			if (aChildElement.getValue().isRequiredInd())
			{
				mandatoryFieldsConfig.add(aChildElement.getValue());
			} else
			{
				optionalFieldsConfig.add(aChildElement.getValue());
			}
		}
		LOGGER.ctdebug("CTAUD00121", data);
	}

	private long eventId = -1;
	private long auditId = -1;
	private String auditFormatterClass = null;
	private String resourceBundle = null;
	private String dataTranslatorClass = null;

	private ArrayList<String> listCollectionFieldsForEvent = null;
	private List<AuditFieldConfig> mandatoryFieldsConfig = null;
	private List<AuditFieldConfig> optionalFieldsConfig = null;
	private Map<String, AuditFieldConfig> data = new LinkedHashMap<String, AuditFieldConfig>();
	private static final Logger LOGGER = Logger.getLogger(AuditDataValue.class);
}
